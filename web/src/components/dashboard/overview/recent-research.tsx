import { api } from "@/lib/api";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Skeleton } from "../../ui/skeleton";
import { CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";

import Cookies from "js-cookie";
import { IResearch } from "@/utils/researchs-types";

interface RecentResearchProps {
  setTotalResearchs: (newNumber: number) => void;
}

async function getRecentResearchs(setIsLoading: (newState: boolean) => void) {
  setIsLoading(true);
  try {
    const token = Cookies.get("token");

    const response = await api.get("/pesquisas?take=5", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (err) {
    console.error("Error fetching research data:", err);
    return null;
  } finally {
    setIsLoading(false);
  }
}

export function RecentResearch({ setTotalResearchs }: RecentResearchProps) {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [researchs, setResearchs] = useState<IResearch[]>([]);

  useEffect(() => {
    const data = getRecentResearchs(setIsLoading);

    data
    .then(values => {
      setResearchs(values.researchs);
      setTotalResearchs(values.totalResearchs)
    })
    .catch(err => console.log(err))
  }, []);

  return(
    <div className="space-y-6 md:space-y-8">
      {!isLoading ? (
        researchs.length > 0 ? (
          researchs.map((research, i) => (
            <Link 
              key={i} 
              to={`/dashboard/${research.id}`} 
              className="flex items-center"
            >
              <span className="size-9 flex items-center justify-center rounded-full font-semibold bg-primary text-white">
                {research.usuario.nome.split('')[0]}
              </span>
    
              <div className="ml-2">
                <p className="text-sm font-medium leading-none">
                  {research.usuario.nome}
                </p>
  
                <p className="text-sm text-muted-foreground uppercase">
                  {research.cliente} - {research.uf}
                </p>
              </div>
    
              <div className="ml-auto font-medium flex items-center gap-1 text-muted-foreground text-xs">  
                <CalendarDays className="size-4"/>
  
                {format(new Date(research.dataVisita), "dd' de 'MMM', 'yy")}
              </div>
            </Link>
          ))
        ) : (
          <div className="">
            <span className="text-muted-foreground text-xs">
              Nenhuma pesquisa registrada
            </span>
          </div>
        )
      ) : (
        <div className="space-y-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="size-9 rounded-full"/>
              <Skeleton className="w-full h-9 rounded"/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}