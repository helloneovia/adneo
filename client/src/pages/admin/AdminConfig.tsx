import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Settings, Key, Eye, EyeOff, Plus, Trash2, CheckCircle2, AlertCircle, Bot, Phone } from "lucide-react";
import { useState } from "react";

const PRESET_CONFIGS = [
  {
    key: "CAPMONSTER_API_KEY",
    label: "Clé API Capmonster",
    description: "Clé API pour la résolution automatique des CAPTCHAs (reCAPTCHA, Cloudflare, etc.)",
    isSecret: true,
    icon: <Bot className="w-4 h-4" />,
    color: "text-blue-400 bg-blue-500/10",
    link: "https://capmonster.cloud",
  },
  {
    key: "FIVESIM_API_KEY",
    label: "Clé API 5sim",
    description: "Clé API pour la réception de SMS de vérification (numéros virtuels français)",
    isSecret: true,
    icon: <Phone className="w-4 h-4" />,
    color: "text-green-400 bg-green-500/10",
    link: "https://5sim.net",
  },
  {
    key: "CAPMONSTER_BALANCE_MIN",
    label: "Solde minimum Capmonster",
    description: "Alerte si le solde Capmonster descend en dessous de cette valeur (en USD)",
    isSecret: false,
    icon: <AlertCircle className="w-4 h-4" />,
    color: "text-orange-400 bg-orange-500/10",
    link: null,
  },
  {
    key: "FIVESIM_COUNTRY",
    label: "Pays 5sim par défaut",
    description: "Code pays pour les numéros 5sim (ex: france, russia, etc.)",
    isSecret: false,
    icon: <Phone className="w-4 h-4" />,
    color: "text-purple-400 bg-purple-500/10",
    link: null,
  },
];

