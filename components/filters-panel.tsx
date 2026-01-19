"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TLD_CATEGORIES, ALL_TLDS, BUSINESS_CATEGORIES, BRAND_STYLES, TONES } from "@/lib/constants";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Filter, Sparkles } from "lucide-react";

interface FiltersPanelProps {
  onFiltersChange: (filters: any) => void;
}

export function FiltersPanel({ onFiltersChange }: FiltersPanelProps) {
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

  return (
    <Card className="glass sticky top-6">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">Filtres avancés</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="format" className="w-full">
          <TabsList className="glass grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="format" className="text-xs">Format</TabsTrigger>
            <TabsTrigger value="tlds" className="text-xs">Extensions</TabsTrigger>
            <TabsTrigger value="branding" className="text-xs">Branding</TabsTrigger>
            <TabsTrigger value="seo" className="text-xs">SEO</TabsTrigger>
            <TabsTrigger value="business" className="text-xs">Business</TabsTrigger>
          </TabsList>

          <TabsContent value="format" className="space-y-6">
            <div>
              <Label className="text-sm font-semibold mb-3 block">
                Longueur: {filters.minLength} - {filters.maxLength} caractères
              </Label>
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label className="text-xs text-muted-foreground">Min</Label>
                  <Slider
                    value={[filters.minLength]}
                    onValueChange={([v]) => updateFilter("minLength", v)}
                    min={3}
                    max={15}
                    step={1}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label className="text-xs text-muted-foreground">Max</Label>
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
              <Label className="text-sm">Autoriser les tirets</Label>
              <Switch
                checked={filters.allowHyphens}
                onCheckedChange={(v) => updateFilter("allowHyphens", v)}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg glass">
              <Label className="text-sm">Autoriser les chiffres</Label>
              <Switch
                checked={filters.allowDigits}
                onCheckedChange={(v) => updateFilter("allowDigits", v)}
              />
            </div>
          </TabsContent>

          <TabsContent value="tlds" className="space-y-4">
            <div>
              <Label className="text-sm font-semibold mb-3 block">Catégories rapides</Label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(TLD_CATEGORIES).map((cat) => (
                  <Button
                    key={cat}
                    variant="outline"
                    size="sm"
                    onClick={() => selectTldCategory(cat as keyof typeof TLD_CATEGORIES)}
                    className="glass text-xs"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold mb-3 block">
                Extensions sélectionnées ({filters.tlds.length})
              </Label>
              <div className="flex flex-wrap gap-2">
                {filters.tlds.map((tld) => (
                  <Badge
                    key={tld}
                    variant="secondary"
                    className="glass cursor-pointer hover:bg-primary/20 transition-colors group"
                  >
                    {tld}
                    <X
                      className="ml-1.5 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => toggleTld(tld)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold mb-3 block">Toutes les extensions</Label>
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

          <TabsContent value="branding" className="space-y-6">
            <div>
              <Label className="text-sm font-semibold mb-3 block">
                Score de brandabilité minimum: {filters.minBrandScore}/30
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
              <Label className="text-sm font-semibold mb-2 block">Style</Label>
              <Select value={filters.style} onValueChange={(v) => updateFilter("style", v)}>
                <SelectTrigger className="glass">
                  <SelectValue placeholder="Tous les styles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous</SelectItem>
                  {BRAND_STYLES.map((style) => (
                    <SelectItem key={style} value={style}>
                      {style}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-4">
            <div className="p-4 glass rounded-lg">
              <p className="text-sm text-muted-foreground">
                Les filtres SEO seront appliqués automatiquement selon les mots-clés de recherche.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="business" className="space-y-4">
            <div>
              <Label className="text-sm font-semibold mb-2 block">Catégorie</Label>
              <Select value={filters.category} onValueChange={(v) => updateFilter("category", v)}>
                <SelectTrigger className="glass">
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes</SelectItem>
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">Ton</Label>
              <Select value={filters.tone} onValueChange={(v) => updateFilter("tone", v)}>
                <SelectTrigger className="glass">
                  <SelectValue placeholder="Tous les tons" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous</SelectItem>
                  {TONES.map((tone) => (
                    <SelectItem key={tone} value={tone}>
                      {tone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
