import { useTranslation } from "react-i18next";
import { Sparkles, Paperclip, Mic, Search, ChevronUp, Star } from "lucide-react";

export function HeroContent() {
  const { t } = useTranslation();

  return (
    <div className="relative z-10 w-full max-w-7xl mx-auto px-[120px] flex flex-col items-center mt-[-50px]">
      
      {/* Badge Component */}
      <div className="flex items-center bg-[#f8f8f8] rounded-full p-1 pr-4 shadow-sm mb-[34px]">
        <div className="flex items-center justify-center bg-[#0e1311] text-white rounded-full px-3 py-1 mr-3 h-7 gap-1">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span className="font-['Inter'] font-regular text-[14px] leading-none">{t("hero.badge_new")}</span>
        </div>
        <span className="font-['Inter'] font-regular text-[14px] text-[#505050]">
          {t("hero.discover_possible")}
        </span>
      </div>

      {/* Main Headline */}
      <h1 className="font-['Fustat'] font-bold text-[80px] tracking-[-4.8px] leading-none text-black text-center mb-[34px]">
        {t("hero.title")}
      </h1>

      {/* Subtitle */}
      <p className="font-['Fustat'] font-medium text-[20px] tracking-[-0.4px] text-[#505050] text-center w-[542px] max-w-[736px] mb-[44px]">
        {t("hero.subtitle")}
      </p>

      {/* Search Input Box */}
      <div className="w-[728px] max-w-full h-[200px] rounded-[18px] hero-glass p-5 flex flex-col justify-between">
        {/* Top row */}
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-3">
            <span className="font-['Schibsted_Grotesk'] font-medium text-[12px] text-white">
              {t("hero.credits_used", { used: 60, total: 450 })}
            </span>
            <button className="bg-[rgba(90,225,76,0.89)] text-black font-['Schibsted_Grotesk'] font-medium text-[12px] px-3 py-1 rounded-full cursor-pointer hover:bg-opacity-80">
              {t("hero.upgrade")}
            </button>
          </div>
          <div className="flex items-center gap-1.5 text-white bg-black/30 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-['Schibsted_Grotesk'] font-medium text-[12px]">
              {t("hero.powered_by")}
            </span>
          </div>
        </div>

        {/* Main input area */}
        <div className="bg-white rounded-[12px] shadow flex items-center p-2 relative h-[60px] my-auto">
          <input 
            type="text" 
            placeholder={t("hero.placeholder")}
            className="flex-1 bg-transparent border-none outline-none text-[16px] text-black font-['Inter'] px-3 placeholder-[rgba(0,0,0,0.6)]"
          />
          <button className="w-[36px] h-[36px] bg-black text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors">
            <ChevronUp className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom row */}
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 bg-[#f8f8f8] hover:bg-[#eaeaea] text-[#505050] text-[12px] font-['Schibsted_Grotesk'] font-medium px-3 py-1.5 rounded-[6px] transition-colors">
              <Paperclip className="w-3.5 h-3.5" />
              {t("hero.btn_attach")}
            </button>
            <button className="flex items-center gap-1.5 bg-[#f8f8f8] hover:bg-[#eaeaea] text-[#505050] text-[12px] font-['Schibsted_Grotesk'] font-medium px-3 py-1.5 rounded-[6px] transition-colors">
              <Mic className="w-3.5 h-3.5" />
              {t("hero.btn_voice")}
            </button>
            <button className="flex items-center gap-1.5 bg-[#f8f8f8] hover:bg-[#eaeaea] text-[#505050] text-[12px] font-['Schibsted_Grotesk'] font-medium px-3 py-1.5 rounded-[6px] transition-colors">
              <Search className="w-3.5 h-3.5" />
              {t("hero.btn_prompts")}
            </button>
          </div>
          <div className="text-[#505050] font-['Schibsted_Grotesk'] font-medium text-[12px]">
            0/3,000
          </div>
        </div>
      </div>
      
    </div>
  );
}
