import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { getUser } from "@/lib/auth";
import { Separator } from "./ui/separator";
import { LayoutGrid, LogOut } from "lucide-react";
import { ButtonTheme } from "./button-theme";

import logoDark from "../../public/laboremus-dark.png";
import logoLight from "../../public/laboremus-light.png";
import Cookies from "js-cookie";

export function Header() {

  const user = getUser();

  return(
    <div className="h-16 flex items-center justify-between px-5 md:px-7 border-b bg-background z-50 sticky top-0 left-0">
      <div className="flex items-center gap-5">
        <div>
          <img src={logoDark} alt="" className="hidden dark:block w-[140px]"/>
          <img src={logoLight} alt="" className="block dark:hidden w-[140px]"/>
        </div>

        <Separator orientation="vertical" className="hidden md:flex h-5"/>

        <nav className="hidden md:flex items-center gap-5 text-sm text-muted-foreground">
          <Link className="hover:text-foreground transition-all" to="/formularios">Início</Link>
          <Link className="hover:text-foreground transition-all" to="/formulario/pesquisa-externa">Pesquisa externa</Link>
          <Link className="hover:text-foreground transition-all" to="/pesquisas">Minhas pesquisas</Link>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <div className={`${ user && user.typeAccount === "admin" ? "hidden md:flex items-center gap-5" : "hidden" }`}>
          <Button asChild className="gap-2" size={"sm"}>
            <Link to="/dashboard">
              <LayoutGrid className="size-4"/>

              Dashboard
            </Link>
          </Button>

          <Separator orientation="vertical" className="h-5"/>
        </div>

        <ButtonTheme/>

        <span className="size-9 flex items-center justify-center rounded-full font-semibold bg-primary text-white">
          {user && user.name.split('')[0]}
        </span>

        <Button 
          size={"icon"}
          variant={"ghost"}
          onClick={() => {
            Cookies.remove("token")
            window.location.pathname = "/"
          }} 
        >
          <LogOut className="size-4 text-red-500"/>
        </Button>
      </div>
    </div>
  );
}