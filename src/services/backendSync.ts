import { getAccessToken, isBackendEnabled, setActiveStoreId, setActiveStoreSlug } from "./apiClient"
import { shopnestApi } from "./shopnestApi"
import { saveStoreSettings, defaultStoreSettings } from "../repositories/settingsStore"
import { saveShippingSettings, defaultShippingSettings } from "../repositories/shippingStore"
import { saveStoreThemeConfig, themeDefaults } from "../repositories/themeStore"
import { saveCommerceProducts, type CommerceProduct } from "../repositories/commerceStore"
import type { StoreSettings, StoreThemeConfig } from "../types"

export function canCallProtectedApi(): boolean {
  return isBackendEnabled() && Boolean(getAccessToken())
}

/**
 * Hydrates local repositories from the live NestJS backend after login or reload.
 * Any individual endpoint failure is caught so the UI never crashes offline.
 */
export async function syncSellerWorkspaceFromBackend(): Promise<void> {
  if (!canCallProtectedApi()) return

  let resolvedSlug = "demo"
  try {
    const store = await shopnestApi.stores.getMyStore() as { id?: string; slug?: string } | null
    if (store?.id) {
      setActiveStoreId(store.id)
    }
    if (store?.slug) {
      resolvedSlug = store.slug
      setActiveStoreSlug(store.slug)
    }
  } catch {
    // Store may not be onboarded yet
    return
  }

  await Promise.allSettled([
    shopnestApi.settings.get().then((data) => {
      if (data && typeof data === "object") {
        saveStoreSettings({ ...defaultStoreSettings, ...(data as Partial<StoreSettings>) })
      }
    }),
    shopnestApi.shipping.get().then((data) => {
      if (data && typeof data === "object") {
        const s = data as Record<string, unknown>
        saveShippingSettings({
          ...defaultShippingSettings,
          insideDhakaRate: Number(s.insideDhakaRate ?? defaultShippingSettings.insideDhakaRate),
          outsideDhakaRate: Number(s.outsideDhakaRate ?? defaultShippingSettings.outsideDhakaRate),
          subDhakaRate: Number(s.subDhakaRate ?? defaultShippingSettings.subDhakaRate),
          freeShippingEnabled: Boolean(s.freeShippingEnabled ?? defaultShippingSettings.freeShippingEnabled),
          freeShippingThreshold: Number(s.freeShippingThreshold ?? defaultShippingSettings.freeShippingThreshold),
          expressDeliveryEnabled: Boolean(s.expressDeliveryEnabled ?? defaultShippingSettings.expressDeliveryEnabled),
          expressDeliveryRate: Number(s.expressDeliveryRate ?? defaultShippingSettings.expressDeliveryRate),
          pickupEnabled: Boolean(s.pickupEnabled ?? defaultShippingSettings.pickupEnabled),
          pickupAddress: String(s.pickupAddress ?? defaultShippingSettings.pickupAddress),
          defaultCourier: String(s.defaultCourier ?? defaultShippingSettings.defaultCourier),
          specialNotes: String(s.specialNotes ?? defaultShippingSettings.specialNotes),
        })
      }
    }),
    shopnestApi.themes.getActiveConfig().then((data) => {
      const record = data as { themeId?: string; status?: string; config?: Partial<StoreThemeConfig> } | null
      if (record?.themeId) {
        const base = themeDefaults(record.themeId, resolvedSlug)
        const hydrated: StoreThemeConfig = {
          ...base,
          ...(record.config || {}),
          storeSlug: resolvedSlug,
          themeId: record.themeId,
          status: record.status === "DRAFT" ? "Draft" : "Published",
        }
        saveStoreThemeConfig(hydrated)
        if (resolvedSlug !== "demo") {
          saveStoreThemeConfig({ ...hydrated, storeSlug: "demo" })
        }
      }
    }),
    shopnestApi.products.list({ limit: 100 }).then((res) => {
      const paged = res as { items?: Array<Record<string, unknown>> } | null
      if (Array.isArray(paged?.items) && paged.items.length > 0) {
        const mapped: CommerceProduct[] = paged.items.map((p, index) => ({
          id: typeof p.id === "number" ? p.id : index + 1,
          name: String(p.name || ""),
          sku: String(p.sku || ""),
          category: String(p.categoryName || p.category || "Uncategorized"),
          price: Number(p.price || 0),
          sale: Number(p.salePrice ?? p.sale ?? 0),
          stock: Number(p.stock || 0),
          status:
            String(p.status || "ACTIVE").toUpperCase() === "DRAFT"
              ? "Draft"
              : String(p.status || "ACTIVE").toUpperCase() === "ARCHIVED"
              ? "Archived"
              : "Active",
          color: String(p.color || ""),
          sizes: String(p.sizes || ""),
          image: String(p.image || ""),
          description: String(p.description || ""),
        }))
        saveCommerceProducts(mapped)
      }
    }),
  ])
}

