import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { system, prompt, maxTokens = 1200, modelType = "claude", useServerApi } = body;

    // Get keys from headers first (client-provided)
    const clientAnthropicKey = req.headers.get("x-anthropic-key");
    const clientOpenaiKey = req.headers.get("x-openai-key");

    // Determine final keys to use
    let anthropicKey = clientAnthropicKey || (useServerApi ? process.env.ANTHROPIC_API_KEY : "");
    let openaiKey = clientOpenaiKey || (useServerApi ? process.env.OPENAI_API_KEY : "");

    // Fallback: If no client keys and server API is not enforced but we have env keys, use env keys
    if (!anthropicKey && process.env.ANTHROPIC_API_KEY) {
      anthropicKey = process.env.ANTHROPIC_API_KEY;
    }
    if (!openaiKey && process.env.OPENAI_API_KEY) {
      openaiKey = process.env.OPENAI_API_KEY;
    }

    if (modelType === "claude") {
      if (!anthropicKey) {
        return NextResponse.json(
          { error: "Claude API Key not configured. Please set it in App Settings." },
          { status: 400 }
        );
      }

      // Call Anthropic API
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: maxTokens,
          system,
          messages: [{ role: "user", content: prompt }]
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Anthropic API Error Raw:", errText);
        try {
          const errJson = JSON.parse(errText);
          return NextResponse.json(
            { error: errJson.error?.message || "Anthropic API failure" },
            { status: response.status }
          );
        } catch {
          return NextResponse.json({ error: `Anthropic responded with code ${response.status}` }, { status: response.status });
        }
      }

      const data = await response.json();
      const text = data.content?.[0]?.text || "";
      return NextResponse.json({ text });

    } else {
      // OpenAI completion
      if (!openaiKey) {
        return NextResponse.json(
          { error: "OpenAI API Key not configured. Please set it in App Settings." },
          { status: 400 }
        );
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          max_tokens: maxTokens,
          messages: [
            { role: "system", content: system },
            { role: "user", content: prompt }
          ]
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("OpenAI API Error Raw:", errText);
        try {
          const errJson = JSON.parse(errText);
          return NextResponse.json(
            { error: errJson.error?.message || "OpenAI API failure" },
            { status: response.status }
          );
        } catch {
          return NextResponse.json({ error: `OpenAI responded with code ${response.status}` }, { status: response.status });
        }
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || "";
      return NextResponse.json({ text });
    }
  } catch (error: any) {
    console.error("API Route AI Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error during AI generation." },
      { status: 500 }
    );
  }
}
