"use client";

import { useState, useEffect } from "react";
import { SearchForm } from "@/components/search-form";
import { ProgressBar } from "@/components/progress-bar";
import { DomainCard } from "@/components/domain-card";
import { FiltersPanel } from "@/components/filters-panel";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchRequest, SearchProgress, SearchResult, FinalDomainResult, SortOption } from "@/lib/types";
import { Download, Sparkles } from "lucide-react";

export default function Home() {
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

  const handleSearch = async (searchKeywords: string[], searchMode: typeof mode) => {
    setKeywords(searchKeywords);
    setMode(searchMode);
    setIsLoading(true);
    setProgress(null);
    setResults([]);

    try {
      // Simuler la progression via SSE (pour MVP, on fait une requête simple)
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

      // Simuler progression
      setProgress({
        stage: "generating",
        progress: 10,
        message: "Génération des idées de noms...",
        details: { generated: 0 },
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      setProgress({
        stage: "normalizing",
        progress: 30,
        message: "Normalisation et déduplication...",
        details: { unique: 0 },
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      setProgress({
        stage: "checking",
        progress: 50,
        message: "Vérification de disponibilité...",
        details: { checking: { current: 0, total: 100, tlds: filters.tlds.length } },
      });

      // Appel API
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
        message: `Recherche terminée - ${data.finalResults.length} domaines disponibles trouvés`,
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">ADNEO</h1>
            </div>
            <p className="text-sm text-muted-foreground hidden md:block">
              Premium Domain Finder
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Search Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-2">
              Trouvez des domaines premium disponibles
            </h2>
            <p className="text-muted-foreground">
              Génération intelligente • Vérification multi-extensions • Résultats disponibles uniquement
            </p>
          </div>

          <SearchForm onSearch={handleSearch} isLoading={isLoading} />

          {progress && <div className="mt-8"><ProgressBar progress={progress} /></div>}
        </section>

        {/* Filters & Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <FiltersPanel onFiltersChange={handleFiltersChange} />
          </aside>

          {/* Results */}
          <div className="lg:col-span-3">
            {results.length > 0 && (
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">
                    {results.length} domaine{results.length > 1 ? "s" : ""} disponible{results.length > 1 ? "s" : ""}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="best-match">Meilleur match</SelectItem>
                      <SelectItem value="shortest">Plus court</SelectItem>
                      <SelectItem value="highest-score">Score le plus élevé</SelectItem>
                      <SelectItem value="most-premium">Plus premium</SelectItem>
                      <SelectItem value="keyword-strongest">Meilleur SEO</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleExportCSV} variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                </div>
              </div>
            )}

            {results.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {keywords.length > 0
                    ? "Aucun domaine disponible trouvé. Essayez d'autres mots-clés ou ajustez les filtres."
                    : "Commencez une recherche pour trouver des domaines premium disponibles"}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedResults.map((domain) => (
                <DomainCard key={domain.fullDomain} domain={domain} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
