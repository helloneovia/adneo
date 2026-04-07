import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

import { useTranslation } from "react-i18next";
import { VideoBackground } from "@/components/home/VideoBackground";
import { HeroNav } from "@/components/home/HeroNav";
import { HeroContent } from "@/components/home/HeroContent";

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
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="relative w-full h-[600px] overflow-hidden flex flex-col">
        <VideoBackground url="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260329_050842_be71947f-f16e-4a14-810c-06e83d23ddb5.mp4" />
        <HeroNav />
        <div className="flex-1 flex flex-col justify-center mt-[60px]">
          <HeroContent />
        </div>
      </div>
      
      <div className="flex-1 relative z-20 bg-background pt-8 pb-20">

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
            <Link href="/register">
              <Button
                size="lg"
                className="brand-gradient text-white border-0 hover:opacity-90 px-10 py-6 text-base font-semibold shadow-lg shadow-primary/25"
              >
                Créer mon compte gratuit <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
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
    </div>
  );
}
