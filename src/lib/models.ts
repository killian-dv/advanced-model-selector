export type ReasoningLevel = "low" | "medium" | "high";
export type SpeedMode = "standard" | "fast";

export interface ModelMetrics {
  context: number;
  cost: number;
  intelligence: number;
  speed: number;
}

export interface ModelCapabilities {
  reasoning: boolean;
  speed: boolean;
}

export interface Model {
  capabilities: ModelCapabilities;
  defaultReasoning: ReasoningLevel;
  defaultSpeed: SpeedMode;
  description: string;
  id: string;
  metrics: ModelMetrics;
  name: string;
  provider: string;
  providerKey: "anthropic" | "openai" | "google";
}

export interface ModelSettings {
  reasoning: ReasoningLevel;
  speed: SpeedMode;
}

export const MODELS: Model[] = [
  {
    id: "claude-fable-5",
    name: "Claude Fable 5",
    provider: "Anthropic",
    providerKey: "anthropic",
    description:
      "Anthropic's most capable model for complex reasoning, nuanced writing, and multi-step tasks.",
    metrics: { intelligence: 5, speed: 3, context: 5, cost: 2 },
    capabilities: { reasoning: true, speed: false },
    defaultReasoning: "high",
    defaultSpeed: "standard",
  },
  {
    id: "gpt-5-5",
    name: "GPT-5.5",
    provider: "OpenAI",
    providerKey: "openai",
    description:
      "OpenAI's flagship model with strong general intelligence and broad tool use.",
    metrics: { intelligence: 5, speed: 4, context: 4, cost: 3 },
    capabilities: { reasoning: true, speed: true },
    defaultReasoning: "high",
    defaultSpeed: "standard",
  },
  {
    id: "gemini-3-flash",
    name: "Gemini 3 Flash",
    provider: "Google",
    providerKey: "google",
    description:
      "Google's fast multimodal model optimized for low latency and high throughput.",
    metrics: { intelligence: 4, speed: 5, context: 4, cost: 4 },
    capabilities: { reasoning: false, speed: true },
    defaultReasoning: "medium",
    defaultSpeed: "fast",
  },
  {
    id: "claude-haiku-4",
    name: "Claude Haiku 4",
    provider: "Anthropic",
    providerKey: "anthropic",
    description:
      "A lightweight Anthropic model tuned for speed while keeping solid reasoning quality.",
    metrics: { intelligence: 3, speed: 5, context: 3, cost: 5 },
    capabilities: { reasoning: false, speed: true },
    defaultReasoning: "low",
    defaultSpeed: "fast",
  },
  {
    id: "gpt-5-mini",
    name: "GPT-5 Mini",
    provider: "OpenAI",
    providerKey: "openai",
    description:
      "A cost-efficient OpenAI model for everyday tasks, drafts, and quick iterations.",
    metrics: { intelligence: 3, speed: 4, context: 3, cost: 5 },
    capabilities: { reasoning: true, speed: true },
    defaultReasoning: "medium",
    defaultSpeed: "standard",
  },
  {
    id: "gemini-3-pro",
    name: "Gemini 3 Pro",
    provider: "Google",
    providerKey: "google",
    description:
      "Google's pro-tier model with extended context and strong analytical performance.",
    metrics: { intelligence: 5, speed: 3, context: 5, cost: 2 },
    capabilities: { reasoning: true, speed: false },
    defaultReasoning: "high",
    defaultSpeed: "standard",
  },
  {
    id: "claude-sonnet-4",
    name: "Claude Sonnet 4",
    provider: "Anthropic",
    providerKey: "anthropic",
    description:
      "A balanced Anthropic model that pairs strong reasoning with responsive latency for daily work.",
    metrics: { intelligence: 4, speed: 4, context: 4, cost: 3 },
    capabilities: { reasoning: true, speed: true },
    defaultReasoning: "medium",
    defaultSpeed: "standard",
  },
  {
    id: "claude-opus-4",
    name: "Claude Opus 4",
    provider: "Anthropic",
    providerKey: "anthropic",
    description:
      "Anthropic's deepest reasoning model for research, architecture, and long-form analysis.",
    metrics: { intelligence: 5, speed: 2, context: 5, cost: 1 },
    capabilities: { reasoning: true, speed: false },
    defaultReasoning: "high",
    defaultSpeed: "standard",
  },
  {
    id: "o3",
    name: "o3",
    provider: "OpenAI",
    providerKey: "openai",
    description:
      "OpenAI's reasoning-first model built for math, code, and multi-step problem solving.",
    metrics: { intelligence: 5, speed: 2, context: 4, cost: 2 },
    capabilities: { reasoning: true, speed: false },
    defaultReasoning: "high",
    defaultSpeed: "standard",
  },
  {
    id: "o4-mini",
    name: "o4-mini",
    provider: "OpenAI",
    providerKey: "openai",
    description:
      "A compact OpenAI reasoning model with lower latency for interactive agent workflows.",
    metrics: { intelligence: 4, speed: 4, context: 3, cost: 4 },
    capabilities: { reasoning: true, speed: true },
    defaultReasoning: "medium",
    defaultSpeed: "fast",
  },
  {
    id: "gpt-5-nano",
    name: "GPT-5 Nano",
    provider: "OpenAI",
    providerKey: "openai",
    description:
      "OpenAI's smallest GPT-5 variant, optimized for high-volume lightweight tasks.",
    metrics: { intelligence: 2, speed: 5, context: 2, cost: 5 },
    capabilities: { reasoning: false, speed: true },
    defaultReasoning: "low",
    defaultSpeed: "fast",
  },
  {
    id: "gemini-2-5-pro",
    name: "Gemini 2.5 Pro",
    provider: "Google",
    providerKey: "google",
    description:
      "Google's previous-generation pro model with reliable multimodal understanding.",
    metrics: { intelligence: 4, speed: 3, context: 5, cost: 3 },
    capabilities: { reasoning: true, speed: false },
    defaultReasoning: "high",
    defaultSpeed: "standard",
  },
  {
    id: "gemini-2-5-flash",
    name: "Gemini 2.5 Flash",
    provider: "Google",
    providerKey: "google",
    description:
      "A speed-focused Google model for chat, summarization, and rapid prototyping.",
    metrics: { intelligence: 3, speed: 5, context: 3, cost: 5 },
    capabilities: { reasoning: false, speed: true },
    defaultReasoning: "low",
    defaultSpeed: "fast",
  },
];

export const DEFAULT_MODEL_ID = MODELS[0].id;

export function getModelById(id: string): Model | undefined {
  return MODELS.find((model) => model.id === id);
}

export function getDefaultSettings(model: Model): ModelSettings {
  return {
    reasoning: model.defaultReasoning,
    speed: model.defaultSpeed,
  };
}
