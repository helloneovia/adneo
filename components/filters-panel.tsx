"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { TLD_CATEGORIES, ALL_TLDS } from "@/lib/constants";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Filter, Sparkles, Settings2 } from "lucide-react";
import { Language, t } from "@/lib/i18n";

interface FiltersPanelProps {
  onFiltersChange: (filters: any) => void;
  lang: Language;
}

export function FiltersPanel({ onFiltersChange, lang }: FiltersPanelProps) {
  const [filters, setFilters] = useState({
    tlds: [".com", ".io", ".ai"],
    minLength: 3,
    maxLength: 20,
    allowHyphens: false,
    allowDigits: false,
  });

  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const toggleTld = (tld: string) => {
    const newTlds = filters.tlds.includes(tld)
      ? filters.tlds.filter((t) => t !== tld)
      : [...filters.tlds, tld];
    updateFilter("tlds", newTlds);
  };

  const selectTldCategory = (category: keyof typeof TLD_CATEGORIES) => {
    const categoryTlds = TLD_CATEGORIES[category];
    const newTlds = [...new Set([...filters.tlds, ...categoryTlds])];
    updateFilter("tlds", newTlds);
  };

  return (
    <Card className="glass border-primary/20 hover:border-primary/40 transition-all duration-300 shadow-lg">
      <CardHeader className="pb-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Filter className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">{t("filters.title", lang)}</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {filters.tlds.length} {t("filters.extensions.selected", lang, { count: filters.tlds.length }).split("(")[0].trim()}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="format" className="w-full">
          <TabsList className="glass grid w-full grid-cols-3 gap-2 p-1.5 h-auto rounded-xl mb-6">
            <TabsTrigger 
              value="format" 
              className="text-sm py-3 px-4 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-500 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all font-medium"
            >
              <Settings2 className="h-4 w-4 mr-2" />
              {t("filters.tabs.format", lang)}
            </TabsTrigger>
            <TabsTrigger 
              value="tlds" 
              className="text-sm py-3 px-4 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-500 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all font-medium"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {t("filters.tabs.extensions", lang)}
            </TabsTrigger>
            <TabsTrigger 
              value="seo" 
              className="text-sm py-3 px-4 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-500 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all font-medium"
            >
              SEO
            </TabsTrigger>
          </TabsList>

          <TabsContent value="format" className="space-y-6 mt-6">
            <div className="p-4 glass rounded-xl border border-border/50">
              <Label className="text-base font-bold mb-4 block flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-primary to-blue-400 rounded-full" />
                {t("filters.format.length", lang, { min: filters.minLength, max: filters.maxLength })}
              </Label>
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-muted-foreground">{t("filters.format.min", lang)}</Label>
                    <span className="text-sm font-semibold text-primary">{filters.minLength}</span>
                  </div>
                  <Slider
                    value={[filters.minLength]}
                    onValueChange={([v]) => updateFilter("minLength", v)}
                    min={3}
                    max={15}
                    step={1}
                    className="cursor-pointer"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-muted-foreground">{t("filters.format.max", lang)}</Label>
                    <span className="text-sm font-semibold text-primary">{filters.maxLength}</span>
                  </div>
                  <Slider
                    value={[filters.maxLength]}
                    onValueChange={([v]) => updateFilter("maxLength", v)}
                    min={5}
                    max={25}
                    step={1}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 rounded-xl glass border border-border/50 hover:border-primary/30 transition-colors">
                <Label className="text-sm font-medium cursor-pointer">{t("filters.format.allowHyphens", lang)}</Label>
                <Switch
                  checked={filters.allowHyphens}
                  onCheckedChange={(v) => updateFilter("allowHyphens", v)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl glass border border-border/50 hover:border-primary/30 transition-colors">
                <Label className="text-sm font-medium cursor-pointer">{t("filters.format.allowDigits", lang)}</Label>
                <Switch
                  checked={filters.allowDigits}
                  onCheckedChange={(v) => updateFilter("allowDigits", v)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tlds" className="space-y-6 mt-6">
            <div className="p-4 glass rounded-xl border border-border/50">
              <Label className="text-base font-bold mb-4 block flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-primary to-blue-400 rounded-full" />
                {t("filters.extensions.quickCategories", lang)}
              </Label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(TLD_CATEGORIES).map((cat) => (
                  <Button
                    key={cat}
                    variant="outline"
                    size="sm"
                    onClick={() => selectTldCategory(cat as keyof typeof TLD_CATEGORIES)}
                    className="glass hover:bg-primary/20 hover:border-primary/50 transition-all"
                  >
                    <Sparkles className="h-3 w-3 mr-1.5" />
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            <div className="p-4 glass rounded-xl border border-border/50">
              <Label className="text-base font-bold mb-4 block flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-primary to-blue-400 rounded-full" />
                {t("filters.extensions.selected", lang, { count: filters.tlds.length })}
              </Label>
              <div className="flex flex-wrap gap-2">
                {filters.tlds.map((tld) => (
                  <Badge
                    key={tld}
                    variant="secondary"
                    className="glass cursor-pointer hover:bg-primary/30 hover:border-primary/50 transition-all group flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium"
                  >
                    {tld}
                    <X
                      className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTld(tld);
                      }}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="p-4 glass rounded-xl border border-border/50">
              <Label className="text-base font-bold mb-4 block flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-primary to-blue-400 rounded-full" />
                {t("filters.extensions.all", lang)}
              </Label>
              <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto p-2 rounded-lg">
                {ALL_TLDS.map((tld) => (
                  <Button
                    key={tld}
                    variant={filters.tlds.includes(tld) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleTld(tld)}
                    className={`text-xs transition-all ${
                      filters.tlds.includes(tld)
                        ? "glow shadow-lg shadow-primary/20"
                        : "hover:border-primary/50"
                    }`}
                  >
                    {tld}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-4 mt-6">
            <div className="p-6 glass rounded-xl border border-border/50 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("filters.seo.info", lang)}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
