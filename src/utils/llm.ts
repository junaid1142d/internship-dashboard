import { storage } from "./storage";

export interface LLMRequest {
  system: string;
  prompt: string;
  maxTokens?: number;
  modelType?: "claude" | "openai";
}

export async function askAI({
  system,
  prompt,
  maxTokens = 1200,
  modelType = "claude"
}: LLMRequest): Promise<string> {
  const settings = storage.getSettings();

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };

    // Inject client-entered keys if available in storage
    if (settings.anthropicApiKey) {
      headers["x-anthropic-key"] = settings.anthropicApiKey;
    }
    if (settings.openaiApiKey) {
      headers["x-openai-key"] = settings.openaiApiKey;
    }

    // Call Next.js API proxy route
    const response = await fetch("/api/ai", {
      method: "POST",
      headers,
      body: JSON.stringify({
        system,
        prompt,
        maxTokens,
        modelType,
        useServerApi: settings.useServerApi
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.text || "";
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    storage.addLog("error", `AI failed: ${error.message || "Unknown error"}`);
    throw error;
  }
}
