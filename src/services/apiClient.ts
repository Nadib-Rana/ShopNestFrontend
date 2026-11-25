const ACCESS_TOKEN_KEY = "shopnest_access_token"
const REFRESH_TOKEN_KEY = "shopnest_refresh_token"
const STORE_ID_KEY = "shopnest_active_store_id"
const STORE_SLUG_KEY = "shopnest_active_store_slug"

export interface ApiErrorShape {
  statusCode: number
  message: string
  errorCode?: string
  errors?: unknown
}

export class ApiError extends Error {
  statusCode: number
  errorCode?: string
  errors?: unknown

  constructor(shape: ApiErrorShape) {
    super(shape.message)
    this.name = "ApiError"
    this.statusCode = shape.statusCode
    this.errorCode = shape.errorCode
    this.errors = shape.errors
  }
}

export function getApiBaseUrl(): string {
  const configured = (import.meta.env?.VITE_API_BASE_URL as string | undefined) || ""
  return configured.replace(/\/$/, "")
}

export function isBackendEnabled(): boolean {
  if (import.meta.env?.MODE === "test") return false
  return Boolean(getApiBaseUrl())
}

export function getAccessToken(): string | null {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  } catch {
    return null
  }
}

export function getRefreshToken(): string | null {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  } catch {
    return null
  }
}

export function setAuthTokens(accessToken: string, refreshToken?: string): void {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    }
  } catch {
    // ignore storage errors
  }
}

export function clearAuthTokens(): void {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(STORE_ID_KEY)
    localStorage.removeItem(STORE_SLUG_KEY)
  } catch {
    // ignore storage errors
  }
}

export function setActiveStoreId(storeId: string): void {
  try {
    localStorage.setItem(STORE_ID_KEY, storeId)
  } catch {
    // ignore
  }
}

export function getActiveStoreId(): string | null {
  try {
    return localStorage.getItem(STORE_ID_KEY)
  } catch {
    return null
  }
}

export function setActiveStoreSlug(slug: string): void {
  try {
    localStorage.setItem(STORE_SLUG_KEY, slug)
  } catch {
    // ignore
  }
}

export function getActiveStoreSlug(): string {
  try {
    return localStorage.getItem(STORE_SLUG_KEY) || "demo"
  } catch {
    return "demo"
  }
}

interface RequestOptions extends RequestInit {
  baseUrl?: string
  skipAuthRefresh?: boolean
  timeoutMs?: number
}

const DEFAULT_TIMEOUT_MS = 15_000
let inFlightRefresh: Promise<string | null> | null = null

function unwrapEnvelope<T>(payload: unknown): T {
  if (
    payload &&
    typeof payload === "object" &&
    "success" in payload &&
    "data" in payload
  ) {
    return (payload as { data: T }).data
  }
  return payload as T
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<Response> {
  if (timeoutMs <= 0 || init.signal) {
    return fetch(url, init)
  }
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError({
        statusCode: 408,
        message: "Request timed out. Please check your connection and try again.",
        errorCode: "REQUEST_TIMEOUT",
      })
    }
    throw err
  } finally {
    clearTimeout(timer)
  }
}

async function performTokenRefresh(baseUrl: string): Promise<string | null> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return null

  try {
    const res = await fetchWithTimeout(`${baseUrl}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    })

    if (!res.ok) {
      clearAuthTokens()
      return null
    }

    const json = await res.json()
    const data = unwrapEnvelope<{ accessToken?: string; refreshToken?: string }>(json)
    if (!data?.accessToken) {
      clearAuthTokens()
      return null
    }

    setAuthTokens(data.accessToken, data.refreshToken)
    return data.accessToken
  } catch {
    return null
  }
}

async function attemptTokenRefresh(baseUrl: string): Promise<string | null> {
  if (!inFlightRefresh) {
    inFlightRefresh = performTokenRefresh(baseUrl).finally(() => {
      inFlightRefresh = null
    })
  }
  return inFlightRefresh
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const baseUrl = (options.baseUrl ?? getApiBaseUrl()).replace(/\/$/, "")
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  const url = `${baseUrl}${normalizedEndpoint}`
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS

  const headers = new Headers(options.headers)
  if (!headers.has("Content-Type") && options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json")
  }

  const token = getAccessToken()
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const activeStoreId = getActiveStoreId()
  if (activeStoreId && !headers.has("x-store-id")) {
    headers.set("x-store-id", activeStoreId)
  }

  let response = await fetchWithTimeout(url, { ...options, headers }, timeoutMs)

  if (response.status === 401 && !options.skipAuthRefresh) {
    const newAccessToken = await attemptTokenRefresh(baseUrl)
    if (newAccessToken) {
      headers.set("Authorization", `Bearer ${newAccessToken}`)
      response = await fetchWithTimeout(url, { ...options, headers }, timeoutMs)
    }
  }

  const contentType = response.headers.get("content-type") || ""
  const isJson = contentType.includes("application/json")
  const body = isJson ? await response.json() : await response.text()

  if (!response.ok) {
    const message =
      (isJson && typeof body === "object" && body !== null && "message" in body
        ? String((body as { message: unknown }).message)
        : typeof body === "string" && body
        ? body
        : `Request failed with status ${response.status}`)

    throw new ApiError({
      statusCode: response.status,
      message,
      errorCode:
        isJson && typeof body === "object" && body !== null && "errorCode" in body
          ? String((body as { errorCode: unknown }).errorCode)
          : undefined,
      errors:
        isJson && typeof body === "object" && body !== null && "errors" in body
          ? (body as { errors: unknown }).errors
          : undefined,
    })
  }

  return isJson ? unwrapEnvelope<T>(body) : (body as T)
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: "GET" }),
  post: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: data !== undefined ? JSON.stringify(data) : undefined,
    }),
  put: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data !== undefined ? JSON.stringify(data) : undefined,
    }),
  patch: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data !== undefined ? JSON.stringify(data) : undefined,
    }),
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
}

