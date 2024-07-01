import { Link } from "react-router-dom";
import { Menu } from "@/components/menu";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth";
import { Separator } from "@/components/ui/separator";
import { Store, UserRoundCog } from "lucide-react";

export function Forms() {

  const user = getUser();

  return(
    <div>
      <div>
        <Header/>
        <Menu/>
      </div>

      <div className="p-4 md:p-7">
        <div>
          <h1 className="text-3xl font-bold">Olá, {user && user.name.split(" ")[0]}</h1>
          <span className="text-muted-foreground text-sm">Seja bem-vindo a plataforma de pesquisa da Laboremus</span>
        </div>
        
        <div className="mt-6 grid grid-cols-2 md:flex md:items-center gap-4 md:gap-10">
          <div className={`${ user && user.typeAccount === "admin" ? "flex items-center gap-10" : "hidden" }`}>
            <Button asChild className="h-36 md:size-36 md:p-0 w-full flex-col gap-2">
              <Link to="/dashboard">
                <UserRoundCog strokeWidth={1} className="size-10"/>

                Área admin
              </Link>
            </Button>

            <Separator orientation="vertical" className="hidden md:flex h-20"/>
          </div>

          <div>
            <Button asChild variant={"outline"} className="h-36 md:size-36 md:p-0 w-full flex-col gap-2">
              <Link to="/formulario/pesquisa-externa">
                <Store strokeWidth={1} className="size-10"/>

                Pesquisa externa
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}