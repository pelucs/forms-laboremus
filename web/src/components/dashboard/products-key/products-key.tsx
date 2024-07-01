import { Chart } from "../overview/chart";
import { AllProductsKey } from "./all-products-key";
import { Card, CardContent } from "@/components/ui/card";
import { SummaryProductsKey } from "./summary-product-key";
import { ChartContextProvider } from "@/context/context-chart";

export function ProductsKey() {
  return(
    <div className="mt-4 space-y-4">
      <h1 className="text-xl font-semibold">
        Produtos chaves
      </h1>

      <div className="mt-4 flex flex-col-reverse md:grid md:grid-cols-7 gap-4">
        <Card className="col-span-5">
          <CardContent className="pl-0 pt-8">
            <ChartContextProvider>
              <Chart/>
            </ChartContextProvider>
          </CardContent>
        </Card>

        <ChartContextProvider>
          <SummaryProductsKey/>
        </ChartContextProvider>
      </div>

      <ChartContextProvider>
        <AllProductsKey/>
      </ChartContextProvider>
    </div>
  );
}