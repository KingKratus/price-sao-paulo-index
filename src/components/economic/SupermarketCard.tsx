import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, TrendingUp, TrendingDown, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface SupermarketData {
  name: string;
  logo?: string;
  lastUpdate: string;
  avgInflation: number;
  productsTracked: number;
  validatedSubmissions: number;
  pendingValidation: number;
  locations: number;
}

interface SupermarketCardProps {
  data: SupermarketData;
  onViewDetails: () => void;
  onSubmitPrice: () => void;
}

export const SupermarketCard = ({ data, onViewDetails, onSubmitPrice }: SupermarketCardProps) => {
  const isInflationPositive = data.avgInflation > 0;
  
  return (
    <Card className="group hover:shadow-hover transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{data.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {data.locations} locais em SP
              </p>
            </div>
          </div>
          <Badge variant={isInflationPositive ? "destructive" : "default"}>
            <div className="flex items-center space-x-1">
              {isInflationPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{Math.abs(data.avgInflation)}%</span>
            </div>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-primary">{data.productsTracked}</div>
            <div className="text-xs text-muted-foreground">Produtos</div>
          </div>
          <div>
            <div className="text-xl font-bold text-economic-positive">{data.validatedSubmissions}</div>
            <div className="text-xs text-muted-foreground">Validados</div>
          </div>
          <div>
            <div className="text-xl font-bold text-economic-warning">{data.pendingValidation}</div>
            <div className="text-xs text-muted-foreground">Pendentes</div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onViewDetails}
            className="flex-1"
          >
            <MapPin className="h-4 w-4 mr-1" />
            Ver Detalhes
          </Button>
          <Button 
            size="sm" 
            onClick={onSubmitPrice}
            className="flex-1 bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary text-primary-foreground"
          >
            Enviar Preço
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground text-center">
          Última atualização: {data.lastUpdate}
        </div>
      </CardContent>
    </Card>
  );
};