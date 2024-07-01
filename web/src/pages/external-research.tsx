import { z } from "zod";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { ptBR } from "date-fns/locale"
import { Input } from "../components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "../components/ui/use-toast";
import { Header } from "@/components/header";
import { getUser } from "@/lib/auth";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Textarea } from "../components/ui/textarea";
import { Calendar } from "../components/ui/calendar";
import { Separator } from "../components/ui/separator";
import { municipios } from "@/utils/uf";
import { zodResolver } from "@hookform/resolvers/zod";
import { IArrayMachines } from "@/utils/machines";
import { ChevronDownIcon, Plus } from "lucide-react";
import { Button, buttonVariants } from "../components/ui/button";
import { DataTableFacetedFilter } from "@/components/data-table-faceted-filter";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Dialog, DialogClose, DialogContent, DialogPortal, DialogTrigger } from "@/components/ui/dialog";
import { 
  Form, 
  FormControl,
  FormDescription,
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "../components/ui/form";

import Cookies from "js-cookie";
import { Menu } from "@/components/menu";

const formSchema = z.object({
  uf: z.string(),
  cliente: z.string().nullish(),
  prazoEntregaCon: z.string(),
  tipoDaPesquisa: z.string(),
  vendaPremiada: z.string(),
  merchandising: z.string(),
  linhasDeCredito: z.string(),
  campanhaDeVendaCon: z.string().nullish(),
  reposicao: z.string().nullish(),
  pagamentoVendaPremiada: z.string().nullish(),
  treinamento: z.string().nullish(),
  observacao: z.string().nullish(),
});

type FormTypes = z.infer<typeof formSchema>;

export function ExternalResearch() {

  const user = getUser();

  // Revendas
  const [clients, setClients] = useState<{ nome: string }[]>([]);
  const [clientSelected, setClientSelected] = useState<string>("");

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [typeResearch, setTypeResearch] = useState<string>("");

  const [sellingCampaign, setSellingCampaign] = useState<string>("");

  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);

  const [competitiveMachines, setCompetitiveMachines] = useState<IArrayMachines[]>([]);
  const [laboremusMachines, setLaboremusMachines] = useState<IArrayMachines[]>([]);
  const [productsKey, setProductsKey] = useState<{ name: string, price: number }[]>([]);

  const addLaboremusMachines = () => {
    if(name && price && amount){
      setLaboremusMachines(
        prev => [...prev, { name, price, amount }]
      );
  
      setName("");
      setPrice(0);
      setAmount(0);
    } else{
      toast({
        title: "Preencha todos os campos corretamente"
      });
    }
  }

  const addCompetitiveMachines = () => {
    if(name && price && amount){
      setCompetitiveMachines(
        prev => [...prev, { name, price, amount }]
      );
  
      setName("");
      setPrice(0);
      setAmount(0);
    } else{
      toast({
        title: "Preencha todos os campos corretamente"
      });
    }
  }

  const addProductsKey = () => {
    if(name && price){
      setProductsKey(
        prev => [...prev, { name, price }]
      );
  
      setName("");
      setPrice(0);
    } else{
      toast({
        title: "Preencha todos os campos corretamente"
      });
    }
  }

  const form = useForm<FormTypes>({
    resolver: zodResolver(formSchema)
  });

  async function onSubmit(values: FormTypes) {
    const token = Cookies.get("token");

    if(user) {
      const research = {
        ...values,
        usuarioId: user.sub,
        dataVisita: date,
        produtoChave: JSON.stringify(productsKey),
        labPisoDeVendas: JSON.stringify(laboremusMachines),
        conPisoDeVendas: JSON.stringify(competitiveMachines),
        cliente: clientSelected ? clientSelected : values.cliente,
      }
  
      await api.post("/pesquisa", {
        uf: research.uf,
        usuarioId: research.usuarioId,
        dataVisita: research.dataVisita,
        tipoDaPesquisa: research.tipoDaPesquisa,
        cliente: research.cliente,
        labPisoDeVendas: research.labPisoDeVendas,
        conPisoDeVendas: research.conPisoDeVendas,
        treinamento: research.treinamento,
        vendaPremiada: research.vendaPremiada,
        pagamentoVendaPremiada: research.pagamentoVendaPremiada,
        merchandising: research.merchandising,
        reposicao: research.reposicao,
        prazoEntregaCon: research.prazoEntregaCon,
        campanhaDeVendaCon: research.campanhaDeVendaCon,
        produtoChave: research.produtoChave,
        linhasDeCredito: research.linhasDeCredito,
        observacao: research.observacao,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        toast({
          title: "Pesquisa registrada com sucesso!",
          description: (
            <span className="flex items-center gap-1">
              ID: #{res.data.id}
            </span>
          )
        })

        setTimeout(() => window.location.reload(), 2000);
      })
    }
  }

  return(
    <div>
      <div>
        <Header/>
        <Menu/>
      </div>

      <div className="h-fit pb-24 md:p-10 flex justify-center">
        <div className="w-full max-w-4xl py-5 px-5 md:px-7 md:border md:rounded-md md:bg-secondary/50">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Pesquisa externa</h1>
            <span className="text-sm text-muted-foreground">Preencha todos os campos corretamente</span>
          </div>

          <Separator className="my-7"/>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

              <div className="flex flex-col-reverse md:flex-row items-start gap-10">
                <div className="flex-1">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="tipoDaPesquisa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Qual o tipo da pesquisa?</FormLabel>

                          <FormControl>
                            <div className="relative w-max">
                              <FormControl>
                                <select
                                  className={cn(
                                    buttonVariants({ variant: "outline" }),
                                    "w-[260px] appearance-none font-normal cursor-pointer"
                                  )}
                                  defaultValue="defaultValue"
                                  onChange={e => {
                                    field.onChange(e)
                                    setTypeResearch(e.target.value)
                                  }}
                                >
                                  <option value="defaultValue" disabled>Selecione o tipo da visita</option>
                                  <option value="prospeccao">Prospecção</option>
                                  <option value="revenda">Revenda</option>
                                </select>
                              </FormControl>
                              <ChevronDownIcon className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {typeResearch && (
                      <FormField
                        control={form.control}
                        name="uf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Qual estado?</FormLabel>

                            <FormControl>
                              <div className="relative w-max">
                                <FormControl>
                                  <select
                                    className={cn(
                                      buttonVariants({ variant: "outline" }),
                                      "w-[260px] appearance-none font-normal cursor-pointer"
                                    )}
                                    defaultValue="defaultValue"
                                    onChange={e => {
                                      field.onChange(e)
                                    }}
                                  >
                                    <option value="defaultValue" disabled>Selecione o estado</option>
                                    {municipios.map(uf => (
                                      <option key={uf} value={uf}>{uf}</option>
                                    ))}
                                  </select>
                                </FormControl>
                                <ChevronDownIcon className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  {typeResearch && (
                    <div className="mt-8 space-y-8">

                      {/* Nome da loja */}
                      {typeResearch && (
                        typeResearch === "revenda" ? (
                          <div className="flex flex-col gap-3">
                            <Label>Selecione a revenda</Label>

                            <DataTableFacetedFilter
                              clients={clients}
                              setClients={setClients}
                              clientSelected={clientSelected}
                              setClientSelected={setClientSelected}
                            />
                          </div>
                        ) : (
                          <FormField
                            control={form.control}
                            name="cliente"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome da loja</FormLabel>
    
                                <FormControl>
                                  <Input 
                                    {...field}
                                    value={field.value ?? ''} 
                                    className="max-w-[380px]" 
                                    placeholder="Insira o nome da loja"
                                  />
                                </FormControl>
    
                                <FormMessage/>
                              </FormItem>
                            )}
                          />
                        )
                      )}

                      {/* Máquinas Laboremus no piso de vendas */}
                      {typeResearch === "revenda" && (
                        <div className="flex flex-col gap-3">
                          <label>Quais máquinas Laboremus estão no piso de vendas?</label>

                          <Dialog>
                            <Button asChild className="w-fit gap-1" size={"sm"}>
                              <DialogTrigger>
                                <Plus className="size-4"/>

                                Add máquina
                              </DialogTrigger>
                            </Button>

                            <DialogPortal>
                              <DialogContent>
                                <h1 className="text-2xl font-bold">Adicionar máquina</h1>
                                
                                <Separator orientation="horizontal"/>

                                <div className="flex flex-col gap-4">
                                  <div className="flex flex-col gap-2">
                                    <label className="text-xs uppercase font-semibold text-muted-foreground">Nome</label>

                                    <Input
                                      placeholder="Insira o nome da máquina"
                                      onChange={e => setName(e.target.value)}
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2">
                                      <label className="text-xs uppercase font-semibold text-muted-foreground">Valor</label>

                                      <Input
                                        type="number"
                                        onChange={e => setPrice(Number(e.target.value))}
                                        placeholder="Insira o valor da máquina"
                                      />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                      <label className="text-xs uppercase font-semibold text-muted-foreground">Quantidade</label>

                                      <Input
                                        type="number"
                                        onChange={e => setAmount(Number(e.target.value))}
                                        placeholder="Insira a quantidade"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-4">
                                  <Button asChild variant={"secondary"}>
                                    <DialogClose>
                                      Cancelar
                                    </DialogClose>
                                  </Button>

                                  <Button onClick={addLaboremusMachines}>
                                    Adicionar
                                  </Button>
                                </div>
                              </DialogContent>
                            </DialogPortal>
                          </Dialog>

                          {laboremusMachines.length > 0 && (
                            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                              {laboremusMachines.map(machine => (
                                <div key={machine.name} className="p-3 space-y-2 bg-secondary rounded">
                                  <div>
                                    <h1 className="text-xs uppercase font-semibold text-muted-foreground">Máquina:</h1>
                                    <span className="text-xs leading-none">{machine.name}</span>
                                  </div>

                                  <div>
                                    <h1 className="text-xs uppercase font-semibold text-muted-foreground">Valor R$:</h1>
                                    <span className="text-xs">R${machine.price.toFixed(2)}</span>
                                  </div>

                                  <div>
                                    <h1 className="text-xs uppercase font-semibold text-muted-foreground">Quantidade:</h1>
                                    <span className="text-xs">{machine.amount}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Máquinas concorrentes no piso de vendas */}
                      <div className="flex flex-col gap-3">
                        <Label>Quais máquinas concorrentes estão no piso de vendas?</Label>

                        <Dialog>
                          <Button asChild className="w-fit gap-1" size={"sm"}>
                            <DialogTrigger>
                              <Plus className="size-4"/>

                              Add máquina
                            </DialogTrigger>
                          </Button>

                          <DialogPortal>
                            <DialogContent>
                              <h1 className="text-2xl font-bold">Adicionar máquina</h1>
                              
                              <Separator orientation="horizontal"/>

                              <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                  <label className="text-xs uppercase font-semibold text-muted-foreground">Nome</label>

                                  <Input
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Insira o nome da máquina"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="flex flex-col gap-2">
                                    <label className="text-xs uppercase font-semibold text-muted-foreground">Valor</label>

                                    <Input
                                      type="number"
                                      onChange={e => setPrice(Number(e.target.value))}
                                      placeholder="Insira o valor da máquina"
                                    />
                                  </div>

                                  <div className="flex flex-col gap-2">
                                    <label className="text-xs uppercase font-semibold text-muted-foreground">Quantidade</label>

                                    <Input
                                      type="number"
                                      onChange={e => setAmount(Number(e.target.value))}
                                      placeholder="Insira a quantidade"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4 grid grid-cols-2 gap-4">
                                <Button asChild variant={"secondary"}>
                                  <DialogClose>
                                    Cancelar
                                  </DialogClose>
                                </Button>

                                <Button onClick={addCompetitiveMachines}>
                                  Adicionar
                                </Button>
                              </div>
                            </DialogContent>
                          </DialogPortal>
                        </Dialog>

                        {competitiveMachines.length > 0 && (
                          <div className="mt-2 grid grid-cols-3 gap-4">
                            {competitiveMachines.map(machine => (
                              <div key={machine.name} className="py-2 px-3 space-y-2 bg-secondary rounded">
                                <div>
                                  <h1 className="text-xs uppercase font-semibold text-muted-foreground">Máquina:</h1>
                                  <span className="text-xs leading-none">{machine.name}</span>
                                </div>

                                <div>
                                  <h1 className="text-xs uppercase font-semibold text-muted-foreground">Valor R$:</h1>
                                  <span className="text-xs">R${machine.price.toFixed(2)}</span>
                                </div>

                                <div>
                                  <h1 className="text-xs uppercase font-semibold text-muted-foreground">Quantidade:</h1>
                                  <span className="text-xs">{machine.amount}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Treinamento */}
                      {typeResearch === "revenda" && (
                        <FormField
                          control={form.control}
                          name="treinamento"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Houve treinamento na equipe de vendas?</FormLabel>

                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  className="flex flex-col space-y-1"
                                >
                                  <FormItem className="flex items-center gap-2">
                                    <FormControl>
                                      <RadioGroupItem value="true"/>
                                    </FormControl>
                                      
                                    <FormLabel className="relative -top-1">Sim</FormLabel>
                                  </FormItem>

                                  <FormItem className="flex items-center gap-2">
                                    <FormControl>
                                      <RadioGroupItem value="false"/>
                                    </FormControl>
                                      
                                    <FormLabel className="relative -top-1">Não</FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      )}

                      {/* Venda premiada */}
                      <FormField
                        control={form.control}
                        name="vendaPremiada"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Foi informado sobre o venda premiada?</FormLabel>

                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center gap-2">
                                  <FormControl>
                                    <RadioGroupItem value="true"/>
                                  </FormControl>
                                    
                                  <FormLabel className="relative -top-1">Sim</FormLabel>
                                </FormItem>

                                <FormItem className="flex items-center gap-2">
                                  <FormControl>
                                    <RadioGroupItem value="false"/>
                                  </FormControl>
                                    
                                  <FormLabel className="relative -top-1">Não</FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {/* Pagamento venda premiada */}
                      {typeResearch === "revenda" && (
                        <FormField
                          control={form.control}
                          name="pagamentoVendaPremiada"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Houve pagamento?</FormLabel>

                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  className="flex flex-col space-y-1"
                                >
                                  <FormItem className="flex items-center gap-2">
                                    <FormControl>
                                      <RadioGroupItem value="true"/>
                                    </FormControl>
                                      
                                    <FormLabel className="relative -top-1">Sim</FormLabel>
                                  </FormItem>

                                  <FormItem className="flex items-center gap-2">
                                    <FormControl>
                                      <RadioGroupItem value="false"/>
                                    </FormControl>
                                      
                                    <FormLabel className="relative -top-1">Não</FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      )}

                      {/* Merchandising */}
                      <FormField
                        control={form.control}
                        name="merchandising"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Foi apresentado material de merchandising?</FormLabel>

                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center gap-2">
                                  <FormControl>
                                    <RadioGroupItem value="true"/>
                                  </FormControl>
                                    
                                  <FormLabel className="relative -top-1">Sim</FormLabel>
                                </FormItem>

                                <FormItem className="flex items-center gap-2">
                                  <FormControl>
                                    <RadioGroupItem value="false"/>
                                  </FormControl>
                                    
                                  <FormLabel className="relative -top-1">Não</FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {/* Reposição */}
                      {typeResearch === "revenda" && (
                        <FormField
                          control={form.control}
                          name="reposicao"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Houve reposição no estoque?</FormLabel>

                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  className="flex flex-col space-y-1"
                                >
                                  <FormItem className="flex items-center gap-2">
                                    <FormControl>
                                      <RadioGroupItem value="true"/>
                                    </FormControl>
                                      
                                    <FormLabel className="relative -top-1">Sim</FormLabel>
                                  </FormItem>

                                  <FormItem className="flex items-center gap-2">
                                    <FormControl>
                                      <RadioGroupItem value="false"/>
                                    </FormControl>
                                      
                                    <FormLabel className="relative -top-1">Não</FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      )}

                      {/* Linhas de crédito */}
                      <FormField
                        control={form.control}
                        name="linhasDeCredito"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Foi informado sobre as linhas de crédito da agricultura familiar?</FormLabel>

                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center gap-2">
                                  <FormControl>
                                    <RadioGroupItem value="true"/>
                                  </FormControl>
                                    
                                  <FormLabel className="relative -top-1">Sim</FormLabel>
                                </FormItem>

                                <FormItem className="flex items-center gap-2">
                                  <FormControl>
                                    <RadioGroupItem value="false"/>
                                  </FormControl>
                                    
                                  <FormLabel className="relative -top-1">Não</FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {/* Prazo de entrega concorrente */}
                      <FormField
                        control={form.control}
                        name="prazoEntregaCon"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Qual o prazo de entrega do concorrente?</FormLabel>

                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center gap-2">
                                  <FormControl>
                                    <RadioGroupItem value="0-15"/>
                                  </FormControl>
                                    
                                  <FormLabel className="relative -top-1">0-15</FormLabel>
                                </FormItem>

                                <FormItem className="flex items-center gap-2">
                                  <FormControl>
                                    <RadioGroupItem value="16-30"/>
                                  </FormControl>
                                    
                                  <FormLabel className="relative -top-1">16-30</FormLabel>
                                </FormItem>

                                <FormItem className="flex items-center gap-2">
                                  <FormControl>
                                    <RadioGroupItem value="31-60"/>
                                  </FormControl>
                                    
                                  <FormLabel className="relative -top-1">31-60</FormLabel>
                                </FormItem>

                                <FormItem className="flex items-center gap-2">
                                  <FormControl>
                                    <RadioGroupItem value="+60"/>
                                  </FormControl>
                                    
                                  <FormLabel className="relative -top-1">+60</FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {/* Campanha de vendas do concorrente */}
                      <FormField
                        control={form.control}
                        name="campanhaDeVendaCon"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Identificou alguma campanha de vendas do concorrente?</FormLabel>

                            <FormControl>
                              <RadioGroup
                                onValueChange={setSellingCampaign}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center gap-2">
                                  <FormControl>
                                    <RadioGroupItem value="true"/>
                                  </FormControl>
                                    
                                  <FormLabel className="relative -top-1">Sim</FormLabel>
                                </FormItem>

                                <FormItem className="flex items-center gap-2">
                                  <FormControl>
                                    <RadioGroupItem value="false"/>
                                  </FormControl>
                                    
                                  <FormLabel className="relative -top-1">Não</FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>

                            {sellingCampaign === "true" && (
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="Qual?"
                                  value={field.value ?? ''}  
                                />
                              </FormControl>
                            )}
                          </FormItem>
                        )}
                      />

                      {/* Produto chave */}
                      <div className="flex flex-col gap-3">
                        <Label>Identificou algum produto chave para o desenvolvimento da Laboremus? (opcional)</Label>

                        <Dialog>
                          <Button asChild className="w-fit gap-1" size={"sm"}>
                            <DialogTrigger>
                              <Plus className="size-4"/>

                              Add máquina
                            </DialogTrigger>
                          </Button>

                          <DialogPortal>
                            <DialogContent>
                              <h1 className="text-2xl font-bold">Adicionar máquina</h1>
                              
                              <Separator orientation="horizontal"/>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                  <label className="text-xs uppercase font-semibold text-muted-foreground">Nome</label>

                                  <Input
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Insira o nome da máquina"
                                  />
                                </div>

                                <div className="flex flex-col gap-2">
                                  <label className="text-xs uppercase font-semibold text-muted-foreground">Valor</label>

                                  <Input
                                    type="number"
                                    onChange={e => setPrice(Number(e.target.value))}
                                    placeholder="Insira o valor da máquina"
                                  />
                                </div>
                              </div>

                              <div className="mt-4 grid grid-cols-2 gap-4">
                                <Button asChild variant={"secondary"}>
                                  <DialogClose>
                                    Cancelar
                                  </DialogClose>
                                </Button>

                                <Button onClick={addProductsKey}>
                                  Adicionar
                                </Button>
                              </div>
                            </DialogContent>
                          </DialogPortal>
                        </Dialog>

                        {productsKey.length > 0 && (
                          <div className="mt-2 grid grid-cols-3 gap-4">
                            {productsKey.map(machine => (
                              <div key={machine.name} className="py-2 px-3 space-y-2 bg-secondary rounded">
                                <div>
                                  <h1 className="text-xs uppercase font-semibold text-muted-foreground">Máquina:</h1>
                                  <span className="text-xs leading-none">{machine.name}</span>
                                </div>

                                <div>
                                  <h1 className="text-xs uppercase font-semibold text-muted-foreground">Valor R$:</h1>
                                  <span className="text-xs">R${machine.price.toFixed(2)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Observação */}
                      <FormField
                        control={form.control}
                        name="observacao"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Observação (opcional)</FormLabel>

                            <FormControl>
                              <Textarea
                                placeholder="Escreva uma mensagem"
                                className="resize-none"
                                onChange={e => field.onChange(e)}
                              />
                            </FormControl>

                            <FormDescription>
                              Caso você tenha alguma observação que não se enquadra nas perguntas feitas acima
                            </FormDescription>

                            <FormMessage/>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                {typeResearch && (
                  <div className="md:sticky md:top-20">
                    <Label>Selecione a data da visita</Label>

                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      locale={ptBR}
                      className="mt-3 rounded-md border"
                    />
                  </div>
                )}
              </div>

              <Button 
                type="submit"
                disabled={typeResearch ? false : true}
              >
                Enviar formulário
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}