export default function AdminConfig() {
  const utils = trpc.useUtils();
  const { data: configs, isLoading } = trpc.admin.config.list.useQuery();
  const [editKey, setEditKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});
  const [customKey, setCustomKey] = useState("");
  const [customValue, setCustomValue] = useState("");
  const [customDesc, setCustomDesc] = useState("");
  const [showCustomForm, setShowCustomForm] = useState(false);

  const upsertMutation = trpc.admin.config.upsert.useMutation({
    onSuccess: () => {
      utils.admin.config.list.invalidate();
      setEditKey(null);
      setEditValue("");
      toast.success("Configuration sauvegardée !");
    },
    onError: (e: { message: string }) => toast.error(e.message),
  });

  const deleteMutation = trpc.admin.config.delete.useMutation({
    onSuccess: () => { utils.admin.config.list.invalidate(); toast.success("Configuration supprimée."); },
    onError: (e: { message: string }) => toast.error(e.message),
  });

  const getConfigValue = (key: string) => configs?.find((c) => c.key === key);

  const handleEdit = (key: string, preset?: typeof PRESET_CONFIGS[0]) => {
    setEditKey(key);
    setEditValue("");
  };

  const handleSave = () => {
    if (!editKey) return;
    const preset = PRESET_CONFIGS.find((p) => p.key === editKey);
    upsertMutation.mutate({
      key: editKey,
      value: editValue,
      description: preset?.description,
      isSecret: preset?.isSecret ?? true,
    });
  };

  const handleCustomSave = () => {
    if (!customKey) return;
    upsertMutation.mutate({
      key: customKey,
      value: customValue,
      description: customDesc || undefined,
      isSecret: true,
    });
    setCustomKey("");
    setCustomValue("");
    setCustomDesc("");
    setShowCustomForm(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Configuration</h1>
            <p className="text-muted-foreground mt-1">
              Gérez les clés API et paramètres d'automatisation.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-border"
            onClick={() => setShowCustomForm(true)}
          >
            <Plus className="w-4 h-4 mr-1.5" /> Ajouter une config
          </Button>
        </div>

        {/* Configs prédéfinies */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Services d'automatisation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRESET_CONFIGS.map((preset) => {
              const config = getConfigValue(preset.key);
              const isConfigured = !!config;
              return (
                <Card key={preset.key} className="bg-card border-border hover:border-primary/40 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${preset.color}`}>
                        {preset.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-sm text-foreground">{preset.label}</p>
                          {isConfigured ? (
                            <Badge className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                              <CheckCircle2 className="w-3 h-3 mr-1" />Configuré
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs border-orange-500/30 text-orange-400">
                              <AlertCircle className="w-3 h-3 mr-1" />Non configuré
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{preset.description}</p>
                        {preset.link && (
                          <a
                            href={preset.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary underline mt-1 inline-block"
                          >
                            Obtenir une clé →
                          </a>
                        )}
                      </div>
                    </div>

                    {isConfigured && (
                      <div className="flex items-center gap-2 bg-muted/20 rounded-lg px-3 py-2 mb-3 border border-border/50">
                        <Key className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="text-xs font-mono text-muted-foreground flex-1 truncate">
                          {showValues[preset.key] ? config.value : config.value}
                        </span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 brand-gradient text-white border-0 hover:opacity-90"
                        onClick={() => handleEdit(preset.key, preset)}
                      >
                        {isConfigured ? "Modifier" : "Configurer"}
                      </Button>
                      {isConfigured && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => deleteMutation.mutate({ key: preset.key })}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Configs personnalisées */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Configurations supplémentaires
          </h2>
          {isLoading ? (
            <div className="h-20 rounded-xl bg-muted/30 animate-pulse" />
          ) : (
            <div className="space-y-2">
              {configs
                ?.filter((c) => !PRESET_CONFIGS.find((p) => p.key === c.key))
                .map((config) => (
                  <div
                    key={config.key}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/50 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Key className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-mono font-medium text-foreground truncate">{config.key}</p>
                        {config.description && (
                          <p className="text-xs text-muted-foreground truncate">{config.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <span className="text-xs font-mono text-muted-foreground">
                        {config.isSecret ? "••••••••" : config.value}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs"
                        onClick={() => handleEdit(config.key)}
                      >
                        Modifier
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => deleteMutation.mutate({ key: config.key })}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              {configs?.filter((c) => !PRESET_CONFIGS.find((p) => p.key === c.key)).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucune configuration supplémentaire.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Dialog modifier une config */}
      <Dialog open={editKey !== null} onOpenChange={() => setEditKey(null)}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="w-4 h-4 text-primary" />
              {PRESET_CONFIGS.find((p) => p.key === editKey)?.label ?? editKey}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {editKey && PRESET_CONFIGS.find((p) => p.key === editKey) && (
              <p className="text-sm text-muted-foreground">
                {PRESET_CONFIGS.find((p) => p.key === editKey)?.description}
              </p>
            )}
            <div className="space-y-1.5">
              <Label>Nouvelle valeur</Label>
              <Input
                type="password"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder="Entrez la valeur..."
                className="bg-input border-border font-mono"
                autoComplete="off"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditKey(null)}>Annuler</Button>
            <Button
              onClick={handleSave}
              disabled={!editValue || upsertMutation.isPending}
              className="brand-gradient text-white border-0 hover:opacity-90"
            >
              Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog config personnalisée */}
      <Dialog open={showCustomForm} onOpenChange={setShowCustomForm}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle>Ajouter une configuration</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Clé *</Label>
              <Input
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value.toUpperCase().replace(/\s/g, "_"))}
                placeholder="ex: MY_API_KEY"
                className="bg-input border-border font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Valeur *</Label>
              <Input
                type="password"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                placeholder="Valeur secrète..."
                className="bg-input border-border"
                autoComplete="off"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description (optionnel)</Label>
              <Input
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                placeholder="À quoi sert cette clé ?"
                className="bg-input border-border"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowCustomForm(false)}>Annuler</Button>
            <Button
              onClick={handleCustomSave}
              disabled={!customKey || !customValue || upsertMutation.isPending}
              className="brand-gradient text-white border-0 hover:opacity-90"
            >
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
