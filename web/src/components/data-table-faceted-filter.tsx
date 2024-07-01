import { api } from "@/lib/api";
import { Button } from "./ui/button";
import { ChevronsLeftRight } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "./ui/popover";

interface OptionsTypes {
  nome: string
}

interface DataTableFacetedFilterProps {
  clients: OptionsTypes[];
  setClients: (newClients: OptionsTypes[]) => void;
  clientSelected: string;
  setClientSelected: (query: string) => void;
}

export function DataTableFacetedFilter({ clients, setClients, clientSelected, setClientSelected }: DataTableFacetedFilterProps) {
  
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300); 

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Depois testar com React 19
  const handleSearch = async (query: string) => {
    try {
      const response = await api.get("/clientes", {
        params: { query }
      });
      setClients(response.data);
    } catch (err) {
      console.error("Erro ao buscar clientes:", err);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"ghost"} className="w-[220px] justify-between border font-normal">
          {clientSelected ? clientSelected : "Selecione a revenda"}

          <ChevronsLeftRight className="size-3 rotate-90 text-muted-foreground"/>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput value={searchTerm} onValueChange={setSearchTerm}/>
          <CommandList>
            <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
            <CommandGroup>
              {clients.map((client, i) => (
                <CommandItem onSelect={(e) => setClientSelected(e)} key={i}>
                  {client.nome}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
