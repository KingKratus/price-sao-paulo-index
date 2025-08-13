import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  period?: string;
  className?: string;
  variant?: 'default' | 'highlight' | 'critical';
}

export const MetricCard = ({ 
  title, 
  value, 
  change, 
  trend, 
  period = "vs mês anterior",
  className,
  variant = 'default'
}: MetricCardProps) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-economic-negative" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-economic-positive" />;
      default:
        return <Minus className="h-4 w-4 text-economic-neutral" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-economic-negative';
      case 'down':
        return 'text-economic-positive';
      default:
        return 'text-economic-neutral';
    }
  };

  const getCardVariant = () => {
    switch (variant) {
      case 'highlight':
        return 'border-primary/20 bg-gradient-to-br from-card to-muted/30 shadow-economic';
      case 'critical':
        return 'border-economic-negative/20 bg-gradient-to-br from-card to-destructive/5';
      default:
        return 'hover:shadow-data transition-shadow duration-300';
    }
  };

  return (
    <Card className={cn(getCardVariant(), className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <div 
            className={cn(
              "text-2xl font-bold", 
              variant === 'highlight' ? 'text-primary' : 'text-card-foreground'
            )}
            style={{ fontSize: 'var(--font-size-metric)', fontWeight: 'var(--font-weight-metric)' }}
          >
            {value}
          </div>
          {change !== undefined && (
            <div className="flex items-center space-x-1">
              {getTrendIcon()}
              <span className={cn("text-sm font-medium", getTrendColor())}>
                {Math.abs(change)}%
              </span>
            </div>
          )}
        </div>
        {period && (
          <p className="text-xs text-muted-foreground mt-1">
            {period}
          </p>
        )}
      </CardContent>
    </Card>
  );
};