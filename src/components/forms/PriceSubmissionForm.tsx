import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, Camera, DollarSign, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
    image: null as File | null
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
    
    if (!formData.supermarket || !formData.product || !formData.price) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha supermercado, produto e preço",
        variant: "destructive"
      });
      return;
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
              <Label htmlFor="brand">Marca</Label>
              <Input
                id="brand"
                placeholder="Ex: Tio João"
                value={formData.brand}
                onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
              />
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