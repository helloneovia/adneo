export const TLD_PACKS = {
  top: [".com", ".net", ".org", ".co"],
  tech: [
    ".io",
    ".ai",
    ".app",
    ".dev",
    ".xyz",
    ".tech",
    ".cloud",
    ".site",
    ".online",
    ".software",
  ],
  business: [
    ".store",
    ".shop",
    ".biz",
    ".company",
    ".inc",
    ".agency",
    ".solutions",
    ".services",
    ".capital",
  ],
  creative: [".studio", ".design", ".media", ".live", ".vision"],
  security: [".security", ".network", ".systems", ".protection"],
  web3: [".eth", ".crypto", ".wallet", ".dao"],
  local: [".fr", ".de", ".uk", ".es", ".it", ".eu", ".ca", ".us", ".ch", ".be"],
};

export const PACK_LABELS: Record<keyof typeof TLD_PACKS, string> = {
  top: "Top extensions",
  tech: "AI / Tech",
  business: "Business",
  creative: "Creative / Media",
  security: "Security / Infra",
  web3: "Web3",
  local: "Local / Country",
};

export const ALL_TLDS = Array.from(
  new Set(Object.values(TLD_PACKS).flat())
).sort();
