export interface FaqItem {
  question: string;
  answer: string;
}

export interface HowToStep {
  name: string;
  text: string;
}

export interface ToolExample {
  title: string;
  description: string;
}

export interface ToolPageContent {
  introduction: string;
  howToSteps: HowToStep[];
  examples: ToolExample[];
  faqs: FaqItem[];
  /** Extra article body rendered below the introduction (optional). */
  article?: string;
}

export interface ToolAgentMetadata {
  name: string;
  slug: string;
  description: string;
  category: string;
  apiEndpoint: string;
  url: string;
}
