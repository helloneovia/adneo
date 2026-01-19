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
import { X } from "lucide-react";

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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Filtres avancés</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="format" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="format">Format</TabsTrigger>
            <TabsTrigger value="tlds">Extensions</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
          </TabsList>

          <TabsContent value="format" className="space-y-4">
            <div>
              <Label>Longueur: {filters.minLength} - {filters.maxLength} caractères</Label>
              <div className="flex gap-4 mt-2">
                <div className="flex-1">
                  <Label className="text-xs">Min</Label>
                  <Slider
                    value={[filters.minLength]}
                    onValueChange={([v]) => updateFilter("minLength", v)}
                    min={3}
                    max={15}
                    step={1}
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-xs">Max</Label>
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

            <div className="flex items-center justify-between">
              <Label>Autoriser les tirets</Label>
              <Switch
                checked={filters.allowHyphens}
                onCheckedChange={(v) => updateFilter("allowHyphens", v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Autoriser les chiffres</Label>
              <Switch
                checked={filters.allowDigits}
                onCheckedChange={(v) => updateFilter("allowDigits", v)}
              />
            </div>
          </TabsContent>

          <TabsContent value="tlds" className="space-y-4">
            <div>
              <Label>Catégories rapides</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.keys(TLD_CATEGORIES).map((cat) => (
                  <Button
                    key={cat}
                    variant="outline"
                    size="sm"
                    onClick={() => selectTldCategory(cat as keyof typeof TLD_CATEGORIES)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label>Extensions sélectionnées ({filters.tlds.length})</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {filters.tlds.map((tld) => (
                  <Badge key={tld} variant="secondary" className="cursor-pointer">
                    {tld}
                    <X
                      className="ml-1 h-3 w-3"
                      onClick={() => toggleTld(tld)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label>Toutes les extensions</Label>
              <div className="flex flex-wrap gap-2 mt-2 max-h-40 overflow-y-auto">
                {ALL_TLDS.map((tld) => (
                  <Button
                    key={tld}
                    variant={filters.tlds.includes(tld) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleTld(tld)}
                  >
                    {tld}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="branding" className="space-y-4">
            <div>
              <Label>Score de brandabilité minimum</Label>
              <Slider
                value={[filters.minBrandScore]}
                onValueChange={([v]) => updateFilter("minBrandScore", v)}
                min={0}
                max={30}
                step={1}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">{filters.minBrandScore}/30</p>
            </div>

            <div>
              <Label>Style</Label>
              <Select value={filters.style} onValueChange={(v) => updateFilter("style", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les styles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous</SelectItem>
                  {BRAND_STYLES.map((style) => (
                    <SelectItem key={style} value={style}>{style}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Les filtres SEO seront appliqués automatiquement selon les mots-clés de recherche.
            </p>
          </TabsContent>

          <TabsContent value="business" className="space-y-4">
            <div>
              <Label>Catégorie</Label>
              <Select value={filters.category} onValueChange={(v) => updateFilter("category", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes</SelectItem>
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Ton</Label>
              <Select value={filters.tone} onValueChange={(v) => updateFilter("tone", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les tons" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous</SelectItem>
                  {TONES.map((tone) => (
                    <SelectItem key={tone} value={tone}>{tone}</SelectItem>
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
