/**
 * 외부 API 호출 공용 fetch — 8초 timeout + try/catch.
 * 실패 시 throw 하지만, 호출부에서 항상 try/catch로 감싸야 합니다.
 */

export interface FetchOptions {
  headers?: Record<string, string>;
  timeoutMs?: number;
  responseType?: "json" | "text";
}

export class ExternalApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public provider?: string,
  ) {
    super(message);
    this.name = "ExternalApiError";
  }
}

export async function fetchExternal<T>(
  url: string,
  options: FetchOptions = {},
): Promise<T> {
  const { headers = {}, timeoutMs = 8000, responseType = "json" } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      headers: {
        Accept: responseType === "json" ? "application/json" : "*/*",
        ...headers,
      },
      signal: controller.signal,
      // server-side fetch — Next.js will cache only when explicitly told to.
      cache: "no-store",
    });
    if (!res.ok) {
      throw new ExternalApiError(
        `External request failed (${res.status}) for ${url}`,
        res.status,
      );
    }
    if (responseType === "text") {
      return (await res.text()) as unknown as T;
    }
    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof ExternalApiError) throw err;
    const msg =
      err instanceof Error ? err.message : "Unknown external API error";
    throw new ExternalApiError(msg);
  } finally {
    clearTimeout(timer);
  }
}
