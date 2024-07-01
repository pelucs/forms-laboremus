import { useContext, useEffect } from "react";
import { Skeleton } from "../../ui/skeleton";
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts"
import { ChartContext } from "@/context/context-chart";
import { formatReal } from "@/helpers/format-currency";

interface ChartProps {
  setTotalProductsKey?: (newNumber: number) => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {

  if (active && payload && payload.length) {
    return (
      <div className="py-3 px-4 rounded bg-secondary">
        <h1>{label}</h1>

        <p className="text-sm text-muted-foreground">
          Quantidade: {`${payload[0].payload.length}`}
        </p>

        <p className="text-sm text-muted-foreground">
          Porcentagem: {`${payload[0].value.toFixed(1)}`}%
        </p>
        
        <p className="text-sm text-muted-foreground">
          Preço médio de mercado: {`${formatReal.format(payload[0].payload.averagePrice)}`}
        </p>
      </div>
    );
  }

  return null;
};

export function Chart({ setTotalProductsKey }: ChartProps) {

  const { productsKey, isLoading } = useContext(ChartContext);

  useEffect(() => {
    setTotalProductsKey && setTotalProductsKey(productsKey.length)
  },[productsKey]);

  return (
    <div>
      {!isLoading ? (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={productsKey.slice(0, 10)}>
            <Tooltip cursor={false} content={<CustomTooltip data={productsKey}/>}/>
            <CartesianGrid strokeDasharray="3 3" opacity={.3}/>
            
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Bar
              dataKey="percentage"
              fill="currentColor"
              radius={[4, 4, 0, 0]}
              className="fill-primary"
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div>
          <Skeleton className="w-full h-full"/>
        </div>
      )}
    </div>
  )
}