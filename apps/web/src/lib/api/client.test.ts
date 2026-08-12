import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  API_DEFAULT_REVALIDATE_SECONDS,
  API_MAX_ATTEMPTS,
  API_RETRY_DELAY_MS,
  fetchApiResult,
} from './client';

describe('fetchApiResult', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    fetchMock.mockReset();
  });

  it('一時的なHTTPエラーは待機後に再試行する', async () => {
    vi.useFakeTimers();
    fetchMock
      .mockResolvedValueOnce(createJsonResponse(503, { error: {} }))
      .mockResolvedValueOnce(createJsonResponse(200, { ok: true }));

    const request = fetchApiResult<{ ok: boolean }>('/health');

    await vi.advanceTimersByTimeAsync(API_RETRY_DELAY_MS);

    await expect(request).resolves.toEqual({
      ok: true,
      status: 200,
      data: { ok: true },
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('既定のrevalidateをfetch optionへ設定する', async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(200, { ok: true }));

    await fetchApiResult('/health');

    expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({
      next: { revalidate: API_DEFAULT_REVALIDATE_SECONDS },
    });
  });

  it('呼び出し元のnext optionを既定値より優先し、tagsを維持する', async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(200, { ok: true }));

    await fetchApiResult('/health', {
      next: { revalidate: 60, tags: ['team:cats'] },
    });

    expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({
      next: { revalidate: 60, tags: ['team:cats'] },
    });
  });

  it('呼び出し元のAbortSignalを維持しながらtimeout signalを合成する', async () => {
    const controller = new AbortController();
    let requestSignal: AbortSignal | null | undefined;
    fetchMock.mockImplementation((_input: URL, init?: RequestInit) => {
      requestSignal = init?.signal;
      return Promise.resolve(createJsonResponse(200, { ok: true }));
    });

    await expect(
      fetchApiResult<{ ok: boolean }>('/health', {
        signal: controller.signal,
      })
    ).resolves.toMatchObject({ ok: true, status: 200 });

    expect(requestSignal).toBeInstanceOf(AbortSignal);
    expect(requestSignal).not.toBe(controller.signal);

    controller.abort();

    expect(requestSignal?.aborted).toBe(true);
  });

  it('404などの再試行対象外のHTTPエラーは再試行しない', async () => {
    fetchMock.mockResolvedValueOnce(
      createJsonResponse(404, {
        error: { code: 'NOT_FOUND', message: '見つかりません' },
      })
    );

    await expect(fetchApiResult('/missing')).resolves.toMatchObject({
      ok: false,
      status: 404,
      error: { code: 'NOT_FOUND' },
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('timeout例外は最大試行回数でNETWORK_ERRORへfallbackする', async () => {
    vi.useFakeTimers();
    fetchMock.mockRejectedValue(
      new DOMException('The operation timed out.', 'TimeoutError')
    );

    const request = fetchApiResult('/slow');

    await vi.advanceTimersByTimeAsync(
      API_RETRY_DELAY_MS * (API_MAX_ATTEMPTS - 1)
    );

    await expect(request).resolves.toMatchObject({
      ok: false,
      status: 0,
      error: { code: 'NETWORK_ERROR' },
    });
    expect(fetchMock).toHaveBeenCalledTimes(API_MAX_ATTEMPTS);
  });
});

function createJsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
