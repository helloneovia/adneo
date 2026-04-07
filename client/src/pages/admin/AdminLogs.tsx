import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, XCircle, Clock, Loader2, RefreshCw, Globe, ChevronDown, ChevronUp, Activity } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs"><CheckCircle2 className="w-3 h-3 mr-1" />Succès</Badge>;
    case "failed":
      return <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs"><XCircle className="w-3 h-3 mr-1" />Échec</Badge>;
    case "running":
      return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs"><Loader2 className="w-3 h-3 mr-1 animate-spin" />En cours</Badge>;
    default:
      return <Badge variant="secondary" className="text-xs"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
  }
}

export default function AdminLogs() {
  const { data: submissions, isLoading, refetch } = trpc.admin.submissions.list.useQuery();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { data: logs } = trpc.admin.submissions.getLogs.useQuery(
    { submissionId: expandedId! },
    { enabled: expandedId !== null }
  );
  
  const { data: trackingLogs, isLoading: isLoadingTracking, refetch: refetchTracking } = trpc.tracking.getLogs.useQuery();

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Logs Système</h1>
            <p className="text-muted-foreground mt-1">Surveiller les soumissions et le tracking utilisateur avancé.</p>
          </div>
          <Button variant="outline" size="sm" className="border-border" onClick={() => { refetch(); refetchTracking(); }}>
            <RefreshCw className="w-4 h-4 mr-1.5" /> Actualiser
          </Button>
        </div>

        <Tabs defaultValue="submissions" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="submissions">Soumissions (API)</TabsTrigger>
            <TabsTrigger value="tracking">Tracking Utilisateurs</TabsTrigger>
          </TabsList>

          <TabsContent value="submissions">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-xl bg-muted/30 animate-pulse" />)}
          </div>
        ) : submissions?.length === 0 ? (
          <Card className="bg-card glass-card border-border">
            <CardContent className="py-12 text-center text-muted-foreground">
              Aucune soumission enregistrée.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {submissions?.map((sub: any) => (
              <Card key={sub.id} className="bg-card border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-foreground">#{sub.id}</span>
                      <StatusBadge status={sub.overallStatus} />
                      <span className="text-xs text-muted-foreground hidden sm:block">
                        Utilisateur #{sub.userId}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(sub.createdAt).toLocaleString("fr-FR")}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs text-muted-foreground"
                        onClick={() => setExpandedId(expandedId === sub.id ? null : sub.id)}
                      >
                        {expandedId === sub.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {(sub.targetSites as string[]).map((siteId: string) => (
                      <span
                        key={siteId}
                        className="flex items-center gap-1 text-xs bg-muted/30 text-muted-foreground border border-border/50 rounded-full px-2 py-0.5"
                      >
                        <Globe className="w-3 h-3" />
                        {SITE_LABELS[siteId] ?? siteId}
                      </span>
                    ))}
                  </div>

                  {expandedId === sub.id && (
                    <div className="mt-3 space-y-2">
                      {logs ? (
                        logs.length === 0 ? (
                          <p className="text-xs text-muted-foreground">Aucun log disponible.</p>
                        ) : (
                          logs.map((log: any) => (
                            <div key={log.id} className="bg-muted/20 rounded-lg p-3 border border-border/50">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-foreground">
                                  {SITE_LABELS[log.site] ?? log.site}
                                </span>
                                <StatusBadge status={log.status} />
                              </div>
                              {log.errorMessage && (
                                <p className="text-xs text-red-400 mb-2">{log.errorMessage}</p>
                              )}
                              {log.externalUrl && (
                                <a
                                  href={log.externalUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-primary underline"
                                >
                                  Voir l'annonce
                                </a>
                              )}
                              {log.logs && (log.logs as string[]).length > 0 && (
                                <div className="mt-2 font-mono text-xs space-y-0.5 max-h-32 overflow-y-auto">
                                  {(log.logs as string[]).map((l: string, i: number) => (
                                    <p key={i} className="text-muted-foreground">{l}</p>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))
                        )
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Loader2 className="w-3 h-3 animate-spin" /> Chargement des logs...
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
          </TabsContent>

          <TabsContent value="tracking">
            <Card className="bg-card glass-card border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Activité Utilisateurs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingTracking ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => <div key={i} className="h-12 rounded-xl bg-muted/30 animate-pulse" />)}
                  </div>
                ) : trackingLogs?.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">Aucun hit enregistré.</div>
                ) : (
                  <div className="space-y-2">
                    {trackingLogs?.map((log: any) => (
                      <div key={log.id} className="flex justify-between items-center bg-muted/20 rounded-lg p-3 border border-border/50">
                        <div className="flex gap-4 items-center">
                          <span className="text-zinc-400 font-mono text-xs">{new Date(log.createdAt).toLocaleString()}</span>
                          <span className="text-sm font-semibold">{log.action}</span>
                          <span className="text-sm border border-border px-2 py-0.5 rounded-full">{log.path}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">User ID: {log.userId || "GUEST"}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
