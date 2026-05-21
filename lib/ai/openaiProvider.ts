/**
 * OpenAI Chat Completions 어댑터.
 * - 모든 호출은 서버에서만 실행됩니다 (API 라우트 / 서버 컴포넌트).
 * - 키 누락·timeout·5xx 등은 ExternalApiError로 throw → summaryService가 mock fallback.
 */

import { getAiConfig } from "@/lib/ai/config";
import { buildUserPrompt, SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { parseAiJson } from "@/lib/ai/validation";
import type {
  AiSummaryPayload,
  AiSummaryRequest,
} from "@/lib/ai/types";

export class AiProviderError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "AiProviderError";
  }
}

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const DEFAULT_TIMEOUT_MS = 25_000;

interface OpenAiChatResponse {
  choices?: Array<{
    message?: { content?: string | null };
    finish_reason?: string;
  }>;
  error?: { message?: string; type?: string };
}

export async function callOpenAi(
  req: AiSummaryRequest,
): Promise<AiSummaryPayload> {
  const cfg = getAiConfig();
  if (!cfg.openaiApiKey) {
    throw new AiProviderError("OPENAI_API_KEY is not configured");
  }

  const userPrompt = buildUserPrompt(
    req.type,
    req.companyName,
    req.symbol,
    req.market,
    req.inputData,
  );

  const body = {
    model: cfg.model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" as const },
    temperature: 0.2,
    max_tokens: 900,
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cfg.openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
      cache: "no-store",
    });
  } catch (err) {
    clearTimeout(timer);
    const msg = err instanceof Error ? err.message : "unknown fetch error";
    throw new AiProviderError(`OpenAI request failed: ${msg}`);
  }
  clearTimeout(timer);

  if (!res.ok) {
    let detail = "";
    try {
      const j = (await res.json()) as OpenAiChatResponse;
      detail = j.error?.message ? `: ${j.error.message}` : "";
    } catch {
      // ignore
    }
    throw new AiProviderError(
      `OpenAI HTTP ${res.status}${detail}`,
      res.status,
    );
  }

  const data = (await res.json()) as OpenAiChatResponse;
  const content = data.choices?.[0]?.message?.content ?? "";
  const parsed = parseAiJson(content);
  if (!parsed) {
    throw new AiProviderError("OpenAI response JSON parse failed");
  }
  return parsed;
}
