export type Language = "fr" | "en" | "es" | "zh";

export const translations = {
  fr: {
    header: {
      title: "ADNEO",
      subtitle: "Premium Domain Finder",
      features: {
        fast: "Ultra rapide",
        verified: "Résultats vérifiés",
      },
    },
    hero: {
      title: "Trouvez des domaines",
      titleHighlight: "premium",
      titleEnd: "disponibles",
      subtitle: "Génération intelligente • Vérification multi-extensions • Résultats disponibles uniquement",
      badges: {
        extensions: "50+ extensions",
        speed: "< 60 secondes",
        available: "100% disponibles",
      },
    },
    search: {
      placeholder: "ex: neo finance, ai fitness, secure vault...",
      placeholderBatch: "Entrez un mot par ligne\nex: vault\nneo\nfinance",
      button: "Rechercher",
      buttonLoading: "Recherche...",
      modes: {
        smart: "Smart Mode",
        exact: "Exact Match",
        batch: "Batch Mode",
      },
    },
    filters: {
      title: "Filtres avancés",
      tabs: {
        format: "Format",
        extensions: "Extensions",
        branding: "Branding",
        seo: "SEO",
        business: "Business",
      },
      format: {
        length: "Longueur: {min} - {max} caractères",
        min: "Min",
        max: "Max",
        allowHyphens: "Autoriser les tirets",
        allowDigits: "Autoriser les chiffres",
      },
      extensions: {
        quickCategories: "Catégories rapides",
        selected: "Extensions sélectionnées ({count})",
        all: "Toutes les extensions",
      },
      branding: {
        minScore: "Score de brandabilité minimum: {score}/30",
        style: "Style",
        styleAll: "Tous les styles",
      },
      business: {
        category: "Catégorie",
        categoryAll: "Toutes les catégories",
        tone: "Ton",
        toneAll: "Tous les tons",
      },
      seo: {
        info: "Les filtres SEO seront appliqués automatiquement selon les mots-clés de recherche.",
      },
    },
    progress: {
      generating: "Génération des idées...",
      normalizing: "Normalisation...",
      checking: "Vérification de disponibilité...",
      scoring: "Calcul des scores...",
      filtering: "Filtrage...",
      done: "Terminé",
      inProgress: "En cours...",
      generated: "idées générées",
      unique: "uniques",
      checked: "Vérifiés",
      extensions: "Extensions",
      available: "Disponibles",
    },
    results: {
      title: "{count} domaine{plural} disponible{plural}",
      subtitle: "Tous vérifiés et prêts à l'achat",
      empty: "Commencez une recherche pour trouver des domaines premium disponibles",
      emptyFiltered: "Aucun domaine disponible trouvé. Essayez d'autres mots-clés ou ajustez les filtres.",
      sort: {
        bestMatch: "Meilleur match",
        shortest: "Plus court",
        highestScore: "Score le plus élevé",
        mostPremium: "Plus premium",
        keywordStrongest: "Meilleur SEO",
      },
      export: "Export CSV",
      buy: "Acheter sur GoDaddy",
      copy: "Copier",
      copied: "Copié !",
      favorite: "Ajouter aux favoris",
      score: "score",
      brandability: "Brandability",
      pronounceability: "Pronounceability",
      seoFit: "SEO Fit",
      length: "Length",
    },
  },
  en: {
    header: {
      title: "ADNEO",
      subtitle: "Premium Domain Finder",
      features: {
        fast: "Ultra fast",
        verified: "Verified results",
      },
    },
    hero: {
      title: "Find",
      titleHighlight: "premium",
      titleEnd: "available domains",
      subtitle: "Smart generation • Multi-extension verification • Available results only",
      badges: {
        extensions: "50+ extensions",
        speed: "< 60 seconds",
        available: "100% available",
      },
    },
    search: {
      placeholder: "ex: neo finance, ai fitness, secure vault...",
      placeholderBatch: "Enter one word per line\nex: vault\nneo\nfinance",
      button: "Search",
      buttonLoading: "Searching...",
      modes: {
        smart: "Smart Mode",
        exact: "Exact Match",
        batch: "Batch Mode",
      },
    },
    filters: {
      title: "Advanced Filters",
      tabs: {
        format: "Format",
        extensions: "Extensions",
        branding: "Branding",
        seo: "SEO",
        business: "Business",
      },
      format: {
        length: "Length: {min} - {max} characters",
        min: "Min",
        max: "Max",
        allowHyphens: "Allow hyphens",
        allowDigits: "Allow digits",
      },
      extensions: {
        quickCategories: "Quick categories",
        selected: "Selected extensions ({count})",
        all: "All extensions",
      },
      branding: {
        minScore: "Minimum brandability score: {score}/30",
        style: "Style",
        styleAll: "All styles",
      },
      business: {
        category: "Category",
        categoryAll: "All categories",
        tone: "Tone",
        toneAll: "All tones",
      },
      seo: {
        info: "SEO filters will be applied automatically based on search keywords.",
      },
    },
    progress: {
      generating: "Generating ideas...",
      normalizing: "Normalizing...",
      checking: "Checking availability...",
      scoring: "Calculating scores...",
      filtering: "Filtering...",
      done: "Done",
      inProgress: "In progress...",
      generated: "ideas generated",
      unique: "unique",
      checked: "Checked",
      extensions: "Extensions",
      available: "Available",
    },
    results: {
      title: "{count} available domain{plural}",
      subtitle: "All verified and ready to purchase",
      empty: "Start a search to find available premium domains",
      emptyFiltered: "No available domains found. Try other keywords or adjust filters.",
      sort: {
        bestMatch: "Best match",
        shortest: "Shortest",
        highestScore: "Highest score",
        mostPremium: "Most premium",
        keywordStrongest: "Best SEO",
      },
      export: "Export CSV",
      buy: "Buy on GoDaddy",
      copy: "Copy",
      copied: "Copied!",
      favorite: "Add to favorites",
      score: "score",
      brandability: "Brandability",
      pronounceability: "Pronounceability",
      seoFit: "SEO Fit",
      length: "Length",
    },
  },
  es: {
    header: {
      title: "ADNEO",
      subtitle: "Buscador de Dominios Premium",
      features: {
        fast: "Ultra rápido",
        verified: "Resultados verificados",
      },
    },
    hero: {
      title: "Encuentra dominios",
      titleHighlight: "premium",
      titleEnd: "disponibles",
      subtitle: "Generación inteligente • Verificación multi-extensión • Solo resultados disponibles",
      badges: {
        extensions: "50+ extensiones",
        speed: "< 60 segundos",
        available: "100% disponibles",
      },
    },
    search: {
      placeholder: "ej: neo finance, ai fitness, secure vault...",
      placeholderBatch: "Ingrese una palabra por línea\nej: vault\nneo\nfinance",
      button: "Buscar",
      buttonLoading: "Buscando...",
      modes: {
        smart: "Modo Inteligente",
        exact: "Coincidencia Exacta",
        batch: "Modo Lote",
      },
    },
    filters: {
      title: "Filtros Avanzados",
      tabs: {
        format: "Formato",
        extensions: "Extensiones",
        branding: "Marca",
        seo: "SEO",
        business: "Negocio",
      },
      format: {
        length: "Longitud: {min} - {max} caracteres",
        min: "Mín",
        max: "Máx",
        allowHyphens: "Permitir guiones",
        allowDigits: "Permitir dígitos",
      },
      extensions: {
        quickCategories: "Categorías rápidas",
        selected: "Extensiones seleccionadas ({count})",
        all: "Todas las extensiones",
      },
      branding: {
        minScore: "Puntuación mínima de marca: {score}/30",
        style: "Estilo",
        styleAll: "Todos los estilos",
      },
      business: {
        category: "Categoría",
        categoryAll: "Todas las categorías",
        tone: "Tono",
        toneAll: "Todos los tonos",
      },
      seo: {
        info: "Los filtros SEO se aplicarán automáticamente según las palabras clave de búsqueda.",
      },
    },
    progress: {
      generating: "Generando ideas...",
      normalizing: "Normalizando...",
      checking: "Verificando disponibilidad...",
      scoring: "Calculando puntuaciones...",
      filtering: "Filtrando...",
      done: "Completado",
      inProgress: "En progreso...",
      generated: "ideas generadas",
      unique: "únicas",
      checked: "Verificados",
      extensions: "Extensiones",
      available: "Disponibles",
    },
    results: {
      title: "{count} dominio{plural} disponible{plural}",
      subtitle: "Todos verificados y listos para comprar",
      empty: "Inicie una búsqueda para encontrar dominios premium disponibles",
      emptyFiltered: "No se encontraron dominios disponibles. Pruebe con otras palabras clave o ajuste los filtros.",
      sort: {
        bestMatch: "Mejor coincidencia",
        shortest: "Más corto",
        highestScore: "Puntuación más alta",
        mostPremium: "Más premium",
        keywordStrongest: "Mejor SEO",
      },
      export: "Exportar CSV",
      buy: "Comprar en GoDaddy",
      copy: "Copiar",
      copied: "¡Copiado!",
      favorite: "Agregar a favoritos",
      score: "puntuación",
      brandability: "Marca",
      pronounceability: "Pronunciabilidad",
      seoFit: "Ajuste SEO",
      length: "Longitud",
    },
  },
  zh: {
    header: {
      title: "ADNEO",
      subtitle: "高级域名查找器",
      features: {
        fast: "超快",
        verified: "已验证结果",
      },
    },
    hero: {
      title: "查找",
      titleHighlight: "高级",
      titleEnd: "可用域名",
      subtitle: "智能生成 • 多扩展验证 • 仅显示可用结果",
      badges: {
        extensions: "50+ 扩展名",
        speed: "< 60 秒",
        available: "100% 可用",
      },
    },
    search: {
      placeholder: "例如：neo finance, ai fitness, secure vault...",
      placeholderBatch: "每行输入一个词\n例如：vault\nneo\nfinance",
      button: "搜索",
      buttonLoading: "搜索中...",
      modes: {
        smart: "智能模式",
        exact: "精确匹配",
        batch: "批量模式",
      },
    },
    filters: {
      title: "高级筛选",
      tabs: {
        format: "格式",
        extensions: "扩展名",
        branding: "品牌",
        seo: "SEO",
        business: "商业",
      },
      format: {
        length: "长度：{min} - {max} 个字符",
        min: "最小",
        max: "最大",
        allowHyphens: "允许连字符",
        allowDigits: "允许数字",
      },
      extensions: {
        quickCategories: "快速类别",
        selected: "已选扩展名 ({count})",
        all: "所有扩展名",
      },
      branding: {
        minScore: "最低品牌评分：{score}/30",
        style: "风格",
        styleAll: "所有风格",
      },
      business: {
        category: "类别",
        categoryAll: "所有类别",
        tone: "语调",
        toneAll: "所有语调",
      },
      seo: {
        info: "SEO筛选将根据搜索关键词自动应用。",
      },
    },
    progress: {
      generating: "生成想法...",
      normalizing: "标准化...",
      checking: "检查可用性...",
      scoring: "计算分数...",
      filtering: "筛选...",
      done: "完成",
      inProgress: "进行中...",
      generated: "个想法已生成",
      unique: "个唯一",
      checked: "已检查",
      extensions: "扩展名",
      available: "可用",
    },
    results: {
      title: "{count} 个可用域名",
      subtitle: "全部已验证并准备购买",
      empty: "开始搜索以查找可用的高级域名",
      emptyFiltered: "未找到可用域名。尝试其他关键词或调整筛选条件。",
      sort: {
        bestMatch: "最佳匹配",
        shortest: "最短",
        highestScore: "最高分",
        mostPremium: "最高级",
        keywordStrongest: "最佳SEO",
      },
      export: "导出CSV",
      buy: "在GoDaddy购买",
      copy: "复制",
      copied: "已复制！",
      favorite: "添加到收藏",
      score: "分数",
      brandability: "品牌性",
      pronounceability: "可读性",
      seoFit: "SEO匹配",
      length: "长度",
    },
  },
} as const;

export function getLanguage(): Language {
  if (typeof window === "undefined") return "en";
  
  const browserLang = navigator.language || navigator.languages?.[0] || "en";
  const langCode = browserLang.split("-")[0].toLowerCase();
  
  if (langCode === "fr") return "fr";
  if (langCode === "es") return "es";
  if (langCode === "zh") return "zh";
  return "en";
}

export function t(key: string, lang: Language = "en", params?: Record<string, string | number>): string {
  const keys = key.split(".");
  let value: any = translations[lang];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  if (typeof value !== "string") {
    // Fallback to English
    value = translations.en;
    for (const k of keys) {
      value = value?.[k];
    }
  }
  
  if (typeof value === "string" && params) {
    return value.replace(/\{(\w+)\}/g, (_, key) => String(params[key] || ""));
  }
  
  return value || key;
}
