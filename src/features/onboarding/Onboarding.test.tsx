import { describe, it, expect, beforeEach, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { Onboarding } from "./Onboarding"
import { themeDefinitions, getStoreThemeConfig } from "../../repositories/themeStore"

describe("Onboarding Wizard", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("renders all 8 themes with category filter chips on the theme step", () => {
    const go = vi.fn()
    render(<Onboarding path="/onboarding/theme" go={go} />)

    expect(screen.getByText("Choose your starting theme")).toBeInTheDocument()
    expect(screen.getByText("All Themes")).toBeInTheDocument()
    expect(screen.getByText("Shoes")).toBeInTheDocument()

    themeDefinitions.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument()
    })
  })

  it("filters themes when clicking category chip", () => {
    const go = vi.fn()
    render(<Onboarding path="/onboarding/theme" go={go} />)

    fireEvent.click(screen.getByText("Shoes"))
    expect(screen.getByText("Shoes Store")).toBeInTheDocument()
    expect(screen.queryByText("Electronics Store")).not.toBeInTheDocument()
  })

  it("pre-selects the pending theme from localStorage if present", () => {
    localStorage.setItem("shopnest_pending_theme", "shoes")
    const go = vi.fn()
    render(<Onboarding path="/onboarding/theme" go={go} />)

    const shoesCard = screen.getByText("Shoes Store").closest(".theme-gallery-card")
    expect(shoesCard).toHaveClass("active")
  })

  it("allows switching themes and triggers preview", () => {
    const go = vi.fn()
    render(<Onboarding path="/onboarding/theme" go={go} />)

    const beautyCard = screen.getByText("Cosmetics & Beauty Store").closest(".theme-gallery-card")
    expect(beautyCard).toBeInTheDocument()
    fireEvent.click(beautyCard!)

    expect(beautyCard).toHaveClass("active")

    const previewBtn = beautyCard!.querySelector("button.secondary")
    expect(previewBtn).toHaveTextContent("Preview")
    fireEvent.click(previewBtn!)
    expect(go).toHaveBeenCalledWith("/store/bloom/preview")
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
