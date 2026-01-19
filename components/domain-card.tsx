"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FinalDomainResult } from "@/lib/types";
import { ExternalLink, Copy, Star, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface DomainCardProps {
  domain: FinalDomainResult;
  onCopy?: (domain: string) => void;
}

export function DomainCard({ domain, onCopy }: DomainCardProps) {
  const [copied, setCopied] = useState(false);
  const [favorited, setFavorited] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(domain.fullDomain);
    setCopied(true);
    if (onCopy) onCopy(domain.fullDomain);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBuy = () => {
    window.open(domain.availability.buyUrl, "_blank");
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-primary";
    return "text-yellow-400";
  };

  return (
    <Card className="group relative glass hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 overflow-hidden">
      {/* Score badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className={`text-3xl font-bold ${getScoreColor(domain.score.total)}`}>
          {domain.score.total}
        </div>
        <div className="text-xs text-muted-foreground text-center">score</div>
      </div>

      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-primary/5 group-hover:to-primary/10 transition-all duration-500 pointer-events-none" />

      <CardContent className="pt-6 pb-4 relative">
        <div className="mb-4">
          <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
            {domain.fullDomain}
          </h3>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="glass border-primary/30 text-primary">
              {domain.tld}
            </Badge>
            {domain.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="glass">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Score breakdown */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Brandability</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-blue-400 transition-all duration-500"
                  style={{ width: `${(domain.score.brandability / 30) * 100}%` }}
                />
              </div>
              <span className="text-foreground font-medium w-8 text-right">
                {domain.score.brandability}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Pronounceability</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-400 transition-all duration-500"
                  style={{ width: `${(domain.score.pronounceability / 20) * 100}%` }}
                />
              </div>
              <span className="text-foreground font-medium w-8 text-right">
                {domain.score.pronounceability}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">SEO Fit</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-500"
                  style={{ width: `${(domain.score.seoKeywordFit / 15) * 100}%` }}
                />
              </div>
              <span className="text-foreground font-medium w-8 text-right">
                {domain.score.seoKeywordFit}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-0 relative">
        <Button
          onClick={handleBuy}
          className="flex-1 font-semibold glow hover:glow-primary transition-all"
          size="sm"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Acheter sur GoDaddy
        </Button>
        <Button
          onClick={handleCopy}
          variant="outline"
          size="sm"
          className="glass"
          title={copied ? "Copié !" : "Copier"}
        >
          {copied ? (
            <CheckCircle2 className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="glass"
          onClick={() => setFavorited(!favorited)}
          title="Ajouter aux favoris"
        >
          <Star className={`h-4 w-4 ${favorited ? "fill-yellow-400 text-yellow-400" : ""}`} />
        </Button>
      </CardFooter>
    </Card>
  );
}
