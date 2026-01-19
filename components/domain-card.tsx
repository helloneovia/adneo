"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FinalDomainResult } from "@/lib/types";
import { ExternalLink, Copy, Star, CheckCircle2, DollarSign, Sparkles } from "lucide-react";
import { useState } from "react";
import { Language, t } from "@/lib/i18n";
import { formatPrice } from "@/lib/price-estimator";

interface DomainCardProps {
  domain: FinalDomainResult;
  onCopy?: (domain: string) => void;
  lang: Language;
}

export function DomainCard({ domain, onCopy, lang }: DomainCardProps) {
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

  const price = domain.availability.price;
  const isPremium = price === null || price === undefined;
  const hasPrice = price !== null && price !== undefined;

  return (
    <Card className="group relative glass hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 overflow-hidden">
      {/* Score badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className={`text-3xl font-bold ${getScoreColor(domain.score.total)}`}>
          {domain.score.total}
        </div>
        <div className="text-xs text-muted-foreground text-center">{t("results.score", lang)}</div>
      </div>

      {/* Premium badge */}
      {isPremium && (
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
            <Sparkles className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        </div>
      )}

      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-primary/5 group-hover:to-primary/10 transition-all duration-500 pointer-events-none" />

      <CardContent className="pt-6 pb-4 relative">
        <div className="mb-5">
          <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
            {domain.fullDomain}
          </h3>
          <div className="flex gap-2 flex-wrap items-center mb-3">
            <Badge variant="outline" className="glass border-primary/30 text-primary font-medium">
              {domain.tld}
            </Badge>
            {domain.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="glass text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          {/* Price display - improved */}
          {hasPrice && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30">
              <span className="text-green-400 font-bold text-base">{formatPrice(price)}</span>
              <span className="text-xs text-green-400/70">GoDaddy</span>
            </div>
          )}
          {isPremium && !hasPrice && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">{formatPrice(null)}</span>
            </div>
          )}
        </div>

        {/* Score breakdown - improved */}
        <div className="space-y-3 mb-5 p-4 rounded-xl glass border border-border/30">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">{t("results.brandability", lang)}</span>
            <div className="flex items-center gap-3">
              <div className="w-32 h-2 bg-secondary/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-blue-400 transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min((domain.score.brandability / 30) * 100, 100)}%` }}
                />
              </div>
              <span className="text-foreground font-bold w-10 text-right text-primary">
                {domain.score.brandability}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">{t("results.pronounceability", lang)}</span>
            <div className="flex items-center gap-3">
              <div className="w-32 h-2 bg-secondary/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-400 transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min((domain.score.pronounceability / 20) * 100, 100)}%` }}
                />
              </div>
              <span className="text-foreground font-bold w-10 text-right text-green-400">
                {domain.score.pronounceability}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">{t("results.seoFit", lang)}</span>
            <div className="flex items-center gap-3">
              <div className="w-32 h-2 bg-secondary/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min((domain.score.seoKeywordFit / 15) * 100, 100)}%` }}
                />
              </div>
              <span className="text-foreground font-bold w-10 text-right text-purple-400">
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
          {t("results.buy", lang)}
        </Button>
        <Button
          onClick={handleCopy}
          variant="outline"
          size="sm"
          className="glass"
          title={copied ? t("results.copied", lang) : t("results.copy", lang)}
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
          title={t("results.favorite", lang)}
        >
          <Star className={`h-4 w-4 ${favorited ? "fill-yellow-400 text-yellow-400" : ""}`} />
        </Button>
      </CardFooter>
    </Card>
  );
}
