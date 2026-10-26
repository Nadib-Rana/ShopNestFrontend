import { StoreSettings } from "../types"
export type { StoreSettings }

const STORAGE_KEY = "shopnest-store-settings"

export const defaultStoreSettings: StoreSettings = {
  storeName: "Trendora Fashion",
  legalBusinessName: "Trendora Apparel Bangladesh Ltd.",
  tagline: "Elevated everyday apparel and sustainable essentials.",
  supportEmail: "support@trendora.com.bd",
  phone: "+880 1712-345678",
  businessAddress: "House 42, Road 11, Block D, Banani",
  city: "Dhaka",
  postalCode: "1213",
  tradeLicenseNumber: "TRAD/DNCC/029182/2024",
  tinNumber: "7291-8392-1029",
  currency: "BDT (৳)",
  timezone: "Asia/Dhaka (GMT+6)",
  defaultLanguage: "en",
  whatsappNumber: "+880 1819-876543",
  facebookUrl: "https://facebook.com/trendorafashion",
  instagramHandle: "@trendora.bd",
  allowGuestCheckout: true,
  requirePhoneVerification: true,
  smsOrderNotification: true,
  emailOrderNotification: true,
  lowStockAlert: true,
  lowStockThreshold: 5,
  maintenanceMode: false,
  maintenanceMessage: "We are currently updating our store with new seasonal arrivals. Please check back shortly!",
}

export function getStoreSettings(): StoreSettings {
  if (typeof window === "undefined") return defaultStoreSettings
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultStoreSettings
    const parsed = JSON.parse(raw)
    return { ...defaultStoreSettings, ...parsed }
  } catch (e) {
    console.error("Failed to parse store settings from localStorage:", e)
    return defaultStoreSettings
  }
}

export function saveStoreSettings(settings: StoreSettings): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (e) {
    console.error("Failed to save store settings to localStorage:", e)
  }
}

export function resetStoreSettings(): StoreSettings {
  if (typeof window === "undefined") return defaultStoreSettings
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    console.error("Failed to reset store settings:", e)
  }
  return defaultStoreSettings
}
