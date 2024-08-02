import { api } from "@/lib/api";
import { Button } from "./ui/button";
import { ChevronsLeftRight, Plus } from "lucide-react";
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
  const [open, setOpen] = useState<boolean>(false);

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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant={"ghost"} className="justify-between border font-normal overflow-hidden whitespace-nowrap text-ellipsis">
          {clientSelected ? clientSelected : "Selecione a revenda"}

          <ChevronsLeftRight className="size-3 rotate-90 text-muted-foreground"/>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <div className="relative">
            <CommandInput 
              value={searchTerm} 
              onValueChange={setSearchTerm}
              className="pr-6"
            />

            <Button 
              size="icon" 
              className="size-5 absolute top-[10px] right-2"
              onClick={() => {
                setOpen(false);
                setClientSelected(searchTerm);
              }}
            >
              <Plus className="size-4"/>
            </Button>
          </div>

          <CommandList>
            <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
            <CommandGroup>
              {clients.map((client, i) => (
                <CommandItem  
                  key={i}
                  className="cursor-pointer"
                  onSelect={(e) => {
                    setOpen(false);
                    setClientSelected(e)
                  }}
                >
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
