import { useMemo } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface PriceSparklineProps {
  data: number[];
  isPositive: boolean;
}

export const PriceSparkline = ({ data, isPositive }: PriceSparklineProps) => {
  const chartData = useMemo(() => {
    return data.map((value, index) => ({ index, value }));
  }, [data]);

  if (data.length < 2) {
    return (
      <div className="h-12 flex items-center justify-center text-muted-foreground text-xs">
        Loading...
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={48}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={isPositive ? 'hsl(var(--success))' : 'hsl(var(--danger))'}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
