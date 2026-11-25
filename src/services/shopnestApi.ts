import { apiClient } from "./apiClient"
import type { StoreSettings, StoreThemeConfig } from "../types"

export const shopnestApi = {
  auth: {
    register: (payload: {
      email: string
      password: string
      firstName?: string
      lastName?: string
      phoneNumber?: string
    }) =>
      apiClient.post<{ accessToken?: string; refreshToken?: string; user?: Record<string, unknown> }>(
        "/auth/register",
        payload,
        { skipAuthRefresh: true },
      ),
    login: (payload: { email: string; password: string }) =>
      apiClient.post<{ accessToken: string; refreshToken: string; user: Record<string, unknown> }>(
        "/auth/login",
        { identifier: payload.email, password: payload.password },
        { skipAuthRefresh: true },
      ),
    verifyEmail: (payload: { email: string; code: string }) =>
      apiClient.post("/auth/verify-email", payload, { skipAuthRefresh: true }),
    forgotPassword: (email: string) =>
      apiClient.post("/auth/forgot-password", { email }, { skipAuthRefresh: true }),
    resetPassword: (payload: { email: string; code: string; newPassword: string }) =>
      apiClient.post("/auth/reset-password", payload, { skipAuthRefresh: true }),
    me: () => apiClient.get("/auth/me"),
  },

  stores: {
    checkSubdomain: (slug: string) =>
      apiClient.get<{ slug: string; available: boolean; reason?: string; url?: string }>(
        `/stores/check-subdomain?slug=${encodeURIComponent(slug)}`,
      ),
    completeOnboarding: (payload: {
      storeName: string
      subdomain: string
      businessName?: string
      businessCategory?: string
      phone?: string
      tagline?: string
      themeId?: string
      brandColor?: string
      logoImage?: string
    }) => apiClient.post("/stores/onboarding", payload),
    getMyStore: () => apiClient.get("/seller/store"),
  },

  settings: {
    get: () => apiClient.get<StoreSettings>("/seller/settings"),
    update: (payload: Partial<StoreSettings>) =>
      apiClient.put<StoreSettings>("/seller/settings", payload),
    reset: () => apiClient.post<StoreSettings>("/seller/settings/reset"),
  },

  themes: {
    list: (category?: string) =>
      apiClient.get(`/themes${category ? `?category=${encodeURIComponent(category)}` : ""}`),
    getActiveConfig: () => apiClient.get("/seller/theme-config"),
    updateConfig: (payload: { status?: "DRAFT" | "PUBLISHED"; config: Partial<StoreThemeConfig> }) =>
      apiClient.patch("/seller/theme-config", payload),
    switchTheme: (themeId: string) =>
      apiClient.post(`/seller/theme-config/switch/${encodeURIComponent(themeId)}`),
    publish: () => apiClient.post("/seller/theme-config/publish"),
    reset: () => apiClient.post("/seller/theme-config/reset"),
    requestLogoUploadUrl: (filename: string) =>
      apiClient.post<{ uploadUrl: string; key: string; publicUrl: string }>(
        "/seller/theme-config/logo-upload-url",
        { filename },
      ),
  },

  categories: {
    list: (params?: { search?: string; status?: string }) => {
      const qs = new URLSearchParams()
      if (params?.search) qs.set("search", params.search)
      if (params?.status) qs.set("status", params.status)
      return apiClient.get(`/seller/categories${qs.toString() ? `?${qs}` : ""}`)
    },
    create: (payload: { name: string; parent?: string; color?: string; status?: string }) =>
      apiClient.post("/seller/categories", payload),
    update: (id: string, payload: Record<string, unknown>) =>
      apiClient.patch(`/seller/categories/${id}`, payload),
    remove: (id: string) => apiClient.delete(`/seller/categories/${id}`),
  },

  products: {
    list: (params?: {
      search?: string
      category?: string
      status?: string
      sort?: "newest" | "price_asc" | "stock_asc"
      page?: number
      limit?: number
    }) => {
      const qs = new URLSearchParams()
      if (params?.search) qs.set("search", params.search)
      if (params?.category) qs.set("category", params.category)
      if (params?.status) qs.set("status", params.status)
      if (params?.sort) qs.set("sort", params.sort)
      if (params?.page) qs.set("page", String(params.page))
      if (params?.limit) qs.set("limit", String(params.limit))
      return apiClient.get(`/seller/products${qs.toString() ? `?${qs}` : ""}`)
    },
    get: (id: string) => apiClient.get(`/seller/products/${id}`),
    create: (payload: Record<string, unknown>) => apiClient.post("/seller/products", payload),
    update: (id: string, payload: Record<string, unknown>) =>
      apiClient.patch(`/seller/products/${id}`, payload),
    remove: (id: string) => apiClient.delete(`/seller/products/${id}`),
    bulkStatus: (ids: string[], status: "ACTIVE" | "DRAFT" | "ARCHIVED") =>
      apiClient.post("/seller/products/bulk-status", { ids, status }),
    bulkDelete: (ids: string[]) => apiClient.post("/seller/products/bulk-delete", { ids }),
    adjustStock: (id: string, delta: number, reason: string) =>
      apiClient.post(`/seller/products/${id}/adjust-stock`, { delta, reason }),
    inventoryMovements: () => apiClient.get("/seller/inventory/movements"),
  },

  shipping: {
    get: () => apiClient.get("/seller/shipping"),
    update: (payload: Record<string, unknown>) => apiClient.put("/seller/shipping", payload),
    reset: () => apiClient.post("/seller/shipping/reset"),
    createRule: (payload: Record<string, unknown>) => apiClient.post("/seller/shipping/rules", payload),
    updateRule: (id: string, payload: Record<string, unknown>) =>
      apiClient.patch(`/seller/shipping/rules/${id}`, payload),
    deleteRule: (id: string) => apiClient.delete(`/seller/shipping/rules/${id}`),
    updateCourier: (id: string, payload: Record<string, unknown>) =>
      apiClient.patch(`/seller/shipping/couriers/${id}`, payload),
  },

  storefront: {
    getStore: (slug: string) => apiClient.get(`/store/${encodeURIComponent(slug)}`),
    listProducts: (slug: string, params?: { search?: string; category?: string; inStock?: boolean; sort?: string }) => {
      const qs = new URLSearchParams()
      if (params?.search) qs.set("search", params.search)
      if (params?.category) qs.set("category", params.category)
      if (params?.inStock) qs.set("inStock", "true")
      if (params?.sort) qs.set("sort", params.sort)
      return apiClient.get(`/store/${encodeURIComponent(slug)}/products${qs.toString() ? `?${qs}` : ""}`)
    },
    getProduct: (slug: string, productId: string) =>
      apiClient.get(`/store/${encodeURIComponent(slug)}/products/${productId}`),
    checkout: (slug: string, payload: Record<string, unknown>) =>
      apiClient.post(`/store/${encodeURIComponent(slug)}/checkout`, payload),
    trackOrder: (slug: string, orderNumber: string, phone: string) =>
      apiClient.get(
        `/store/${encodeURIComponent(slug)}/track-order?orderNumber=${encodeURIComponent(orderNumber)}&phone=${encodeURIComponent(phone)}`,
      ),
  },

  orders: {
    list: (params?: { status?: string; search?: string; date?: string; page?: number }) => {
      const qs = new URLSearchParams()
      if (params?.status) qs.set("status", params.status)
      if (params?.search) qs.set("search", params.search)
      if (params?.date) qs.set("date", params.date)
      if (params?.page) qs.set("page", String(params.page))
      return apiClient.get(`/seller/orders${qs.toString() ? `?${qs}` : ""}`)
    },
    get: (id: string) => apiClient.get(`/seller/orders/${id}`),
    updateStatus: (id: string, status: string) =>
      apiClient.patch(`/seller/orders/${id}/status`, { status }),
    exportCsv: () => apiClient.get<string>("/seller/orders/export"),
  },

  customers: {
    list: (params?: { search?: string; city?: string }) => {
      const qs = new URLSearchParams()
      if (params?.search) qs.set("search", params.search)
      if (params?.city) qs.set("city", params.city)
      return apiClient.get(`/seller/customers${qs.toString() ? `?${qs}` : ""}`)
    },
    getByPhone: (phone: string) =>
      apiClient.get(`/seller/customers/${encodeURIComponent(phone)}`),
  },

  billing: {
    listPlans: () => apiClient.get("/billing/plans"),
    listPayments: () => apiClient.get("/seller/billing/payments"),
    getPayment: (id: string) => apiClient.get(`/seller/billing/payments/${id}`),
    submitPayment: (payload: {
      planId: string
      provider?: string
      transactionId: string
      senderAccount: string
      amount: number
      paymentDate: string
    }) => apiClient.post("/seller/billing/payments", payload),
  },

  admin: {
    overview: () => apiClient.get("/admin/overview"),
    listPayments: (params?: { status?: string; search?: string }) => {
      const qs = new URLSearchParams()
      if (params?.status) qs.set("status", params.status)
      if (params?.search) qs.set("search", params.search)
      return apiClient.get(`/admin/payments${qs.toString() ? `?${qs}` : ""}`)
    },
    getPayment: (id: string) => apiClient.get(`/admin/payments/${id}`),
    reviewPayment: (id: string, status: string, reason?: string) =>
      apiClient.patch(`/admin/payments/${id}/decision`, { status, reason }),
    listSellers: () => apiClient.get("/admin/sellers"),
    listStores: () => apiClient.get("/admin/stores"),
    updateStoreStatus: (id: string, status: string) =>
      apiClient.patch(`/admin/stores/${id}/status`, { status }),
    auditLogs: () => apiClient.get("/admin/audit-logs"),
  },

  analytics: {
    overview: () => apiClient.get("/seller/analytics/overview"),
    reports: (range: "7d" | "30d" | "90d" | "year" = "30d") =>
      apiClient.get(`/seller/analytics/reports?range=${range}`),
  },
}

