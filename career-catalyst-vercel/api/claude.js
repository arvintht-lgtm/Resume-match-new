// api/claude.js — Vercel serverless function
// Proxies requests to the Anthropic API with the key server-side.
// Env var required: ANTHROPIC_API_KEY

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

export default async function handler(req, res) {
  // Only POST allowed
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("[api/claude] ANTHROPIC_API_KEY not set");
    return res.status(500).json({
      error: { type: "config_error", message: "Server is not configured. ANTHROPIC_API_KEY environment variable is missing." }
    });
  }

  const { model, max_tokens, system, messages } = req.body || {};

  if (!model || !messages) {
    return res.status(400).json({
      error: { type: "invalid_request", message: "Missing required fields: model, messages" }
    });
  }

  try {
    const anthropicRes = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: max_tokens || 4096,
        system: system || "",
        messages,
      }),
    });

    const contentType = anthropicRes.headers.get("content-type") || "";

    // If Anthropic returned non-JSON (shouldn't happen server-side, but guard)
    if (!contentType.includes("json")) {
      const text = await anthropicRes.text();
      console.error("[api/claude] Non-JSON from Anthropic:", text.substring(0, 300));
      return res.status(502).json({
        error: { type: "upstream_error", message: "Anthropic returned a non-JSON response" }
      });
    }

    const data = await anthropicRes.json();

    // Forward the status code and body as-is so the frontend can handle
    // rate limits (429), overload (529), quota (exceeded_limit), etc.
    return res.status(anthropicRes.status).json(data);

  } catch (err) {
    console.error("[api/claude] Proxy error:", err);
    return res.status(502).json({
      error: { type: "proxy_error", message: "Failed to reach Anthropic API: " + err.message }
    });
  }
}
