import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import { CheckIcon, SlidersHorizontal } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList,
} from "./ui/command"

const options = [
  { value: "merchandising", label: "Merchandising" },
  { value: "treinamento", label: "Treinamento" },
  { value: "pagamento", label: "Pagamento" },
]

interface DataTableFilterProps {
  selectedFilters: string[];
  setSelectedFilters: (newFilter: string[] | ((prevList: string[]) => string[])) => void;
}

export function DataTableFilter({ selectedFilters, setSelectedFilters }: DataTableFilterProps) {

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button title="Filtros" variant="outline" className="border-dashed">
          <SlidersHorizontal className="mr-1 h-4 w-4" />
          
          <span className="hidden md:flex">Filtros</span>

          {selectedFilters.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              
              <Badge
                variant="secondary"
                className="size-6 flex items-center justify-center rounded-sm font-normal lg:hidden"
              >
                {selectedFilters.length}
              </Badge>

              <div className="hidden space-x-1 lg:flex">
                {selectedFilters.length > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedFilters.length} selecionados
                  </Badge>
                ) : (
                  options
                  .filter((option) => selectedFilters.includes(option.value))
                  .map((option) => (
                    <Badge
                      variant="secondary"
                      key={option.value}
                      className="rounded-sm px-1 font-normal"
                    >
                      {option.label}
                    </Badge>
                  ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput/>
          <CommandList>
            <CommandEmpty>Nenhum resultado.</CommandEmpty>
            <CommandGroup>
              {options.map(option => {

                const isSelected = selectedFilters.includes(option.value);

                return(
                  <CommandItem 
                    key={option.value}
                    value={option.value}
                    className="cursor-pointer flex items-center justify-between"
                    onSelect={() => {
                      if(isSelected) {
                        setSelectedFilters((prevList: string[]) => {
                          return prevList.filter((itemSelected: string) => itemSelected !== option.value)
                        })
                      } else {
                        setSelectedFilters((prevList: string[]) => [...prevList, option.value])
                      }
                    }}
                  >
                    {option.label}
                    {isSelected && <CheckIcon className="size-4"/>}
                  </CommandItem>
                ) 
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}