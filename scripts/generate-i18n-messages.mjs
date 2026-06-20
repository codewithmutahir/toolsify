/**
 * Generates messages/en.json from constants and page-content sources.
 * Run: node scripts/generate-i18n-messages.mjs
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Dynamic import for TS modules via compiled paths - use direct file reads instead
import { tools } from "../constants/tools.ts";
import { categories } from "../constants/categories.ts";

// page-content is TS - we'll import via tsx or duplicate logic
// Use dynamic import with ts-node alternative - read as eval
const pageContentPath = join(root, "lib/tools/page-content.ts");

async function main() {
  const { getToolPageContent } = await import("../lib/tools/page-content.ts");
  const { IMPLEMENTED_TOOL_SLUGS } = await import(
    "../components/tools/tool-registry.ts"
  );

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
      noResults: "No tools found",
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
    },
    toolPage: {
      howToUse: "How to use",
      faqTitle: "Frequently Asked Questions",
      examplesTitle: "Examples",
      relatedTools: "Related Tools",
      aboutTool: "About this tool",
      toolInterface: "Tool interface",
    },
    toolCommon: {
      defaultHowTo: {
        open: "Open {tool}",
        openText: "Navigate to the {tool} page on Toolsify.",
        enterValues: "Enter your values",
        enterValuesText: "Fill in the required inputs in the tool interface above.",
        viewResults: "View results",
        viewResultsText: "Results update instantly. Copy or use the output as needed.",
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
        title:
          "Free Online Tools — Calculators, Converters & More | Toolsify",
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
        title: "All Free Online Tools — 50+ Calculators & Converters | Toolsify",
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
    categories: {},
    tools: {},
  };

  for (const category of categories) {
    messages.categories[category.slug] = {
      title: category.title,
      description: category.description,
      shortLabel: category.slug === "math" ? "Math" : category.title.split(" ")[0],
      shortName:
        category.slug === "converter"
          ? "Converters"
          : category.slug === "developer"
            ? "Developer"
            : category.title.split(" ")[0],
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
    const content = getToolPageContent(slug);
    messages.tools[slug].content = {
      introduction: content.introduction,
      howToSteps: content.howToSteps,
      examples: content.examples,
      faqs: content.faqs,
      ...(content.article ? { article: content.article } : {}),
    };
  }

  const outPath = join(root, "messages/en.json");
  writeFileSync(outPath, JSON.stringify(messages, null, 2) + "\n", "utf-8");
  console.log(`Written ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
