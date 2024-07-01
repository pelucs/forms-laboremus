import { Card } from "@/components/ui/card";
import { formatReal } from "@/helpers/format-currency";
import { useContext } from "react";
import { ChartContext } from "@/context/context-chart";
import { Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
} from "@/components/ui/table";

export function AllProductsKey() {

  const { productsKey } = useContext(ChartContext);

  return(
    <div>
      <h1 className="text-sm font-medium">Todos os produtos chaves</h1>

      <Card className="mt-4 py-3 px-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Produto</TableHead>
              <TableHead className="whitespace-nowrap text-center">Porcentagem</TableHead>
              <TableHead className="whitespace-nowrap text-center">Preço médio de mercado</TableHead>
              <TableHead className="whitespace-nowrap text-center">Quantidade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productsKey.map((product) => (
              <TableRow key={product.name}>
                <TableCell className="whitespace-nowrap font-medium">{product.name}</TableCell>
                <TableCell className="text-center">{product.percentage.toFixed(1)}%</TableCell>
                <TableCell className="text-center">{formatReal.format(product.averagePrice)}</TableCell>
                <TableCell className="text-center">{product.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}