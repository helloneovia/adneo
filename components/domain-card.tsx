"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FinalDomainResult } from "@/lib/types";
import { ExternalLink, Copy, Star } from "lucide-react";
import { useState } from "react";

interface DomainCardProps {
  domain: FinalDomainResult;
  onCopy?: (domain: string) => void;
}

export function DomainCard({ domain, onCopy }: DomainCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(domain.fullDomain);
    setCopied(true);
    if (onCopy) onCopy(domain.fullDomain);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBuy = () => {
    window.open(domain.availability.buyUrl, "_blank");
  };

  return (
    <Card className="hover:shadow-lg hover:shadow-primary/10 transition-all animate-fade-in">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">{domain.fullDomain}</h3>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline">{domain.tld}</Badge>
              {domain.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{domain.score.total}</div>
            <div className="text-xs text-muted-foreground">score</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-4">
          <div>Brandability: {domain.score.brandability}/30</div>
          <div>Pronounceability: {domain.score.pronounceability}/20</div>
          <div>SEO Fit: {domain.score.seoKeywordFit}/15</div>
          <div>Length: {domain.score.lengthScore}/15</div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button
          onClick={handleBuy}
          className="flex-1"
          size="sm"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Acheter sur GoDaddy
        </Button>
        <Button
          onClick={handleCopy}
          variant="outline"
          size="sm"
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Star className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
