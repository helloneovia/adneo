import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Zap, X } from "lucide-react";
import { useState } from "react";

type TemplateForm = {
  name: string;
  title: string;
  description: string;
  price: string;
  category: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  location: string;
  variables: Record<string, string>;
};

const emptyForm: TemplateForm = {
  name: "",
  title: "",
  description: "",
  price: "",
  category: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  location: "",
  variables: {},
};

export default function Templates() {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<TemplateForm>(emptyForm);
  const [varKey, setVarKey] = useState("");
  const [varVal, setVarVal] = useState("");

  const utils = trpc.useUtils();
  const { data: templates, isLoading } = trpc.templates.list.useQuery();

  const createMutation = trpc.templates.create.useMutation({
    onSuccess: () => { utils.templates.list.invalidate(); setOpen(false); toast.success("Template créé !"); },
    onError: (e) => toast.error(e.message),
  });

  const updateMutation = trpc.templates.update.useMutation({
    onSuccess: () => { utils.templates.list.invalidate(); setOpen(false); toast.success("Template mis à jour !"); },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = trpc.templates.delete.useMutation({
    onSuccess: () => { utils.templates.list.invalidate(); toast.success("Template supprimé."); },
    onError: (e) => toast.error(e.message),
  });

  const handleOpen = (tpl?: typeof templates extends (infer T)[] | undefined ? T : never) => {
    if (tpl) {
      setEditId(tpl.id);
      setForm({
        name: tpl.name,
        title: tpl.title ?? "",
        description: tpl.description ?? "",
        price: tpl.price ?? "",
        category: tpl.category ?? "",
        contactName: tpl.contactName ?? "",
        contactPhone: tpl.contactPhone ?? "",
        contactEmail: tpl.contactEmail ?? "",
        location: tpl.location ?? "",
        variables: (tpl.variables as Record<string, string>) ?? {},
      });
    } else {
      setEditId(null);
      setForm(emptyForm);
    }
    setOpen(true);
  };

  const handleSubmit = () => {
    const payload = {
      name: form.name,
      title: form.title || null,
      description: form.description || null,
      price: form.price || null,
      category: form.category || null,
      contactName: form.contactName || null,
      contactPhone: form.contactPhone || null,
      contactEmail: form.contactEmail || null,
      location: form.location || null,
      variables: Object.keys(form.variables).length > 0 ? form.variables : null,
    };
    if (editId) {
      updateMutation.mutate({ id: editId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const addVariable = () => {
    if (!varKey.trim()) return;
    setForm((f) => ({ ...f, variables: { ...f.variables, [varKey]: varVal } }));
    setVarKey("");
    setVarVal("");
  };

  const removeVariable = (key: string) => {
    const vars = { ...form.variables };
    delete vars[key];
    setForm((f) => ({ ...f, variables: vars }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mes templates</h1>
            <p className="text-muted-foreground mt-1">
              Créez des modèles réutilisables avec variables dynamiques.
            </p>
          </div>
          <Button
            onClick={() => handleOpen()}
            className="brand-gradient text-white border-0 hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" /> Nouveau template
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => <div key={i} className="h-32 rounded-xl bg-muted/30 animate-pulse" />)}
          </div>
        ) : templates?.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-16 text-center">
              <Zap className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-30" />
              <p className="text-muted-foreground mb-4">Aucun template pour l'instant.</p>
              <Button onClick={() => handleOpen()} className="brand-gradient text-white border-0">
                <Plus className="w-4 h-4 mr-2" /> Créer mon premier template
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates?.map((tpl) => (
              <Card
                key={tpl.id}
                className="bg-card border-border hover:border-primary/40 transition-colors"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-md brand-gradient flex items-center justify-center">
                          <Zap className="w-3 h-3 text-white" />
                        </div>
                        <h3 className="font-semibold text-foreground truncate">{tpl.name}</h3>
                      </div>
                      {tpl.title && (
                        <p className="text-sm text-muted-foreground truncate">{tpl.title}</p>
                      )}
                    </div>
                  </div>
                  {Object.keys((tpl.variables as Record<string, string>) ?? {}).length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {Object.keys(tpl.variables as Record<string, string>).map((k) => (
                        <span
                          key={k}
                          className="text-xs bg-primary/10 text-primary border border-primary/20 rounded px-2 py-0.5 font-mono"
                        >
                          {`{{${k}}}`}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-border hover:border-primary/40"
                      onClick={() => handleOpen(tpl)}
                    >
                      <Pencil className="w-3.5 h-3.5 mr-1.5" /> Modifier
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => deleteMutation.mutate({ id: tpl.id })}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle>{editId ? "Modifier le template" : "Nouveau template"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Nom du template *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="ex: Annonce immobilière standard"
                className="bg-input border-border"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <Label>Titre (optionnel)</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Titre par défaut de l'annonce"
                  className="bg-input border-border"
                />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <Label>Description (optionnel)</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Utilisez {{variable}} pour les champs dynamiques..."
                  rows={4}
                  className="bg-input border-border resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Prix</Label>
                <Input value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className="bg-input border-border" />
              </div>
              <div className="space-y-1.5">
                <Label>Catégorie</Label>
                <Input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="bg-input border-border" />
              </div>
              <div className="space-y-1.5">
                <Label>Nom contact</Label>
                <Input value={form.contactName} onChange={(e) => setForm((f) => ({ ...f, contactName: e.target.value }))} className="bg-input border-border" />
              </div>
              <div className="space-y-1.5">
                <Label>Téléphone</Label>
                <Input value={form.contactPhone} onChange={(e) => setForm((f) => ({ ...f, contactPhone: e.target.value }))} className="bg-input border-border" />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input type="email" value={form.contactEmail} onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))} className="bg-input border-border" />
              </div>
              <div className="space-y-1.5">
                <Label>Localisation</Label>
                <Input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} className="bg-input border-border" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Variables dynamiques</Label>
              <p className="text-xs text-muted-foreground">
                Définissez des variables utilisables avec la syntaxe <code className="bg-muted px-1 rounded">{"{{nom}}"}</code> dans le titre et la description.
              </p>
              <div className="flex gap-2">
                <Input value={varKey} onChange={(e) => setVarKey(e.target.value)} placeholder="Nom variable" className="bg-input border-border" />
                <Input value={varVal} onChange={(e) => setVarVal(e.target.value)} placeholder="Valeur par défaut" className="bg-input border-border" />
                <Button variant="outline" onClick={addVariable} className="shrink-0 border-border">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {Object.entries(form.variables).map(([k, v]) => (
                <div key={k} className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2">
                  <span className="text-sm font-mono text-primary">{`{{${k}}}`}</span>
                  <span className="text-sm text-muted-foreground">→</span>
                  <span className="text-sm text-foreground flex-1">{v || "(vide)"}</span>
                  <button onClick={() => removeVariable(k)} className="text-muted-foreground hover:text-destructive">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Annuler</Button>
            <Button
              onClick={handleSubmit}
              disabled={!form.name || createMutation.isPending || updateMutation.isPending}
              className="brand-gradient text-white border-0 hover:opacity-90"
            >
              {editId ? "Mettre à jour" : "Créer le template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
