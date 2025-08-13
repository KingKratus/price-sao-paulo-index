import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, Camera, DollarSign, MapPin, ExternalLink, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PriceSubmissionFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const PriceSubmissionForm = ({ onSubmit, onCancel }: PriceSubmissionFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    supermarket: '',
    product: '',
    price: '',
    unit: '',
    location: '',
    brand: '',
    observations: '',
    image: null as File | null,
    waybackUrl: '',
    captureDate: ''
  });

  const supermarkets = [
    'Atacadão',
    'Assaí Atacadista',
    'Carrefour'
  ];

  const products = [
    'Arroz branco tipo 1 - 5kg',
    'Feijão carioca - 1kg',
    'Leite integral - 1L',
    'Açúcar cristal - 1kg',
    'Óleo de soja - 900ml',
    'Café torrado - 500g',
    'Farinha de trigo - 1kg'
  ];

  const units = ['kg', 'L', 'unidade', 'pacote'];

  // Marcas aceitas para validação
  const acceptedBrands = [
    'Tio João', 'Camil', 'Nestlé', 'Itambé', 'Parmalat', 'Soya', 'Liza', 
    'União', 'Cristal', 'Da Barra', 'Taeq', 'Carrefour', 'Qualitá'
  ];

  // Função para verificar se é último sábado do mês
  const isLastSaturdayOfMonth = (date: Date): boolean => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // Encontra o último sábado do mês
    let lastSaturday = lastDayOfMonth;
    while (lastSaturday.getDay() !== 6) {
      lastSaturday.setDate(lastSaturday.getDate() - 1);
    }
    
    return date.toDateString() === lastSaturday.toDateString();
  };

  // Função para validar URL do Wayback Machine
  const isValidWaybackUrl = (url: string): boolean => {
    const waybackPattern = /^https?:\/\/web\.archive\.org\/web\/\d{14}\//;
    return waybackPattern.test(url);
  };

  // Função para extrair data da URL do Wayback Machine
  const extractDateFromWaybackUrl = (url: string): Date | null => {
    const match = url.match(/\/web\/(\d{14})\//);
    if (!match) return null;
    
    const timestamp = match[1];
    const year = parseInt(timestamp.substring(0, 4));
    const month = parseInt(timestamp.substring(4, 6)) - 1;
    const day = parseInt(timestamp.substring(6, 8));
    
    return new Date(year, month, day);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      toast({
        title: "Imagem carregada",
        description: "Foto da etiqueta de preço adicionada com sucesso",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações obrigatórias
    if (!formData.supermarket || !formData.product || !formData.price || !formData.brand) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha supermercado, produto, preço e marca",
        variant: "destructive"
      });
      return;
    }

    // Validações do Wayback Machine se URL foi fornecida
    if (formData.waybackUrl) {
      // Verifica se a URL é válida do Wayback Machine
      if (!isValidWaybackUrl(formData.waybackUrl)) {
        toast({
          title: "URL inválida",
          description: "A URL deve ser do Wayback Machine (web.archive.org)",
          variant: "destructive"
        });
        return;
      }

      // Extrai e valida a data da captura
      const captureDate = extractDateFromWaybackUrl(formData.waybackUrl);
      if (!captureDate) {
        toast({
          title: "Data inválida",
          description: "Não foi possível extrair a data da URL do Wayback Machine",
          variant: "destructive"
        });
        return;
      }

      // Verifica se foi capturado no último sábado do mês
      if (!isLastSaturdayOfMonth(captureDate)) {
        toast({
          title: "Data não aceita",
          description: "Aceito apenas capturas do último sábado do mês",
          variant: "destructive"
        });
        return;
      }

      // Verifica se a marca está na lista aceita
      if (!acceptedBrands.includes(formData.brand)) {
        toast({
          title: "Marca não aceita",
          description: "Esta marca não está na lista de marcas aceitas para Wayback Machine",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "URL do Wayback Machine validada!",
        description: `Captura válida de ${captureDate.toLocaleDateString('pt-BR')}`,
      });
    }

    onSubmit(formData);
    toast({
      title: "Preço enviado!",
      description: "Sua contribuição foi registrada e aguarda validação",
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-primary" />
          <span>Contribuir com Preço</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supermarket">Supermercado *</Label>
              <Select 
                value={formData.supermarket} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, supermarket: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o supermercado" />
                </SelectTrigger>
                <SelectContent>
                  {supermarkets.map(market => (
                    <SelectItem key={market} value={market}>{market}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="product">Produto *</Label>
              <Select 
                value={formData.product} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, product: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o produto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map(product => (
                    <SelectItem key={product} value={product}>{product}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Marca *</Label>
              <Select 
                value={formData.brand} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, brand: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a marca" />
                </SelectTrigger>
                <SelectContent>
                  {acceptedBrands.map(brand => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Região/Bairro</Label>
              <Input
                id="location"
                placeholder="Ex: Vila Madalena"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observations">Observações</Label>
            <Textarea
              id="observations"
              placeholder="Informações adicionais, promoções, etc."
              value={formData.observations}
              onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Seção do Wayback Machine */}
          <div className="space-y-4 p-4 border border-primary/20 rounded-lg bg-primary/5">
            <div className="flex items-center space-x-2">
              <ExternalLink className="h-4 w-4 text-primary" />
              <Label className="text-sm font-medium">URL do Wayback Machine (Opcional)</Label>
            </div>
            <div className="space-y-2">
              <Input
                id="waybackUrl"
                placeholder="https://web.archive.org/web/20241230120000/http://..."
                value={formData.waybackUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, waybackUrl: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>Aceito apenas capturas do último sábado do mês de marcas pré-aprovadas</span>
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Foto da Etiqueta de Preço</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label htmlFor="image" className="cursor-pointer">
                <div className="space-y-2">
                  <Camera className="h-8 w-8 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">
                    Clique para tirar foto ou selecionar imagem
                  </p>
                  {formData.image && (
                    <Badge variant="secondary" className="mt-2">
                      <Upload className="h-3 w-3 mr-1" />
                      {formData.image.name}
                    </Badge>
                  )}
                </div>
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              A foto ajuda na validação dos dados e aumenta a confiabilidade
            </p>
          </div>

          <div className="flex space-x-3">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary"
            >
              Enviar Contribuição
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};