import { ptBR } from "date-fns/locale";
import { format } from "date-fns";

interface FormatDateProps {
  date: Date | undefined;
}

export function formatDate({ date }: FormatDateProps): string | undefined {
  if (!date) {
    return undefined;
  }

  return format(date, "dd' de 'MMM'", { locale: ptBR });
}