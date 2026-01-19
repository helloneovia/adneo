"use client";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { SearchProgress } from "@/lib/types";
import { Loader2, CheckCircle2, Sparkles } from "lucide-react";

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

  const getStageIcon = (stage: string) => {
    if (stage === "done") {
      return <CheckCircle2 className="h-5 w-5 text-green-400" />;
    }
    return <Loader2 className="h-5 w-5 text-primary animate-spin" />;
  };

  return (
    <Card className="w-full max-w-5xl mx-auto glass border-primary/20">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {getStageIcon(progress.stage)}
              <span className="text-base font-semibold">{getStageLabel(progress.stage)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-lg font-bold text-primary">{Math.round(progress.progress)}%</span>
            </div>
          </div>
          
          <div className="relative">
            <Progress 
              value={progress.progress} 
              className="h-3 bg-secondary/50"
            />
            <div 
              className="absolute top-0 left-0 h-3 bg-gradient-to-r from-primary via-blue-400 to-purple-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress.progress}%` }}
            />
          </div>

          <p className="text-sm text-muted-foreground">{progress.message}</p>
          
          {progress.details && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border/50">
              {progress.details.generated !== undefined && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{progress.details.generated}</div>
                  <div className="text-xs text-muted-foreground">Idées générées</div>
                </div>
              )}
              {progress.details.unique !== undefined && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{progress.details.unique}</div>
                  <div className="text-xs text-muted-foreground">Uniques</div>
                </div>
              )}
              {progress.details.checking && (
                <>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {progress.details.checking.current}
                    </div>
                    <div className="text-xs text-muted-foreground">Vérifiés</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {progress.details.checking.tlds}
                    </div>
                    <div className="text-xs text-muted-foreground">Extensions</div>
                  </div>
                </>
              )}
              {progress.details.available !== undefined && (
                <div className="text-center col-span-2 md:col-span-1">
                  <div className="text-2xl font-bold text-green-400">
                    {progress.details.available}
                  </div>
                  <div className="text-xs text-muted-foreground">Disponibles</div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
