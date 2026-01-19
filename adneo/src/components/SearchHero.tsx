"use client";

import { useState } from "react";
import { Search, Zap, Target, List, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchStore } from "@/store/search-store";

interface SearchHeroProps {
  onSearch: () => void;
}

export function SearchHero({ onSearch }: SearchHeroProps) {
  const { query, setQuery, mode, setMode, isSearching } = useSearchStore();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim() && !isSearching) {
      onSearch();
    }
  };

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-purple-500/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Headline */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            Find <span className="gradient-text">Premium Domains</span>
            <br />
            Faster Than Anywhere
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Generate, filter, and discover available domain names with AI-powered
            suggestions. Only see what&apos;s actually available.
          </p>
        </div>

        {/* Search Mode Tabs */}
        <div className="flex justify-center mb-6">
          <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
            <TabsList className="bg-secondary/50 backdrop-blur">
              <TabsTrigger value="smart" className="gap-2">
                <Zap className="w-4 h-4" />
                Smart Mode
              </TabsTrigger>
              <TabsTrigger value="exact" className="gap-2">
                <Target className="w-4 h-4" />
                Exact Match
              </TabsTrigger>
              <TabsTrigger value="batch" className="gap-2">
                <List className="w-4 h-4" />
                Batch Mode
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Search Input */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {mode === "batch" ? (
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter domain names (one per line)&#10;neohub&#10;vaultai&#10;flowstack"
                className="w-full h-32 px-6 py-4 text-lg bg-card border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none placeholder:text-muted-foreground/50"
              />
            ) : (
              <div className="relative flex items-center">
                <Search className="absolute left-5 w-6 h-6 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="neo finance, ai fitness, secure vault..."
                  className="w-full h-16 pl-14 pr-36 text-lg bg-card border-border rounded-2xl focus:ring-2 focus:ring-primary placeholder:text-muted-foreground/50"
                />
                <Button
                  onClick={onSearch}
                  disabled={!query.trim() || isSearching}
                  size="lg"
                  className="absolute right-2 h-12 px-8 rounded-xl btn-shimmer"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Mode description */}
          <p className="text-center text-sm text-muted-foreground mt-4">
            {mode === "smart" && (
              <>
                <Zap className="w-4 h-4 inline mr-1 text-yellow-500" />
                Generates smart variations, prefixes, suffixes, and brandable names
              </>
            )}
            {mode === "exact" && (
              <>
                <Target className="w-4 h-4 inline mr-1 text-blue-500" />
                Checks only the exact domain name you enter
              </>
            )}
            {mode === "batch" && (
              <>
                <List className="w-4 h-4 inline mr-1 text-green-500" />
                Check multiple domain names at once (one per line)
              </>
            )}
          </p>

          {/* Batch mode search button */}
          {mode === "batch" && (
            <div className="flex justify-center mt-4">
              <Button
                onClick={onSearch}
                disabled={!query.trim() || isSearching}
                size="lg"
                className="px-12 btn-shimmer"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Checking domains...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Check Availability
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Quick stats */}
        <div className="flex justify-center gap-8 md:gap-16 mt-12 text-center">
          <div>
            <div className="text-2xl md:text-3xl font-bold gradient-text">50+</div>
            <div className="text-sm text-muted-foreground">Extensions</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold gradient-text">20+</div>
            <div className="text-sm text-muted-foreground">Filters</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold gradient-text">&lt;60s</div>
            <div className="text-sm text-muted-foreground">Search Time</div>
          </div>
        </div>
      </div>
    </section>
  );
}
