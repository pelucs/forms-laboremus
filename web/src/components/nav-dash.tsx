import { ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

interface DashNavProps {
  children: ReactNode;
}

export function NavDash({ children }: DashNavProps) {
  return(
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Geral</TabsTrigger>
        <TabsTrigger value="researchs">Pesquisas</TabsTrigger>
        <TabsTrigger value="productsKey">Produtos chave</TabsTrigger>
      </TabsList>
      
      {children}
    </Tabs>
  );
}