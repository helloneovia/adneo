import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";
import {
  Zap,
  Globe,
  Shield,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Bot,
  Clock,
  Layers,
} from "lucide-react";
import { Link } from "wouter";

const FEATURES = [
  {
    icon: <Globe className="w-6 h-6" />,
    title: "5 sites simultanément",
    desc: "Déposez vos annonces sur ParuVendu, Topannonces, Entreparticuliers, Vivastreet et PAP en un seul clic.",
  },
  {
    icon: <Bot className="w-6 h-6" />,
    title: "Automatisation totale",
    desc: "Intégration Capmonster pour les CAPTCHAs et 5sim pour les vérifications SMS. Zéro intervention manuelle.",
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: "Templates réutilisables",
    desc: "Créez des modèles d'annonces avec variables dynamiques. Réutilisez-les en quelques secondes.",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Suivi en temps réel",
    desc: "Tableau de bord avec statut détaillé par site : en cours, succès, échec. Logs complets disponibles.",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Gain de temps massif",
    desc: "Ce qui prenait 2 heures se fait en 2 minutes. Concentrez-vous sur votre activité, pas sur la saisie.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Sécurisé & privé",
    desc: "Vos clés API sont chiffrées. Vos données restent confidentielles. Inscription 100% gratuite.",
  },
];

const SITES = [
  { name: "ParuVendu.fr", color: "bg-orange-500/20 text-orange-300 border-orange-500/30" },
  { name: "Topannonces.fr", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  { name: "Entreparticuliers", color: "bg-green-500/20 text-green-300 border-green-500/30" },
  { name: "Vivastreet.com", color: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  { name: "PAP.fr", color: "bg-red-500/20 text-red-300 border-red-500/30" },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  // Compute login URL once, safely — getLoginUrl() returns "/" if env vars are missing
  const loginUrl = useMemo(() => getLoginUrl(), []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ─── Navbar ──────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg brand-gradient flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">ADNEO</span>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="sm" className="brand-gradient text-white border-0 hover:opacity-90">
                  Tableau de bord <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            ) : (
              <>
                <a href={loginUrl}>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    Connexion
                  </Button>
                </a>
                <a href={loginUrl}>
                  <Button size="sm" className="brand-gradient text-white border-0 hover:opacity-90">
                    Inscription gratuite
                  </Button>
                </a>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ─── Hero ────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-4">
        <div className="container text-center max-w-4xl mx-auto">
          <Badge
            variant="outline"
            className="mb-6 border-primary/40 text-primary bg-primary/10 px-4 py-1.5 text-sm font-medium"
          >
            <Zap className="w-3.5 h-3.5 mr-1.5" />
            Automatisation de petites annonces
          </Badge>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Déposez vos annonces{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, oklch(0.62 0.22 270), oklch(0.65 0.18 280))",
              }}
            >
              partout en un clic
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            ADNEO automatise le dépôt de vos annonces sur les 5 plus grands sites français.
            Capmonster résout les CAPTCHAs, 5sim gère les SMS. Vous n'avez plus rien à faire.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href={loginUrl}>
              <Button
                size="lg"
                className="brand-gradient text-white border-0 hover:opacity-90 px-8 py-6 text-base font-semibold shadow-lg shadow-primary/25"
              >
                Commencer gratuitement <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
            <p className="text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 inline mr-1 text-green-400" />
              Inscription gratuite · Aucune carte requise
            </p>
          </div>
        </div>

        {/* Sites badges */}
        <div className="container max-w-3xl mx-auto mt-16">
          <p className="text-center text-sm text-muted-foreground mb-4 uppercase tracking-wider font-medium">
            Sites supportés
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {SITES.map((site) => (
              <span
                key={site.name}
                className={`px-4 py-2 rounded-full border text-sm font-medium ${site.color}`}
              >
                {site.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ────────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-border/50">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Une plateforme complète pour automatiser votre présence sur les sites de petites annonces.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="glass-card rounded-xl p-6 hover:border-primary/40 transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg brand-gradient flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-border/50">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Comment ça marche ?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Créez votre annonce",
                desc: "Remplissez le formulaire une seule fois : titre, description, prix, photos, contact.",
              },
              {
                step: "02",
                title: "Sélectionnez les sites",
                desc: "Cochez les plateformes cibles. ADNEO gère CAPTCHAs et SMS automatiquement.",
              },
              {
                step: "03",
                title: "Suivez en temps réel",
                desc: "Consultez le statut de chaque dépôt avec logs détaillés. Succès ou erreur, vous savez tout.",
              },
            ].map((step) => (
              <div key={step.step} className="text-center">
                <div
                  className="w-16 h-16 rounded-2xl brand-gradient flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl shadow-lg shadow-primary/25"
                >
                  {step.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-border/50">
        <div className="container max-w-2xl mx-auto text-center">
          <div className="glass-card rounded-2xl p-10">
            <h2 className="text-3xl font-bold mb-4">Prêt à automatiser ?</h2>
            <p className="text-muted-foreground mb-8">
              Rejoignez ADNEO gratuitement. Configurez vos clés API Capmonster et 5sim, et déposez
              votre première annonce en moins de 5 minutes.
            </p>
            <a href={loginUrl}>
              <Button
                size="lg"
                className="brand-gradient text-white border-0 hover:opacity-90 px-10 py-6 text-base font-semibold shadow-lg shadow-primary/25"
              >
                Créer mon compte gratuit <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-border/50 py-8">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md brand-gradient flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-sm">ADNEO</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ADNEO — Automatisateur d'annonces multi-sites
          </p>
        </div>
      </footer>
    </div>
  );
}
