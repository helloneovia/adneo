import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { FileText, Send, Zap, CheckCircle2, Clock, XCircle, ArrowRight, Plus } from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { data: announcements } = trpc.announcements.list.useQuery();
  const { data: submissions } = trpc.submissions.list.useQuery();
  const { data: templates } = trpc.templates.list.useQuery();

  const successCount = submissions?.filter((s) => s.overallStatus === "completed").length ?? 0;
  const failedCount = submissions?.filter((s) => s.overallStatus === "failed").length ?? 0;
  const pendingCount = submissions?.filter((s) => s.overallStatus === "running" || s.overallStatus === "pending").length ?? 0;

  const recentSubmissions = submissions?.slice(0, 5) ?? [];

  const statusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30">Succès</Badge>;
      case "failed":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30">Échec</Badge>;
      case "running":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30">En cours</Badge>;
      default:
        return <Badge variant="secondary">En attente</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Bonjour, {user?.name?.split(" ")[0] ?? "utilisateur"} 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Gérez vos annonces et suivez vos dépôts multi-sites.
            </p>
          </div>
          <Button
            onClick={() => setLocation("/dashboard/deposer")}
            className="brand-gradient text-white border-0 hover:opacity-90"
          >
            <Send className="w-4 h-4 mr-2" />
            Déposer une annonce
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Annonces",
              value: announcements?.length ?? 0,
              icon: <FileText className="w-5 h-5" />,
              color: "text-blue-400",
              bg: "bg-blue-500/10",
              action: () => setLocation("/dashboard/annonces"),
            },
            {
              label: "Templates",
              value: templates?.length ?? 0,
              icon: <Zap className="w-5 h-5" />,
              color: "text-purple-400",
              bg: "bg-purple-500/10",
              action: () => setLocation("/dashboard/templates"),
            },
            {
              label: "Dépôts réussis",
              value: successCount,
              icon: <CheckCircle2 className="w-5 h-5" />,
              color: "text-green-400",
              bg: "bg-green-500/10",
              action: () => setLocation("/dashboard/soumissions"),
            },
            {
              label: "Dépôts échoués",
              value: failedCount,
              icon: <XCircle className="w-5 h-5" />,
              color: "text-red-400",
              bg: "bg-red-500/10",
              action: () => setLocation("/dashboard/soumissions"),
            },
          ].map((stat) => (
            <Card
              key={stat.label}
              className="bg-card border-border cursor-pointer hover:border-primary/40 transition-colors"
              onClick={stat.action}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                  <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Créer une annonce", path: "/dashboard/annonces/nouveau", icon: <Plus className="w-4 h-4" /> },
                { label: "Créer un template", path: "/dashboard/templates/nouveau", icon: <Plus className="w-4 h-4" /> },
                { label: "Déposer sur les sites", path: "/dashboard/deposer", icon: <Send className="w-4 h-4" /> },
              ].map((action) => (
                <Button
                  key={action.path}
                  variant="ghost"
                  className="w-full justify-between text-left h-10 hover:bg-muted/50"
                  onClick={() => setLocation(action.path)}
                >
                  <span className="flex items-center gap-2">
                    {action.icon}
                    {action.label}
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Soumissions récentes</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground"
                  onClick={() => setLocation("/dashboard/soumissions")}
                >
                  Voir tout
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentSubmissions.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  <Send className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  Aucune soumission pour l'instant
                </div>
              ) : (
                <div className="space-y-2">
                  {recentSubmissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Soumission #{sub.id}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(sub.targetSites as string[]).join(", ")}
                        </p>
                      </div>
                      {statusBadge(sub.overallStatus)}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
