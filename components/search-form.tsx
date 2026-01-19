"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Sparkles } from "lucide-react";
import { Language, t } from "@/lib/i18n";

interface SearchFormProps {
  onSearch: (keywords: string[], mode: "smart" | "exact" | "batch") => void;
  isLoading?: boolean;
  lang: Language;
}

export function SearchForm({ onSearch, isLoading, lang }: SearchFormProps) {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"smart" | "exact" | "batch">("smart");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const keywords = mode === "batch"
      ? input.split("\n").filter((k) => k.trim())
      : input.split(/[,\s]+/).filter((k) => k.trim());

    if (keywords.length > 0) {
      onSearch(keywords, mode);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto space-y-6">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative glass rounded-2xl p-2 flex gap-3">
          <div className="flex-1 relative">
            {mode === "batch" ? (
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("search.placeholderBatch", lang)}
                className="w-full min-h-[140px] rounded-xl border-0 bg-background/50 px-6 py-4 text-base ring-0 focus-visible:ring-2 focus-visible:ring-primary/50 placeholder:text-muted-foreground/60 resize-none"
              />
            ) : (
              <div className="relative">
                <Input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t("search.placeholder", lang)}
                  className="h-16 text-lg bg-background/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/50 placeholder:text-muted-foreground/60 pl-6 pr-14"
                />
                <Sparkles className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/50" />
              </div>
            )}
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={isLoading || !input.trim()}
            className="h-16 px-8 text-base font-semibold glow-primary hover:glow-primary transition-all duration-300"
          >
            <Search className="mr-2 h-5 w-5" />
            {isLoading ? t("search.buttonLoading", lang) : t("search.button", lang)}
          </Button>
        </div>
      </div>

      <div className="flex justify-center">
        <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)} className="w-full max-w-md">
          <TabsList className="glass w-full grid grid-cols-3 p-1.5 h-auto">
            <TabsTrigger 
              value="smart" 
              className="py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              {t("search.modes.smart", lang)}
            </TabsTrigger>
            <TabsTrigger 
              value="exact" 
              className="py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              {t("search.modes.exact", lang)}
            </TabsTrigger>
            <TabsTrigger 
              value="batch" 
              className="py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              {t("search.modes.batch", lang)}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </form>
  );
}
