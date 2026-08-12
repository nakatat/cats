import { env } from '@/lib/env';

/**
 * UIへ安全に渡せるAPIエラー。
 *
 * 内部例外や接続先URLは含めず、APIが返した公開可能なcode・message・detailsだけを保持する。
 */
export type ApiError = {
  code: string;
  message: string;
  details: string[];
};

/**
 * API呼び出しの成功・失敗を判別できるResult型。
 *
 * `ok`を型ガードとして利用し、成功時はdata、失敗時はerrorを参照する。
 */
export type ApiResult<T> =
  | {
      ok: true;
      status: number;
      data: T;
    }
  | {
      ok: false;
      status: number;
      error: ApiError;
    };

type ErrorEnvelope = {
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
};

export const API_REQUEST_TIMEOUT_MS = 10_000;
export const API_RETRY_DELAY_MS = 2_000;
export const API_MAX_ATTEMPTS = 3;
export const API_DEFAULT_REVALIDATE_SECONDS = 300;

/**
 * APIを呼び出し、成功・APIエラー・ネットワークエラーを同じResult形式で返す。
 *
 * <p>相対pathをAPI_BASE_URLへ結合し、既定では5分のNext.js cacheを利用する。
 * 呼び出し元が指定したNext.js fetch optionは既定値より優先する。
 * timeoutは10秒で、408・425・429・5xxの一時的な応答とネットワーク例外は最大3回（初回1回＋再試行2回）試行する。
 * retry間隔は2秒とし、全試行がtimeoutした場合も最大34秒で終了する。
 * 呼び出し元のAbortSignalによる中断は再試行せず、最終的に接続できない場合は内部例外を公開せずNETWORK_ERRORを返す。
 */
export async function fetchApiResult<T>(
  path: string,
  init?: RequestInit
): Promise<ApiResult<T>> {
  const url = new URL(
    normalizePath(path),
    ensureTrailingSlash(env.API_BASE_URL)
  );

  const headers = new Headers(init?.headers);
  headers.set('Accept', 'application/json');

  for (let attempt = 0; attempt < API_MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...init,
        next: {
          revalidate: API_DEFAULT_REVALIDATE_SECONDS,
          ...init?.next,
        },
        signal: createRequestSignal(init?.signal),
        headers,
      });

      const body = await readBody(response);

      if (response.ok) {
        return {
          ok: true,
          status: response.status,
          data: body as T,
        };
      }

      if (
        !isRetryableStatus(response.status) ||
        attempt === API_MAX_ATTEMPTS - 1
      ) {
        return {
          ok: false,
          status: response.status,
          error: toApiError(body, response.status),
        };
      }
    } catch (error) {
      if (
        init?.signal?.aborted ||
        !isRetryableError(error) ||
        attempt === API_MAX_ATTEMPTS - 1
      ) {
        break;
      }
    }

    try {
      await waitForRetry(API_RETRY_DELAY_MS, init?.signal ?? undefined);
    } catch {
      break;
    }
  }

  return {
    ok: false,
    status: 0,
    error: {
      code: 'NETWORK_ERROR',
      message: 'APIに接続できませんでした。時間をおいて再度お試しください。',
      details: [],
    },
  };
}

function isRetryableStatus(status: number) {
  return [408, 425, 429, 500, 502, 503, 504].includes(status);
}

function isRetryableError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  return ['AbortError', 'TimeoutError', 'TypeError'].includes(error.name);
}

function createRequestSignal(signal: AbortSignal | null | undefined) {
  const timeoutSignal = AbortSignal.timeout(API_REQUEST_TIMEOUT_MS);

  return signal == null
    ? timeoutSignal
    : AbortSignal.any([signal, timeoutSignal]);
}

function waitForRetry(delayMs: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason);
      return;
    }

    const timeoutId = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, delayMs);

    function onAbort() {
      clearTimeout(timeoutId);
      reject(signal?.reason);
    }

    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

async function readBody(response: Response) {
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return (await response.json()) as unknown;
  }

  return await response.text();
}

function toApiError(body: unknown, status: number): ApiError {
  if (isErrorEnvelope(body) && body.error) {
    return {
      code: body.error.code ?? `HTTP_${status}`,
      message: body.error.message ?? 'Unexpected API error',
      details: Array.isArray(body.error.details)
        ? body.error.details.map((detail) => String(detail))
        : [],
    };
  }

  return {
    code: `HTTP_${status}`,
    message: 'Unexpected API error',
    details: [],
  };
}

function isErrorEnvelope(value: unknown): value is ErrorEnvelope {
  return typeof value === 'object' && value !== null;
}

function ensureTrailingSlash(value: string) {
  return value.endsWith('/') ? value : `${value}/`;
}

function normalizePath(value: string) {
  return value.startsWith('/') ? value.slice(1) : value;
}
