/**
 * Generates ur.json and es.json with UI + metadata translations.
 * Tool page long-form content uses localized defaults until translated per tool.
 * Run: npx tsx scripts/generate-locale-overrides.ts
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { tools } from "../constants/tools";
import {
  esToolTranslations,
  urToolTranslations,
  type ToolTranslation,
} from "./tool-translation-maps";
import { esToolUiMaps, urToolUiMaps } from "./tool-ui-maps";

const urUi = {
  common: {
    siteName: "Toolsify",
    home: "ہوم",
    comingSoon: "جلد آ رہا ہے",
    calculateNow: "ابھی حساب کریں",
    copy: "کاپی",
    copied: "کاپی ہو گیا!",
    reset: "ری سیٹ",
    clear: "صاف کریں",
    result: "نتیجہ",
    results: "نتائج",
    loading: "لوڈ ہو رہا ہے...",
    error: "خرابی",
    closeMenu: "مینو بند کریں",
    openMenu: "مینو کھولیں",
    notFoundTitle: "صفحہ نہیں ملا",
    notFoundDescription:
      "آپ جو صفحہ تلاش کر رہے ہیں وہ موجود نہیں ہے یا منتقل ہو گیا ہے۔",
    backToHome: "ہوم پر واپس",
    builtFor: "رفتار، وضاحت اور پیشہ ورانہ اعتماد کے لیے بنایا گیا۔",
    allRightsReserved: "تمام حقوق محفوظ ہیں۔",
    calculating: "حساب ہو رہا ہے…",
    units: {
      years: "سال",
      months: "مہینے",
      days: "دن",
      yearShort: "سال",
      kg: "kg",
      lbs: "lbs",
      cm: "cm",
      ft: "ft",
      male: "مرد",
      female: "عورت",
    },
  },
  toolApi: {
    networkError: "حساب کی API تک رسائی نہیں ہو سکی۔",
    calculationFailed: "حساب ناکام ہو گیا۔",
    invalidJson: "درخواست کا جسم درست JSON ہونا چاہیے۔",
    toolNotFound: "ٹول نہیں ملا۔",
    invalidWeightOrHeight: "غلط وزن یا قد کی قیمتیں۔",
  },
  nav: {
    home: "ہوم",
    allTools: "تمام ٹولز",
    categories: "زمرے",
    logIn: "لاگ ان",
    signUp: "سائن اپ",
    dashboard: "ڈیش بورڈ",
  },
  footer: {
    description:
      "مفت آن لائن کیلکولیٹرز، کنورٹرز اور یوٹیلیٹی ٹولز۔ تیز، درست، اور سائن اپ کی ضرورت نہیں۔",
    tools: "ٹولز",
    categories: "زمرے",
    company: "کمپنی",
    privacyPolicy: "رازداری کی پالیسی",
    termsOfService: "سروس کی شرائط",
    contactUs: "ہم سے رابطہ کریں",
    requestToolDescription: "Toolsify میں شامل کرنے کے لیے ٹولز تجویز کریں۔",
  },
  languageSwitcher: {
    label: "زبان",
    en: "انگریزی",
    ur: "اردو",
    es: "ہسپانوی",
  },
  home: {
    heroTitle: "سب کے لیے مفت آن لائن ٹولز",
    heroDescription:
      "تیز، مفت اور استعمال میں آسان۔ سائن اپ کی ضرورت نہیں۔ دستاویز، ریاضی اور ڈویلپر ٹولز کا پیشہ ورانہ مجموعہ فوراً استعمال کریں۔",
    heroImageAlt: "Toolsify ہیرو تصویر",
    browseByCategory: "زمرے کے مطابق براؤز کریں",
    browseByCategoryDescription: "اپنے کام کے لیے صحیح ٹول تلاش کریں",
    viewAllTools: "تمام {count}+ ٹولز دیکھیں",
    popularTools: "مقبول ٹولز",
    howItWorks: "Toolsify کیسے کام کرتا ہے",
    suggestionPills: {
      bmiCalculator: "BMI کیلکولیٹر",
      wordCounter: "ورڈ کاؤنٹر",
      emiCalculator: "EMI کیلکولیٹر",
      percentageCalculator: "فیصد کیلکولیٹر",
      colorConverter: "رنگ کنورٹر",
    },
    howItWorksSteps: {
      search: {
        title: "1. تلاش",
        description:
          "سرچ بار یا زمرے سے ہمارے وسیع لائبریری میں بہترین ٹول تلاش کریں۔",
      },
      use: {
        title: "2. فوراً استعمال کریں",
        description:
          "اپنا ڈیٹا درج کریں یا فائلیں اپ لوڈ کریں۔ کوئی اکاؤنٹ یا انتظار نہیں۔",
      },
      results: {
        title: "3. نتائج حاصل کریں",
        description:
          "فائلیں ڈاؤن لوڈ کریں یا ایک کلک میں نتائج کاپی کریں۔",
      },
    },
    stats: {
      proTools: "دستیاب پرو ٹولز",
      activeUsers: "ماہانہ فعال صارفین",
      signupRequired: "سائن اپ ضروری",
    },
    requestTool: {
      heading: "ٹول کی درخواست",
      description:
        "سائن ان صارفین کیلکولیٹرز اور یوٹیلیٹیز کی تجویز دے سکتے ہیں۔",
      button: "ٹول کی درخواست",
      signInToRequest: "درخواست کے لیے سائن ان کریں",
      compactButton: "ٹول کی درخواست",
      signInCompact: "درخواست کے لیے سائن ان",
    },
  },
  search: {
    placeholder: "ٹولز تلاش کریں...",
    heroPlaceholder: "ٹول تلاش کریں (مثلاً BMI، Word Counter، EMI...)",
    quickSearch: "فوری تلاش",
    submit: "تلاش",
    noResults: "کوئی ٹول نہیں ملا",
    noResultsFor: "\"{query}\" کے لیے کوئی ٹول نہیں ملا",
    searchAllTools: "تمام ٹولز تلاش کریں",
    viewAllResults: "\"{query}\" کے تمام نتائج دیکھیں",
    resultsLabel: "تلاش کے نتائج",
    tryDifferent: "دوسرا تلاش لفظ استعمال کریں",
  },
  toolsPage: {
    title: "تمام مفت آن لائن ٹولز",
    description:
      "{count}+ مفت کیلکولیٹرز، کنورٹرز اور ٹیکسٹ ٹولز براؤز کریں۔ زمرے سے فلٹر کریں یا تلاش کریں — سائن اپ کی ضرورت نہیں۔",
    filterAll: "تمام",
    searchPlaceholder: "ٹولز تلاش کریں...",
    showing: "{count} ٹولز دکھائے گئے",
    noToolsFound: "کوئی ٹول نہیں ملا",
    adjustFilters: "تلاش یا زمرے کا فلٹر تبدیل کریں۔",
    missingToolHeading: "آپ کا ٹول نہیں مل رہا؟",
    missingToolDescription:
      "نیا کیلکولیٹر یا یوٹیلیٹی کی درخواست کریں، ہم Toolsify میں شامل کرنے پر غور کریں گے۔",
  },
  toolPage: {
    howToUse: "استعمال کا طریقہ",
    faqTitle: "اکثر پوچھے گئے سوالات",
    examplesTitle: "مثالیں",
    relatedTools: "متعلقہ ٹولز",
    aboutTool: "اس ٹول کے بارے میں",
    toolInterface: "ٹول انٹرفیس",
  },
  toolCommon: {
    defaultHowTo: {
      open: "{tool} کھولیں",
      openText: "Toolsify پر {tool} صفحہ کھولیں۔",
      enterValues: "اپنی اقدار درج کریں",
      enterValuesText: "اوپر والے ٹول انٹرفیس میں مطلوبہ فیلڈز پُر کریں۔",
      viewResults: "نتائج دیکھیں",
      viewResultsText: "نتائج فوراً اپ ڈیٹ ہوتے ہیں۔ ضرورت کے مطابق کاپی یا استعمال کریں۔",
    },
    defaultFaqs: {
      isFreeQuestion: "{tool} مفت ہے؟",
      isFreeAnswer: "ہاں۔ Toolsify پر ہر ٹول مفت ہے، سائن اپ کی ضرورت نہیں۔",
      dataQuestion: "کیا آپ میرا ڈیٹا محفوظ کرتے ہیں؟",
      dataAnswer:
        "زیادہ تر ٹولز براؤزر میں چلتے ہیں۔ API استعمال ہونے پر ان پٹ نتائج کے لیے پروسیس ہوتا ہے اور محفوظ نہیں ہوتا۔",
      accuracyQuestion: "یہ {tool} کتنا درست ہے؟",
      accuracyAnswer:
        "{description} نتائج عام استعمال کے لیے ہیں؛ اہم حسابات خود سے بھی چیک کریں۔",
    },
    defaultExample: {
      title: "فوری شروعات",
      description:
        "اپنے کیس کے عام اقدار کے ساتھ {tool} استعمال کریں اور اوپر کا نتیجہ دیکھیں۔",
    },
  },
  signUpPrompt: {
    title: "Toolsify آپ کے لیے کام کر رہا ہے",
    subtitle: "مزید فیچرز کے لیے مفت اکاؤنٹ بنائیں — ٹولز مفت رہیں گے۔",
    dismiss: "بند کریں",
    createAccount: "مفت اکاؤنٹ بنائیں",
    signIn: "سائن ان",
    notNow: "ابھی نہیں",
    benefits: {
      earlyAccess: {
        title: "پریمیم ٹولز کی ابتدائی رسائی",
        description: "نئے فیچرز لانچ ہونے پر سب سے پہلے آزمائیں۔",
        badge: "جلد آ رہا ہے",
      },
      requestTools: {
        title: "نئے ٹولز کی درخواست",
        description: "بتائیں ہم کیا بنائیں — members کو ترجیح ملتی ہے۔",
        badge: "صرف members",
      },
      favorites: {
        title: "پسندیدہ اور تاریخ محفوظ کریں",
        description: "دوبارہ آئیں تو جہاں چھوڑا تھا وہاں سے شروع کریں۔",
      },
    },
  },
  forms: {
    contact: {
      name: "نام",
      email: "ای میل",
      subject: "موضوع",
      message: "پیغام",
      namePlaceholder: "آپ کا نام",
      emailPlaceholder: "you@example.com",
      subjectPlaceholder: "یہ کس بارے میں ہے؟",
      messagePlaceholder: "ہم کیسے مدد کر سکتے ہیں؟",
      send: "پیغام بھیجیں",
      sending: "بھیجا جا رہا ہے...",
      successTitle: "پیغام بھیج دیا!",
      successDescription:
        "رابطہ کرنے کا شکریہ۔ ہم جلد از جلد جواب دیں گے۔",
      sendAnother: "دوسرا پیغام بھیجیں",
      error: "کچھ غلط ہو گیا۔ بعد میں دوبارہ کوشش کریں۔",
    },
    requestTool: {
      title: "ٹول کی درخواست",
      toolName: "ٹول کا نام",
      description: "تفصیل",
      useCase: "استعمال کا کیس",
      submit: "درخواست جمع کریں",
      submitting: "جمع کیا جا رہا ہے...",
      success: "درخواست جمع ہو گئی!",
      error: "جمع نہیں ہوئی۔ دوبارہ کوشش کریں۔",
    },
  },
  metadata: {
    site: {
      title: "Toolsify — مفت آن لائن ٹولز",
      description:
        "مفت آن لائن کیلکولیٹرز، کنورٹرز اور یوٹیلیٹی ٹولز۔ تیز اور درست۔",
    },
    home: {
      title: "مفت آن لائن ٹولز — کیلکولیٹرز اور کنورٹرز | Toolsify",
      description:
        "BMI، فیصد، ورڈ کاؤنٹر، EMI کیلکولیٹر اور 50+ مفت ٹولز۔ سائن اپ کی ضرورت نہیں۔",
      keywords: [
        "مفت آن لائن ٹولز",
        "کیلکولیٹر",
        "کنورٹر",
        "BMI کیلکولیٹر",
        "ورڈ کاؤنٹر",
        "toolsify",
      ],
    },
    tools: {
      title: "تمام مفت آن لائن ٹولز | Toolsify",
      description:
        "50+ مفت آن لائن ٹولز بشمول کیلکولیٹرز، کنورٹرز اور ٹیکسٹ ٹولز۔",
      keywords: ["مفت آن لائن ٹولز", "کیلکولیٹرز", "toolsify"],
    },
    categories: {
      title: "ٹول زمرے | Toolsify",
      description: "Toolsify پر زمرے کے مطابق مفت ٹولز براؤز کریں۔",
    },
    contact: {
      title: "ہم سے رابطہ | Toolsify",
      description: "Toolsify ٹیم سے رابطہ کریں۔",
    },
    privacy: {
      title: "رازداری کی پالیسی | Toolsify",
      description: "Toolsify رازداری کی پالیسی۔",
    },
    terms: {
      title: "سروس کی شرائط | Toolsify",
      description: "Toolsify سروس کی شرائط۔",
    },
    toolTitle: "{title} — مفت آن لائن ٹول | Toolsify",
    toolDescription:
      "ہمارا مفت {title} استعمال کریں۔ {description} سائن اپ کی ضرورت نہیں۔",
    categoryTitle: "مفت {category} — {count} ٹولز | Toolsify",
    categoryDescription: "{count} مفت {category}۔ سائن اپ کی ضرورت نہیں۔",
  },
  categories: {
    math: {
      title: "ریاضی اور کیلکولیٹرز",
      description:
        "فیصد، فریکشن، اوسط اور مزید کے لیے مفت ریاضی کیلکولیٹرز۔",
      shortLabel: "ریاضی",
      shortName: "ریاضی",
    },
    finance: {
      title: "فنانس",
      description: "EMI، سود، قرضے اور SIP کے لیے مفت فنانس کیلکولیٹرز۔",
      shortLabel: "فنانس",
      shortName: "فنانس",
    },
    fitness: {
      title: "فٹنس اور صحت",
      description: "BMI، BMR، کیلوری اور مثالی وزن کیلکولیٹرز۔",
      shortLabel: "فٹنس",
      shortName: "فٹنس",
    },
    text: {
      title: "ٹیکسٹ ٹولز",
      description: "ورڈز شمار کریں، کیس تبدیل کریں اور ٹیکسٹ میں ترمیم کریں۔",
      shortLabel: "ٹیکسٹ",
      shortName: "ٹیکسٹ ٹولز",
    },
    color: {
      title: "رنگ اور ڈیزائن",
      description: "رنگ منتخب کریں اور HEX، RGB فارمیٹس میں کنورٹ کریں۔",
      shortLabel: "ڈیزائن",
      shortName: "ڈیزائن",
    },
    converter: {
      title: "یونٹ کنورٹرز",
      description: "لمبائی، وزن، درجہ حرارت اور مزید کنورٹ کریں۔",
      shortLabel: "کنورٹر",
      shortName: "کنورٹرز",
    },
    developer: {
      title: "ڈویلپر ٹولز",
      description: "JSON فارمیٹ، Base64 اور ڈویلپر یوٹیلیٹیز۔",
      shortLabel: "ڈیو",
      shortName: "ڈویلپر",
    },
  },
};

const esUi = {
  common: {
    siteName: "Toolsify",
    home: "Inicio",
    comingSoon: "Próximamente",
    calculateNow: "Calcular ahora",
    copy: "Copiar",
    copied: "¡Copiado!",
    reset: "Restablecer",
    clear: "Limpiar",
    result: "Resultado",
    results: "Resultados",
    loading: "Cargando...",
    error: "Error",
    closeMenu: "Cerrar menú",
    openMenu: "Abrir menú",
    notFoundTitle: "Página no encontrada",
    notFoundDescription:
      "La página que buscas no existe o ha sido movida.",
    backToHome: "Volver al inicio",
    builtFor: "Creado para velocidad, claridad y confiabilidad profesional.",
    allRightsReserved: "Todos los derechos reservados.",
    calculating: "Calculando…",
    units: {
      years: "años",
      months: "meses",
      days: "días",
      yearShort: "a",
      kg: "kg",
      lbs: "lbs",
      cm: "cm",
      ft: "ft",
      male: "Masculino",
      female: "Femenino",
    },
  },
  toolApi: {
    networkError: "No se puede conectar con la API de cálculo.",
    calculationFailed: "El cálculo falló.",
    invalidJson: "El cuerpo de la solicitud debe ser JSON válido.",
    toolNotFound: "Herramienta no encontrada.",
    invalidWeightOrHeight: "Valores de peso o altura no válidos.",
  },
  nav: {
    home: "Inicio",
    allTools: "Todas las herramientas",
    categories: "Categorías",
    logIn: "Iniciar sesión",
    signUp: "Registrarse",
    dashboard: "Panel",
  },
  footer: {
    description:
      "Calculadoras, convertidores y herramientas en línea gratis. Rápidas, precisas y sin registro.",
    tools: "Herramientas",
    categories: "Categorías",
    company: "Empresa",
    privacyPolicy: "Política de privacidad",
    termsOfService: "Términos de servicio",
    contactUs: "Contáctanos",
    requestToolDescription: "Sugiere herramientas para agregar a Toolsify.",
  },
  languageSwitcher: {
    label: "Idioma",
    en: "Inglés",
    ur: "Urdu",
    es: "Español",
  },
  home: {
    heroTitle: "Herramientas en línea gratis para todos",
    heroDescription:
      "Rápidas, gratis y fáciles de usar. Sin registro. Accede a documentos, matemáticas y herramientas para desarrolladores al instante.",
    heroImageAlt: "Ilustración principal de Toolsify",
    browseByCategory: "Explorar por categoría",
    browseByCategoryDescription: "Encuentra la herramienta adecuada para tu tarea",
    viewAllTools: "Ver todas las {count}+ herramientas",
    popularTools: "Herramientas populares",
    howItWorks: "Cómo funciona Toolsify",
    suggestionPills: {
      bmiCalculator: "Calculadora BMI",
      wordCounter: "Contador de palabras",
      emiCalculator: "Calculadora EMI",
      percentageCalculator: "Calculadora de porcentajes",
      colorConverter: "Convertidor de colores",
    },
    howItWorksSteps: {
      search: {
        title: "1. Buscar",
        description:
          "Encuentra la herramienta perfecta en nuestra biblioteca con la búsqueda o categorías.",
      },
      use: {
        title: "2. Usar al instante",
        description:
          "Introduce tus datos o sube archivos. Sin cuentas ni tiempos de espera.",
      },
      results: {
        title: "3. Obtener resultados",
        description:
          "Descarga archivos o copia resultados con un solo clic.",
      },
    },
    stats: {
      proTools: "Herramientas pro disponibles",
      activeUsers: "Usuarios activos mensuales",
      signupRequired: "Registro requerido",
    },
    requestTool: {
      heading: "Solicitar una herramienta",
      description:
        "Los miembros registrados pueden sugerir calculadoras y utilidades.",
      button: "Solicitar herramienta",
      signInToRequest: "Inicia sesión para solicitar",
      compactButton: "Solicitar herramienta",
      signInCompact: "Inicia sesión para solicitar",
    },
  },
  search: {
    placeholder: "Buscar herramientas...",
    heroPlaceholder: "Buscar herramienta (ej. BMI, contador de palabras, EMI...)",
    quickSearch: "Búsqueda rápida",
    submit: "Buscar",
    noResults: "No se encontraron herramientas",
    noResultsFor: "No se encontraron herramientas para \"{query}\"",
    searchAllTools: "Buscar todas las herramientas",
    viewAllResults: "Ver todos los resultados para \"{query}\"",
    resultsLabel: "Resultados de búsqueda",
    tryDifferent: "Prueba con otra búsqueda",
  },
  toolsPage: {
    title: "Todas las herramientas en línea gratis",
    description:
      "Explora {count}+ calculadoras, convertidores y herramientas de texto. Filtra por categoría o busca — sin registro.",
    filterAll: "Todas",
    searchPlaceholder: "Buscar herramientas...",
    showing: "Mostrando {count} herramientas",
    noToolsFound: "No se encontraron herramientas",
    adjustFilters: "Ajusta la búsqueda o el filtro de categoría.",
    missingToolHeading: "¿No encuentras la herramienta que necesitas?",
    missingToolDescription:
      "Solicita una nueva calculadora o utilidad y la consideraremos para Toolsify.",
  },
  toolPage: {
    howToUse: "Cómo usar",
    faqTitle: "Preguntas frecuentes",
    examplesTitle: "Ejemplos",
    relatedTools: "Herramientas relacionadas",
    aboutTool: "Acerca de esta herramienta",
    toolInterface: "Interfaz de la herramienta",
  },
  toolCommon: {
    defaultHowTo: {
      open: "Abrir {tool}",
      openText: "Ve a la página de {tool} en Toolsify.",
      enterValues: "Introduce tus valores",
      enterValuesText: "Completa los campos requeridos en la interfaz de arriba.",
      viewResults: "Ver resultados",
      viewResultsText:
        "Los resultados se actualizan al instante. Copia o usa el resultado según necesites.",
    },
    defaultFaqs: {
      isFreeQuestion: "¿{tool} es gratis?",
      isFreeAnswer:
        "Sí. Todas las herramientas de Toolsify son gratis y no requieren registro.",
      dataQuestion: "¿Guardan mis datos?",
      dataAnswer:
        "La mayoría de herramientas se ejecutan en tu navegador. Si se usa una API, los datos se procesan para el resultado y no se almacenan.",
      accuracyQuestion: "¿Qué precisión tiene {tool}?",
      accuracyAnswer:
        "{description} Los resultados son para uso general; verifica cálculos críticos por tu cuenta.",
    },
    defaultExample: {
      title: "Inicio rápido",
      description:
        "Usa {tool} con valores típicos de tu caso y revisa el resultado arriba.",
    },
  },
  signUpPrompt: {
    title: "Toolsify te está siendo útil",
    subtitle: "Crea una cuenta gratis para desbloquear más — las herramientas siguen siendo gratis.",
    dismiss: "Cerrar",
    createAccount: "Crear cuenta gratis",
    signIn: "Iniciar sesión",
    notNow: "Ahora no",
    benefits: {
      earlyAccess: {
        title: "Acceso anticipado a herramientas premium",
        description: "Prueba primero las funciones avanzadas cuando se lancen.",
        badge: "Próximamente",
      },
      requestTools: {
        title: "Solicitar nuevas herramientas",
        description: "Dinos qué construir — los miembros tienen prioridad.",
        badge: "Solo miembros",
      },
      favorites: {
        title: "Guardar favoritos e historial",
        description: "Retoma donde lo dejaste en cada visita.",
      },
    },
  },
  forms: {
    contact: {
      name: "Nombre",
      email: "Correo electrónico",
      subject: "Asunto",
      message: "Mensaje",
      namePlaceholder: "Tu nombre",
      emailPlaceholder: "you@example.com",
      subjectPlaceholder: "¿De qué se trata?",
      messagePlaceholder: "¿Cómo podemos ayudarte?",
      send: "Enviar mensaje",
      sending: "Enviando...",
      successTitle: "¡Mensaje enviado!",
      successDescription:
        "Gracias por contactarnos. Responderemos lo antes posible.",
      sendAnother: "Enviar otro mensaje",
      error: "Algo salió mal. Inténtalo de nuevo más tarde.",
    },
    requestTool: {
      title: "Solicitar herramienta",
      toolName: "Nombre de la herramienta",
      description: "Descripción",
      useCase: "Caso de uso",
      submit: "Enviar solicitud",
      submitting: "Enviando...",
      success: "¡Solicitud enviada!",
      error: "No se pudo enviar. Inténtalo de nuevo.",
    },
  },
  metadata: {
    site: {
      title: "Toolsify — Herramientas en línea gratis",
      description:
        "Calculadoras, convertidores y herramientas en línea gratis. Rápidas y precisas.",
    },
    home: {
      title:
        "Herramientas en línea gratis — Calculadoras y convertidores | Toolsify",
      description:
        "BMI, porcentajes, contador de palabras, EMI y 50+ herramientas gratis. Sin registro.",
      keywords: [
        "herramientas en línea gratis",
        "calculadora",
        "convertidor",
        "calculadora BMI",
        "contador de palabras",
        "toolsify",
      ],
    },
    tools: {
      title: "Todas las herramientas gratis | Toolsify",
      description:
        "50+ herramientas en línea gratis: calculadoras, convertidores y texto.",
      keywords: [
        "herramientas en línea gratis",
        "calculadoras",
        "toolsify",
      ],
    },
    categories: {
      title: "Categorías de herramientas | Toolsify",
      description: "Explora herramientas gratis por categoría en Toolsify.",
    },
    contact: {
      title: "Contáctanos | Toolsify",
      description: "Contacta al equipo de Toolsify.",
    },
    privacy: {
      title: "Política de privacidad | Toolsify",
      description: "Política de privacidad de Toolsify.",
    },
    terms: {
      title: "Términos de servicio | Toolsify",
      description: "Términos de servicio de Toolsify.",
    },
    toolTitle: "{title} — Herramienta en línea gratis | Toolsify",
    toolDescription:
      "Usa nuestra {title} gratis. {description} Sin registro.",
    categoryTitle: "{category} gratis — {count} herramientas | Toolsify",
    categoryDescription:
      "{count} {category} gratis. Sin registro requerido.",
  },
  categories: {
    math: {
      title: "Matemáticas y calculadoras",
      description:
        "Calculadoras de matemáticas gratis para porcentajes, fracciones y más.",
      shortLabel: "Mates",
      shortName: "Matemáticas",
    },
    finance: {
      title: "Finanzas",
      description:
        "Calcula EMI, interés compuesto, préstamos y más.",
      shortLabel: "Finanzas",
      shortName: "Finanzas",
    },
    fitness: {
      title: "Fitness y salud",
      description: "BMI, BMR, calorías y peso ideal.",
      shortLabel: "Fitness",
      shortName: "Fitness",
    },
    text: {
      title: "Herramientas de texto",
      description: "Cuenta palabras, cambia mayúsculas y manipula texto.",
      shortLabel: "Texto",
      shortName: "Texto",
    },
    color: {
      title: "Color y diseño",
      description: "Elige colores y convierte entre HEX, RGB y más.",
      shortLabel: "Diseño",
      shortName: "Diseño",
    },
    converter: {
      title: "Convertidores de unidades",
      description: "Convierte longitud, peso, temperatura y más.",
      shortLabel: "Convertidor",
      shortName: "Convertidores",
    },
    developer: {
      title: "Herramientas para desarrolladores",
      description: "Formatea JSON, Base64 y utilidades para desarrolladores.",
      shortLabel: "Dev",
      shortName: "Desarrollador",
    },
  },
};

type ToolOverride = ToolTranslation & { ui?: Record<string, string> };

function buildToolOverrides(
  titleMap: Record<string, ToolTranslation>,
  uiMap: Record<string, Record<string, string>>
) {
  const toolsSection: Record<string, ToolOverride> = {};
  for (const tool of tools) {
    const translation = titleMap[tool.slug];
    const ui = uiMap[tool.slug];
    if (translation || ui) {
      toolsSection[tool.slug] = {
        ...(translation ?? {}),
        ...(ui ? { ui } : {}),
      };
    }
  }
  return { tools: toolsSection };
}

const ur = {
  ...urUi,
  ...buildToolOverrides(urToolTranslations, urToolUiMaps),
};
const es = {
  ...esUi,
  ...buildToolOverrides(esToolTranslations, esToolUiMaps),
};

writeFileSync(
  join(process.cwd(), "messages/ur.json"),
  JSON.stringify(ur, null, 2) + "\n",
  "utf-8"
);
writeFileSync(
  join(process.cwd(), "messages/es.json"),
  JSON.stringify(es, null, 2) + "\n",
  "utf-8"
);
console.log("Written messages/ur.json and messages/es.json");
