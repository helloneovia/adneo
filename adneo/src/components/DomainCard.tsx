"use client";

import { useState } from "react";
import {
  ExternalLink,
  Copy,
  Check,
  Star,
  TrendingUp,
  Zap,
  Hash,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { DomainResult } from "@/types/domain";
import { cn } from "@/lib/utils";

interface DomainCardProps {
  domain: DomainResult;
}

export function DomainCard({ domain }: DomainCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(domain.domain);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-blue-400";
    if (score >= 40) return "text-amber-400";
    return "text-muted-foreground";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-500/10 border-emerald-500/20";
    if (score >= 60) return "bg-blue-500/10 border-blue-500/20";
    if (score >= 40) return "bg-amber-500/10 border-amber-500/20";
    return "bg-secondary border-border";
  };

  const getTagVariant = (tag: string): "success" | "info" | "purple" | "warning" | "secondary" => {
    if (["Premium", "High Quality"].includes(tag)) return "success";
    if (["Short", "Ultra-short", "Clean"].includes(tag)) return "info";
    if (["Brandable", "Easy to say"].includes(tag)) return "purple";
    if (["AI", "Tech", "Cloud", "Hub"].includes(tag)) return "warning";
    return "secondary";
  };

  return (
    <Card className="domain-card group bg-card/50 backdrop-blur border-border/50 hover:border-primary/30 overflow-hidden">
      <div className="p-5">
        {/* Domain name and TLD */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold truncate group-hover:text-primary transition-colors">
              <span className="text-foreground">{domain.name}</span>
              <span className="text-primary">{domain.tld}</span>
            </h3>
          </div>

          {/* Score badge */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ml-3",
                    getScoreBg(domain.score)
                  )}
                >
                  <Star className={cn("w-4 h-4", getScoreColor(domain.score))} />
                  <span className={cn("font-bold", getScoreColor(domain.score))}>
                    {domain.score}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="left" className="p-3 max-w-xs">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Brandability</span>
                    <span className="font-medium">{domain.scores.brandability}/30</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Pronounceability</span>
                    <span className="font-medium">{domain.scores.pronounceability}/20</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">SEO Keyword</span>
                    <span className="font-medium">{domain.scores.seoKeywordFit}/15</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Length Score</span>
                    <span className="font-medium">{domain.scores.lengthScore}/15</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Clean Chars</span>
                    <span className="font-medium">{domain.scores.cleanCharacters}/10</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Business Intent</span>
                    <span className="font-medium">{domain.scores.businessIntent}/10</span>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {domain.tags.map((tag) => (
            <Badge key={tag} variant={getTagVariant(tag)} className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Hash className="w-3 h-3" />
            {domain.name.length} chars
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            SEO: {domain.scores.seoKeywordFit}
          </span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Brand: {domain.scores.brandability}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            asChild
            className="flex-1 btn-shimmer"
            size="sm"
          >
            <a
              href={domain.buyUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Buy on GoDaddy
            </a>
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {copied ? "Copied!" : "Copy domain"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </Card>
  );
}
