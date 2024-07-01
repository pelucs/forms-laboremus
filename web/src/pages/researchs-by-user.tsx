import { Input } from "@/components/ui/input";
import { Header } from "@/components/header";
import { format, subDays } from "date-fns";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { DatePicker } from "@/components/dashboard/researchs/date-picker";
import Cookies from "js-cookie";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { valueFormated } from "@/helpers/regular-expressions";
import { IResearch } from "@/utils/researchs-types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ptBR } from "date-fns/locale";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "@/components/menu";

async function getResearchs(date: DateRange | undefined, setIsLoading: (newState: boolean) => void) {
  setIsLoading(true);
  try {
    const token = Cookies.get("token");
    const user = getUser();

    const querystring = `startDate=${date?.from}&endDate=${date?.to}`;

    if(user) {
      const response = await api.get(`/pesquisas/${user.sub}?${querystring}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      return response.data;
    }
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    setIsLoading(false);
  }
}

export function ResearchByUser() {

  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), (new Date().getDate() - 1)),
    to: new Date(),
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [researchs, setResearchs] = useState<IResearch[]>([]);

  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const data = getResearchs(date, setIsLoading);
    
    data
    .then(values => {
      setResearchs(values.researchs);
    })
    .catch(err => console.log(err))
  }, [date]);

  const filteredResearchs = search
    ? researchs.filter(research => (
      valueFormated(research.usuario.nome).includes(valueFormated(search)) ||
      valueFormated(research.usuario.email).includes(valueFormated(search)) ||
      valueFormated(research.cliente).includes(valueFormated(search)) ||
      valueFormated(research.uf).includes(valueFormated(search)) ||
      valueFormated(research.tipoDaPesquisa).includes(valueFormated(search))
    )
  ) : researchs;

  return(
    <div>
      <div>
        <Header/>
        <Menu/>
      </div>

      <div className="p-4 pb-24 md:p-7">
        <h1 className="text-xl font-semibold">Minhas pesquisas</h1>

        <div className="mt-4 space-y-5">
          <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-4">
            <Input 
              className="w-full md:w-[280px]"
              placeholder="Encontre uma pesquisa" 
              onChange={e => setSearch(e.target.value)}
            />

            <DatePicker date={date} setDate={setDate}/>
          </div>

          <Card className="py-3 px-5">
            {!isLoading ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">ID</TableHead>
                    <TableHead className="whitespace-nowrap">Nome</TableHead>
                    <TableHead className="whitespace-nowrap">Tipo da pesquisa</TableHead>
                    <TableHead className="whitespace-nowrap">Loja</TableHead>
                    <TableHead className="whitespace-nowrap">UF</TableHead>
                    <TableHead className="whitespace-nowrap">Reposição</TableHead>
                    <TableHead className="whitespace-nowrap">Data</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResearchs.length > 0 ? (
                    filteredResearchs.map((research) => (
                      <TableRow key={research.id}>
                        <TableCell>{research.id}</TableCell>
                        <TableCell className="font-medium whitespace-nowrap">{research.usuario.nome}</TableCell>
    
                        <TableCell>
                          {research.tipoDaPesquisa === "prospeccao" ? "Prospecção" : "Revenda"}
                        </TableCell>
    
                        <TableCell className="whitespace-nowrap">{research.cliente}</TableCell>
                        <TableCell>{research.uf}</TableCell>
    
                        <TableCell>
                          {research.reposicao === "true" ? "Sim" : "Não"}
                        </TableCell>
    
                        <TableCell className="whitespace-nowrap">
                          {format(new Date(research.dataVisita), "dd' de 'MMM', 'yy", { locale: ptBR })}
                        </TableCell>
    
                        <TableCell className="text-right">
                          <Button 
                            asChild 
                            size={"icon"} 
                            className="size-6"
                            variant={"secondary"} 
                          >
                            <Link to={`/dashboard/${research.id}`}>
                              <Eye className="size-3"/>
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableCell colSpan={7} className="h-[40vh] text-center text-muted-foreground">
                      Nenhuma pesquisa encontrada com base nos filtros
                    </TableCell>
                  )}
                </TableBody>
              </Table>
            ) : (
              <Skeleton className="w-full h-96 flex items-center justify-center text-muted-foreground"/>
            )}
          </Card>

          <div className="flex items-start justify-between gap-5">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              {filteredResearchs.length} pesquisas

              {(date?.from || date?.to) && (
                <div>
                  de
                  {date?.from && (
                    <span className="mx-1 py-[2px] px-2 bg-secondary rounded">
                      {format(new Date(Number(date.from)), "dd' de 'MMMM', 'yy", { locale: ptBR })}
                    </span>
                  )}
                  há
                  {date?.to && (
                    <span className="ml-1 py-[2px] px-2 bg-secondary rounded">
                      {format(new Date(Number(date.to)), "dd' de 'MMMM', 'yy", { locale: ptBR })}
                    </span>
                  )}
                </div>
              )}

              {search && (
                <div>
                  com base no filtro 

                  <span className="ml-1 py-[2px] px-2 bg-secondary rounded uppercase">
                    {search}
                  </span>
                </div>
              )}
            </div>

            {/* <div className="flex items-center gap-5">
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Página 1 de 5
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                >
                  <span className="sr-only">Go to first page</span>
                  <DoubleArrowLeftIcon className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                >
                  <span className="sr-only">Go to last page</span>
                  <DoubleArrowRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}