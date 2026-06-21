import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { categories } from "../constants/categories";
import { tools } from "../constants/tools";
import { IMPLEMENTED_TOOL_SLUGS } from "../components/tools/tool-registry";
import { getToolPageContent } from "../lib/tools/page-content";
import { enToolUiMaps } from "./tool-ui-maps";

const messages = {
  common: {
    siteName: "Toolsify",
    home: "Home",
    comingSoon: "Coming Soon",
    calculateNow: "Calculate Now",
    copy: "Copy",
    copied: "Copied!",
    reset: "Reset",
    clear: "Clear",
    result: "Result",
    results: "Results",
    loading: "Loading...",
    error: "Error",
    closeMenu: "Close menu",
    openMenu: "Open menu",
    notFoundTitle: "Page not found",
    notFoundDescription:
      "The page you are looking for does not exist or has been moved.",
    backToHome: "Back to home",
    builtFor: "Built for speed, clarity, and professional reliability.",
    allRightsReserved: "All rights reserved.",
    calculating: "Calculating…",
    units: {
      years: "years",
      months: "months",
      days: "days",
      yearShort: "yr",
      kg: "kg",
      lbs: "lbs",
      cm: "cm",
      ft: "ft",
      male: "Male",
      female: "Female",
    },
  },
  toolApi: {
    networkError: "Unable to reach the calculation API.",
    calculationFailed: "Calculation failed.",
    invalidJson: "Request body must be valid JSON.",
    toolNotFound: "Tool not found.",
    invalidWeightOrHeight: "Invalid weight or height values.",
  },
  nav: {
    home: "Home",
    allTools: "All Tools",
    categories: "Categories",
    logIn: "Log In",
    signUp: "Sign Up",
    dashboard: "Dashboard",
  },
  footer: {
    description:
      "Free online calculators, converters, and utility tools. Fast, accurate, and no signup required.",
    tools: "Tools",
    categories: "Categories",
    company: "Company",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    contactUs: "Contact Us",
    requestToolDescription: "Suggest tools we should add to Toolsify.",
  },
  languageSwitcher: {
    label: "Language",
    en: "English",
    ur: "Urdu",
    es: "Spanish",
  },
  home: {
    heroTitle: "Free Online Tools for Everyone",
    heroDescription:
      "Fast, free, and easy-to-use. No signup required. Access a professional suite of document, math, and developer tools instantly.",
    heroImageAlt: "Toolsify hero illustration",
    browseByCategory: "Browse by Category",
    browseByCategoryDescription: "Find the right tool for your specific task",
    viewAllTools: "View all {count}+ Tools",
    popularTools: "Popular Tools",
    howItWorks: "How Toolsify Works",
    suggestionPills: {
      bmiCalculator: "BMI Calculator",
      wordCounter: "Word Counter",
      emiCalculator: "EMI Calculator",
      percentageCalculator: "Percentage Calculator",
      colorConverter: "Color Converter",
    },
    howItWorksSteps: {
      search: {
        title: "1. Search",
        description:
          "Find the perfect tool from our extensive library using the search bar or categories.",
      },
      use: {
        title: "2. Use Instantly",
        description:
          "Enter your data or upload files. No accounts or waiting times involved.",
      },
      results: {
        title: "3. Get Results",
        description:
          "Download your processed files or copy your results immediately with one click.",
      },
    },
    stats: {
      proTools: "Pro Tools Available",
      activeUsers: "Active Monthly Users",
      signupRequired: "Signup Required",
    },
    requestTool: {
      heading: "Request a tool",
      description:
        "Signed-in members can suggest calculators and utilities we should build next.",
      button: "Request a Tool",
      signInToRequest: "Sign in to request a tool",
      compactButton: "Request a tool",
      signInCompact: "Sign in to request",
    },
  },
  search: {
    placeholder: "Search tools...",
    heroPlaceholder: "Search for a tool (e.g. BMI, Word Counter, EMI...)",
    quickSearch: "Quick search",
    submit: "Search",
    noResults: "No tools found",
    noResultsFor: "No tools found for \"{query}\"",
    searchAllTools: "Search all tools",
    viewAllResults: "View all results for \"{query}\"",
    resultsLabel: "Search results",
    tryDifferent: "Try a different search term",
  },
  toolsPage: {
    title: "All Free Online Tools",
    description:
      "Browse {count}+ free calculators, converters, and text tools. Filter by category or search to find exactly what you need — no signup required.",
    filterAll: "All",
    searchPlaceholder: "Search tools...",
    showing: "Showing {count} tools",
    noToolsFound: "No tools found",
    adjustFilters: "Try adjusting your search or category filter.",
    missingToolHeading: "Can't find the tool you need?",
    missingToolDescription:
      "Request a new calculator or utility and we'll consider adding it to Toolsify.",
  },
  toolPage: {
    howToUse: "How to use",
    faqTitle: "Frequently Asked Questions",
    examplesTitle: "Examples",
    relatedTools: "Related Tools",
    aboutTool: "About this tool",
    toolInterface: "Tool interface",
  },
  contactPage: {
    back: "Back to home",
    title: "Contact Us",
    description:
      "Have a question, feedback, or partnership inquiry? Send us a message and we'll respond as soon as we can.",
  },
  signUpPrompt: {
    title: "You're getting value from Toolsify",
    subtitle: "Create a free account to unlock more — your tools stay free.",
    dismiss: "Dismiss",
    createAccount: "Create free account",
    signIn: "Sign in",
    notNow: "Not now",
    benefits: {
      earlyAccess: {
        title: "Early access to premium tools",
        description: "Be first to try advanced features as they launch.",
        badge: "Coming soon",
      },
      requestTools: {
        title: "Request new tools",
        description: "Tell us what to build next — members get priority.",
        badge: "Members only",
      },
      favorites: {
        title: "Save favorites & history",
        description: "Pick up where you left off across visits.",
      },
    },
  },
  toolCommon: {
    defaultHowTo: {
      open: "Open {tool}",
      openText: "Navigate to the {tool} page on Toolsify.",
      enterValues: "Enter your values",
      enterValuesText:
        "Fill in the required inputs in the tool interface above.",
      viewResults: "View results",
      viewResultsText:
        "Results update instantly. Copy or use the output as needed.",
    },
    defaultFaqs: {
      isFreeQuestion: "Is the {tool} free?",
      isFreeAnswer:
        "Yes. Every tool on Toolsify is free to use with no signup required.",
      dataQuestion: "Do you store my data?",
      dataAnswer:
        "Most Toolsify tools run in your browser. When an API is used, inputs are processed to return a result and are not stored.",
      accuracyQuestion: "How accurate is this {tool}?",
      accuracyAnswer:
        "{description} Results are intended for general use; verify critical calculations independently.",
    },
    defaultExample: {
      title: "Quick start",
      description:
        "Use the {tool} with typical values for your scenario and review the output above.",
    },
  },
  forms: {
    contact: {
      name: "Name",
      email: "Email",
      subject: "Subject",
      message: "Message",
      namePlaceholder: "Your name",
      emailPlaceholder: "you@example.com",
      subjectPlaceholder: "What is this about?",
      messagePlaceholder: "How can we help?",
      send: "Send Message",
      sending: "Sending...",
      successTitle: "Message sent!",
      successDescription:
        "Thanks for reaching out. We'll get back to you as soon as we can.",
      sendAnother: "Send another message",
      error: "Something went wrong. Please try again later.",
    },
    requestTool: {
      title: "Request a tool",
      toolName: "Tool name",
      description: "Description",
      useCase: "Use case",
      submit: "Submit request",
      submitting: "Submitting...",
      success: "Request submitted!",
      error: "Failed to submit. Please try again.",
    },
  },
  metadata: {
    site: {
      title: "Toolsify — Free Online Tools",
      description:
        "Free online calculators, converters, and utility tools. Fast, accurate, and no signup required.",
    },
    home: {
      title: "Free Online Tools — Calculators, Converters & More | Toolsify",
      description:
        "Free online tools including BMI calculator, percentage calculator, word counter, EMI calculator, and 50+ more. No signup required. Fast and accurate.",
      keywords: [
        "free online tools",
        "calculator",
        "converter",
        "BMI calculator",
        "word counter",
        "EMI calculator",
        "toolsify",
      ],
    },
    tools: {
      title:
        "All Free Online Tools — 50+ Calculators & Converters | Toolsify",
      description:
        "Browse 50+ free online tools including calculators, converters, text tools, and more.",
      keywords: [
        "free online tools",
        "all tools",
        "calculators",
        "converters",
        "toolsify",
      ],
    },
    categories: {
      title: "Tool Categories | Toolsify",
      description: "Browse free online tools by category on Toolsify.",
    },
    contact: {
      title: "Contact Us | Toolsify",
      description: "Get in touch with the Toolsify team.",
    },
    privacy: {
      title: "Privacy Policy | Toolsify",
      description: "Toolsify privacy policy and data practices.",
    },
    terms: {
      title: "Terms of Service | Toolsify",
      description: "Toolsify terms of service.",
    },
    toolTitle: "{title} — Free Online Tool | Toolsify",
    toolDescription:
      "Use our free online {title}. {description} No signup required. Fast and accurate.",
    categoryTitle: "Free {category} — {count} Tools | Toolsify",
    categoryDescription:
      "{count} free {category} for everyone. No signup required.",
  },
  categories: {} as Record<
    string,
    { title: string; description: string; shortLabel: string; shortName: string }
  >,
  tools: {} as Record<
    string,
    {
      title: string;
      description: string;
      shortDesc: string;
      content?: Record<string, unknown>;
      ui?: Record<string, string>;
    }
  >,
};

