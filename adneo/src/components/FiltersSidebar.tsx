"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Filter,
  RotateCcw,
  Globe,
  Type,
  Sparkles,
  Search as SearchIcon,
  Briefcase,
  Star,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSearchStore } from "@/store/search-store";
import {
  EXTENSION_PACKS,
  ALL_EXTENSIONS,
  STYLE_OPTIONS,
  CATEGORY_OPTIONS,
  TONE_OPTIONS,
} from "@/types/domain";

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({
  title,
  icon,
  children,
  defaultOpen = true,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border/50 pb-4 mb-4 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-2 text-sm font-medium hover:text-foreground transition-colors"
      >
        <span className="flex items-center gap-2">
          {icon}
          {title}
        </span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      {isOpen && <div className="mt-3 space-y-3">{children}</div>}
    </div>
  );
}

export function FiltersSidebar() {
  const {
    selectedExtensions,
    setSelectedExtensions,
    toggleExtensionPack,
    filters,
    updateFilter,
    resetFilters,
  } = useSearchStore();

  const [excludeWordInput, setExcludeWordInput] = useState("");

  const addExcludeWord = () => {
    if (excludeWordInput.trim() && !filters.excludeWords.includes(excludeWordInput.trim())) {
      updateFilter("excludeWords", [...filters.excludeWords, excludeWordInput.trim()]);
      setExcludeWordInput("");
    }
  };

  const removeExcludeWord = (word: string) => {
    updateFilter(
      "excludeWords",
      filters.excludeWords.filter((w) => w !== word)
    );
  };

  return (
    <aside className="w-full lg:w-80 shrink-0">
      <div className="sticky top-20 bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Advanced Filters
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)] max-h-[700px]">
          <div className="p-4">
            {/* Extensions */}
            <CollapsibleSection
              title="Extensions"
              icon={<Globe className="w-4 h-4" />}
            >
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Quick Select</Label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(EXTENSION_PACKS).map(([name, extensions]) => {
                    const allSelected = extensions.every((ext) =>
                      selectedExtensions.includes(ext)
                    );
                    return (
                      <Badge
                        key={name}
                        variant={allSelected ? "default" : "secondary"}
                        className="cursor-pointer capitalize"
                        onClick={() => toggleExtensionPack(name)}
                      >
                        {name}
                      </Badge>
                    );
                  })}
                </div>

                <Label className="text-xs text-muted-foreground mt-3 block">
                  Selected ({selectedExtensions.length})
                </Label>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {ALL_EXTENSIONS.map((ext) => (
                    <Badge
                      key={ext}
                      variant={selectedExtensions.includes(ext) ? "info" : "outline"}
                      className="cursor-pointer text-xs"
                      onClick={() => {
                        if (selectedExtensions.includes(ext)) {
                          setSelectedExtensions(
                            selectedExtensions.filter((e) => e !== ext)
                          );
                        } else {
                          setSelectedExtensions([...selectedExtensions, ext]);
                        }
                      }}
                    >
                      {ext}
                    </Badge>
                  ))}
                </div>
              </div>
            </CollapsibleSection>

            {/* Format Filters */}
            <CollapsibleSection
              title="Format"
              icon={<Type className="w-4 h-4" />}
            >
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Length: {filters.minLength} - {filters.maxLength} chars
                  </Label>
                  <Slider
                    value={[filters.minLength, filters.maxLength]}
                    min={2}
                    max={30}
                    step={1}
                    onValueChange={([min, max]) => {
                      updateFilter("minLength", min);
                      updateFilter("maxLength", max);
                    }}
                    className="mt-2"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="allowHyphens" className="text-sm">
                    Allow hyphens
                  </Label>
                  <Switch
                    id="allowHyphens"
                    checked={filters.allowHyphens}
                    onCheckedChange={(checked) => updateFilter("allowHyphens", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="allowDigits" className="text-sm">
                    Allow numbers
                  </Label>
                  <Switch
                    id="allowDigits"
                    checked={filters.allowDigits}
                    onCheckedChange={(checked) => updateFilter("allowDigits", checked)}
                  />
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Starts with</Label>
                  <Input
                    value={filters.startsWith}
                    onChange={(e) => updateFilter("startsWith", e.target.value)}
                    placeholder="e.g. neo, get"
                    className="mt-1 h-8 text-sm"
                  />
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Ends with</Label>
                  <Input
                    value={filters.endsWith}
                    onChange={(e) => updateFilter("endsWith", e.target.value)}
                    placeholder="e.g. hub, ai"
                    className="mt-1 h-8 text-sm"
                  />
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Must contain</Label>
                  <Input
                    value={filters.containsKeyword}
                    onChange={(e) => updateFilter("containsKeyword", e.target.value)}
                    placeholder="e.g. cloud"
                    className="mt-1 h-8 text-sm"
                  />
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Exclude words</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={excludeWordInput}
                      onChange={(e) => setExcludeWordInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addExcludeWord()}
                      placeholder="Add word"
                      className="h-8 text-sm"
                    />
                    <Button size="sm" variant="secondary" onClick={addExcludeWord}>
                      Add
                    </Button>
                  </div>
                  {filters.excludeWords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {filters.excludeWords.map((word) => (
                        <Badge
                          key={word}
                          variant="destructive"
                          className="cursor-pointer"
                          onClick={() => removeExcludeWord(word)}
                        >
                          {word}
                          <X className="w-3 h-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CollapsibleSection>

            {/* Branding Filters */}
            <CollapsibleSection
              title="Branding"
              icon={<Sparkles className="w-4 h-4" />}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="pronounceable" className="text-sm">
                    Pronounceable only
                  </Label>
                  <Switch
                    id="pronounceable"
                    checked={filters.pronounceable}
                    onCheckedChange={(checked) => updateFilter("pronounceable", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="excludeAwkward" className="text-sm">
                    Exclude Q, X, Z
                  </Label>
                  <Switch
                    id="excludeAwkward"
                    checked={filters.excludeAwkwardLetters}
                    onCheckedChange={(checked) =>
                      updateFilter("excludeAwkwardLetters", checked)
                    }
                  />
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Style</Label>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {STYLE_OPTIONS.map((style) => (
                      <Badge
                        key={style}
                        variant={filters.style.includes(style) ? "purple" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          if (filters.style.includes(style)) {
                            updateFilter(
                              "style",
                              filters.style.filter((s) => s !== style)
                            );
                          } else {
                            updateFilter("style", [...filters.style, style]);
                          }
                        }}
                      >
                        {style}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">
                    Min brandability score: {filters.minBrandableScore}
                  </Label>
                  <Slider
                    value={[filters.minBrandableScore]}
                    min={0}
                    max={30}
                    step={1}
                    onValueChange={([value]) => updateFilter("minBrandableScore", value)}
                    className="mt-2"
                  />
                </div>
              </div>
            </CollapsibleSection>

            {/* SEO Filters */}
            <CollapsibleSection
              title="SEO"
              icon={<SearchIcon className="w-4 h-4" />}
              defaultOpen={false}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="keywordExact" className="text-sm">
                    Keyword exact match
                  </Label>
                  <Switch
                    id="keywordExact"
                    checked={filters.keywordExactMatch}
                    onCheckedChange={(checked) =>
                      updateFilter("keywordExactMatch", checked)
                    }
                  />
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Keyword position</Label>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {(["any", "start", "middle", "end"] as const).map((pos) => (
                      <Badge
                        key={pos}
                        variant={filters.keywordPosition === pos ? "info" : "outline"}
                        className="cursor-pointer capitalize"
                        onClick={() => updateFilter("keywordPosition", pos)}
                      >
                        {pos}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">
                    Min SEO score: {filters.minSeoScore}
                  </Label>
                  <Slider
                    value={[filters.minSeoScore]}
                    min={0}
                    max={15}
                    step={1}
                    onValueChange={([value]) => updateFilter("minSeoScore", value)}
                    className="mt-2"
                  />
                </div>
              </div>
            </CollapsibleSection>

            {/* Business Intent */}
            <CollapsibleSection
              title="Business Intent"
              icon={<Briefcase className="w-4 h-4" />}
              defaultOpen={false}
            >
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Categories</Label>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {CATEGORY_OPTIONS.map((cat) => (
                      <Badge
                        key={cat}
                        variant={filters.categories.includes(cat) ? "success" : "outline"}
                        className="cursor-pointer text-xs"
                        onClick={() => {
                          if (filters.categories.includes(cat)) {
                            updateFilter(
                              "categories",
                              filters.categories.filter((c) => c !== cat)
                            );
                          } else {
                            updateFilter("categories", [...filters.categories, cat]);
                          }
                        }}
                      >
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Tone</Label>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {TONE_OPTIONS.map((tone) => (
                      <Badge
                        key={tone}
                        variant={filters.tone.includes(tone) ? "warning" : "outline"}
                        className="cursor-pointer text-xs"
                        onClick={() => {
                          if (filters.tone.includes(tone)) {
                            updateFilter(
                              "tone",
                              filters.tone.filter((t) => t !== tone)
                            );
                          } else {
                            updateFilter("tone", [...filters.tone, tone]);
                          }
                        }}
                      >
                        {tone}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            {/* Quality Filters */}
            <CollapsibleSection
              title="Quality"
              icon={<Star className="w-4 h-4" />}
              defaultOpen={false}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="noDouble" className="text-sm">
                    No double letters
                  </Label>
                  <Switch
                    id="noDouble"
                    checked={filters.noDoubleLetters}
                    onCheckedChange={(checked) =>
                      updateFilter("noDoubleLetters", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="noTriple" className="text-sm">
                    No 3 consonants
                  </Label>
                  <Switch
                    id="noTriple"
                    checked={filters.noTripleConsonants}
                    onCheckedChange={(checked) =>
                      updateFilter("noTripleConsonants", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="noRepeat" className="text-sm">
                    No repetitions
                  </Label>
                  <Switch
                    id="noRepeat"
                    checked={filters.noRepetitions}
                    onCheckedChange={(checked) =>
                      updateFilter("noRepetitions", checked)
                    }
                  />
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">
                    Min global score: {filters.minGlobalScore}
                  </Label>
                  <Slider
                    value={[filters.minGlobalScore]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={([value]) => updateFilter("minGlobalScore", value)}
                    className="mt-2"
                  />
                </div>
              </div>
            </CollapsibleSection>
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
}
