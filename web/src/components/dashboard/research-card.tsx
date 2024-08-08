import Cookies from "js-cookie";

import { api } from "@/lib/api";
import { Card } from "../ui/card";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import { Skeleton } from "../ui/skeleton";
import { Separator } from "../ui/separator";
import { IResearch } from "@/utils/researchs-types";
import { formatReal } from "@/helpers/format-currency";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Loader, LoaderCircle, MoreVertical, Pencil, Trash } from "lucide-react";
import { PopoverPortal } from "@radix-ui/react-popover";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "../ui/use-toast";
import { Dialog, DialogClose, DialogContent, DialogPortal, DialogTrigger } from "../ui/dialog";
import { useLocation, useNavigate, useNavigation, useRoutes } from "react-router-dom";

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

const formSchema = z.object({
  pagamentoVendaPremiada: z.string().nullish(),
  treinamento: z.string().nullish(),
  observacao: z.string().nullish(),
});

type FormTypes = z.infer<typeof formSchema>;

export function ResearchCard({ idResearch }: ResearchCardProps) {

  const navigate = useNavigate();

  const { register, handleSubmit } = useForm<FormTypes>({
    resolver: zodResolver(formSchema)
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [research, setResearch] = useState<IResearch>();

  const [editMode, setEditMode] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState<boolean>(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);

  useEffect(() => {
    const data = getRecentResearch(idResearch, setIsLoading);

    data
    .then(values => {
      setResearch(values.research);
    })
    .catch(err => console.log(err))
  }, []);

  // Deletar uma pesquisa
  const deleteResearch = async () => {
    setIsLoadingDelete(true);
    
    const token = Cookies.get("token");
    
    if(token) { 
      try {
        await api.delete(`/pesquisa/${idResearch}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        toast({
          title: "Pesquisa deletada com sucesso!"
        });

        //Back page
        navigate(-1);
      } catch(err) {
        console.log(err)
      } finally {
        setIsLoadingDelete(false);
      }
    }
  }

  // Atualizar uma pesquisa
  const updateData = async (data: FormTypes) => {
    setIsLoadingEdit(true);
    
    const token = Cookies.get("token");
    
    if(token) {
  
      const { observacao, treinamento, pagamentoVendaPremiada } = data;
  
      if(observacao || pagamentoVendaPremiada || treinamento) {
        try {
          await api.put(`/pesquisa/${research?.id}`, {
            pagamentoVendaPremiada: (pagamentoVendaPremiada === "não" || pagamentoVendaPremiada === "Não"  || pagamentoVendaPremiada === "nao" || pagamentoVendaPremiada === "Nao") ? "false" : "true",
            treinamento: (treinamento === "não" || treinamento === "Não"  || treinamento === "nao" || treinamento === "Nao") ? "false" : "true",
            observacao,
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
  
          toast({
            title: "Alterações salvas!"
          });
  
          setTimeout(() => window.location.reload(), 1700);
        } catch(err) {
          console.log(err)
        } finally {
          setIsLoadingEdit(false);
        }
      }
    }
  }

  return(
    <div className="">
      <h1 className="text-3xl font-bold">Pesquisa externa</h1>

      <div>
        {!isLoading ? (
          research ? (
            <form onSubmit={handleSubmit(updateData)} className="mt-5 flex flex-col-reverse md:flex-row items-start gap-5">
              <Card className="w-full p-5 md:p-10 relative bg-secondary/50">
                <div className="absolute top-4 right-4">
                  <Popover onOpenChange={setOpen} open={open}>
                    <Button 
                      asChild 
                      size="icon" 
                      type="button"
                      className="size-8" 
                      variant="secondary"
                    >
                      <PopoverTrigger>
                        <MoreVertical className="size-4"/>
                      </PopoverTrigger>
                    </Button>

                    <PopoverPortal>
                      <PopoverContent align="end" className="w-40 p-1">
                        {research.tipoDaPesquisa === "revenda" && (
                          <Button 
                            type="button"
                            variant="ghost" 
                            onClick={() => {
                              setOpen(false);
                              setEditMode(true)
                            }} 
                            className="w-full justify-start gap-2 px-2"
                          >
                            <Pencil className="size-4"/>

                            Editar
                          </Button> 
                        )} 

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              type="button"
                              variant="ghost" 
                              className="w-full justify-start gap-2 px-2"
                            >
                              <Trash className="size-4"/>

                              Deletar
                            </Button>  
                          </DialogTrigger>

                          <DialogPortal>
                            <DialogContent>
                              <div className="flex flex-col gap-4">
                                <h1 className="text-2xl font-bold">
                                  Deseja excluir a pesquisa?
                                </h1>

                                <div className="grid grid-cols-2 gap-4">
                                  <Button 
                                    disabled={isLoadingDelete}
                                    variant="destructive"
                                    onClick={deleteResearch} 
                                    className="disabled:opacity-50"
                                  >
                                    {isLoadingDelete ? (
                                      <Loader className="size-4 animate-spin"/>
                                    ) : (
                                      "Deletar"
                                    )}
                                  </Button>

                                  <Button asChild variant="secondary" className="shadow">
                                    <DialogClose>
                                      Cancelar
                                    </DialogClose>
                                  </Button>
                                </div>
                              </div>
                            </DialogContent> 
                          </DialogPortal>  
                        </Dialog> 
                      </PopoverContent>  
                    </PopoverPortal>  
                  </Popover>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
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
                      
                      {editMode ? (
                        <Input
                          className="mt-2"
                          placeholder="Sua resposta"
                          {...register("treinamento")}
                          defaultValue={research.treinamento === "true" ? "Sim" : "Não"}
                        />
                      ) : (
                        <span className="font-medium">
                          {research.treinamento === "true" ? "Sim" : "Não"}
                        </span>
                      )}
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

                      {editMode ? (
                        <Input
                          className="mt-2"
                          placeholder="Sua resposta"
                          {...register("pagamentoVendaPremiada")}
                          defaultValue={research.pagamentoVendaPremiada === "true" ? "Sim" : "Não"}
                        />
                      ) : (
                        <span className="font-medium">
                          {research.pagamentoVendaPremiada === "true" ? "Sim" : "Não"}
                        </span>
                      )}
                    </div>
                  )}
      
                  <div>
                    <h1 className="text-sm text-muted-foreground leading-tight">Foi aplicado material de merchandising?</h1>
                    <span className="font-medium">
                      {research.merchandising === "true" ? "Sim (Antes/Depois)" : "Não"}
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
                      {editMode ? (
                        <Textarea
                          className="mt-2 h-40"
                          placeholder="Sua resposta"
                          defaultValue={research.observacao}
                          {...register("observacao")}
                        />
                      ) : (
                        <span className="font-medium">
                          {research.observacao}
                        </span>
                      )}
                    </div>
                  )}

                  {editMode && (
                    <Button
                      type="submit"
                      disabled={isLoadingEdit}
                      className="w-[180px] disabled:bg-primary/50"
                    >
                      {isLoadingEdit ? <LoaderCircle className="size-4 animate-spin"/> : "Enviar alterações"}
                    </Button>
                  )}
      
                  <Separator/>
      
                  <div>
                    <h1 className="text-sm text-muted-foreground leading-tight">Laboremus no piso de vendas</h1>
      
                    {JSON.parse(research.labPisoDeVendas).length > 0 ? (
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
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
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
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
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
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
      
              <Card className="md:sticky md:top-20 p-5 md:p-10 w-full md:w-fit h-fit bg-secondary/50">
                <div className="flex flex-row md:flex-col items-center gap-4">
                  <div className="text-white size-14 md:size-20 flex items-center justify-center rounded-full text-3xl font-bold bg-primary">
                    {research.usuario.nome.split("")[0]}
                  </div>
      
                  <div className="flex flex-col items-start md:items-center">
                    <h1 className="text-2xl font-bold leading-tight">{research.usuario.nome}</h1>
      
                    <span className="text-sm text-muted-foreground">
                      {research.usuario.email}
                    </span>
                  </div>
                </div>
              </Card>
            </form>
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