const categoryShortLabels: Record<string, string> = {
  math: "Math",
  finance: "Finance",
  fitness: "Fitness",
  text: "Text",
  color: "Design",
  converter: "Converter",
  developer: "Dev",
};

const categoryShortNames: Record<string, string> = {
  math: "Math",
  finance: "Finance",
  fitness: "Fitness",
  text: "Text Tools",
  color: "Design",
  converter: "Converters",
  developer: "Developer",
};

for (const category of categories) {
  messages.categories[category.slug] = {
    title: category.title,
    description: category.description,
    shortLabel: categoryShortLabels[category.slug] ?? category.title,
    shortName: categoryShortNames[category.slug] ?? category.title,
  };
}

for (const tool of tools) {
  messages.tools[tool.slug] = {
    title: tool.title,
    description: tool.description,
    shortDesc: tool.shortDesc,
  };
}

for (const slug of IMPLEMENTED_TOOL_SLUGS) {
  const ui = enToolUiMaps[slug];
  if (ui) {
    messages.tools[slug].ui = ui;
  }

  const content = getToolPageContent(slug);
  messages.tools[slug].content = {
    introduction: content.introduction,
    howToSteps: content.howToSteps,
    examples: content.examples,
    faqs: content.faqs,
    ...(content.article ? { article: content.article } : {}),
  };
}

const outPath = join(process.cwd(), "messages/en.json");
writeFileSync(outPath, JSON.stringify(messages, null, 2) + "\n", "utf-8");
console.log(`Written ${outPath}`);
