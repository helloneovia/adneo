export type Language = "fr" | "en" | "es" | "zh" | "de" | "it" | "pt" | "nl" | "ja" | "ko" | "ar" | "hi" | "ru" | "tr";

export const SUPPORTED_LANGUAGES: Language[] = ["fr", "en", "es", "zh", "de", "it", "pt", "nl", "ja", "ko", "ar", "hi", "ru", "tr"];

const baseTranslations = {
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

export const translations = {
  ...baseTranslations,
  de: {
    header: { title: "ADNEO", subtitle: "Premium-Domain-Finder", features: { fast: "Ultraschnell", verified: "Verifizierte Ergebnisse" } },
    hero: { title: "Finde", titleHighlight: "Premium", titleEnd: "verfügbare Domains", subtitle: "Intelligente Generierung • Multi-Endungs-Prüfung • Nur verfügbare Ergebnisse", badges: { extensions: "50+ Endungen", speed: "< 60 Sekunden", available: "100% verfügbar" } },
    search: { placeholder: "z. B.: neo finance, ai fitness, secure vault...", placeholderBatch: "Ein Wort pro Zeile eingeben\nz. B.: vault\nneo\nfinance", button: "Suchen", buttonLoading: "Suche...", modes: { smart: "Smart-Modus", exact: "Exakte Übereinstimmung", batch: "Batch-Modus" } },
    filters: { title: "Erweiterte Filter", tabs: { format: "Format", extensions: "Endungen", branding: "Branding", seo: "SEO", business: "Business" }, format: { length: "Länge: {min} - {max} Zeichen", min: "Min", max: "Max", allowHyphens: "Bindestriche erlauben", allowDigits: "Ziffern erlauben" }, extensions: { quickCategories: "Schnellkategorien", selected: "Ausgewählte Endungen ({count})", all: "Alle Endungen" }, branding: { minScore: "Mindest-Branding-Score: {score}/30", style: "Stil", styleAll: "Alle Stile" }, business: { category: "Kategorie", categoryAll: "Alle Kategorien", tone: "Ton", toneAll: "Alle Töne" }, seo: { info: "SEO-Filter werden automatisch anhand der Suchbegriffe angewendet." } },
    progress: { generating: "Ideen werden generiert...", normalizing: "Normalisieren...", checking: "Verfügbarkeit wird geprüft...", scoring: "Scores werden berechnet...", filtering: "Filtern...", done: "Fertig", inProgress: "In Bearbeitung...", generated: "Ideen generiert", unique: "einzigartig", checked: "Geprüft", extensions: "Endungen", available: "Verfügbar" },
    results: { title: "{count} verfügbare Domain{plural}", subtitle: "Alle verifiziert und sofort kaufbar", empty: "Starte eine Suche, um verfügbare Premium-Domains zu finden", emptyFiltered: "Keine verfügbare Domain gefunden. Versuche andere Keywords oder passe die Filter an.", sort: { bestMatch: "Beste Übereinstimmung", shortest: "Kürzeste", highestScore: "Höchster Score", mostPremium: "Am exklusivsten", keywordStrongest: "Bestes SEO" }, export: "CSV exportieren", buy: "Bei GoDaddy kaufen", copy: "Kopieren", copied: "Kopiert!", favorite: "Zu Favoriten", score: "Score", brandability: "Markenfähigkeit", pronounceability: "Aussprechbarkeit", seoFit: "SEO-Fit", length: "Länge" },
  },
  it: {
    header: { title: "ADNEO", subtitle: "Ricerca Domini Premium", features: { fast: "Ultra veloce", verified: "Risultati verificati" } },
    hero: { title: "Trova", titleHighlight: "domini premium", titleEnd: "disponibili", subtitle: "Generazione intelligente • Verifica multi-estensione • Solo risultati disponibili", badges: { extensions: "50+ estensioni", speed: "< 60 secondi", available: "100% disponibili" } },
    search: { placeholder: "es: neo finance, ai fitness, secure vault...", placeholderBatch: "Inserisci una parola per riga\nes: vault\nneo\nfinance", button: "Cerca", buttonLoading: "Ricerca...", modes: { smart: "Modalità Smart", exact: "Corrispondenza esatta", batch: "Modalità Batch" } },
    filters: { title: "Filtri avanzati", tabs: { format: "Formato", extensions: "Estensioni", branding: "Branding", seo: "SEO", business: "Business" }, format: { length: "Lunghezza: {min} - {max} caratteri", min: "Min", max: "Max", allowHyphens: "Consenti trattini", allowDigits: "Consenti cifre" }, extensions: { quickCategories: "Categorie rapide", selected: "Estensioni selezionate ({count})", all: "Tutte le estensioni" }, branding: { minScore: "Punteggio minimo brandability: {score}/30", style: "Stile", styleAll: "Tutti gli stili" }, business: { category: "Categoria", categoryAll: "Tutte le categorie", tone: "Tono", toneAll: "Tutti i toni" }, seo: { info: "I filtri SEO verranno applicati automaticamente in base alle parole chiave di ricerca." } },
    progress: { generating: "Generazione idee...", normalizing: "Normalizzazione...", checking: "Verifica disponibilità...", scoring: "Calcolo punteggi...", filtering: "Filtro...", done: "Completato", inProgress: "In corso...", generated: "idee generate", unique: "uniche", checked: "Verificate", extensions: "Estensioni", available: "Disponibili" },
    results: { title: "{count} dominio{plural} disponibile{plural}", subtitle: "Tutti verificati e pronti all'acquisto", empty: "Avvia una ricerca per trovare domini premium disponibili", emptyFiltered: "Nessun dominio disponibile trovato. Prova altre parole chiave o modifica i filtri.", sort: { bestMatch: "Migliore corrispondenza", shortest: "Più corto", highestScore: "Punteggio più alto", mostPremium: "Più premium", keywordStrongest: "Miglior SEO" }, export: "Esporta CSV", buy: "Acquista su GoDaddy", copy: "Copia", copied: "Copiato!", favorite: "Aggiungi ai preferiti", score: "punteggio", brandability: "Brandabilità", pronounceability: "Pronunciabilità", seoFit: "Compatibilità SEO", length: "Lunghezza" },
  },
  pt: {
    header: { title: "ADNEO", subtitle: "Buscador de Domínios Premium", features: { fast: "Ultra rápido", verified: "Resultados verificados" } },
    hero: { title: "Encontre domínios", titleHighlight: "premium", titleEnd: "disponíveis", subtitle: "Geração inteligente • Verificação multi-extensão • Apenas resultados disponíveis", badges: { extensions: "50+ extensões", speed: "< 60 segundos", available: "100% disponíveis" } },
    search: { placeholder: "ex: neo finance, ai fitness, secure vault...", placeholderBatch: "Digite uma palavra por linha\nex: vault\nneo\nfinance", button: "Pesquisar", buttonLoading: "Pesquisando...", modes: { smart: "Modo Smart", exact: "Correspondência exata", batch: "Modo em lote" } },
    filters: { title: "Filtros avançados", tabs: { format: "Formato", extensions: "Extensões", branding: "Marca", seo: "SEO", business: "Negócio" }, format: { length: "Comprimento: {min} - {max} caracteres", min: "Mín", max: "Máx", allowHyphens: "Permitir hífens", allowDigits: "Permitir dígitos" }, extensions: { quickCategories: "Categorias rápidas", selected: "Extensões selecionadas ({count})", all: "Todas as extensões" }, branding: { minScore: "Pontuação mínima de marca: {score}/30", style: "Estilo", styleAll: "Todos os estilos" }, business: { category: "Categoria", categoryAll: "Todas as categorias", tone: "Tom", toneAll: "Todos os tons" }, seo: { info: "Os filtros de SEO serão aplicados automaticamente com base nas palavras-chave de pesquisa." } },
    progress: { generating: "Gerando ideias...", normalizing: "Normalizando...", checking: "Verificando disponibilidade...", scoring: "Calculando pontuações...", filtering: "Filtrando...", done: "Concluído", inProgress: "Em andamento...", generated: "ideias geradas", unique: "únicas", checked: "Verificados", extensions: "Extensões", available: "Disponíveis" },
    results: { title: "{count} domínio{plural} disponível{plural}", subtitle: "Todos verificados e prontos para compra", empty: "Inicie uma pesquisa para encontrar domínios premium disponíveis", emptyFiltered: "Nenhum domínio disponível encontrado. Tente outras palavras-chave ou ajuste os filtros.", sort: { bestMatch: "Melhor correspondência", shortest: "Mais curto", highestScore: "Maior pontuação", mostPremium: "Mais premium", keywordStrongest: "Melhor SEO" }, export: "Exportar CSV", buy: "Comprar no GoDaddy", copy: "Copiar", copied: "Copiado!", favorite: "Adicionar aos favoritos", score: "pontuação", brandability: "Marca", pronounceability: "Pronunciabilidade", seoFit: "Ajuste SEO", length: "Comprimento" },
  },
  nl: {
    header: { title: "ADNEO", subtitle: "Premium Domeinzoeker", features: { fast: "Supersnel", verified: "Geverifieerde resultaten" } },
    hero: { title: "Vind", titleHighlight: "premium", titleEnd: "beschikbare domeinen", subtitle: "Slimme generatie • Multi-extensie controle • Alleen beschikbare resultaten", badges: { extensions: "50+ extensies", speed: "< 60 seconden", available: "100% beschikbaar" } },
    search: { placeholder: "bijv: neo finance, ai fitness, secure vault...", placeholderBatch: "Voer één woord per regel in\nbijv: vault\nneo\nfinance", button: "Zoeken", buttonLoading: "Bezig met zoeken...", modes: { smart: "Slimme modus", exact: "Exacte match", batch: "Batchmodus" } },
    filters: { title: "Geavanceerde filters", tabs: { format: "Formaat", extensions: "Extensies", branding: "Branding", seo: "SEO", business: "Zakelijk" }, format: { length: "Lengte: {min} - {max} tekens", min: "Min", max: "Max", allowHyphens: "Koppeltekens toestaan", allowDigits: "Cijfers toestaan" }, extensions: { quickCategories: "Snelle categorieën", selected: "Geselecteerde extensies ({count})", all: "Alle extensies" }, branding: { minScore: "Minimale merk-score: {score}/30", style: "Stijl", styleAll: "Alle stijlen" }, business: { category: "Categorie", categoryAll: "Alle categorieën", tone: "Toon", toneAll: "Alle tonen" }, seo: { info: "SEO-filters worden automatisch toegepast op basis van zoekwoorden." } },
    progress: { generating: "Ideeën genereren...", normalizing: "Normaliseren...", checking: "Beschikbaarheid controleren...", scoring: "Scores berekenen...", filtering: "Filteren...", done: "Klaar", inProgress: "Bezig...", generated: "ideeën gegenereerd", unique: "uniek", checked: "Gecontroleerd", extensions: "Extensies", available: "Beschikbaar" },
    results: { title: "{count} beschikbaar domein{plural}", subtitle: "Allemaal geverifieerd en klaar om te kopen", empty: "Start een zoekopdracht om beschikbare premium domeinen te vinden", emptyFiltered: "Geen beschikbare domeinen gevonden. Probeer andere zoekwoorden of pas de filters aan.", sort: { bestMatch: "Beste match", shortest: "Kortste", highestScore: "Hoogste score", mostPremium: "Meest premium", keywordStrongest: "Beste SEO" }, export: "CSV exporteren", buy: "Kopen op GoDaddy", copy: "Kopiëren", copied: "Gekopieerd!", favorite: "Toevoegen aan favorieten", score: "score", brandability: "Merkbaarheid", pronounceability: "Uitspreekbaarheid", seoFit: "SEO-fit", length: "Lengte" },
  },
  ja: {
    header: { title: "ADNEO", subtitle: "プレミアムドメイン検索", features: { fast: "超高速", verified: "検証済み結果" } },
    hero: { title: "利用可能な", titleHighlight: "プレミアム", titleEnd: "ドメインを探す", subtitle: "スマート生成 • 複数拡張子チェック • 利用可能な結果のみ", badges: { extensions: "50以上の拡張子", speed: "60秒未満", available: "100% 利用可能" } },
    search: { placeholder: "例: neo finance, ai fitness, secure vault...", placeholderBatch: "1行に1語入力\n例: vault\nneo\nfinance", button: "検索", buttonLoading: "検索中...", modes: { smart: "スマートモード", exact: "完全一致", batch: "バッチモード" } },
    filters: { title: "高度なフィルター", tabs: { format: "形式", extensions: "拡張子", branding: "ブランディング", seo: "SEO", business: "ビジネス" }, format: { length: "長さ: {min} - {max} 文字", min: "最小", max: "最大", allowHyphens: "ハイフンを許可", allowDigits: "数字を許可" }, extensions: { quickCategories: "クイックカテゴリ", selected: "選択済み拡張子 ({count})", all: "すべての拡張子" }, branding: { minScore: "最低ブランドスコア: {score}/30", style: "スタイル", styleAll: "すべてのスタイル" }, business: { category: "カテゴリ", categoryAll: "すべてのカテゴリ", tone: "トーン", toneAll: "すべてのトーン" }, seo: { info: "SEOフィルターは検索キーワードに基づいて自動で適用されます。" } },
    progress: { generating: "アイデアを生成中...", normalizing: "正規化中...", checking: "利用可能性を確認中...", scoring: "スコア計算中...", filtering: "フィルタリング中...", done: "完了", inProgress: "処理中...", generated: "件のアイデア生成", unique: "件ユニーク", checked: "確認済み", extensions: "拡張子", available: "利用可能" },
    results: { title: "利用可能なドメイン {count} 件", subtitle: "すべて検証済みで購入可能", empty: "検索を開始して利用可能なプレミアムドメインを見つけましょう", emptyFiltered: "利用可能なドメインが見つかりません。別のキーワードを試すか、フィルターを調整してください。", sort: { bestMatch: "最適一致", shortest: "最短", highestScore: "最高スコア", mostPremium: "最もプレミアム", keywordStrongest: "最高SEO" }, export: "CSVをエクスポート", buy: "GoDaddyで購入", copy: "コピー", copied: "コピーしました！", favorite: "お気に入りに追加", score: "スコア", brandability: "ブランド性", pronounceability: "発音しやすさ", seoFit: "SEO適合", length: "長さ" },
  },
  ko: {
    header: { title: "ADNEO", subtitle: "프리미엄 도메인 찾기", features: { fast: "초고속", verified: "검증된 결과" } },
    hero: { title: "사용 가능한", titleHighlight: "프리미엄", titleEnd: "도메인 찾기", subtitle: "스마트 생성 • 다중 확장자 검증 • 사용 가능한 결과만", badges: { extensions: "50개 이상 확장자", speed: "60초 미만", available: "100% 사용 가능" } },
    search: { placeholder: "예: neo finance, ai fitness, secure vault...", placeholderBatch: "한 줄에 한 단어 입력\n예: vault\nneo\nfinance", button: "검색", buttonLoading: "검색 중...", modes: { smart: "스마트 모드", exact: "정확히 일치", batch: "배치 모드" } },
    filters: { title: "고급 필터", tabs: { format: "형식", extensions: "확장자", branding: "브랜딩", seo: "SEO", business: "비즈니스" }, format: { length: "길이: {min} - {max}자", min: "최소", max: "최대", allowHyphens: "하이픈 허용", allowDigits: "숫자 허용" }, extensions: { quickCategories: "빠른 카테고리", selected: "선택된 확장자 ({count})", all: "모든 확장자" }, branding: { minScore: "최소 브랜딩 점수: {score}/30", style: "스타일", styleAll: "모든 스타일" }, business: { category: "카테고리", categoryAll: "모든 카테고리", tone: "톤", toneAll: "모든 톤" }, seo: { info: "SEO 필터는 검색 키워드에 따라 자동 적용됩니다." } },
    progress: { generating: "아이디어 생성 중...", normalizing: "정규화 중...", checking: "사용 가능 여부 확인 중...", scoring: "점수 계산 중...", filtering: "필터링 중...", done: "완료", inProgress: "진행 중...", generated: "개 아이디어 생성", unique: "개 고유", checked: "확인됨", extensions: "확장자", available: "사용 가능" },
    results: { title: "사용 가능한 도메인 {count}개", subtitle: "모두 검증되었고 바로 구매 가능", empty: "검색을 시작해 사용 가능한 프리미엄 도메인을 찾아보세요", emptyFiltered: "사용 가능한 도메인을 찾지 못했습니다. 다른 키워드를 시도하거나 필터를 조정하세요.", sort: { bestMatch: "최적 일치", shortest: "가장 짧음", highestScore: "최고 점수", mostPremium: "가장 프리미엄", keywordStrongest: "최고 SEO" }, export: "CSV 내보내기", buy: "GoDaddy에서 구매", copy: "복사", copied: "복사됨!", favorite: "즐겨찾기에 추가", score: "점수", brandability: "브랜드 적합성", pronounceability: "발음 용이성", seoFit: "SEO 적합성", length: "길이" },
  },
  ar: {
    header: { title: "ADNEO", subtitle: "أداة البحث عن النطاقات المميزة", features: { fast: "سريع جدًا", verified: "نتائج موثقة" } },
    hero: { title: "اعثر على نطاقات", titleHighlight: "مميزة", titleEnd: "متاحة", subtitle: "توليد ذكي • تحقق متعدد الامتدادات • النتائج المتاحة فقط", badges: { extensions: "+50 امتداد", speed: "< 60 ثانية", available: "100% متاحة" } },
    search: { placeholder: "مثال: neo finance, ai fitness, secure vault...", placeholderBatch: "أدخل كلمة في كل سطر\nمثال: vault\nneo\nfinance", button: "بحث", buttonLoading: "جارٍ البحث...", modes: { smart: "الوضع الذكي", exact: "تطابق تام", batch: "وضع الدفعات" } },
    filters: { title: "فلاتر متقدمة", tabs: { format: "التنسيق", extensions: "الامتدادات", branding: "الهوية", seo: "SEO", business: "الأعمال" }, format: { length: "الطول: {min} - {max} حرفًا", min: "الحد الأدنى", max: "الحد الأقصى", allowHyphens: "السماح بشرطات", allowDigits: "السماح بالأرقام" }, extensions: { quickCategories: "فئات سريعة", selected: "الامتدادات المختارة ({count})", all: "كل الامتدادات" }, branding: { minScore: "الحد الأدنى لدرجة العلامة: {score}/30", style: "النمط", styleAll: "كل الأنماط" }, business: { category: "الفئة", categoryAll: "كل الفئات", tone: "النبرة", toneAll: "كل النبرات" }, seo: { info: "سيتم تطبيق فلاتر SEO تلقائيًا بناءً على كلمات البحث." } },
    progress: { generating: "جارٍ توليد الأفكار...", normalizing: "جارٍ التطبيع...", checking: "جارٍ التحقق من التوفر...", scoring: "جارٍ احتساب الدرجات...", filtering: "جارٍ التصفية...", done: "تم", inProgress: "قيد التنفيذ...", generated: "أفكار تم توليدها", unique: "فريدة", checked: "تم التحقق", extensions: "الامتدادات", available: "متاح" },
    results: { title: "{count} نطاق{plural} متاح{plural}", subtitle: "جميعها موثقة وجاهزة للشراء", empty: "ابدأ بحثًا للعثور على نطاقات مميزة متاحة", emptyFiltered: "لم يتم العثور على نطاقات متاحة. جرّب كلمات أخرى أو عدّل الفلاتر.", sort: { bestMatch: "أفضل تطابق", shortest: "الأقصر", highestScore: "أعلى درجة", mostPremium: "الأكثر تميزًا", keywordStrongest: "أفضل SEO" }, export: "تصدير CSV", buy: "اشترِ عبر GoDaddy", copy: "نسخ", copied: "تم النسخ!", favorite: "أضف إلى المفضلة", score: "الدرجة", brandability: "قابلية العلامة", pronounceability: "سهولة النطق", seoFit: "ملاءمة SEO", length: "الطول" },
  },
  hi: {
    header: { title: "ADNEO", subtitle: "प्रीमियम डोमेन खोजक", features: { fast: "बहुत तेज", verified: "सत्यापित परिणाम" } },
    hero: { title: "उपलब्ध", titleHighlight: "प्रीमियम", titleEnd: "डोमेन खोजें", subtitle: "स्मार्ट जनरेशन • मल्टी-एक्सटेंशन जाँच • केवल उपलब्ध परिणाम", badges: { extensions: "50+ एक्सटेंशन", speed: "< 60 सेकंड", available: "100% उपलब्ध" } },
    search: { placeholder: "उदा: neo finance, ai fitness, secure vault...", placeholderBatch: "प्रति पंक्ति एक शब्द लिखें\nउदा: vault\nneo\nfinance", button: "खोजें", buttonLoading: "खोज जारी...", modes: { smart: "स्मार्ट मोड", exact: "सटीक मिलान", batch: "बैच मोड" } },
    filters: { title: "उन्नत फ़िल्टर", tabs: { format: "फ़ॉर्मेट", extensions: "एक्सटेंशन", branding: "ब्रांडिंग", seo: "SEO", business: "बिज़नेस" }, format: { length: "लंबाई: {min} - {max} अक्षर", min: "न्यूनतम", max: "अधिकतम", allowHyphens: "हाइफ़न की अनुमति दें", allowDigits: "अंकों की अनुमति दें" }, extensions: { quickCategories: "त्वरित श्रेणियाँ", selected: "चयनित एक्सटेंशन ({count})", all: "सभी एक्सटेंशन" }, branding: { minScore: "न्यूनतम ब्रांड स्कोर: {score}/30", style: "स्टाइल", styleAll: "सभी स्टाइल" }, business: { category: "श्रेणी", categoryAll: "सभी श्रेणियाँ", tone: "टोन", toneAll: "सभी टोन" }, seo: { info: "SEO फ़िल्टर खोज कीवर्ड के आधार पर स्वतः लागू होंगे।" } },
    progress: { generating: "आइडिया बनाए जा रहे हैं...", normalizing: "सामान्यीकृत किया जा रहा है...", checking: "उपलब्धता जाँची जा रही है...", scoring: "स्कोर गणना हो रही है...", filtering: "फ़िल्टर किया जा रहा है...", done: "पूर्ण", inProgress: "प्रगति में...", generated: "आइडिया जनरेट हुए", unique: "अद्वितीय", checked: "जाँचे गए", extensions: "एक्सटेंशन", available: "उपलब्ध" },
    results: { title: "{count} उपलब्ध डोमेन{plural}", subtitle: "सभी सत्यापित और खरीद के लिए तैयार", empty: "उपलब्ध प्रीमियम डोमेन खोजने के लिए खोज शुरू करें", emptyFiltered: "कोई उपलब्ध डोमेन नहीं मिला। अन्य कीवर्ड आज़माएँ या फ़िल्टर समायोजित करें।", sort: { bestMatch: "सबसे अच्छा मिलान", shortest: "सबसे छोटा", highestScore: "सबसे उच्च स्कोर", mostPremium: "सबसे प्रीमियम", keywordStrongest: "सबसे अच्छा SEO" }, export: "CSV निर्यात", buy: "GoDaddy पर खरीदें", copy: "कॉपी", copied: "कॉपी हो गया!", favorite: "पसंदीदा में जोड़ें", score: "स्कोर", brandability: "ब्रांड योग्यता", pronounceability: "उच्चारण योग्यता", seoFit: "SEO फिट", length: "लंबाई" },
  },
  ru: {
    header: { title: "ADNEO", subtitle: "Поиск премиум-доменов", features: { fast: "Сверхбыстро", verified: "Проверенные результаты" } },
    hero: { title: "Найдите", titleHighlight: "премиальные", titleEnd: "доступные домены", subtitle: "Умная генерация • Проверка по нескольким зонам • Только доступные результаты", badges: { extensions: "50+ зон", speed: "< 60 секунд", available: "100% доступны" } },
    search: { placeholder: "напр.: neo finance, ai fitness, secure vault...", placeholderBatch: "Введите одно слово в строке\nнапр.: vault\nneo\nfinance", button: "Поиск", buttonLoading: "Идет поиск...", modes: { smart: "Умный режим", exact: "Точное совпадение", batch: "Пакетный режим" } },
    filters: { title: "Расширенные фильтры", tabs: { format: "Формат", extensions: "Зоны", branding: "Брендинг", seo: "SEO", business: "Бизнес" }, format: { length: "Длина: {min} - {max} символов", min: "Мин", max: "Макс", allowHyphens: "Разрешить дефисы", allowDigits: "Разрешить цифры" }, extensions: { quickCategories: "Быстрые категории", selected: "Выбранные зоны ({count})", all: "Все зоны" }, branding: { minScore: "Минимальный бренд-скор: {score}/30", style: "Стиль", styleAll: "Все стили" }, business: { category: "Категория", categoryAll: "Все категории", tone: "Тон", toneAll: "Все тона" }, seo: { info: "SEO-фильтры будут применены автоматически на основе ключевых слов." } },
    progress: { generating: "Генерация идей...", normalizing: "Нормализация...", checking: "Проверка доступности...", scoring: "Расчет оценок...", filtering: "Фильтрация...", done: "Готово", inProgress: "В процессе...", generated: "идей сгенерировано", unique: "уникальных", checked: "Проверено", extensions: "Зоны", available: "Доступно" },
    results: { title: "{count} доступный домен{plural}", subtitle: "Все проверены и готовы к покупке", empty: "Начните поиск, чтобы найти доступные премиум-домены", emptyFiltered: "Доступные домены не найдены. Попробуйте другие ключевые слова или измените фильтры.", sort: { bestMatch: "Лучшее совпадение", shortest: "Самый короткий", highestScore: "Наивысший балл", mostPremium: "Самый премиальный", keywordStrongest: "Лучшее SEO" }, export: "Экспорт CSV", buy: "Купить на GoDaddy", copy: "Копировать", copied: "Скопировано!", favorite: "Добавить в избранное", score: "балл", brandability: "Брендируемость", pronounceability: "Произносимость", seoFit: "SEO соответствие", length: "Длина" },
  },
  tr: {
    header: { title: "ADNEO", subtitle: "Premium Alan Adı Bulucu", features: { fast: "Çok hızlı", verified: "Doğrulanmış sonuçlar" } },
    hero: { title: "Kullanılabilir", titleHighlight: "premium", titleEnd: "alan adlarını bulun", subtitle: "Akıllı üretim • Çoklu uzantı doğrulaması • Yalnızca kullanılabilir sonuçlar", badges: { extensions: "50+ uzantı", speed: "< 60 saniye", available: "%100 uygun" } },
    search: { placeholder: "ör: neo finance, ai fitness, secure vault...", placeholderBatch: "Her satıra bir kelime girin\nör: vault\nneo\nfinance", button: "Ara", buttonLoading: "Aranıyor...", modes: { smart: "Akıllı Mod", exact: "Tam eşleşme", batch: "Toplu Mod" } },
    filters: { title: "Gelişmiş Filtreler", tabs: { format: "Format", extensions: "Uzantılar", branding: "Markalaşma", seo: "SEO", business: "İş" }, format: { length: "Uzunluk: {min} - {max} karakter", min: "Min", max: "Maks", allowHyphens: "Tireye izin ver", allowDigits: "Rakama izin ver" }, extensions: { quickCategories: "Hızlı kategoriler", selected: "Seçili uzantılar ({count})", all: "Tüm uzantılar" }, branding: { minScore: "Minimum marka puanı: {score}/30", style: "Stil", styleAll: "Tüm stiller" }, business: { category: "Kategori", categoryAll: "Tüm kategoriler", tone: "Ton", toneAll: "Tüm tonlar" }, seo: { info: "SEO filtreleri arama anahtar kelimelerine göre otomatik uygulanır." } },
    progress: { generating: "Fikirler oluşturuluyor...", normalizing: "Normalleştiriliyor...", checking: "Uygunluk kontrol ediliyor...", scoring: "Puanlar hesaplanıyor...", filtering: "Filtreleniyor...", done: "Tamamlandı", inProgress: "Devam ediyor...", generated: "fikir üretildi", unique: "benzersiz", checked: "Kontrol edildi", extensions: "Uzantılar", available: "Uygun" },
    results: { title: "{count} uygun alan adı{plural}", subtitle: "Hepsi doğrulandı ve satın almaya hazır", empty: "Uygun premium alan adlarını bulmak için arama başlatın", emptyFiltered: "Uygun alan adı bulunamadı. Başka anahtar kelimeler deneyin veya filtreleri ayarlayın.", sort: { bestMatch: "En iyi eşleşme", shortest: "En kısa", highestScore: "En yüksek puan", mostPremium: "En premium", keywordStrongest: "En iyi SEO" }, export: "CSV dışa aktar", buy: "GoDaddy üzerinden satın al", copy: "Kopyala", copied: "Kopyalandı!", favorite: "Favorilere ekle", score: "puan", brandability: "Marka uygunluğu", pronounceability: "Telaffuz edilebilirlik", seoFit: "SEO uyumu", length: "Uzunluk" },
  },
} as const;

export function getLanguage(): Language {
  if (typeof window === "undefined") return "en";
  
  const browserLang = navigator.language || navigator.languages?.[0] || "en";
  const langCode = browserLang.split("-")[0].toLowerCase();
  
  if (langCode === "fr") return "fr";
  if (langCode === "es") return "es";
  if (langCode === "zh") return "zh";
  if (langCode === "de") return "de";
  if (langCode === "it") return "it";
  if (langCode === "pt") return "pt";
  if (langCode === "nl") return "nl";
  if (langCode === "ja") return "ja";
  if (langCode === "ko") return "ko";
  if (langCode === "ar") return "ar";
  if (langCode === "hi") return "hi";
  if (langCode === "ru") return "ru";
  if (langCode === "tr") return "tr";
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
