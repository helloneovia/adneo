"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TLD_CATEGORIES, ALL_TLDS, BUSINESS_CATEGORIES, BRAND_STYLES, TONES } from "@/lib/constants";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Filter } from "lucide-react";
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
    minBrandScore: 0,
    category: "",
    style: "",
    tone: "",
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

  const brandStylesArray = Array.from(BRAND_STYLES);
  const businessCategoriesArray = Array.from(BUSINESS_CATEGORIES);
  const tonesArray = Array.from(TONES);

  return (
    <Card className="glass">
      <CardContent className="p-6">
        <Tabs defaultValue="format" className="w-full">
          <TabsList className="glass grid w-full grid-cols-5 gap-1 p-1 h-auto rounded-lg mb-6">
            <TabsTrigger 
              value="format" 
              className="text-xs py-2.5 px-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all"
            >
              {t("filters.tabs.format", lang)}
            </TabsTrigger>
            <TabsTrigger 
              value="tlds" 
              className="text-xs py-2.5 px-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all"
            >
              {t("filters.tabs.extensions", lang)}
            </TabsTrigger>
            <TabsTrigger 
              value="branding" 
              className="text-xs py-2.5 px-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all"
            >
              {t("filters.tabs.branding", lang)}
            </TabsTrigger>
            <TabsTrigger 
              value="seo" 
              className="text-xs py-2.5 px-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all"
            >
              {t("filters.tabs.seo", lang)}
            </TabsTrigger>
            <TabsTrigger 
              value="business" 
              className="text-xs py-2.5 px-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all"
            >
              {t("filters.tabs.business", lang)}
            </TabsTrigger>
          </TabsList>

          {/* Horizontal Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Format Column */}
            <TabsContent value="format" className="space-y-4 mt-0 col-span-1 lg:col-span-1">
              <div>
                <Label className="text-sm font-semibold mb-3 block">
                  {t("filters.format.length", lang, { min: filters.minLength, max: filters.maxLength })}
                </Label>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">{t("filters.format.min", lang)}</Label>
                    <Slider
                      value={[filters.minLength]}
                      onValueChange={([v]) => updateFilter("minLength", v)}
                      min={3}
                      max={15}
                      step={1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">{t("filters.format.max", lang)}</Label>
                    <Slider
                      value={[filters.maxLength]}
                      onValueChange={([v]) => updateFilter("maxLength", v)}
                      min={5}
                      max={25}
                      step={1}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg glass">
                <Label className="text-sm">{t("filters.format.allowHyphens", lang)}</Label>
                <Switch
                  checked={filters.allowHyphens}
                  onCheckedChange={(v) => updateFilter("allowHyphens", v)}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg glass">
                <Label className="text-sm">{t("filters.format.allowDigits", lang)}</Label>
                <Switch
                  checked={filters.allowDigits}
                  onCheckedChange={(v) => updateFilter("allowDigits", v)}
                />
              </div>
            </TabsContent>

            {/* Extensions Column */}
            <TabsContent value="tlds" className="space-y-4 mt-0 col-span-1 lg:col-span-2">
              <div>
                <Label className="text-sm font-semibold mb-3 block">{t("filters.extensions.quickCategories", lang)}</Label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {Object.keys(TLD_CATEGORIES).map((cat) => (
                    <Button
                      key={cat}
                      variant="outline"
                      size="sm"
                      onClick={() => selectTldCategory(cat as keyof typeof TLD_CATEGORIES)}
                      className="glass text-xs"
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold mb-3 block">
                  {t("filters.extensions.selected", lang, { count: filters.tlds.length })}
                </Label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {filters.tlds.map((tld) => (
                    <Badge
                      key={tld}
                      variant="secondary"
                      className="glass cursor-pointer hover:bg-primary/20 transition-colors group flex items-center gap-1"
                    >
                      {tld}
                      <X
                        className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTld(tld);
                        }}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold mb-3 block">{t("filters.extensions.all", lang)}</Label>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 glass rounded-lg">
                  {ALL_TLDS.map((tld) => (
                    <Button
                      key={tld}
                      variant={filters.tlds.includes(tld) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleTld(tld)}
                      className="text-xs"
                    >
                      {tld}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Branding Column */}
            <TabsContent value="branding" className="space-y-4 mt-0 col-span-1 lg:col-span-1">
              <div>
                <Label className="text-sm font-semibold mb-3 block">
                  {t("filters.branding.minScore", lang, { score: filters.minBrandScore })}
                </Label>
                <Slider
                  value={[filters.minBrandScore]}
                  onValueChange={([v]) => updateFilter("minBrandScore", v)}
                  min={0}
                  max={30}
                  step={1}
                />
              </div>

              <div>
                <Label className="text-sm font-semibold mb-2 block">{t("filters.branding.style", lang)}</Label>
                <Select value={filters.style || ""} onValueChange={(v) => updateFilter("style", v)}>
                  <SelectTrigger className="glass w-full">
                    <SelectValue placeholder={t("filters.branding.styleAll", lang)} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t("filters.branding.styleAll", lang)}</SelectItem>
                    {brandStylesArray.map((style) => (
                      <SelectItem key={style} value={style}>
                        {style}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            {/* SEO Column */}
            <TabsContent value="seo" className="space-y-4 mt-0 col-span-1 lg:col-span-1">
              <div className="p-4 glass rounded-lg h-full flex items-center">
                <p className="text-sm text-muted-foreground">
                  {t("filters.seo.info", lang)}
                </p>
              </div>
            </TabsContent>

            {/* Business Column */}
            <TabsContent value="business" className="space-y-4 mt-0 col-span-1 lg:col-span-1">
              <div>
                <Label className="text-sm font-semibold mb-2 block">{t("filters.business.category", lang)}</Label>
                <Select value={filters.category || ""} onValueChange={(v) => updateFilter("category", v)}>
                  <SelectTrigger className="glass w-full">
                    <SelectValue placeholder={t("filters.business.categoryAll", lang)} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t("filters.business.categoryAll", lang)}</SelectItem>
                    {businessCategoriesArray.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-semibold mb-2 block">{t("filters.business.tone", lang)}</Label>
                <Select value={filters.tone || ""} onValueChange={(v) => updateFilter("tone", v)}>
                  <SelectTrigger className="glass w-full">
                    <SelectValue placeholder={t("filters.business.toneAll", lang)} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t("filters.business.toneAll", lang)}</SelectItem>
                    {tonesArray.map((tone) => (
                      <SelectItem key={tone} value={tone}>
                        {tone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
