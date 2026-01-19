// Extensions TLD par catégorie
export const TLD_CATEGORIES = {
  top: [".com", ".net", ".org", ".co"],
  tech: [".io", ".ai", ".app", ".dev", ".xyz", ".tech", ".cloud", ".site", ".online"],
  business: [".store", ".shop", ".biz", ".company", ".inc", ".agency", ".solutions", ".services"],
  creative: [".studio", ".design", ".media", ".live"],
  security: [".security", ".network", ".systems"],
  web3: [".crypto", ".wallet"],
  country: [".fr", ".de", ".uk", ".es", ".it", ".eu", ".ca", ".us", ".ch", ".be"],
} as const;

export const ALL_TLDS = Object.values(TLD_CATEGORIES).flat();

// Préfixes premium
export const PREMIUM_PREFIXES = [
  "get", "try", "go", "use", "my", "join", "app", "the", "hey", "make", "build", "create",
  "find", "discover", "explore", "launch", "start", "run", "do", "be", "we", "you", "our",
];

// Suffixes premium
export const PREMIUM_SUFFIXES = [
  "hub", "labs", "studio", "cloud", "ai", "io", "pay", "stack", "base", "flow", "link",
  "app", "pro", "plus", "max", "prime", "core", "edge", "zen", "zen", "zen", "zen",
  "space", "zone", "world", "global", "tech", "dev", "code", "build", "make", "do",
];

// Catégories business
export const BUSINESS_CATEGORIES = [
  "SaaS", "Finance", "Health", "Ecom", "Crypto", "DevTools", "Marketing",
  "Real Estate", "Education", "Food", "Travel", "Fashion", "Gaming",
] as const;

// Styles de marque
export const BRAND_STYLES = [
  "Startup", "Corporate", "Fun", "Luxury", "Minimal",
] as const;

// Tons
export const TONES = [
  "sérieux", "premium", "casual",
] as const;
