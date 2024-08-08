import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { ReactNode, useEffect, useState } from "react";
interface DashNavProps {
  children: ReactNode;
}

export function NavDash({ children }: DashNavProps) {

  const [currentTab, setCurrentTab] = useState("");

  useEffect(() => {
    let local = localStorage.getItem("current_tab");

    if(!local) {
      setCurrentTab("overview");
      localStorage.setItem("current_tab", "overview");
    } else {
      setCurrentTab(local);
    }
  }, []);

  return(
    <Tabs 
      value={currentTab} 
      onValueChange={setCurrentTab}
      defaultValue="overview" 
      className="space-y-4"
    >
      <TabsList>
        <TabsTrigger 
          value="overview"
          onClick={() => {
            localStorage.setItem("current_tab", "overview")
          }}
        >
          Geral
        </TabsTrigger>

        <TabsTrigger 
          value="researchs"
          onClick={() => {
            localStorage.setItem("current_tab", "researchs")
          }}
        >
          Pesquisas
        </TabsTrigger>

        <TabsTrigger 
          value="productsKey"
          onClick={() => {
            localStorage.setItem("current_tab", "productsKey")
          }}
        >
          Produtos chave
        </TabsTrigger>
      </TabsList>
      
      {children}
    </Tabs>
  );
}