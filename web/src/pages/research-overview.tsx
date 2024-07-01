import { ResearchCard } from "@/components/dashboard/research-card";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export function ResearchOverview() {

  const navigate = useNavigate();
  const { idResearch } = useParams<{ idResearch: string }>();

  return(
    <div>
      <Header/>

      <div className="p-7 space-y-8">
        <Button 
          variant={"ghost"} 
          className="gap-3 text-lg"
          onClick={() => navigate(-1)}
        >
          <MoveLeft className="size-5"/>

          Voltar
        </Button>

        <div>
          { idResearch ? <ResearchCard idResearch={idResearch}/> : <h1>Carregando</h1>}
        </div>
      </div>
    </div>
  );
}