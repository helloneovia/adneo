import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Send, CheckCircle2, XCircle, Clock, Loader2, ChevronDown, ChevronUp, Globe, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

const SITE_LABELS: Record<string, string> = {
  paruvendu: "ParuVendu.fr",
  topannonces: "Topannonces.fr",
  entreparticuliers: "Entreparticuliers.com",
  vivastreet: "Vivastreet.com",
  pap: "PAP.fr",
};

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle2 className="w-3 h-3 mr-1" />Succès</Badge>;
    case "failed":
      return <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><XCircle className="w-3 h-3 mr-1" />Échec</Badge>;
    case "running":
      return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30"><Loader2 className="w-3 h-3 mr-1 animate-spin" />En cours</Badge>;
    default:
      return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
  }
}

export default function Submissions() {
  const [, setLocation] = useLocation();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [expandedLogs, setExpandedLogs] = useState<Record<number, boolean>>({});

  const { data: submissions, isLoading, refetch } = trpc.submissions.list.useQuery();
  const { data: details } = trpc.submissions.getDetails.useQuery(
    { id: selectedId! },
    { enabled: selectedId !== null }
  );

  type SubmissionWithResults = typeof submissions extends (infer T)[] | undefined ? T & {
    results?: Record<string, { status: string; message?: string; url?: string }>;
    logs?: string[];
  } : never;

  const toggleLog = (id: number) => {
    setExpandedLogs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mes soumissions</h1>
            <p className="text-muted-foreground mt-1">Suivez le statut de vos dépôts multi-sites.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-border" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-1.5" /> Actualiser
            </Button>
            <Button
              size="sm"
              className="brand-gradient text-white border-0 hover:opacity-90"
              onClick={() => setLocation("/dashboard/deposer")}
            >
              <Send className="w-4 h-4 mr-1.5" /> Nouveau dépôt
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-xl bg-muted/30 animate-pulse" />)}
          </div>
        ) : submissions?.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-16 text-center">
              <Send className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-30" />
              <p className="text-muted-foreground mb-4">Aucune soumission pour l'instant.</p>
              <Button
                onClick={() => setLocation("/dashboard/deposer")}
                className="brand-gradient text-white border-0"
              >
                <Send className="w-4 h-4 mr-2" /> Déposer ma première annonce
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {submissions?.map((sub) => (
              <Card
                key={sub.id}
                className="bg-card border-border hover:border-primary/40 transition-colors"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-foreground">
                          Soumission #{sub.id}
                        </span>
                        <StatusBadge status={sub.overallStatus} />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(sub.createdAt).toLocaleString("fr-FR")}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-muted-foreground hover:text-foreground shrink-0"
                      onClick={() => setSelectedId(sub.id)}
                    >
                      Détails
                    </Button>
                  </div>

                  {/* Sites */}
                  <div className="flex flex-wrap gap-2">
                    {(sub.targetSites as string[]).map((siteId) => {
                      const subAny = sub as any;
                      const siteResult = (subAny.results as Record<string, { status: string; message?: string }> | null)?.[siteId];
                      const status = siteResult?.status ?? "pending";
                      return (
                        <div
                          key={siteId}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${
                            status === "success"
                              ? "bg-green-500/10 text-green-400 border-green-500/30"
                              : status === "failed"
                              ? "bg-red-500/10 text-red-400 border-red-500/30"
                              : status === "running"
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                              : "bg-muted/30 text-muted-foreground border-border"
                          }`}
                        >
                          <Globe className="w-3 h-3" />
                          {SITE_LABELS[siteId] ?? siteId}
                          {status === "success" && <CheckCircle2 className="w-3 h-3" />}
                          {status === "failed" && <XCircle className="w-3 h-3" />}
                          {status === "running" && <Loader2 className="w-3 h-3 animate-spin" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Logs toggle */}
                  {(sub as any).logs && ((sub as any).logs as string[]).length > 0 && (
                    <div className="mt-3">
                      <button
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => toggleLog(sub.id)}
                      >
                        {expandedLogs[sub.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        {expandedLogs[sub.id] ? "Masquer les logs" : "Voir les logs"}
                      </button>
                      {expandedLogs[sub.id] && (
                        <div className="mt-2 bg-muted/20 rounded-lg p-3 font-mono text-xs space-y-1 max-h-40 overflow-y-auto border border-border/50">
                          {((sub as any).logs as string[]).map((log: string, i: number) => (
                            <p key={i} className="text-muted-foreground">{log}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Détails dialog */}
      <Dialog open={selectedId !== null} onOpenChange={() => setSelectedId(null)}>
        <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle>Détails de la soumission #{selectedId}</DialogTitle>
          </DialogHeader>
          {details ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <StatusBadge status={details.overallStatus} />
                <span className="text-xs text-muted-foreground">
                  {new Date(details.createdAt).toLocaleString("fr-FR")}
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">Résultats par site</p>
                {(details.targetSites as string[]).map((siteId) => {
                  const result = (details.results as Record<string, { status: string; message?: string; url?: string }> | null)?.[siteId];
                  return (
                    <div key={siteId} className="bg-muted/20 rounded-lg p-3 border border-border/50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">
                          {SITE_LABELS[siteId] ?? siteId}
                        </span>
                        <StatusBadge status={result?.status ?? "pending"} />
                      </div>
                      {result?.message && (
                        <p className="text-xs text-muted-foreground mt-1">{result.message}</p>
                      )}
                      {result?.url && (
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary underline mt-1 block"
                        >
                          Voir l'annonce publiée
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>

              {details.logs && (details.logs as string[]).length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">Logs complets</p>
                  <div className="bg-muted/20 rounded-lg p-3 font-mono text-xs space-y-1 max-h-48 overflow-y-auto border border-border/50">
                    {(details.logs as string[]).map((log, i) => (
                      <p key={i} className="text-muted-foreground">{log}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
