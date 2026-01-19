"use client";

import { useState } from "react";
import {
  ArrowUpDown,
  Grid3X3,
  List,
  Download,
  Search,
  Frown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DomainCard } from "./DomainCard";
import { useSearchStore } from "@/store/search-store";
import { sortDomains } from "@/lib/domain-scorer";
import type { SortOption } from "@/types/domain";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "bestMatch", label: "Best Match" },
  { value: "shortest", label: "Shortest" },
  { value: "brandScore", label: "Most Brandable" },
  { value: "premium", label: "Premium Score" },
  { value: "keyword", label: "Keyword Match" },
];

export function ResultsSection() {
  const { results, sortBy, setSortBy, isSearching } = useSearchStore();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter only available domains
  const availableDomains = results.filter((d) => d.status === "available");

  // Sort domains
  const sortedDomains = sortDomains(availableDomains, sortBy);

  const handleExportCSV = () => {
    const headers = ["Domain", "Score", "Length", "TLD", "Tags", "Buy URL"];
    const rows = sortedDomains.map((d) => [
      d.domain,
      d.score.toString(),
      d.name.length.toString(),
      d.tld,
      d.tags.join("; "),
      d.buyUrl,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `adneo-domains-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (results.length === 0 && !isSearching) {
    return null;
  }

  if (results.length > 0 && availableDomains.length === 0 && !isSearching) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-card mb-4">
          <Frown className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No available domains found</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          All the generated domain names are already taken. Try different
          keywords, adjust your filters, or add more extensions.
        </p>
        <div className="flex justify-center gap-3">
          <Badge variant="outline" className="text-sm py-1 px-3">
            Try different keywords
          </Badge>
          <Badge variant="outline" className="text-sm py-1 px-3">
            Add more extensions
          </Badge>
          <Badge variant="outline" className="text-sm py-1 px-3">
            Relax length filters
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Results header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">
            {isSearching ? (
              "Finding domains..."
            ) : (
              <>
                <span className="gradient-text">{availableDomains.length}</span>{" "}
                available domains
              </>
            )}
          </h2>
          {!isSearching && results.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {results.length - availableDomains.length} taken
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Sort dropdown */}
          <div className="flex items-center gap-2 bg-card border border-border rounded-lg p-1">
            <ArrowUpDown className="w-4 h-4 text-muted-foreground ml-2" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent text-sm font-medium focus:outline-none pr-2 py-1"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* View toggle */}
          <div className="flex items-center bg-card border border-border rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          {/* Export button */}
          {availableDomains.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="w-4 h-4 mr-1" />
              Export CSV
            </Button>
          )}
        </div>
      </div>

      {/* Results grid */}
      {sortedDomains.length > 0 && (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
              : "space-y-3"
          }
        >
          {sortedDomains.map((domain) => (
            <DomainCard key={domain.id} domain={domain} />
          ))}
        </div>
      )}

      {/* Loading skeleton */}
      {isSearching && sortedDomains.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-5 animate-pulse"
            >
              <div className="flex justify-between mb-3">
                <div className="h-6 bg-secondary rounded w-2/3" />
                <div className="h-6 bg-secondary rounded w-12" />
              </div>
              <div className="flex gap-2 mb-4">
                <div className="h-5 bg-secondary rounded w-16" />
                <div className="h-5 bg-secondary rounded w-12" />
              </div>
              <div className="flex gap-2 mb-4">
                <div className="h-4 bg-secondary rounded w-20" />
                <div className="h-4 bg-secondary rounded w-16" />
              </div>
              <div className="flex gap-2">
                <div className="h-9 bg-secondary rounded flex-1" />
                <div className="h-9 bg-secondary rounded w-9" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
