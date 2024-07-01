import { ReactNode, createContext, useState } from "react";

interface ContextOverviewProviderProps {
  children: ReactNode
}

interface ContextOverviewTypes {
  totalResearchs: number;
  setTotalResearchs: (newNumber: number) => void;

  totalProductsKey: number;
  setTotalProductsKey: (newNumber: number) => void;
}

export const ContextOverview = createContext({} as ContextOverviewTypes);

export function ContextOverviewProvider({ children }: ContextOverviewProviderProps) {
  
  const [totalResearchs, setTotalResearchs] = useState<number>(0);
  const [totalProductsKey, setTotalProductsKey] = useState<number>(0);

  return(
    <ContextOverview.Provider value={{ totalResearchs, setTotalResearchs, totalProductsKey, setTotalProductsKey}}>
      {children}
    </ContextOverview.Provider>
  );
}