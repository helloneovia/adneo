"use client";

import { useCallback, useRef } from "react";
import { Header } from "@/components/Header";
import { SearchHero } from "@/components/SearchHero";
import { FiltersSidebar } from "@/components/FiltersSidebar";
import { ProgressBar } from "@/components/ProgressBar";
import { ResultsSection } from "@/components/ResultsSection";
import { useSearchStore } from "@/store/search-store";
import type { DomainResult } from "@/types/domain";

export default function Home() {
  const {
    query,
    mode,
    selectedExtensions,
    filters,
    isSearching,
    setIsSearching,
    setProgress,
    addProgressLog,
    clearProgressLog,
    addResult,
    clearResults,
  } = useSearchStore();

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSearch = useCallback(async () => {
    if (!query.trim() || selectedExtensions.length === 0) return;

    // Cancel any ongoing search
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    // Reset state
    clearResults();
    clearProgressLog();
    setIsSearching(true);
    setProgress({
      step: "Starting",
      message: "Initializing search...",
      percentage: 0,
    });

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          mode,
          extensions: selectedExtensions,
          filters,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process complete events
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;

          const eventMatch = line.match(/event: (\w+)/);
          const dataMatch = line.match(/data: ([\s\S]+)/);

          if (eventMatch && dataMatch) {
            const eventType = eventMatch[1];
            const data = JSON.parse(dataMatch[1]);

            switch (eventType) {
              case "progress":
                setProgress({
                  step: data.step,
                  message: data.message,
                  percentage: data.percentage,
                });
                break;

              case "log":
                addProgressLog(data.message);
                break;

              case "result":
                addResult(data as DomainResult);
                break;

              case "error":
                console.error("Search error:", data.message);
                addProgressLog(`Error: ${data.message}`);
                break;

              case "complete":
                setProgress({
                  step: "Complete",
                  message: `Found ${data.total} available domains`,
                  percentage: 100,
                });
                break;
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        addProgressLog("Search cancelled");
      } else {
        console.error("Search error:", error);
        addProgressLog(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    } finally {
      setIsSearching(false);
      abortControllerRef.current = null;
    }
  }, [
    query,
    mode,
    selectedExtensions,
    filters,
    clearResults,
    clearProgressLog,
    setIsSearching,
    setProgress,
    addProgressLog,
    addResult,
  ]);

  const handleCancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section with Search */}
        <SearchHero onSearch={handleSearch} />

        {/* Main Content Area */}
        <section className="container mx-auto px-4 pb-16">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar */}
            <FiltersSidebar />

            {/* Results Area */}
            <div className="flex-1 min-w-0">
              {/* Progress Bar */}
              <ProgressBar onCancel={handleCancel} />

              {/* Results */}
              <ResultsSection />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="border-t border-border/50 bg-card/30 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose <span className="gradient-text">ADNEO</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Find premium available domains in under 60 seconds with our
                  optimized search engine.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Smart Filters</h3>
                <p className="text-muted-foreground">
                  20+ advanced filters for length, branding, SEO, business
                  intent, and more.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Available Only</h3>
                <p className="text-muted-foreground">
                  See only domains that are actually available for purchase. No
                  noise, no frustration.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

            <div className="max-w-3xl mx-auto">
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Enter your concept</h3>
                    <p className="text-muted-foreground">
                      Type keywords, phrases, or brand ideas. Use Smart Mode for
                      AI-powered suggestions or Exact Mode for precise matching.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Customize your search</h3>
                    <p className="text-muted-foreground">
                      Choose from 50+ extensions and apply advanced filters for
                      length, branding style, SEO, and business categories.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Get instant results</h3>
                    <p className="text-muted-foreground">
                      Watch real-time progress as we check availability. See
                      scored, tagged results and buy directly on GoDaddy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Extensions Section */}
        <section id="extensions" className="border-t border-border/50 bg-card/30 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              50+ Extensions Supported
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              From popular TLDs to niche extensions, find the perfect domain
              for your brand across all categories.
            </p>

            <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
              {[
                ".com",
                ".io",
                ".ai",
                ".co",
                ".net",
                ".app",
                ".dev",
                ".tech",
                ".cloud",
                ".xyz",
                ".store",
                ".design",
                ".studio",
                ".agency",
                ".solutions",
                ".pro",
                ".online",
                ".site",
                ".shop",
                ".org",
              ].map((ext) => (
                <span
                  key={ext}
                  className="px-3 py-1.5 bg-card border border-border rounded-full text-sm font-medium"
                >
                  {ext}
                </span>
              ))}
              <span className="px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-full text-sm font-medium">
                +30 more
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <span className="font-semibold">ADNEO</span>
            </div>

            <p className="text-sm text-muted-foreground">
              Find premium available domains faster than anywhere else.
            </p>

            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ADNEO. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
