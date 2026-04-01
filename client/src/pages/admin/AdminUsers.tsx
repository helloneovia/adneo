import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Users, Shield, User, RefreshCw, BarChart3 } from "lucide-react";

export default function AdminUsers() {
  const utils = trpc.useUtils();
  const { data: users, isLoading, refetch } = trpc.admin.users.list.useQuery();
  const { data: stats } = trpc.admin.stats.useQuery();

  const promoteAdminMutation = trpc.admin.users.setRole.useMutation({
    onSuccess: () => { utils.admin.users.list.invalidate(); toast.success("Rôle mis à jour !"); },
    onError: (e: { message: string }) => toast.error(e.message),
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Utilisateurs</h1>
            <p className="text-muted-foreground mt-1">Gérez les comptes et les rôles.</p>
          </div>
          <Button variant="outline" size="sm" className="border-border" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-1.5" /> Actualiser
          </Button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Utilisateurs", value: stats.totalUsers, icon: <Users className="w-4 h-4" />, color: "text-blue-400 bg-blue-500/10" },
              { label: "Annonces", value: stats.totalAnnouncements, icon: <BarChart3 className="w-4 h-4" />, color: "text-purple-400 bg-purple-500/10" },
              { label: "Soumissions", value: stats.totalSubmissions, icon: <BarChart3 className="w-4 h-4" />, color: "text-green-400 bg-green-500/10" },
              { label: "Templates", value: (stats as any).totalTemplates ?? 0, icon: <BarChart3 className="w-4 h-4" />, color: "text-orange-400 bg-orange-500/10" },
            ].map((s) => (
              <Card key={s.label} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">{s.label}</span>
                    <div className={`w-7 h-7 rounded-md flex items-center justify-center ${s.color}`}>
                      {s.icon}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Table utilisateurs */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Liste des utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => <div key={i} className="h-14 rounded-lg bg-muted/30 animate-pulse" />)}
              </div>
            ) : (
              <div className="space-y-2">
                {users?.map((user: any) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/50 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full brand-gradient flex items-center justify-center text-white font-semibold text-sm">
                        {user.name?.charAt(0).toUpperCase() ?? "?"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{user.name ?? "—"}</p>
                        <p className="text-xs text-muted-foreground">{user.email ?? "—"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground hidden sm:block">
                        {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                      <Badge
                        className={
                          user.role === "admin"
                            ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                            : "bg-muted/50 text-muted-foreground border-border"
                        }
                      >
                        {user.role === "admin" ? (
                          <><Shield className="w-3 h-3 mr-1" />Admin</>
                        ) : (
                          <><User className="w-3 h-3 mr-1" />Utilisateur</>
                        )}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs text-muted-foreground hover:text-foreground h-7 px-2"
                        onClick={() =>
                          promoteAdminMutation.mutate({
                            userId: user.id,
                            role: user.role === "admin" ? "user" : "admin",
                          })
                        }
                      >
                        {user.role === "admin" ? "Rétrograder" : "Promouvoir"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
