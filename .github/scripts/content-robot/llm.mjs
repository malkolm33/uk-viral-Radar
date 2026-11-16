// Minimal Claude API client (no dependencies). Reads ANTHROPIC_API_KEY.
// CONTENT_ROBOT_MOCK=1 swaps in canned answers so the whole pipeline can be
// tested without an API key or network (see mock.mjs).
import { mockAnswer } from "./mock.mjs";

export async function ask({ model, system, prompt, maxTokens = 4000, role = "writer" }) {
  if (process.env.CONTENT_ROBOT_MOCK === "1") return mockAnswer(role, prompt);

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY is not set (GitHub > Settings > Secrets > Actions).");

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        system,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (res.ok) {
      const data = await res.json();
      return (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
    }
    const body = await res.text();
    // Retry on rate limits / temporary server errors only.
    if ((res.status === 429 || res.status >= 500) && attempt < 3) {
      await new Promise((r) => setTimeout(r, 15000 * attempt));
      continue;
    }
    throw new Error(`Claude API error ${res.status}: ${body.slice(0, 300)}`);
  }
}

// Pulls the first JSON object out of a model answer (tolerates ```json fences).
export function parseJson(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) throw new Error("Model did not return JSON: " + text.slice(0, 200));
  return JSON.parse(text.slice(start, end + 1));
}
