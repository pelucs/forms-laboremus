import * as React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { ptBR } from "date-fns/locale"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  date: DateRange | undefined;
  setDate: (newDates: DateRange | undefined) => void;
}

export function DatePicker({
  date,
  setDate,
  className,
}: DatePickerProps) {

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[250px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Escolha uma data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={event => {
              const adjustedFrom = event?.from ? new Date(event.from.setHours(0, 0, 0, 0)) : undefined;
              const adjustedTo = event?.to ? new Date(event.to.setHours(23, 59, 59, 999)) : undefined;
            
              setDate({ 
                from: adjustedFrom, 
                to: adjustedTo 
              });
            
              localStorage.setItem("research_date", JSON.stringify({ from: adjustedFrom, to: adjustedTo }));
            }}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}