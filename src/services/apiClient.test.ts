import { describe, it, expect, beforeEach, vi } from "vitest"
import {
  apiClient,
  ApiError,
  clearAuthTokens,
  getAccessToken,
  setAuthTokens,
} from "./apiClient"

describe("apiClient", () => {
  beforeEach(() => {
    localStorage.clear()
    clearAuthTokens()
    vi.restoreAllMocks()
  })

  it("attaches Authorization bearer token and unwraps NestJS response envelope", async () => {
    setAuthTokens("token-123")
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({ success: true, data: { id: "store-1", slug: "demo" } }),
    })
    vi.stubGlobal("fetch", fetchMock)

    const result = await apiClient.get<{ id: string; slug: string }>("/seller/store", {
      baseUrl: "http://localhost:3000/api/v1",
    })

    expect(result).toEqual({ id: "store-1", slug: "demo" })
    const [, init] = fetchMock.mock.calls[0]
    expect((init.headers as Headers).get("Authorization")).toBe("Bearer token-123")
  })

  it("refreshes access token on 401 and retries the original request", async () => {
    setAuthTokens("expired-token", "valid-refresh")
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ message: "Unauthorized" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({
          success: true,
          data: { accessToken: "fresh-token", refreshToken: "fresh-refresh" },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ success: true, data: { ok: true } }),
      })

    vi.stubGlobal("fetch", fetchMock)

    const result = await apiClient.get<{ ok: boolean }>("/seller/settings", {
      baseUrl: "http://localhost:3000/api/v1",
    })

    expect(result).toEqual({ ok: true })
    expect(getAccessToken()).toBe("fresh-token")
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  it("throws ApiError with statusCode and message on failure", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 409,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        statusCode: 409,
        message: "This transaction ID has already been submitted",
      }),
    })
    vi.stubGlobal("fetch", fetchMock)

    await expect(
      apiClient.post(
        "/seller/billing/payments",
        { transactionId: "TXN123" },
        { baseUrl: "http://localhost:3000/api/v1", skipAuthRefresh: true },
      ),
    ).rejects.toThrow(ApiError)
  })
})

