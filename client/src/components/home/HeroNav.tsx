import { useTranslation } from "react-i18next";
import { Link } from "wouter";

export function HeroNav() {
  const { t } = useTranslation();

  return (
    <nav className="relative z-10 w-full px-[120px] py-[16px] flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/">
          <span className="font-['Schibsted_Grotesk'] font-semibold text-[24px] tracking-[-1.44px] text-white cursor-pointer hover:opacity-80 transition-opacity">
            Logoipsum
          </span>
        </Link>
      </div>

      <div className="hidden lg:flex items-center gap-8 font-['Schibsted_Grotesk'] font-medium text-[16px] tracking-[-0.2px] text-white">
        <a href="#platform" className="hover:opacity-80 transition-opacity">{t("nav.platform")}</a>
        <button className="flex items-center gap-1 hover:opacity-80 transition-opacity">
          {t("nav.features")}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <a href="#projects" className="hover:opacity-80 transition-opacity">{t("nav.projects")}</a>
        <a href="#community" className="hover:opacity-80 transition-opacity">{t("nav.community")}</a>
        <a href="#contact" className="hover:opacity-80 transition-opacity">{t("nav.contact")}</a>
      </div>

      <div className="flex items-center gap-4">
        <button className="w-[82px] h-10 bg-transparent text-white font-['Schibsted_Grotesk'] font-medium text-[16px] tracking-[-0.2px] hover:opacity-80 transition-opacity">
          {t("nav.signup")}
        </button>
        <button className="w-[101px] h-10 bg-black text-white font-['Schibsted_Grotesk'] font-medium text-[16px] tracking-[-0.2px] rounded hover:bg-black/90 transition-colors">
          {t("nav.login")}
        </button>
      </div>
    </nav>
  );
}
