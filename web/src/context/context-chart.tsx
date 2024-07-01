import { api } from "@/lib/api";
import Cookies from "js-cookie";
import { ReactNode, createContext, useEffect, useState } from "react";

interface ChartContextProvider {
  children: ReactNode;
}

interface IProductsKey {
  nome: string;
  preco: number;
}

interface IProductsKeyForChart {
  name: string;
  length: number;
  percentage: number;
  averagePrice: number;
}

interface IChartContext {
  isLoading: boolean;
  productsKey: IProductsKeyForChart[];
  setProductsKey: (newProduct: IProductsKeyForChart[]) => void;
}

export const ChartContext = createContext({} as IChartContext);

async function getProductsKey(setIsLoading: (newState: boolean) => void) {
  setIsLoading(true);
  const token = Cookies.get("token");

  try {
    const response = await api.get("/produto-chave", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch(err) {
    console.log(err)
  } finally {
    setIsLoading(false);
  }
}

export function ChartContextProvider({ children }: ChartContextProvider) {

  const [productsKey, setProductsKey] = useState<IProductsKeyForChart[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const data = getProductsKey(setIsLoading);

    data
    .then(values => {
      processProducts(values.productsKey)
    })
    .catch(err => console.log(err))
  }, []);

  function normalizeString(str: string): string {
    return str.trim().toLowerCase();
  }
  
  function processProducts(products: IProductsKey[]) {
    const totalProducts = products.length;
    const productMap: { [key: string]: { total: number, count: number } } = {};
  
    // Irá inserir a máquina no map, somando os preços e atualizando a quantidade
    products.forEach(product => {
      const normalizedNome = normalizeString(product.nome);
      
      if (!productMap[normalizedNome]) {
        productMap[normalizedNome] = { total: 0, count: 0 };
      }
      productMap[normalizedNome].total += product.preco;
      productMap[normalizedNome].count += 1;
    });
  
    const result: IProductsKeyForChart[] = Object.keys(productMap).map(key => {
      const item = productMap[key]; // Desestruturação pra pegar a quantidade e a soma dos valores
  
      return {
        name: key.charAt(0).toUpperCase() + key.slice(1),
        length: item.count,
        percentage: (item.count / totalProducts) * 100,
        averagePrice: item.total / item.count,
      };
    });
  
    const orderedProducts = result.sort((a, b) => b.length - a.length);
  
    setProductsKey(orderedProducts);
  }  

  return(
    <ChartContext.Provider value={{ isLoading, productsKey, setProductsKey }}>
      {children}
    </ChartContext.Provider>
  )
} 