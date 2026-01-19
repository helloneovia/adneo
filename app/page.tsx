"use client";

import { useState, useEffect } from "react";
import { SearchForm } from "@/components/search-form";
import { ProgressBar } from "@/components/progress-bar";
import { DomainCard } from "@/components/domain-card";
import { FiltersPanel } from "@/components/filters-panel";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchRequest, SearchProgress, SearchResult, FinalDomainResult, SortOption } from "@/lib/types";
import { Download, Sparkles, Zap, Shield, TrendingUp } from "lucide-react";
import { Language, getLanguage, t } from "@/lib/i18n";

export default function Home() {
  const [lang, setLang] = useState<Language>("en");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [mode, setMode] = useState<"smart" | "exact" | "batch">("smart");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<SearchProgress | null>(null);
  const [results, setResults] = useState<FinalDomainResult[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("best-match");
  const [filters, setFilters] = useState<any>({
    tlds: [".com", ".io", ".ai"],
    minLength: 3,
    maxLength: 20,
    allowHyphens: false,
    allowDigits: false,
    minBrandScore: 0,
    category: "",
    style: "",
    tone: "",
  });

  // Détection automatique de la langue au chargement
  useEffect(() => {
    const detectedLang = getLanguage();
    setLang(detectedLang);
    // Sauvegarder dans localStorage
    localStorage.setItem("adneo-lang", detectedLang);
  }, []);

  // Charger la langue depuis localStorage si disponible
  useEffect(() => {
    const savedLang = localStorage.getItem("adneo-lang") as Language;
    if (savedLang && ["fr", "en", "es", "zh"].includes(savedLang)) {
      setLang(savedLang);
    }
  }, []);

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("adneo-lang", newLang);
  };

  const handleSearch = async (searchKeywords: string[], searchMode: typeof mode) => {
    setKeywords(searchKeywords);
    setMode(searchMode);
    setIsLoading(true);
    setProgress(null);
    setResults([]);

    try {
      const request: SearchRequest = {
        keywords: searchKeywords,
        tlds: filters.tlds,
        mode: searchMode,
        options: {
          allowHyphens: filters.allowHyphens,
          allowDigits: filters.allowDigits,
          maxLength: filters.maxLength,
          minLength: filters.minLength,
          minBrandScore: filters.minBrandScore,
          category: filters.category,
          style: filters.style,
          tone: filters.tone,
        },
      };

      setProgress({
        stage: "generating",
        progress: 10,
        message: t("progress.generating", lang),
        details: { generated: 0 },
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      setProgress({
        stage: "normalizing",
        progress: 30,
        message: t("progress.normalizing", lang),
        details: { unique: 0 },
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      setProgress({
        stage: "checking",
        progress: 50,
        message: t("progress.checking", lang),
        details: { checking: { current: 0, total: 100, tlds: filters.tlds.length } },
      });

      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la recherche");
      }

      const data: SearchResult = await response.json();

      setProgress({
        stage: "done",
        progress: 100,
        message: t("progress.done", lang),
        details: { available: data.finalResults.length },
      });

      setResults(data.finalResults);
    } catch (error) {
      console.error("Search error:", error);
      setProgress({
        stage: "done",
        progress: 100,
        message: "Erreur lors de la recherche",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const sortedResults = [...results].sort((a, b) => {
    switch (sortBy) {
      case "shortest":
        return a.name.length - b.name.length;
      case "highest-score":
        return b.score.total - a.score.total;
      case "most-premium":
        return b.score.brandability - a.score.brandability;
      case "keyword-strongest":
        return b.score.seoKeywordFit - a.score.seoKeywordFit;
      case "best-match":
      default:
        return b.score.total - a.score.total;
    }
  });

  const handleExportCSV = () => {
    const csv = [
      ["Domain", "TLD", "Full Domain", "Score", "Brandability", "Pronounceability", "SEO Fit", "Buy URL"],
      ...sortedResults.map((r) => [
        r.name,
        r.tld,
        r.fullDomain,
        r.score.total.toString(),
        r.score.brandability.toString(),
        r.score.pronounceability.toString(),
        r.score.seoKeywordFit.toString(),
        r.availability.buyUrl,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `adneo-domains-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const plural = results.length > 1 ? "s" : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-[#0a0f1a]">
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="relative border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Sparkles className="h-7 w-7 text-primary animate-pulse" />
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">{t("header.title", lang)}</h1>
                <p className="text-xs text-muted-foreground -mt-1">{t("header.subtitle", lang)}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>{t("header.features.fast", lang)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>{t("header.features.verified", lang)}</span>
                </div>
              </div>
              <LanguageSwitcher currentLang={lang} onLanguageChange={handleLanguageChange} />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Search Section */}
        <section className="mb-16">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              {t("hero.title", lang)}{" "}
              <span className="gradient-text">{t("hero.titleHighlight", lang)}</span>{" "}
              {t("hero.titleEnd", lang)}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("hero.subtitle", lang)}
            </p>
            
            {/* Features badges */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="glass px-4 py-2 rounded-full text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span>{t("hero.badges.extensions", lang)}</span>
              </div>
              <div className="glass px-4 py-2 rounded-full text-sm flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span>{t("hero.badges.speed", lang)}</span>
              </div>
              <div className="glass px-4 py-2 rounded-full text-sm flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>{t("hero.badges.available", lang)}</span>
              </div>
            </div>
          </div>

          <SearchForm onSearch={handleSearch} isLoading={isLoading} lang={lang} />

          {progress && (
            <div className="mt-8 animate-fade-in">
              <ProgressBar progress={progress} lang={lang} />
            </div>
          )}
        </section>

        {/* Filters Panel - Horizontal */}
        <section className="mb-8">
          <FiltersPanel onFiltersChange={handleFiltersChange} lang={lang} />
        </section>

        {/* Results */}
        <section>
          {results.length > 0 && (
            <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-3xl font-bold mb-1">
                  {t("results.title", lang, { count: results.length, plural })}
                </h3>
                <p className="text-sm text-muted-foreground">{t("results.subtitle", lang)}</p>
              </div>
              <div className="flex gap-3">
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                  <SelectTrigger className="w-[180px] glass">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="best-match">{t("results.sort.bestMatch", lang)}</SelectItem>
                    <SelectItem value="shortest">{t("results.sort.shortest", lang)}</SelectItem>
                    <SelectItem value="highest-score">{t("results.sort.highestScore", lang)}</SelectItem>
                    <SelectItem value="most-premium">{t("results.sort.mostPremium", lang)}</SelectItem>
                    <SelectItem value="keyword-strongest">{t("results.sort.keywordStrongest", lang)}</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleExportCSV} variant="outline" className="glass">
                  <Download className="mr-2 h-4 w-4" />
                  {t("results.export", lang)}
                </Button>
              </div>
            </div>
          )}

          {results.length === 0 && !isLoading && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                {keywords.length > 0
                  ? t("results.emptyFiltered", lang)
                  : t("results.empty", lang)}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedResults.map((domain, index) => (
              <div
                key={domain.fullDomain}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <DomainCard domain={domain} lang={lang} />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
