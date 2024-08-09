import Cookies from "js-cookie";

import { api } from "@/lib/api";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Menu } from "@/components/menu";
import { ptBR } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { getUser } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { IResearch } from "@/utils/researchs-types";
import { DateRange } from "react-day-picker";
import { DatePicker } from "@/components/dashboard/researchs/date-picker";
import { valueFormated } from "@/helpers/regular-expressions";
import { format, subDays } from "date-fns";
import { useEffect, useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { DataTableFilter } from "@/components/data-table-filter";

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
    from: new Date(
      subDays(new Date(), (new Date().getDate() - 1))
      .setHours(0, 0, 0, 0)
    ),
    to: new Date(
      new Date().setHours(23, 59, 59, 999)
    ),
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [researchs, setResearchs] = useState<IResearch[]>([]);

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const data = getResearchs(date, setIsLoading);
    
    data
    .then(values => {
      setResearchs(values.researchs);
    })
    .catch(err => console.log(err))
  }, [date]);

  const filteredResearchs = researchs.filter(research => {
    const matchesSearch = search
      ? valueFormated(research.usuario.nome).includes(valueFormated(search)) ||
        valueFormated(research.usuario.email).includes(valueFormated(search)) ||
        valueFormated(research.cliente).includes(valueFormated(search)) ||
        valueFormated(research.uf).includes(valueFormated(search)) ||
        valueFormated(research.tipoDaPesquisa).includes(valueFormated(search))
      : true;

    const matchesMerchandising = selectedFilters.includes('merchandising')
    ? research.merchandising === "true"
    : "true";

    const matchesTreinamento = selectedFilters.includes('treinamento')
      ? research.treinamento === "true"
      : "true";

    const matchesPagamento = selectedFilters.includes('pagamento')
      ? research.pagamentoVendaPremiada === "true"
      : "true";

    return matchesSearch && matchesMerchandising && matchesTreinamento && matchesPagamento;
  });

  return(
    <div>
      <div>
        <Header/>
        <Menu/>
      </div>

      <div className="p-4 pb-24 md:p-7 space-y-5">
        <h1 className="text-xl font-semibold">Minhas pesquisas</h1>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input 
              className="w-full md:w-[280px]"
              placeholder="Encontre uma pesquisa" 
              onChange={e => setSearch(e.target.value)}
            />

            <DataTableFilter 
              selectedFilters={selectedFilters} 
              setSelectedFilters={setSelectedFilters}
            />

            <div className="flex md:hidden">
              <DatePicker date={date} setDate={setDate}/>
            </div>     
          </div>

          <div className="flex items-start md:items-center justify-between gap-5">
            <div className="text-xs md:text-base flex items-center gap-1">
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

            <div className="hidden md:flex">
              <DatePicker date={date} setDate={setDate}/>
            </div>
          </div>

          <Card className="py-3 px-5">
            {!isLoading ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-6"></TableHead>
                    <TableHead className="w-16 whitespace-nowrap">Id</TableHead>
                    <TableHead className="w-32 whitespace-nowrap">Data</TableHead>
                    <TableHead className="w-40 whitespace-nowrap">Tipo da pesquisa</TableHead>
                    <TableHead className="w-24 whitespace-nowrap">UF</TableHead>
                    <TableHead className="w-32 whitespace-nowrap">Treinamento</TableHead>
                    <TableHead className="w-32 whitespace-nowrap">Pagamento</TableHead>
                    <TableHead className="w-48 whitespace-nowrap">Merchandising</TableHead>
                    <TableHead className="whitespace-nowrap">Loja</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResearchs.length > 0 ? (
                    filteredResearchs.map((research) => (
                      <TableRow key={research.id}>
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

                        <TableCell className="whitespace-nowrap">
                          #{research.id}
                        </TableCell>
    
                        <TableCell className="whitespace-nowrap">
                          {format(new Date(research.dataVisita), "dd' de 'MMM', 'yy", { locale: ptBR })}
                        </TableCell>

                        <TableCell>
                          {research.tipoDaPesquisa === "prospeccao" ? "Prospecção" : "Revenda"}
                        </TableCell>
    
                        <TableCell>
                          {research.uf}
                        </TableCell>
    
                        <TableCell>
                          {research.treinamento === "true" ? "Sim" : "Não"}
                        </TableCell>

                        <TableCell>
                          {research.pagamentoVendaPremiada === "true" ? "Sim" : "Não"}
                        </TableCell>

                        <TableCell className="whitespace-nowrap">
                          {research.merchandising === "true" ? "Sim (Antes/Depois)" : "Não"}
                        </TableCell>
    
                        <TableCell className="whitespace-nowrap">
                          {research.cliente}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableCell colSpan={9} className="h-[40vh] text-center text-muted-foreground">
                      Nenhuma pesquisa encontrada com base nos filtros
                    </TableCell>
                  )}
                </TableBody>
              </Table>
            ) : (
              <Skeleton className="w-full h-96 flex items-center justify-center text-muted-foreground"/>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}