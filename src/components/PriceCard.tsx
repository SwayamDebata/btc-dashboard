import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PriceCardProps {
  label: string;
  value: string;
  subtitle?: string;
  isPrimaryPrice?: boolean;
  showChange?: boolean;
  previousValue?: string;
}

export const PriceCard = ({ 
  label, 
  value, 
  subtitle, 
  isPrimaryPrice = false,
  showChange = false,
  previousValue
}: PriceCardProps) => {
  const [priceDirection, setPriceDirection] = useState<'up' | 'down' | 'neutral'>('neutral');

  useEffect(() => {
    if (showChange && previousValue && value !== previousValue) {
      const prev = parseFloat(previousValue);
      const current = parseFloat(value);
      
      if (current > prev) {
        setPriceDirection('up');
      } else if (current < prev) {
        setPriceDirection('down');
      }

      // Reset animation after 300ms
      const timer = setTimeout(() => {
        setPriceDirection('neutral');
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [value, previousValue, showChange]);

  const formatValue = (val: string) => {
    if (!val || val === '0') return '$0.00';
    
    const num = parseFloat(val);
    if (isNaN(num)) return '$0.00';
    
    if (num >= 1_000_000_000) {
      return `$${(num / 1_000_000_000).toFixed(2)}B`;
    } else if (num >= 1_000_000) {
      return `$${(num / 1_000_000).toFixed(2)}M`;
    } else if (num >= 1_000) {
      return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${num.toFixed(2)}`;
  };

  return (
    <Card className={cn(
      "glass-card p-4 sm:p-6 transition-all duration-200 hover:border-primary/50",
      isPrimaryPrice && "col-span-full"
    )}>
      <div className="space-y-2">
        <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        
        <p className={cn(
          "font-bold transition-all duration-300",
          isPrimaryPrice ? "text-3xl sm:text-5xl lg:text-6xl" : "text-xl sm:text-2xl",
          priceDirection === 'up' && "price-up",
          priceDirection === 'down' && "price-down"
        )}>
          {label.includes('%') ? `${parseFloat(value).toFixed(2)}%` : formatValue(value)}
        </p>
        
        {subtitle && (
          <p className="text-xs sm:text-sm text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
    </Card>
  );
};
