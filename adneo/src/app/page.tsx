"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Copy,
  Download,
  Filter,
  Pause,
  Play,
  Search,
  Sparkles,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { defaultFilters, sortResults } from "@/lib/domain";
import { ALL_TLDS, PACK_LABELS, TLD_PACKS } from "@/lib/tlds";
import type { DomainResult, SearchFilters, SearchMode, SearchProgress } from "@/lib/types";

const MODE_OPTIONS: { label: string; value: SearchMode }[] = [
  { label: "Smart", value: "smart" },
  { label: "Exact", value: "exact" },
  { label: "Batch", value: "batch" },
];

const SORT_OPTIONS = [
  { label: "Best match", value: "best" },
  { label: "Shortest first", value: "shortest" },
  { label: "Highest brand score", value: "brand" },
  { label: "Most premium", value: "premium" },
  { label: "Keyword strongest", value: "keyword" },
];

const SUGGESTIONS = ["vault", "neo finance", "fitness ai", "secure cloud", "ai studio"];

const defaultTlds = Array.from(new Set([...TLD_PACKS.top, ...TLD_PACKS.tech]));

export default function Home() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<SearchMode>("smart");
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [selectedTlds, setSelectedTlds] = useState<string[]>(defaultTlds);
  const [results, setResults] = useState<DomainResult[]>([]);
  const [progress, setProgress] = useState<SearchProgress | null>(null);
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState("best");
  const [checkedCount, setCheckedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const eventSourceRef = useRef<EventSource | null>(null);

  const availableCount = results.length;

  const displayResults = useMemo(() => {
    let filtered = results;
    if (filters.maxBudget > 0) {
      filtered = filtered.filter(
        (result) => (result.priceEstimate ?? 0) <= filters.maxBudget
      );
    }
    if (filters.regOnly) {
      filtered = filtered.filter((result) => (result.priceEstimate ?? 0) <= 25);
    }
    return sortResults(filtered, sort);
  }, [filters.maxBudget, filters.regOnly, results, sort]);

  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  const updateFilters = (partial: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const toggleTld = (tld: string) => {
    setSelectedTlds((prev) =>
      prev.includes(tld) ? prev.filter((item) => item !== tld) : [...prev, tld]
    );
  };

  const togglePack = (pack: keyof typeof TLD_PACKS) => {
    const packTlds = TLD_PACKS[pack];
    const hasAll = packTlds.every((tld) => selectedTlds.includes(tld));
    if (hasAll) {
      setSelectedTlds((prev) => prev.filter((tld) => !packTlds.includes(tld)));
    } else {
      setSelectedTlds((prev) => Array.from(new Set([...prev, ...packTlds])));
    }
  };

  const startSearch = () => {
    if (!query.trim()) {
      setError("Enter a concept or keyword to start.");
      return;
    }

    eventSourceRef.current?.close();
    setResults([]);
    setProgress(null);
    setLogs([]);
    setStatus("running");
    setError(null);
    setCheckedCount(0);
    setTotalCount(0);

    const params = new URLSearchParams({
      q: query,
      mode,
      tlds: selectedTlds.length ? selectedTlds.join(",") : "all",
      filters: JSON.stringify(filters),
    });

    const es = new EventSource(`/api/search?${params.toString()}`);
    eventSourceRef.current = es;

    es.addEventListener("progress", (event) => {
      const data = JSON.parse(event.data) as SearchProgress;
      setProgress(data);
      if (typeof data.checked === "number") setCheckedCount(data.checked);
      if (typeof data.total === "number") setTotalCount(data.total);

      const entry = data.detail ? `${data.message} ${data.detail}` : data.message;
      setLogs((prev) => {
        if (prev[prev.length - 1] === entry) return prev;
        return [...prev, entry].slice(-7);
      });
    });

    es.addEventListener("result", (event) => {
      const data = JSON.parse(event.data) as DomainResult;
      setResults((prev) => [...prev, data]);
    });

    es.addEventListener("done", (event) => {
      const data = JSON.parse(event.data) as { available: number };
      setStatus("done");
      setProgress({
        stage: "done",
        percent: 100,
        message: `Done — ${data.available} available domains found`,
      });
      es.close();
    });

    es.addEventListener("error", (event) => {
      if (event instanceof MessageEvent && event.data) {
        try {
          const data = JSON.parse(event.data) as { message?: string };
          setError(data.message ?? "Search interrupted.");
        } catch {
          setError("Search interrupted.");
        }
      }
      setStatus("error");
      es.close();
    });

    es.onerror = () => {
      setStatus("error");
      setError("Connection lost. Please retry.");
      es.close();
    };
  };

  const cancelSearch = () => {
    eventSourceRef.current?.close();
    setStatus("idle");
    setProgress(null);
  };

  const exportCsv = () => {
    if (!results.length) return;
    const rows = results.map((result) => [
      result.domain,
      result.score,
      result.priceEstimate ?? "",
      result.tags.join("|"),
      result.provider,
    ]);
    const csv = [
      ["domain", "score", "price_estimate", "tags", "provider"].join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `adneo-results-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyDomain = async (domain: string) => {
    await navigator.clipboard.writeText(domain);
  };

  return (
    <div className="min-h-screen bg-[#0b0f14] text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-8">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-500 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/30">
              AD
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">ADNEO</p>
              <h1 className="text-2xl font-semibold text-slate-50">
                Premium Domain Finder
              </h1>
              <p className="text-sm text-slate-400">
                Find premium available domains faster than anywhere else.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="glow">Available only</Badge>
            <Badge variant="outline">GoDaddy link-out</Badge>
            <Button variant="accent" size="lg" onClick={startSearch}>
              <Sparkles className="h-4 w-4" />
              Start search
            </Button>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-8">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-[0_0_60px_rgba(56,189,248,0.08)]">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Search className="h-4 w-4" />
                    Concept input
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Filter className="h-4 w-4" />
                    {selectedTlds.length} TLDs selected
                  </div>
                </div>
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="ex: neo finance, ai fitness, secure vault..."
                  className="h-14 text-base"
                />
                {mode === "batch" && (
                  <p className="text-xs text-slate-500">
                    Batch mode: one idea per line for bulk generation.
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-2">
                  {MODE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setMode(option.value)}
                      className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                        mode === option.value
                          ? "border-cyan-400/70 bg-cyan-400/10 text-cyan-100"
                          : "border-slate-800 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                  {SUGGESTIONS.map((item) => (
                    <button
                      key={item}
                      className="rounded-full border border-slate-800 px-3 py-1 hover:border-slate-600"
                      onClick={() => setQuery(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="accent" size="lg" onClick={startSearch}>
                    <Search className="h-4 w-4" />
                    Search now
                  </Button>
                  {status === "running" ? (
                    <Button variant="outline" size="lg" onClick={cancelSearch}>
                      <Pause className="h-4 w-4" />
                      Cancel
                    </Button>
                  ) : (
                    <Button variant="secondary" size="lg" onClick={startSearch}>
                      <Play className="h-4 w-4" />
                      Re-run
                    </Button>
                  )}
                  {error && (
                    <div className="flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                      <XCircle className="h-4 w-4" />
                      {error}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Real-time progress</span>
                  <span>{progress?.percent ?? 0}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-900">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500 transition-all"
                    style={{ width: `${progress?.percent ?? 0}%` }}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span>{progress?.message ?? "Awaiting search..."}</span>
                  {checkedCount > 0 && (
                    <span className="rounded-full border border-slate-800 px-2 py-0.5">
                      {checkedCount}/{totalCount} checked
                    </span>
                  )}
                </div>
                <div className="space-y-1 text-xs text-slate-500">
                  {logs.length === 0 && <p>Generating → Normalizing → Checking → Scoring</p>}
                  {logs.map((log) => (
                    <p key={log}>{log}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-100">
                    Available domains
                  </h2>
                  <p className="text-sm text-slate-500">
                    {availableCount} found • {selectedTlds.length} extensions
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={sort}
                    onChange={(event) => setSort(event.target.value)}
                    className="h-10 rounded-full border border-slate-800 bg-slate-950 px-4 text-xs text-slate-100"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <Button variant="secondary" size="sm" onClick={exportCsv}>
                    <Download className="h-4 w-4" />
                    Export CSV
                  </Button>
                </div>
              </div>

              {displayResults.length === 0 && status !== "running" ? (
                <div className="mt-8 rounded-3xl border border-dashed border-slate-800 bg-slate-950/40 p-10 text-center text-sm text-slate-400">
                  No available domains yet. Try adjusting keywords, filters, or TLD packs.
                </div>
              ) : (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {displayResults.map((result) => (
                    <div
                      key={result.domain}
                      className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-950/60 p-5 shadow-[0_0_40px_rgba(15,23,42,0.4)]"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-lg font-semibold text-slate-100">
                            {result.domain}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Badge variant="glow">{result.tld}</Badge>
                            {result.tags.map((tag) => (
                              <Badge key={`${result.domain}-${tag}`} variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-semibold text-slate-50">
                            {result.score}
                          </p>
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                            Score
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-slate-400">
                        <div>Brand {result.scores.brandability}</div>
                        <div>Pron. {result.scores.pronounceability}</div>
                        <div>SEO {result.scores.seo}</div>
                        <div>Length {result.scores.length}</div>
                        <div>Clean {result.scores.clean}</div>
                        <div>Intent {result.scores.intent}</div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span>Est. ${result.priceEstimate ?? "—"} / yr</span>
                        <span>Provider: {result.provider}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={result.buyUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-cyan-400/90 px-4 py-2 text-xs font-semibold text-slate-950"
                        >
                          Buy on GoDaddy
                          <ArrowUpRight className="h-3 w-3" />
                        </a>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => copyDomain(result.domain)}
                        >
                          <Copy className="h-3 w-3" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm" disabled>
                          Save
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-100">Filters</h3>
                <button
                  className="text-xs text-slate-500 hover:text-slate-300"
                  onClick={() => setFilters(defaultFilters)}
                >
                  Reset
                </button>
              </div>

              <div className="mt-4 space-y-5 text-xs text-slate-400">
                <div>
                  <p className="mb-2 text-slate-300">Length range</p>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={2}
                      max={18}
                      value={filters.lengthMin}
                      onChange={(event) =>
                        updateFilters({ lengthMin: Number(event.target.value) })
                      }
                      className="w-full accent-cyan-400"
                    />
                    <span>{filters.lengthMin}+</span>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <input
                      type="range"
                      min={6}
                      max={24}
                      value={filters.lengthMax}
                      onChange={(event) =>
                        updateFilters({ lengthMax: Number(event.target.value) })
                      }
                      className="w-full accent-cyan-400"
                    />
                    <span>{filters.lengthMax}</span>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-slate-300">Word count</p>
                  <div className="flex gap-2">
                    {[1, 2, 3].map((count) => (
                      <button
                        key={count}
                        onClick={() =>
                          updateFilters({
                            wordCount: filters.wordCount.includes(count)
                              ? filters.wordCount.filter((item) => item !== count)
                              : [...filters.wordCount, count],
                          })
                        }
                        className={`rounded-full border px-3 py-1 ${
                          filters.wordCount.includes(count)
                            ? "border-cyan-400/70 bg-cyan-400/10 text-cyan-100"
                            : "border-slate-800 text-slate-400"
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-2">
                  {[
                    { key: "allowHyphen", label: "Allow hyphens" },
                    { key: "allowDigits", label: "Allow digits" },
                    { key: "pronouncable", label: "Pronounceable only" },
                    { key: "noDoubleLetters", label: "No double letters" },
                    { key: "noTripleConsonants", label: "No 3 consonants" },
                    { key: "noRepeats", label: "No repeats" },
                    { key: "keywordExact", label: "Keyword exact" },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters[item.key as keyof SearchFilters] as boolean}
                        onChange={(event) =>
                          updateFilters({
                            [item.key]: event.target.checked,
                          } as Partial<SearchFilters>)
                        }
                        className="accent-cyan-400"
                      />
                      {item.label}
                    </label>
                  ))}
                </div>

                <div>
                  <p className="mb-2 text-slate-300">Starts / Ends with</p>
                  <div className="grid gap-2">
                    <Input
                      value={filters.startsWith}
                      onChange={(event) => updateFilters({ startsWith: event.target.value })}
                      placeholder="Starts with"
                    />
                    <Input
                      value={filters.endsWith}
                      onChange={(event) => updateFilters({ endsWith: event.target.value })}
                      placeholder="Ends with"
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-slate-300">Exclude words</p>
                  <Input
                    value={filters.excludeWords.join(", ")}
                    onChange={(event) =>
                      updateFilters({
                        excludeWords: event.target.value
                          .split(",")
                          .map((word) => word.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="spam, free, cheap"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="flex items-center justify-between">
                    <span>Brand min</span>
                    <span>{filters.brandMin}</span>
                  </label>
                  <input
                    type="range"
                    min={8}
                    max={30}
                    value={filters.brandMin}
                    onChange={(event) =>
                      updateFilters({ brandMin: Number(event.target.value) })
                    }
                    className="accent-cyan-400"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="flex items-center justify-between">
                    <span>Memorable min</span>
                    <span>{filters.memorableMin}</span>
                  </label>
                  <input
                    type="range"
                    min={6}
                    max={15}
                    value={filters.memorableMin}
                    onChange={(event) =>
                      updateFilters({ memorableMin: Number(event.target.value) })
                    }
                    className="accent-cyan-400"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="flex items-center justify-between">
                    <span>SEO min</span>
                    <span>{filters.seoMin}</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={15}
                    value={filters.seoMin}
                    onChange={(event) => updateFilters({ seoMin: Number(event.target.value) })}
                    className="accent-cyan-400"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="flex items-center justify-between">
                    <span>Global min</span>
                    <span>{filters.globalMin}</span>
                  </label>
                  <input
                    type="range"
                    min={30}
                    max={100}
                    value={filters.globalMin}
                    onChange={(event) =>
                      updateFilters({ globalMin: Number(event.target.value) })
                    }
                    className="accent-cyan-400"
                  />
                </div>

                <div>
                  <p className="mb-2 text-slate-300">Keyword position</p>
                  <select
                    value={filters.keywordPosition}
                    onChange={(event) =>
                      updateFilters({
                        keywordPosition: event.target.value as SearchFilters["keywordPosition"],
                      })
                    }
                    className="h-10 w-full rounded-full border border-slate-800 bg-slate-950 px-4 text-xs text-slate-100"
                  >
                    <option value="any">Any</option>
                    <option value="start">Start</option>
                    <option value="middle">Middle</option>
                    <option value="end">End</option>
                  </select>
                </div>

                <div>
                  <p className="mb-2 text-slate-300">Brand style</p>
                  <select
                    value={filters.style}
                    onChange={(event) =>
                      updateFilters({
                        style: event.target.value as SearchFilters["style"],
                      })
                    }
                    className="h-10 w-full rounded-full border border-slate-800 bg-slate-950 px-4 text-xs text-slate-100"
                  >
                    <option value="any">Any</option>
                    <option value="startup">Startup</option>
                    <option value="corporate">Corporate</option>
                    <option value="fun">Fun</option>
                    <option value="luxury">Luxury</option>
                    <option value="minimal">Minimal</option>
                  </select>
                </div>

                <div>
                  <p className="mb-2 text-slate-300">Business intent</p>
                  <select
                    value={filters.category}
                    onChange={(event) =>
                      updateFilters({
                        category: event.target.value as SearchFilters["category"],
                      })
                    }
                    className="h-10 w-full rounded-full border border-slate-800 bg-slate-950 px-4 text-xs text-slate-100"
                  >
                    <option value="any">Any</option>
                    <option value="saas">SaaS</option>
                    <option value="finance">Finance</option>
                    <option value="health">Health</option>
                    <option value="ecom">Ecom</option>
                    <option value="crypto">Crypto</option>
                    <option value="devtools">DevTools</option>
                    <option value="marketing">Marketing</option>
                    <option value="realestate">Real Estate</option>
                    <option value="education">Education</option>
                  </select>
                </div>

                <div>
                  <p className="mb-2 text-slate-300">Tone</p>
                  <select
                    value={filters.tone}
                    onChange={(event) =>
                      updateFilters({
                        tone: event.target.value as SearchFilters["tone"],
                      })
                    }
                    className="h-10 w-full rounded-full border border-slate-800 bg-slate-950 px-4 text-xs text-slate-100"
                  >
                    <option value="any">Any</option>
                    <option value="serious">Serious</option>
                    <option value="premium">Premium</option>
                    <option value="casual">Casual</option>
                  </select>
                </div>

                <div>
                  <p className="mb-2 text-slate-300">Avoid letters</p>
                  <div className="flex gap-2">
                    {["q", "x", "z"].map((letter) => (
                      <button
                        key={letter}
                        onClick={() =>
                          updateFilters({
                            avoidLetters: filters.avoidLetters.includes(letter)
                              ? filters.avoidLetters.filter((item) => item !== letter)
                              : [...filters.avoidLetters, letter],
                          })
                        }
                        className={`rounded-full border px-3 py-1 ${
                          filters.avoidLetters.includes(letter)
                            ? "border-cyan-400/70 bg-cyan-400/10 text-cyan-100"
                            : "border-slate-800 text-slate-400"
                        }`}
                      >
                        {letter.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-slate-300">Budget max ($)</p>
                  <input
                    type="range"
                    min={0}
                    max={1000}
                    value={filters.maxBudget}
                    onChange={(event) =>
                      updateFilters({ maxBudget: Number(event.target.value) })
                    }
                    className="accent-cyan-400"
                  />
                  <div className="mt-1 text-xs text-slate-500">
                    {filters.maxBudget === 0 ? "No limit" : `$${filters.maxBudget}`}
                  </div>
                  <label className="mt-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.regOnly}
                      onChange={(event) => updateFilters({ regOnly: event.target.checked })}
                      className="accent-cyan-400"
                    />
                    Standard reg price only
                  </label>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-100">Extensions</h3>
                <div className="flex gap-2">
                  <button
                    className="text-xs text-slate-500 hover:text-slate-300"
                    onClick={() => setSelectedTlds(ALL_TLDS)}
                  >
                    All
                  </button>
                  <button
                    className="text-xs text-slate-500 hover:text-slate-300"
                    onClick={() => setSelectedTlds([])}
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {(Object.keys(TLD_PACKS) as Array<keyof typeof TLD_PACKS>).map((pack) => {
                  const packTlds = TLD_PACKS[pack];
                  const selected = packTlds.every((tld) => selectedTlds.includes(tld));
                  return (
                    <button
                      key={pack}
                      onClick={() => togglePack(pack)}
                      className={`rounded-full border px-3 py-1 text-xs ${
                        selected
                          ? "border-cyan-400/70 bg-cyan-400/10 text-cyan-100"
                          : "border-slate-800 text-slate-400"
                      }`}
                    >
                      {PACK_LABELS[pack]}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 max-h-56 overflow-auto rounded-2xl border border-slate-800 p-3">
                <div className="grid grid-cols-3 gap-2 text-xs text-slate-400">
                  {ALL_TLDS.map((tld) => (
                    <label key={tld} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedTlds.includes(tld)}
                        onChange={() => toggleTld(tld)}
                        className="accent-cyan-400"
                      />
                      {tld}
                    </label>
                  ))}
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                {selectedTlds.length} extensions selected. Only available domains are shown.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
