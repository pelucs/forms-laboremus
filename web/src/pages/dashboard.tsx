import { Menu } from "@/components/menu";
import { Header } from "@/components/header";
import { NavDash } from "@/components/nav-dash";
import { Overview } from "@/components/dashboard/overview/overview";
import { Researchs } from "@/components/dashboard/researchs/researchs";
import { TabsContent } from "@/components/ui/tabs";
import { ProductsKey } from "@/components/dashboard/products-key/products-key";
import { ContextOverviewProvider } from "@/context/context-overview";

export function Dashboard() {
  return(
    <div>
      <div>
        <Header/>
        <Menu/>
      </div>

      <div className="p-5 pb-24 md:p-7 flex items-center gap-10">
        <div className="w-full flex flex-col gap-4">
          <h1 className="text-3xl font-bold">
            Dashboard
          </h1>

          <NavDash>
            <ContextOverviewProvider>
              <TabsContent value="overview" className="w-full h-fit space-y-4">
                <Overview/>
              </TabsContent>
            </ContextOverviewProvider>

            <TabsContent value="researchs">
              <Researchs/>
            </TabsContent>

            <TabsContent value="productsKey">
              <ProductsKey/>
            </TabsContent>
          </NavDash>
        </div>
      </div>
    </div>
  );
}