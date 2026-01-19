"use client";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { SearchProgress } from "@/lib/types";

interface ProgressBarProps {
  progress: SearchProgress | null;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  if (!progress) return null;

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case "generating":
        return "Génération des idées...";
      case "normalizing":
        return "Normalisation...";
      case "checking":
        return "Vérification de disponibilité...";
      case "scoring":
        return "Calcul des scores...";
      case "filtering":
        return "Filtrage...";
      case "done":
        return "Terminé";
      default:
        return "En cours...";
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{getStageLabel(progress.stage)}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress.progress)}%</span>
          </div>
          <Progress value={progress.progress} />
          <p className="text-sm text-muted-foreground">{progress.message}</p>
          {progress.details && (
            <div className="text-xs text-muted-foreground space-y-1">
              {progress.details.generated !== undefined && (
                <p>{progress.details.generated} idées générées</p>
              )}
              {progress.details.unique !== undefined && (
                <p>{progress.details.unique} uniques</p>
              )}
              {progress.details.checking && (
                <p>
                  Vérification: {progress.details.checking.current} / {progress.details.checking.total} domaines
                  ({progress.details.checking.tlds} extensions)
                </p>
              )}
              {progress.details.available !== undefined && (
                <p className="text-primary font-medium">
                  {progress.details.available} domaines disponibles trouvés
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
