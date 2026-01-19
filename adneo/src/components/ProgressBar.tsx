"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useSearchStore } from "@/store/search-store";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  onCancel?: () => void;
}

export function ProgressBar({ onCancel }: ProgressBarProps) {
  const { isSearching, progress, progressLog } = useSearchStore();
  const [showLogs, setShowLogs] = useState(true);

  if (!isSearching && !progress) return null;

  const getStepIcon = (step: string) => {
    if (step.includes("Done") || step.includes("Complete")) {
      return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    }
    if (step.includes("Error") || step.includes("Failed")) {
      return <XCircle className="w-4 h-4 text-red-400" />;
    }
    if (step.includes("Warning")) {
      return <AlertCircle className="w-4 h-4 text-amber-400" />;
    }
    return <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />;
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 mb-6 glow-box">
      {/* Progress header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {isSearching ? (
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          )}
          <div>
            <h3 className="font-medium">
              {isSearching ? "Searching for domains..." : "Search complete"}
            </h3>
            {progress && (
              <p className="text-sm text-muted-foreground">{progress.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSearching && onCancel && (
            <Button variant="outline" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLogs(!showLogs)}
            className="text-muted-foreground"
          >
            {showLogs ? "Hide" : "Show"} details
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="text-muted-foreground">
            {progress?.step || "Initializing"}
          </span>
          <span className="font-medium text-primary">
            {progress?.percentage || 0}%
          </span>
        </div>
        <Progress value={progress?.percentage || 0} className="h-2" />
      </div>

      {/* Progress logs */}
      {showLogs && progressLog.length > 0 && (
        <div className="bg-background/50 rounded-lg p-3 max-h-40 overflow-y-auto">
          <div className="space-y-1.5">
            {progressLog.map((log, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-2 text-sm",
                  index === progressLog.length - 1
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {getStepIcon(log)}
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
