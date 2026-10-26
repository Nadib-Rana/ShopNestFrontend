import { describe, it, expect, beforeEach } from "vitest"
import {
  defaultStoreSettings,
  getStoreSettings,
  saveStoreSettings,
  resetStoreSettings,
} from "./settingsStore"

describe("settingsStore", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("returns default store settings when localStorage is empty", () => {
    const settings = getStoreSettings()
    expect(settings.storeName).toBe("Trendora Fashion")
    expect(settings.currency).toBe("BDT (৳)")
    expect(settings.allowGuestCheckout).toBe(true)
    expect(settings.maintenanceMode).toBe(false)
  })

  it("persists updated settings to localStorage and retrieves them", () => {
    const custom = {
      ...defaultStoreSettings,
      storeName: "Dhaka Craft Studio",
      phone: "+880 1999-123456",
      maintenanceMode: true,
    }
    saveStoreSettings(custom)

    const retrieved = getStoreSettings()
    expect(retrieved.storeName).toBe("Dhaka Craft Studio")
    expect(retrieved.phone).toBe("+880 1999-123456")
    expect(retrieved.maintenanceMode).toBe(true)
  })

  it("resets store settings to defaults", () => {
    saveStoreSettings({
      ...defaultStoreSettings,
      storeName: "Temporary Name",
    })
    expect(getStoreSettings().storeName).toBe("Temporary Name")

    const reset = resetStoreSettings()
    expect(reset.storeName).toBe("Trendora Fashion")
    expect(getStoreSettings().storeName).toBe("Trendora Fashion")
  })
})
