import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Send, CheckCircle2, AlertCircle, Globe, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

const SITE_INFO: Record<string, { label: string; color: string; desc: string }> = {
  paruvendu: { label: "ParuVendu.fr", color: "text-orange-400 bg-orange-500/10 border-orange-500/30", desc: "Vérification SMS via 5sim" },
  topannonces: { label: "Topannonces.fr", color: "text-blue-400 bg-blue-500/10 border-blue-500/30", desc: "Modération manuelle" },
  entreparticuliers: { label: "Entreparticuliers.com", color: "text-green-400 bg-green-500/10 border-green-500/30", desc: "Immobilier & services" },
  vivastreet: { label: "Vivastreet.com", color: "text-purple-400 bg-purple-500/10 border-purple-500/30", desc: "CAPTCHA via Capmonster" },
  pap: { label: "PAP.fr", color: "text-red-400 bg-red-500/10 border-red-500/30", desc: "Non supporté (payant)" },
};

export default function Submit() {
  const [location] = useLocation();
  const [, setLocation] = useLocation();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<number | null>(null);
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState<number | null>(null);

  const { data: announcements } = trpc.announcements.list.useQuery();
  const { data: sites } = trpc.sites.list.useQuery();

  // Pré-sélectionner l'annonce depuis l'URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("announcementId");
    if (id) setSelectedAnnouncement(parseInt(id));
  }, []);

  const submitMutation = trpc.submissions.submit.useMutation({
    onSuccess: (data) => {
      setSubmissionId(data.submissionId);
      setSubmitting(false);
      toast.success("Soumission lancée ! Suivez le statut dans vos soumissions.");
    },
    onError: (e) => {
      setSubmitting(false);
      toast.error(e.message);
    },
  });

  const toggleSite = (siteId: string) => {
    if (siteId === "pap") return; // Non supporté
    setSelectedSites((prev) =>
      prev.includes(siteId) ? prev.filter((s) => s !== siteId) : [...prev, siteId]
    );
  };

  const handleSubmit = () => {
    if (!selectedAnnouncement) return toast.error("Sélectionnez une annonce");
    if (selectedSites.length === 0) return toast.error("Sélectionnez au moins un site");
    setSubmitting(true);
    submitMutation.mutate({ announcementId: selectedAnnouncement, targetSites: selectedSites });
  };

  const selectedAnn = announcements?.find((a) => a.id === selectedAnnouncement);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Déposer une annonce</h1>
          <p className="text-muted-foreground mt-1">
            Sélectionnez une annonce et les sites cibles. ADNEO s'occupe du reste.
          </p>
        </div>

        {submissionId ? (
          <Card className="bg-card border-green-500/30">
            <CardContent className="py-10 text-center">
              <CheckCircle2 className="w-14 h-14 mx-auto mb-4 text-green-400" />
              <h2 className="text-xl font-bold text-foreground mb-2">Soumission lancée !</h2>
              <p className="text-muted-foreground mb-6">
                La soumission #{submissionId} est en cours. Suivez son avancement en temps réel.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => setLocation("/dashboard/soumissions")}
                  className="brand-gradient text-white border-0 hover:opacity-90"
                >
                  Voir mes soumissions
                </Button>
                <Button
                  variant="outline"
                  className="border-border"
                  onClick={() => { setSubmissionId(null); setSelectedSites([]); }}
                >
                  Nouvelle soumission
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sélection annonce */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">1. Choisir l'annonce</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {!announcements || announcements.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground text-sm">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    Aucune annonce disponible.{" "}
                    <button
                      className="text-primary underline"
                      onClick={() => setLocation("/dashboard/annonces")}
                    >
                      Créez-en une
                    </button>
                  </div>
                ) : (
                  announcements.map((ann) => (
                    <button
                      key={ann.id}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedAnnouncement === ann.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/40 bg-muted/20"
                      }`}
                      onClick={() => setSelectedAnnouncement(ann.id)}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">{ann.title}</p>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{ann.description}</p>
                        </div>
                        {selectedAnnouncement === ann.id && (
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        )}
                      </div>
                    </button>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Sélection sites */}
            <div className="space-y-4">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base">2. Choisir les sites cibles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {sites?.map((site) => {
                    const info = SITE_INFO[site.id];
                    const isSelected = selectedSites.includes(site.id);
                    const isDisabled = site.id === "pap";
                    return (
                      <button
                        key={site.id}
                        disabled={isDisabled}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          isDisabled
                            ? "border-border opacity-40 cursor-not-allowed"
                            : isSelected
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/40 bg-muted/20"
                        }`}
                        onClick={() => toggleSite(site.id)}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-sm text-foreground">{info?.label ?? site.label}</p>
                              <p className="text-xs text-muted-foreground">{info?.desc}</p>
                            </div>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
                          {isDisabled && <Badge variant="outline" className="text-xs border-red-500/30 text-red-400">Non supporté</Badge>}
                        </div>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Résumé et bouton */}
              <Card className="bg-card border-border">
                <CardContent className="p-4 space-y-3">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Annonce sélectionnée</span>
                      <span className="text-foreground font-medium truncate max-w-[180px]">
                        {selectedAnn?.title ?? "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sites cibles</span>
                      <span className="text-foreground font-medium">
                        {selectedSites.length > 0 ? `${selectedSites.length} site(s)` : "—"}
                      </span>
                    </div>
                  </div>
                  <Button
                    className="w-full brand-gradient text-white border-0 hover:opacity-90"
                    disabled={!selectedAnnouncement || selectedSites.length === 0 || submitting}
                    onClick={handleSubmit}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Soumission en cours...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" /> Lancer le dépôt
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
