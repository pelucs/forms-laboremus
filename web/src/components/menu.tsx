import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { LayoutGrid, Search, SearchCheck } from "lucide-react";

export function Menu() {
  return(
    <div 
      className="w-full h-[70px] px-5 md:hidden flex items-center justify-between fixed left-0 bottom-0 z-50 
      border-t bg-background"
    >
      <Button 
        asChild
        variant={"ghost"} 
        className="p-2 h-fit flex-col gap-1 items-center"
      >
        <Link to="/pesquisas">
          <SearchCheck className="size-4"/>
          
          <span className="text-xs text-muted-foreground">Minhas Pesquisas</span>
        </Link>
      </Button>
      
      <Button 
        asChild
        variant={"secondary"} 
        className="p-2 h-fit flex-col gap-1 items-center"
      >
        <Link to="/formularios">
          <LayoutGrid className="size-4"/>
          
          <span className="px-5 text-xs text-muted-foreground">Início</span>
        </Link>
      </Button>

      <Button 
        asChild
        variant={"ghost"} 
        className="p-2 h-fit flex-col gap-1 items-center"
      >
        <Link to="/formulario/pesquisa-externa">
          <Search className="size-4"/>
          
          <span className="text-xs text-muted-foreground">Pesquisa externa</span>
        </Link>
      </Button>
    </div>
  );
}