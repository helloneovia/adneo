import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Plus, Pencil, Trash2, FileText, Image, Send, X } from "lucide-react";
import { useState, useRef } from "react";
import { useLocation } from "wouter";

type AnnouncementForm = {
  title: string;
  description: string;
  price: string;
  category: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  location: string;
  imageUrls: string[];
  variables: Record<string, string>;
};

const emptyForm: AnnouncementForm = {
  title: "",
  description: "",
  price: "",
  category: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  location: "",
  imageUrls: [],
  variables: {},
};

export default function Announcements() {
  const [, setLocation] = useLocation();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<AnnouncementForm>(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [varKey, setVarKey] = useState("");
  const [varVal, setVarVal] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const utils = trpc.useUtils();
  const { data: announcements, isLoading } = trpc.announcements.list.useQuery();

  const createMutation = trpc.announcements.create.useMutation({
    onSuccess: () => { utils.announcements.list.invalidate(); setOpen(false); toast.success("Annonce créée !"); },
    onError: (e) => toast.error(e.message),
  });

  const updateMutation = trpc.announcements.update.useMutation({
    onSuccess: () => { utils.announcements.list.invalidate(); setOpen(false); toast.success("Annonce mise à jour !"); },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = trpc.announcements.delete.useMutation({
    onSuccess: () => { utils.announcements.list.invalidate(); toast.success("Annonce supprimée."); },
    onError: (e) => toast.error(e.message),
  });

  const uploadMutation = trpc.announcements.uploadImage.useMutation({
    onSuccess: (data) => {
      setForm((f) => ({ ...f, imageUrls: [...f.imageUrls, data.url] }));
      setUploading(false);
      toast.success("Image uploadée !");
    },
    onError: (e) => { setUploading(false); toast.error(e.message); },
  });

  const handleOpen = (ann?: typeof announcements extends (infer T)[] | undefined ? T : never) => {
    if (ann) {
      setEditId(ann.id);
      setForm({
        title: ann.title,
        description: ann.description,
        price: ann.price ?? "",
        category: ann.category ?? "",
        contactName: ann.contactName ?? "",
        contactPhone: ann.contactPhone ?? "",
        contactEmail: ann.contactEmail ?? "",
        location: ann.location ?? "",
        imageUrls: (ann.imageUrls as string[]) ?? [],
        variables: (ann.variables as Record<string, string>) ?? {},
      });
    } else {
      setEditId(null);
      setForm(emptyForm);
    }
    setOpen(true);
  };

  const handleSubmit = () => {
    const payload = {
      title: form.title,
      description: form.description,
      price: form.price || null,
      category: form.category || null,
      contactName: form.contactName || null,
      contactPhone: form.contactPhone || null,
      contactEmail: form.contactEmail || null,
      location: form.location || null,
      imageUrls: form.imageUrls.length > 0 ? form.imageUrls : null,
      variables: Object.keys(form.variables).length > 0 ? form.variables : null,
    };
    if (editId) {
      updateMutation.mutate({ id: editId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      uploadMutation.mutate({ filename: file.name, contentType: file.type, base64 });
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be re-selected
    e.target.value = "";
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
            <h1 className="text-2xl font-bold text-foreground">Mes annonces</h1>
            <p className="text-muted-foreground mt-1">Créez et gérez vos annonces.</p>
          </div>
          <Button
            onClick={() => handleOpen()}
            className="brand-gradient text-white border-0 hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" /> Nouvelle annonce
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-xl bg-muted/30 animate-pulse" />
            ))}
          </div>
        ) : announcements?.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-16 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-30" />
              <p className="text-muted-foreground mb-4">Aucune annonce pour l'instant.</p>
              <Button onClick={() => handleOpen()} className="brand-gradient text-white border-0">
                <Plus className="w-4 h-4 mr-2" /> Créer ma première annonce
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements?.map((ann) => (
              <Card
                key={ann.id}
                className="bg-card border-border hover:border-primary/40 transition-colors"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{ann.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {ann.description}
                      </p>
                    </div>
                    {ann.price && (
                      <Badge variant="outline" className="shrink-0 border-primary/40 text-primary">
                        {ann.price}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    {ann.category && <span className="bg-muted px-2 py-0.5 rounded">{ann.category}</span>}
                    {ann.location && <span>{ann.location}</span>}
                    {(ann.imageUrls as string[] | null)?.length ? (
                      <span className="flex items-center gap-1">
                        <Image className="w-3 h-3" />
                        {(ann.imageUrls as string[]).length} photo(s)
                      </span>
                    ) : null}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-border hover:border-primary/40"
                      onClick={() => handleOpen(ann)}
                    >
                      <Pencil className="w-3.5 h-3.5 mr-1.5" /> Modifier
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 brand-gradient text-white border-0 hover:opacity-90"
                      onClick={() => setLocation(`/dashboard/deposer?announcementId=${ann.id}`)}
                    >
                      <Send className="w-3.5 h-3.5 mr-1.5" /> Déposer
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => deleteMutation.mutate({ id: ann.id })}
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

      {/* Dialog Créer/Modifier */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle>{editId ? "Modifier l'annonce" : "Nouvelle annonce"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <Label>Titre *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Titre de l'annonce"
                  className="bg-input border-border"
                />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <Label>Description *</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Description détaillée..."
                  rows={4}
                  className="bg-input border-border resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Prix</Label>
                <Input
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="ex: 150 €"
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Catégorie</Label>
                <Input
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  placeholder="ex: Immobilier, Services..."
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Nom du contact</Label>
                <Input
                  value={form.contactName}
                  onChange={(e) => setForm((f) => ({ ...f, contactName: e.target.value }))}
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Téléphone</Label>
                <Input
                  value={form.contactPhone}
                  onChange={(e) => setForm((f) => ({ ...f, contactPhone: e.target.value }))}
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))}
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Localisation</Label>
                <Input
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="ex: Paris 75001"
                  className="bg-input border-border"
                />
              </div>
            </div>

            {/* Photos */}
            <div className="space-y-2">
              <Label>Photos</Label>
              <div className="flex flex-wrap gap-2">
                {form.imageUrls.map((url, i) => (
                  <div key={i} className="relative group">
                    <img src={url} alt="" className="w-16 h-16 object-cover rounded-lg border border-border" />
                    <button
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setForm((f) => ({ ...f, imageUrls: f.imageUrls.filter((_, j) => j !== i) }))}
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
                <button
                  className="w-16 h-16 rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </div>

            {/* Variables */}
            <div className="space-y-2">
              <Label>Variables optionnelles</Label>
              <div className="flex gap-2">
                <Input
                  value={varKey}
                  onChange={(e) => setVarKey(e.target.value)}
                  placeholder="Nom (ex: ville)"
                  className="bg-input border-border"
                />
                <Input
                  value={varVal}
                  onChange={(e) => setVarVal(e.target.value)}
                  placeholder="Valeur"
                  className="bg-input border-border"
                />
                <Button variant="outline" onClick={addVariable} className="shrink-0 border-border">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {Object.entries(form.variables).map(([k, v]) => (
                <div key={k} className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2">
                  <span className="text-sm font-mono text-primary">{`{{${k}}}`}</span>
                  <span className="text-sm text-muted-foreground">→</span>
                  <span className="text-sm text-foreground flex-1">{v}</span>
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
              disabled={!form.title || !form.description || createMutation.isPending || updateMutation.isPending}
              className="brand-gradient text-white border-0 hover:opacity-90"
            >
              {editId ? "Mettre à jour" : "Créer l'annonce"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
