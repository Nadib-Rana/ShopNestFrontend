import { describe, it, expect, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { getStoreThemeConfig, saveStoreThemeConfig, StoreThemeConfig, themeDefaults } from "@/themeStore"
import CustomerStorefront from "@/features/storefront/CustomerStorefront"
import ThemeStudio from "@/features/themes/ThemeStudio"
import PublicThemesPage from "@/features/themes/PublicThemesPage"
import ShopNestHome from "@/features/home/ShopNestHome"
import { setRegisteredUser } from "@/utils/auth"

describe("Themes & Customization", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("persists and retrieves StoreThemeConfig with logoImage, announcementText, header, and footer", () => {
    const customConfig: StoreThemeConfig = {
      storeSlug: "demo",
      themeId: "fashion",
      logo: "CUSTOM_BRAND",
      logoImage: "data:image/png;base64,mockLogoData",
      primary: "#123456",
      secondary: "#abcdef",
      background: "#ffffff",
      text: "#000000",
      font: "Editorial",
      heroTitle: "Custom Hero",
      heroText: "Custom Hero Text",
      announcementText: "Limited Time Free Shipping!",
      showCategories: true,
      showPromo: false,
      showTestimonials: true,
      grid: 3,
      header: "Compact",
      footer: "Minimal",
      status: "Published",
    }

    saveStoreThemeConfig(customConfig)
    const loaded = getStoreThemeConfig("demo")

    expect(loaded.logo).toBe("CUSTOM_BRAND")
    expect(loaded.logoImage).toBe("data:image/png;base64,mockLogoData")
    expect(loaded.announcementText).toBe("Limited Time Free Shipping!")
    expect(loaded.header).toBe("Compact")
    expect(loaded.footer).toBe("Minimal")
  })

  it("renders custom announcement bar and uploaded logo on demo storefront", () => {
    saveStoreThemeConfig({
      storeSlug: "demo",
      themeId: "fashion",
      logo: "TRENDORA",
      logoImage: "data:image/png;base64,logoImageBytes",
      primary: "#755b46",
      secondary: "#eae2d7",
      background: "#f7f5f0",
      text: "#24201c",
      font: "Editorial",
      heroTitle: "Quiet confidence",
      heroText: "Editorial collections",
      announcementText: "Special 20% Eid Discount across all categories",
      showCategories: true,
      showPromo: true,
      showTestimonials: true,
      grid: 4,
      header: "Compact",
      footer: "Minimal",
      status: "Published",
    })

    const { container } = render(<CustomerStorefront path="/store/demo" go={() => {}} />)

    expect(screen.getByText("Special 20% Eid Discount across all categories")).toBeInTheDocument()
    const logoImg = container.querySelector(".store-logo img")
    expect(logoImg).toBeInTheDocument()
    expect(logoImg).toHaveAttribute("src", "data:image/png;base64,logoImageBytes")
    expect(container.querySelector(".header-layout-compact")).toBeInTheDocument()
    expect(container.querySelector(".store-footer-minimal")).toBeInTheDocument()
  })

  it("maintains configuration isolation between different store slugs", () => {
    saveStoreThemeConfig({
      ...themeDefaults("fashion", "store-alpha"),
      storeSlug: "store-alpha",
      heroTitle: "Alpha Exclusive Store",
      primary: "#112233",
    })

    saveStoreThemeConfig({
      ...themeDefaults("shoes", "store-beta"),
      storeSlug: "store-beta",
      heroTitle: "Beta Sneakers Only",
      primary: "#998877",
    })

    const alpha = getStoreThemeConfig("store-alpha")
    const beta = getStoreThemeConfig("store-beta")

    expect(alpha.heroTitle).toBe("Alpha Exclusive Store")
    expect(alpha.primary).toBe("#112233")
    expect(alpha.themeId).toBe("fashion")

    expect(beta.heroTitle).toBe("Beta Sneakers Only")
    expect(beta.primary).toBe("#998877")
    expect(beta.themeId).toBe("shoes")
  })

  it("preserves previous theme-specific customizations when switching themes", () => {
    const storeSlug = "demo-switch"

    // 1. Customize Shoes
    const initialShoes = themeDefaults("shoes", storeSlug)
    saveStoreThemeConfig({
      ...initialShoes,
      shoesDropTag: "CUSTOM VIP DROP 2026",
      shoesBadgeText: "AIR / SPEED",
    })

    // Verify it saved
    expect(getStoreThemeConfig(storeSlug).shoesDropTag).toBe("CUSTOM VIP DROP 2026")

    // 2. Switch to Electronics
    const electronics = themeDefaults("electronics", storeSlug)
    saveStoreThemeConfig({
      ...electronics,
      techWarrantyText: "5-Year VIP Tech Warranty",
    })
    expect(getStoreThemeConfig(storeSlug).themeId).toBe("electronics")
    expect(getStoreThemeConfig(storeSlug).techWarrantyText).toBe("5-Year VIP Tech Warranty")

    // 3. Switch back to Shoes -> previously saved customizations must be restored!
    const restoredShoes = themeDefaults("shoes", storeSlug)
    expect(restoredShoes.shoesDropTag).toBe("CUSTOM VIP DROP 2026")
    expect(restoredShoes.shoesBadgeText).toBe("AIR / SPEED")
  })

  it("renders distinct storefront elements for all 8 themes", () => {
    // 1. Fashion
    saveStoreThemeConfig({ ...themeDefaults("fashion", "demo"), storeSlug: "demo" })
    const fRes = render(<CustomerStorefront path="/store/demo" go={() => {}} />)
    expect(fRes.container.querySelector(".header-fashion")).toBeInTheDocument()
    fRes.unmount()

    // 2. Shoes
    saveStoreThemeConfig({ ...themeDefaults("shoes", "demo"), storeSlug: "demo", shoesDropTag: "SPEED LAB DROP", shoesBadgeText: "RUN / LIVE" })
    const sRes = render(<CustomerStorefront path="/store/demo" go={() => {}} />)
    expect(sRes.container.querySelector(".header-shoes")).toBeInTheDocument()
    expect(sRes.container.querySelector(".sport-strip")).toHaveTextContent("SPEED LAB DROP")
    expect(sRes.container.querySelector(".store-logo i")).toHaveTextContent("RUN / LIVE")
    sRes.unmount()

    // 3. Electronics
    saveStoreThemeConfig({ ...themeDefaults("electronics", "demo"), storeSlug: "demo", techWarrantyText: "3-year official warranty" })
    const eRes = render(<CustomerStorefront path="/store/demo" go={() => {}} />)
    expect(eRes.container.querySelector(".header-electronics")).toBeInTheDocument()
    expect(eRes.container.querySelector(".tech-nav span")).toHaveTextContent("3-year official warranty")
    expect(screen.getByText("Compare")).toBeInTheDocument()
    eRes.unmount()

    // 4. Beauty
    saveStoreThemeConfig({ ...themeDefaults("beauty", "demo"), storeSlug: "demo", beautyRitualNote: "Pure calm botanical ritual" })
    const bRes = render(<CustomerStorefront path="/store/demo" go={() => {}} />)
    expect(bRes.container.querySelector(".header-beauty")).toBeInTheDocument()
    expect(bRes.container.querySelector(".beauty-note")).toHaveTextContent("Pure calm botanical ritual")
    expect(bRes.container.querySelector(".store-logo small")).toHaveTextContent("BEAUTY RITUALS")
    bRes.unmount()

    // 5. Grocery
    saveStoreThemeConfig({ ...themeDefaults("grocery", "demo"), storeSlug: "demo", groceryDeliveryArea: "Gulshan & Banani" })
    const gRes = render(<CustomerStorefront path="/store/demo" go={() => {}} />)
    expect(gRes.container.querySelector(".header-grocery")).toBeInTheDocument()
    expect(gRes.container.querySelector(".delivery-pill strong")).toHaveTextContent("Gulshan & Banani")
    gRes.unmount()

    // 6. Decor
    saveStoreThemeConfig({ ...themeDefaults("decor", "demo"), storeSlug: "demo", decorQuote: "Warm sanctuary objects." })
    const dRes = render(<CustomerStorefront path="/store/demo" go={() => {}} />)
    expect(dRes.container.querySelector(".header-decor")).toBeInTheDocument()
    expect(dRes.container.querySelector(".decor-quote")).toHaveTextContent("Warm sanctuary objects.")
    dRes.unmount()

    // 7. Furniture
    saveStoreThemeConfig({ ...themeDefaults("furniture", "demo"), storeSlug: "demo", furnitureSubtitle: "NORDIC CRAFT / DHAKA" })
    const furRes = render(<CustomerStorefront path="/store/demo" go={() => {}} />)
    expect(furRes.container.querySelector(".header-furniture")).toBeInTheDocument()
    expect(furRes.container.querySelector(".header-furniture span")).toHaveTextContent("NORDIC CRAFT / DHAKA")
    furRes.unmount()

    // 8. Retail
    saveStoreThemeConfig({ ...themeDefaults("retail", "demo"), storeSlug: "demo", retailCategoryTag: "Browse All Departments" })
    const rRes = render(<CustomerStorefront path="/store/demo" go={() => {}} />)
    expect(rRes.container.querySelector(".header-retail")).toBeInTheDocument()
    expect(rRes.container.querySelector(".all-categories")).toHaveTextContent("Browse All Departments")
    rRes.unmount()
  })

  it("shared customizer displays theme-specific controls and updates preview in real-time", () => {
    saveStoreThemeConfig({ ...themeDefaults("shoes", "demo"), storeSlug: "demo", shoesDropTag: "SUMMER MARATHON" })
    const { container } = render(<ThemeStudio path="/seller/customizer" go={() => {}} notify={() => {}} />)

    // Shoes controls rendered
    expect(screen.getByText("Shoes & Sneakers Settings")).toBeInTheDocument()
    expect(screen.getByDisplayValue("SUMMER MARATHON")).toBeInTheDocument()

    // Preview rendered with authentic shoes elements
    expect(container.querySelector(".sport-strip")).toHaveTextContent("SUMMER MARATHON")
    expect(container.querySelector(".preview-theme-shoes")).toBeInTheDocument()

    // Real-time input change updates preview immediately
    const input = screen.getByDisplayValue("SUMMER MARATHON")
    fireEvent.change(input, { target: { value: "AUTUMN MARATHON DROP" } })

    expect(container.querySelector(".sport-strip")).toHaveTextContent("AUTUMN MARATHON DROP")
  })

  it("navigates to /themes from landing page Themes button", () => {
    let currentPath = "/"
    const { getByRole } = render(<ShopNestHome go={(p) => { currentPath = p }} />)
    const themesBtn = getByRole("button", { name: "Themes" })
    fireEvent.click(themesBtn)
    expect(currentPath).toBe("/themes")
  })

  it("redirects unregistered user to /signup when clicking 'Use theme' on /themes", () => {
    let currentPath = "/themes"
    const { getAllByText } = render(<PublicThemesPage go={(p) => { currentPath = p }} />)

    const useThemeBtns = getAllByText("Use theme")
    expect(useThemeBtns.length).toBe(8)

    // Click Use theme for first item (fashion)
    fireEvent.click(useThemeBtns[0])

    expect(currentPath).toBe("/signup")
    expect(localStorage.getItem("shopnest_pending_theme")).toBe("fashion")
  })

  it("applies theme directly and navigates to customizer when user is registered", () => {
    setRegisteredUser({ email: "merchant@example.com", name: "Saif" })
    let currentPath = "/themes"
    const { getAllByText } = render(<PublicThemesPage go={(p) => { currentPath = p }} />)

    const useThemeBtns = getAllByText("Use theme")
    // Click Use theme for shoes (second item)
    fireEvent.click(useThemeBtns[1])

    expect(currentPath).toBe("/seller/customizer")
    expect(getStoreThemeConfig("demo").themeId).toBe("shoes")
  })

  it("customizer locks full access to selected theme and storefront renders that selected theme", () => {
    // Select Electronics theme
    saveStoreThemeConfig({ ...themeDefaults("electronics", "demo"), storeSlug: "demo" })

    // Customizer renders active Electronics theme and tech controls
    const custRes = render(<ThemeStudio path="/seller/customizer" go={() => {}} notify={() => {}} />)
    expect(custRes.getByText("Active Store Theme")).toBeInTheDocument()
    expect(custRes.getAllByText("Electronics Store")[0]).toBeInTheDocument()
    expect(custRes.getByText("Electronics & Tech Settings")).toBeInTheDocument()

    // Storefront at /store/demo renders Electronics Store
    const storeRes = render(<CustomerStorefront path="/store/demo" go={() => {}} />)
    expect(storeRes.container.querySelector(".theme-electronics")).toBeInTheDocument()
    expect(storeRes.container.querySelector(".header-electronics")).toBeInTheDocument()
    expect(storeRes.getAllByText("Featured technology").length).toBeGreaterThan(0)
  })

  it("returns to /seller/themes when closing preview from seller dashboard", () => {
    setRegisteredUser({ email: "seller@example.com", name: "Rana" })
    let currentPath = "/seller/themes"
    const go = (p: string) => { currentPath = p }

    // Click Preview in seller theme gallery
    const { getAllByText } = render(<ThemeStudio path="/seller/themes" go={go} notify={() => {}} />)
    const previewBtns = getAllByText("Preview")
    fireEvent.click(previewBtns[0])

    expect(currentPath).toBe("/store/demo/preview")
    expect(localStorage.getItem("shopnest_preview_return")).toBe("/seller/themes")

    // In storefront preview, click Close Preview
    const { getByText } = render(<CustomerStorefront path="/store/demo/preview" go={go} />)
    const closeBtn = getByText("Close Preview")
    fireEvent.click(closeBtn)

    expect(currentPath).toBe("/seller/themes")
  })
})
