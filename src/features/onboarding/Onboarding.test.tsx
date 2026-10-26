import { describe, it, expect, beforeEach, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { Onboarding } from "./Onboarding"
import { themeDefinitions, getStoreThemeConfig } from "../../repositories/themeStore"

describe("Onboarding Wizard", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("renders all 8 themes on the theme step", () => {
    const go = vi.fn()
    render(<Onboarding path="/onboarding/theme" go={go} />)

    expect(screen.getByText("Choose your starting theme")).toBeInTheDocument()
    themeDefinitions.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument()
      expect(screen.getByText(item.label)).toBeInTheDocument()
    })
  })

  it("pre-selects the pending theme from localStorage if present", () => {
    localStorage.setItem("shopnest_pending_theme", "shoes")
    const go = vi.fn()
    render(<Onboarding path="/onboarding/theme" go={go} />)

    const shoesButton = screen.getByText("Shoes Store").closest("button")
    expect(shoesButton).toHaveClass("selected")
  })

  it("allows switching themes and reviews the selected theme title", () => {
    const go = vi.fn()
    render(<Onboarding path="/onboarding/theme" go={go} />)

    const electronicsButton = screen.getByText("Electronics Store").closest("button")
    expect(electronicsButton).toBeInTheDocument()
    fireEvent.click(electronicsButton!)

    expect(electronicsButton).toHaveClass("selected")
  })

  it("saves the store theme config upon completing onboarding", () => {
    localStorage.setItem("shopnest_pending_theme", "beauty")
    const go = vi.fn()
    render(<Onboarding path="/onboarding/complete" go={go} />)

    expect(screen.getByText("Cosmetics & Beauty Store")).toBeInTheDocument()

    const finishBtn = screen.getByText("Enter seller dashboard")
    fireEvent.click(finishBtn)

    expect(go).toHaveBeenCalledWith("/seller/overview")
    const saved = getStoreThemeConfig("demo")
    expect(saved.themeId).toBe("beauty")
    expect(localStorage.getItem("shopnest_pending_theme")).toBeNull()
  })
})
