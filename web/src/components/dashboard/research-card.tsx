import { api } from "@/lib/api";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import { Skeleton } from "../ui/skeleton";
import { Separator } from "../ui/separator";
import { IResearch } from "@/utils/researchs-types";
import { formatReal } from "@/helpers/format-currency";
import { Card, CardHeader } from "../ui/card";
import { useEffect, useState } from "react";

import Cookies from "js-cookie";

interface ResearchCardProps {
  idResearch: string;
}

async function getRecentResearch(idResearch: string, setIsLoading: (newState: boolean) => void) {
  setIsLoading(true);
  try {
    const token = Cookies.get("token");

    const response = await api.get(`/pesquisa/${idResearch}`, {
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

export function ResearchCard({ idResearch }: ResearchCardProps) {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [research, setResearch] = useState<IResearch>();

  useEffect(() => {
    const data = getRecentResearch(idResearch, setIsLoading);

    data
    .then(values => {
      setResearch(values.research);
    })
    .catch(err => console.log(err))
  }, []);

  return(
    <div className="">
      <h1 className="text-3xl font-bold">Pesquisa externa</h1>

      <div>
        {!isLoading ? (
          research ? (
            <div className="mt-5 flex items-start gap-5">
              <Card className="flex-1 p-10 bg-secondary/50">
                <div className="grid grid-cols-4 gap-5">
                  <div>
                    <h1 className="text-sm text-muted-foreground leading-tight">ID da pesquisa</h1>
                    <span className="font-medium">#{idResearch}</span>
                  </div>
      
                  <div>
                    <h1 className="text-sm text-muted-foreground leading-tight">Nome da loja</h1>
                    <span className="font-medium">{research.cliente}</span>
                  </div>
      
                  <div>
                    <h1 className="text-sm text-muted-foreground leading-tight">Estado</h1>
                    <span className="font-medium">{research.uf}</span>
                  </div>
      
                  <div>
                    <h1 className="text-sm text-muted-foreground leading-tight">Tipo da pesquisa</h1>
                    <span className="font-medium">
                      {research.tipoDaPesquisa === "prospeccao" ? "Prospecção" : "Revenda"}
                    </span>
                  </div>
      
                  <div>
                    <h1 className="text-sm text-muted-foreground leading-tight">Data da pesquisa</h1>
                    <span className="font-medium">
                      {format(new Date(research.dataVisita), "dd' de 'MMM', 'yy", { locale: ptBR })}
                    </span>
                  </div>
      
                  {research.tipoDaPesquisa === "revenda" && (  
                    <div>
                      <h1 className="text-sm text-muted-foreground leading-tight">Houve treinamento na equipe de vendas?</h1>
                      <span className="font-medium">
                        {research.treinamento === "true" ? "Sim" : "Não"}
                      </span>
                    </div>
                  )}

                  {research.tipoDaPesquisa === "revenda" && (  
                    <div>
                      <h1 className="text-sm text-muted-foreground leading-tight">Houve reposição no estoque durante a visita?</h1>
                      <span className="font-medium">
                        {research.reposicao === "true" ? "Sim" : "Não"}
                      </span>
                    </div>
                  )}
      
                  <div>
                    <h1 className="text-sm text-muted-foreground leading-tight">Foi informado sobre venda premiada?</h1>
                    <span className="font-medium">
                      {research.vendaPremiada === "true" ? "Sim" : "Não"}
                    </span>
                  </div>
      
                  {research.tipoDaPesquisa === "revenda" && (
                    <div>
                      <h1 className="text-sm text-muted-foreground leading-tight">Houve pagamento?</h1>
                      <span className="font-medium">
                        {research.pagamentoVendaPremiada === "true" ? "Sim" : "Não"}
                      </span>
                    </div>
                  )}
      
                  <div>
                    <h1 className="text-sm text-muted-foreground leading-tight">Foi apresentado material de merchandising?</h1>
                    <span className="font-medium">
                      {research.merchandising === "true" ? "Sim" : "Não"}
                    </span>
                  </div>
      
                  <div>
                    <h1 className="text-sm text-muted-foreground leading-tight">Foi informado sobre as linhas de crédito da agricultura familiar?</h1>
                    <span className="font-medium">
                      {research.linhasDeCredito === "true" ? "Sim" : "Não"}
                    </span>
                  </div>
      
                  <div>
                    <h1 className="text-sm text-muted-foreground leading-tight">Qual o prazo de entrega do concorrente?</h1>
                    <span className="font-medium">
                      {research.prazoEntregaCon} dias
                    </span>
                  </div>
      
                  {research.campanhaDeVendaCon && (
                    <div>
                      <h1 className="text-sm text-muted-foreground leading-tight">Identificou alguma campanha de vendas do concorrente?</h1>
                      <span className="font-medium">
                        {research.campanhaDeVendaCon}
                      </span>
                    </div>
                  )}
                </div>
      
                <div className="mt-5 space-y-5">
                  {research.observacao && (
                    <div>
                      <h1 className="text-sm text-muted-foreground leading-tight">Observação</h1>
                      <span className="font-medium">{research.observacao}</span>
                    </div>
                  )}
      
                  <Separator/>
      
                  <div>
                    <h1 className="text-sm text-muted-foreground leading-tight">Laboremus no piso de vendas</h1>
      
                    {JSON.parse(research.labPisoDeVendas).length > 0 ? (
                      <div className="mt-2 grid grid-cols-4 gap-2">
                        {JSON.parse(research.labPisoDeVendas).map((lab: { name: string, price: number, amount: number }) => (
                          <div key={lab.name} className="p-4 space-y-2 bg-secondary rounded-md">
                            <div>
                              <h1 className="text-sm text-muted-foreground leading-tight">Nome</h1>
                              <span className="font-medium text-sm">{lab.name}</span>
                            </div>
        
                            <div>
                              <h1 className="text-sm text-muted-foreground leading-tight">Valor</h1>
                              <span className="font-medium text-sm">{formatReal.format(lab.price)}</span>
                            </div>
        
                            <div>
                              <h1 className="text-sm text-muted-foreground leading-tight">Quantidade</h1>
                              <span className="font-medium text-sm">{lab.amount}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="w-fit rounded mt-2 flex px-2 py-1 text-xs text-muted-foreground bg-secondary">
                        Nenhuma máquina identificada
                      </span>
                    )}
                  </div>
      
                  <div>
                    <h1 className="text-sm text-muted-foreground leading-tight">Máquinas concorrentes no piso de vendas</h1>
      
                    {JSON.parse(research.conPisoDeVendas).length > 0 ? (
                      <div className="mt-2 grid grid-cols-4 gap-2">
                        {JSON.parse(research.conPisoDeVendas).map((con: { name: string, price: number, amount: number }) => (
                          <div key={con.name} className="p-4 space-y-2 bg-secondary rounded-md">
                            <div>
                              <h1 className="text-sm text-muted-foreground leading-tight">Nome</h1>
                              <span className="font-medium text-sm">{con.name}</span>
                            </div>
        
                            <div>
                              <h1 className="text-sm text-muted-foreground leading-tight">Valor</h1>
                              <span className="font-medium text-sm">{formatReal.format(con.price)}</span>
                            </div>
        
                            <div>
                              <h1 className="text-sm text-muted-foreground leading-tight">Quantidade</h1>
                              <span className="font-medium text-sm">{con.amount}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="w-fit rounded mt-2 flex px-2 py-1 text-xs text-muted-foreground bg-secondary">
                        Nenhuma máquina identificada
                      </span>
                    )}
                  </div>
      
                  <div>
                    <h1 className="text-sm text-muted-foreground leading-tight">Produtos chaves identificados</h1>
      
                    {JSON.parse(research.produtoChave).length > 0 ? (
                      <div className="mt-2 grid grid-cols-4 gap-2">
                        {JSON.parse(research.produtoChave).map((productKey: { name: string, price: number }) => (
                          <div key={productKey.name} className="p-4 space-y-2 bg-secondary rounded-md">
                            <div>
                              <h1 className="text-sm text-muted-foreground leading-tight">Nome</h1>
                              <span className="font-medium text-sm">{productKey.name}</span>
                            </div>
        
                            <div>
                              <h1 className="text-sm text-muted-foreground leading-tight">Valor</h1>
                              <span className="font-medium text-sm">{formatReal.format(productKey.price)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="w-fit rounded mt-2 flex px-2 py-1 text-xs text-muted-foreground bg-secondary">
                        Nenhuma máquina identificada
                      </span>
                    )}
                  </div>
                </div>
              </Card>
      
              <Card className="sticky top-20 p-10 w-fit h-fit bg-secondary/50">
                <CardHeader className="flex flex-col items-center p-0">
                  <div className="text-white size-20 flex items-center justify-center rounded-full text-3xl font-bold bg-primary">
                    {research.usuario.nome.split("")[0]}
                  </div>
      
                  <h1 className="text-2xl font-bold">{research.usuario.nome}</h1>
      
                  <span className="text-sm text-muted-foreground">
                    {research.usuario.email}
                  </span>
                </CardHeader>
              </Card>
            </div>
          ) : (
            <div>
              Nenhuma pesquisa encontrada com esse id #{idResearch}
            </div>
          )
        ) : (
          <div className="flex items-start gap-5">
            <Skeleton className="flex-1 h-[60vh]"/>
            <Skeleton className="w-72 h-80 rounded-md"/>
          </div>
        )}
      </div>
    </div>
  );
}