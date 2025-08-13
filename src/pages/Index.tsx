import { useState } from 'react';
import { MetricCard } from '@/components/economic/MetricCard';
import { InflationChart } from '@/components/economic/InflationChart';
import { SupermarketCard } from '@/components/economic/SupermarketCard';
import { PriceSubmissionForm } from '@/components/forms/PriceSubmissionForm';
import { ValidationQueue } from '@/components/validation/ValidationQueue';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, BarChart3, Users, Settings, TrendingUp } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [showPriceForm, setShowPriceForm] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock data for demonstration
  const inflationData = [
    { date: '01/12', index: 100.0, change: 0 },
    { date: '08/12', index: 101.2, change: 1.2 },
    { date: '15/12', index: 102.8, change: 1.6 },
    { date: '22/12', index: 103.5, change: 0.7 },
    { date: '29/12', index: 104.2, change: 0.7 },
    { date: '05/01', index: 105.8, change: 1.5 },
    { date: '12/01', index: 107.1, change: 1.2 },
  ];

  const supermarketData = [
    {
      name: 'Atacadão',
      lastUpdate: '12/01/2025',
      avgInflation: 2.3,
      productsTracked: 15,
      validatedSubmissions: 234,
      pendingValidation: 12,
      locations: 45
    },
    {
      name: 'Assaí Atacadista',
      lastUpdate: '12/01/2025',
      avgInflation: 1.8,
      productsTracked: 18,
      validatedSubmissions: 189,
      pendingValidation: 8,
      locations: 32
    },
    {
      name: 'Carrefour',
      lastUpdate: '11/01/2025',
      avgInflation: 2.7,
      productsTracked: 12,
      validatedSubmissions: 156,
      pendingValidation: 15,
      locations: 28
    }
  ];

  const pendingSubmissions = [
    {
      id: '1',
      supermarket: 'Atacadão',
      product: 'Arroz branco tipo 1 - 5kg',
      price: 25.90,
      submittedBy: 'João Silva',
      submittedAt: 'há 2 horas',
      location: 'Vila Madalena',
      brand: 'Tio João',
      hasImage: true,
      observations: 'Promoção até o final da semana'
    },
    {
      id: '2',
      supermarket: 'Carrefour',
      product: 'Leite integral - 1L',
      price: 4.89,
      submittedBy: 'Maria Santos',
      submittedAt: 'há 4 horas',
      location: 'Pinheiros',
      hasImage: false
    },
    {
      id: '3',
      supermarket: 'Assaí',
      product: 'Feijão carioca - 1kg',
      price: 7.50,
      submittedBy: 'Carlos Lima',
      submittedAt: 'há 6 horas',
      location: 'Liberdade',
      brand: 'Camil',
      hasImage: true
    }
  ];

  const handleSubmitPrice = (data: any) => {
    console.log('Preço enviado:', data);
    setShowPriceForm(false);
    // Here we would normally send to backend
  };

  const handleValidation = (id: string, approved: boolean) => {
    console.log(`Validação: ${id} - ${approved ? 'Aprovado' : 'Rejeitado'}`);
    // Here we would update the backend
  };

  if (showPriceForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4">
        <div className="max-w-4xl mx-auto py-8">
          <PriceSubmissionForm
            onSubmit={handleSubmitPrice}
            onCancel={() => setShowPriceForm(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Índice SP</h1>
                <p className="text-sm text-muted-foreground">Inflação Colaborativa São Paulo</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowPriceForm(true)}
              className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Contribuir
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="supermarkets" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Supermercados</span>
            </TabsTrigger>
            <TabsTrigger value="validation" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Validação</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Sobre</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Índice SP Atual"
                value="107.1"
                change={1.2}
                trend="up"
                period="vs semana anterior"
                variant="highlight"
              />
              <MetricCard
                title="Inflação Mensal"
                value="7.1%"
                change={0.3}
                trend="up"
                period="Janeiro 2025"
              />
              <MetricCard
                title="Contribuições"
                value="579"
                change={12}
                trend="up"
                period="esta semana"
              />
              <MetricCard
                title="Taxa Validação"
                value="94.2%"
                change={2.1}
                trend="up"
                period="últimos 30 dias"
              />
            </div>

            {/* Inflation Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Evolução do Índice de Inflação - São Paulo</CardTitle>
              </CardHeader>
              <CardContent>
                <InflationChart data={inflationData} height={400} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="supermarkets" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {supermarketData.map((market) => (
                <SupermarketCard
                  key={market.name}
                  data={market}
                  onViewDetails={() => toast({
                    title: `Detalhes - ${market.name}`,
                    description: "Funcionalidade em desenvolvimento"
                  })}
                  onSubmitPrice={() => setShowPriceForm(true)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="validation" className="space-y-6">
            <ValidationQueue
              submissions={pendingSubmissions}
              onValidate={handleValidation}
            />
          </TabsContent>

          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sobre o Índice SP</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  O <strong>Índice SP</strong> é uma iniciativa colaborativa para monitorar a inflação 
                  em tempo real nos principais supermercados de São Paulo. Através da contribuição 
                  da comunidade, coletamos preços de produtos essenciais e calculamos um índice 
                  local de inflação.
                </p>
                
                <div className="mt-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-card-foreground mb-2">Como funciona:</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Colaboradores enviam preços de produtos básicos</li>
                      <li>Cada contribuição é validada pela comunidade</li>
                      <li>Calculamos médias ponderadas por região e categoria</li>
                      <li>Geramos um índice de inflação atualizado semanalmente</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-card-foreground mb-2">Produtos monitorados:</h3>
                    <p className="text-muted-foreground">
                      Arroz, feijão, leite, açúcar, óleo, café, farinha de trigo e outros 
                      itens da cesta básica paulistana.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
