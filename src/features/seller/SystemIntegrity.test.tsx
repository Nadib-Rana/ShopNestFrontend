import { describe, it, expect, beforeEach, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import App from "../../App"
import SellerManagement from "./SellerManagement"
import CustomerStorefront from "../storefront/CustomerStorefront"
import { setRegisteredUser, clearRegisteredUser } from "../../utils/auth"
import { getCommerceProducts, saveCommerceProducts } from "../../repositories/commerceStore"
import { defaultStoreSettings, saveStoreSettings } from "../../repositories/settingsStore"
import { saveStoreThemeConfig, themeDefaults } from "../../repositories/themeStore"

describe("System Integrity & Architectural Fixes", () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    clearRegisteredUser()
    window.history.pushState({}, "", "/")
  })

  it("blocks unauthenticated users from /seller/overview and shows login screen", () => {
    window.history.pushState({}, "", "/seller/overview")
    render(<App />)
    expect(screen.getByText("Welcome back")).toBeInTheDocument()
  })

  it("blocks seller role from /admin/overview with 403 access denied", () => {
    setRegisteredUser({ email: "seller@trendora.com", name: "Saif", role: "seller" })
    window.history.pushState({}, "", "/admin/overview")
    render(<App />)
    expect(screen.getByText("Admin access required.")).toBeInTheDocument()
  })

  it("allows authenticated seller to access /seller/overview", () => {
    setRegisteredUser({ email: "seller@trendora.com", name: "Saif", role: "seller" })
    window.history.pushState({}, "", "/seller/overview")
    render(<App />)
    expect(screen.getByText("Good morning, Saif")).toBeInTheDocument()
  })

  it("edits the specific product by ID in SellerManagement instead of always Product #1", () => {
    const go = vi.fn()
    const notify = vi.fn()
    render(<SellerManagement path="/seller/products/2/edit" go={go} notify={notify} />)

    expect(screen.getByDisplayValue("Classic Pleated Trouser")).toBeInTheDocument()
    expect(screen.getByDisplayValue("CPT-209")).toBeInTheDocument()
  })

  it("preserves custom stock adjustment reason in Inventory AdjustDialog", () => {
    const go = vi.fn()
    const notify = vi.fn()
    render(<SellerManagement path="/seller/inventory" go={go} notify={notify} />)

    const adjustButtons = screen.getAllByText("Adjust")
    fireEvent.click(adjustButtons[0])

    const reasonInput = screen.getByPlaceholderText("Stock received, correction...")
    fireEvent.change(reasonInput, { target: { value: "Restocked from Gazipur warehouse" } })
    fireEvent.click(screen.getByText("Confirm adjustment"))

    expect(notify).toHaveBeenCalledWith(expect.stringContaining("Restocked from Gazipur warehouse"))
  })

  it("enforces maintenance mode on the demo storefront", () => {
    saveStoreSettings({
      ...defaultStoreSettings,
      maintenanceMode: true,
      maintenanceMessage: "Scheduled catalog upgrade in progress.",
    })

    render(<CustomerStorefront path="/store/demo" go={vi.fn()} />)
    expect(screen.getByText("We’ll be right back.")).toBeInTheDocument()
    expect(screen.getByText("Scheduled catalog upgrade in progress.")).toBeInTheDocument()
  })

  it("prevents adding out-of-stock products on ProductDetail", () => {
    const products = getCommerceProducts()
    saveCommerceProducts(products.map((p, idx) => (idx === 0 ? { ...p, stock: 0 } : p)))

    render(<CustomerStorefront path="/store/demo/products/1" go={vi.fn()} />)
    expect(screen.getByRole("button", { name: "Out of stock" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Buy now" })).toBeDisabled()
  })

  it("resets theme settings to factory defaults when ignoreCache is true", () => {
    const customized = {
      ...themeDefaults("fashion", "demo"),
      heroTitle: "Custom Winter Collection",
      primary: "#112233",
    }
    saveStoreThemeConfig(customized)

    // Preserved on normal theme switch
    expect(themeDefaults("fashion", "demo").heroTitle).toBe("Custom Winter Collection")
    // Factory reset ignores cache
    expect(themeDefaults("fashion", "demo", true).heroTitle).toBe("Quiet confidence, thoughtfully worn.")
    expect(themeDefaults("fashion", "demo", true).primary).toBe("#755b46")
  })

  it("renders a newly onboarded custom store subdomain instead of 404 after publishing", () => {
    saveStoreThemeConfig({
      ...themeDefaults("decor", "dhaka-crafts"),
      storeSlug: "dhaka-crafts",
      logo: "DHAKA CRAFTS",
      heroTitle: "Handcrafted Home Decor",
      status: "Published",
    })

    render(<CustomerStorefront path="/store/dhaka-crafts" go={vi.fn()} />)
    expect(screen.getAllByText("DHAKA CRAFTS").length).toBeGreaterThan(0)
    expect(screen.getByText("Handcrafted Home Decor")).toBeInTheDocument()
  })
})

