"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

interface SearchFormProps {
  onSearch: (keywords: string[], mode: "smart" | "exact" | "batch") => void;
  isLoading?: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
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
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto space-y-4">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          {mode === "batch" ? (
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Entrez un mot par ligne&#10;ex: vault&#10;neo&#10;finance"
              className="w-full min-h-[120px] rounded-md border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          ) : (
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ex: neo finance, ai fitness, secure vault..."
              className="h-14 text-lg"
            />
          )}
        </div>
        <Button type="submit" size="lg" disabled={isLoading || !input.trim()} className="h-14 px-8">
          <Search className="mr-2 h-5 w-5" />
          {isLoading ? "Recherche..." : "Rechercher"}
        </Button>
      </div>

      <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
        <TabsList>
          <TabsTrigger value="smart">Smart Mode</TabsTrigger>
          <TabsTrigger value="exact">Exact Match</TabsTrigger>
          <TabsTrigger value="batch">Batch Mode</TabsTrigger>
        </TabsList>
      </Tabs>
    </form>
  );
}
