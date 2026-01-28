import { getPreferenceValues } from "@raycast/api";

interface Preferences {
  llmProvider: "lmstudio" | "ollama" | "localai" | "textgen" | "custom";
  llmCustomUrl: string;
  llmModel: string;
}

// Provider URL mappings
const PROVIDER_URLS: Record<string, string> = {
  lmstudio: "http://127.0.0.1:1234/v1",
  ollama: "http://127.0.0.1:11434/v1",
  localai: "http://127.0.0.1:8080/v1",
  textgen: "http://127.0.0.1:5000/v1",
};

/**
 * Get the LLM base URL based on selected provider
 */
function getLLMBaseUrl(): string {
  const { llmProvider, llmCustomUrl } = getPreferenceValues<Preferences>();

  if (llmProvider === "custom") {
    return llmCustomUrl;
  }

  return PROVIDER_URLS[llmProvider];
}

export interface LLMStatus {
  running: boolean;
  error?: string;
}

/**
 * Check if the local LLM server is running
 */
export async function checkLLM(): Promise<LLMStatus> {
  const baseUrl = getLLMBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/models`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error("Server not responding");
    return { running: true };
  } catch (error) {
    return {
      running: false,
      error: `Cannot connect to ${baseUrl}`,
    };
  }
}

/**
 * Generate a completion from the local LLM
 * Uses OpenAI-compatible API (works with LM Studio, Ollama, LocalAI, etc.)
 */
export async function generate(prompt: string): Promise<string> {
  const baseUrl = getLLMBaseUrl();
  const { llmModel } = getPreferenceValues<Preferences>();

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: llmModel || "default",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    throw new Error(`LLM error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Summarize text using the local LLM
 */
export async function summarize(text: string): Promise<string> {
  const prompt = `Summarize the following text in 2-3 concise sentences. Only output the summary, nothing else.

Text:
${text}

Summary:`;

  return generate(prompt);
}

/**
 * Translate text using the local LLM
 */
export async function translate(text: string, targetLang: string): Promise<string> {
  const prompt = `Translate the following text to ${targetLang}. Only output the translation, nothing else.

Text:
${text}

Translation:`;

  return generate(prompt);
}

/**
 * Define a word using the local LLM
 */
export async function define(word: string): Promise<string> {
  const prompt = `Define "${word}" concisely. Include:
1. Part of speech
2. Definition (1-2 sentences)
3. Example sentence

Keep it brief and clear.`;

  return generate(prompt);
}
