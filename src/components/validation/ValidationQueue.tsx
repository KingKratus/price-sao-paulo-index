import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, XCircle, Clock, Camera, MapPin, DollarSign } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PendingSubmission {
  id: string;
  supermarket: string;
  product: string;
  price: number;
  submittedBy: string;
  submittedAt: string;
  location?: string;
  brand?: string;
  hasImage: boolean;
  observations?: string;
}

interface ValidationQueueProps {
  submissions: PendingSubmission[];
  onValidate: (id: string, approved: boolean) => void;
}

export const ValidationQueue = ({ submissions, onValidate }: ValidationQueueProps) => {
  const { toast } = useToast();
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null);

  const handleApprove = (submission: PendingSubmission) => {
    onValidate(submission.id, true);
    toast({
      title: "Preço aprovado",
      description: `${submission.product} no ${submission.supermarket} foi validado`,
    });
  };

  const handleReject = (submission: PendingSubmission) => {
    onValidate(submission.id, false);
    toast({
      title: "Preço rejeitado",
      description: `Contribuição de ${submission.submittedBy} foi rejeitada`,
      variant: "destructive"
    });
  };

  const toggleExpanded = (id: string) => {
    setExpandedSubmission(expandedSubmission === id ? null : id);
  };

  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <CheckCircle className="h-12 w-12 text-economic-positive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Todas as validações em dia!</h3>
          <p className="text-muted-foreground">
            Não há contribuições pendentes de validação no momento.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Fila de Validação</h2>
        <Badge variant="secondary" className="text-sm">
          <Clock className="h-3 w-3 mr-1" />
          {submissions.length} pendentes
        </Badge>
      </div>

      {submissions.map((submission) => (
        <Card key={submission.id} className="overflow-hidden">
          <CardHeader 
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => toggleExpanded(submission.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {submission.submittedBy.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{submission.product}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{submission.supermarket}</span>
                    <span className="flex items-center">
                      <DollarSign className="h-3 w-3 mr-1" />
                      R$ {submission.price.toFixed(2)}
                    </span>
                    {submission.hasImage && (
                      <Badge variant="secondary" className="text-xs">
                        <Camera className="h-3 w-3 mr-1" />
                        Com foto
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <div>Por {submission.submittedBy}</div>
                <div>{submission.submittedAt}</div>
              </div>
            </div>
          </CardHeader>

          {expandedSubmission === submission.id && (
            <CardContent className="border-t bg-muted/20">
              <div className="space-y-4">
                {submission.location && (
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{submission.location}</span>
                  </div>
                )}
                
                {submission.brand && (
                  <div className="text-sm">
                    <span className="font-medium">Marca:</span> {submission.brand}
                  </div>
                )}
                
                {submission.observations && (
                  <div className="text-sm">
                    <span className="font-medium">Observações:</span>
                    <p className="mt-1 text-muted-foreground">{submission.observations}</p>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReject(submission)}
                    className="flex-1 border-economic-negative/20 text-economic-negative hover:bg-economic-negative/10"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Rejeitar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApprove(submission)}
                    className="flex-1 bg-economic-positive hover:bg-economic-positive/90 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Aprovar
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};