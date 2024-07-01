import { cn } from "@/lib/utils";
import { Cog } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useContext } from "react";
import { ChartContext } from "@/context/context-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SummaryProductsKey() {
  
  const { productsKey, isLoading } = useContext(ChartContext);

  const orderedProducts = productsKey.sort((a, b) => b.length - a.length);

  return(
    <div className="col-span-2 flex flex-col gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de produtos chaves
          </CardTitle>
          
          <Cog className="size-4 text-muted-foreground"/>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {!isLoading ? productsKey.length : <Skeleton className="size-6 mb-2"/>}
          </div>

          <p className="text-xs text-muted-foreground">
            Produtos chaves registrados
          </p>
        </CardContent>
      </Card>

      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Top produtos chaves
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {!isLoading ? (
            orderedProducts.length > 0 ? (
              orderedProducts.slice(0, 4).map((product, i) => (
                <div 
                  key={i} 
                  className={cn("mt-2 py-2 px-3 flex items-center justify-between text-sm rounded-md", {
                    "bg-primary" : i === 0,
                    "bg-primary/60" : i === 1,
                    "bg-primary/40" : i === 2,
                    "bg-primary/20" : i === 3,
                  })}
                >
                  <span>{product.name}</span>
                  <span>Quant.: {product.length}</span>
                </div>
              ))
            ) : (
              <span className="h-40 flex items-center justify-center text-sm text-muted-foreground">
                Nenhum produto chave registrado
              </span>
            )
          ) : (
            <div className="mt-2 space-y-2">
              <Skeleton className="w-full h-9"/>
              <Skeleton className="w-full h-9"/>
              <Skeleton className="w-full h-9"/>
              <Skeleton className="w-full h-9"/>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}