import { Chart } from "./chart";
import { useContext } from "react";
import { RecentResearch } from "./recent-research";
import { Cog, FileSearch } from "lucide-react";
import { ContextOverview, ContextOverviewProvider } from "@/context/context-overview";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { ChartContextProvider } from "@/context/context-chart";

export function Overview() {

  const { 
    totalResearchs, 
    setTotalResearchs, 
    totalProductsKey, 
    setTotalProductsKey 
  } = useContext(ContextOverview);

  return(
    <div className="space-y-4">

      {/* Cards overview */}
      <ContextOverviewProvider>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de pesquisas
              </CardTitle>
              
              <FileSearch className="size-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalResearchs}</div>
              <p className="text-xs text-muted-foreground">
                Pesquisas externas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de produtos chaves
              </CardTitle>
              
              <Cog className="size-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProductsKey}</div>
              <p className="text-xs text-muted-foreground">
                Produtos chaves cadastrados
              </p>
            </CardContent>
          </Card>
        </div>
      </ContextOverviewProvider>

      {/* Charts and recent researchs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Produtos chaves</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            <ChartContextProvider>
              <Chart setTotalProductsKey={setTotalProductsKey}/>
            </ChartContextProvider>
          </CardContent>
        </Card>

        <Card className="col-span-4 md:col-span-3">
          <CardHeader>
            <CardTitle>Pesquisas recentes</CardTitle>
            <CardDescription>
              Listagem das últimas 5 pesquisas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentResearch setTotalResearchs={setTotalResearchs}/>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}