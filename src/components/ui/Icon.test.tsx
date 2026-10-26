import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { Icon } from "./Icon"

describe("Icon component", () => {
  it("renders SVG with default size 18 and aria-hidden", () => {
    const { container } = render(<Icon name="truck" />)
    const svg = container.querySelector("svg")
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute("width", "18")
    expect(svg).toHaveAttribute("height", "18")
    expect(svg).toHaveAttribute("aria-hidden", "true")
  })

  it("accepts custom size and className", () => {
    const { container } = render(<Icon name="check" size={24} className="custom-icon" />)
    const svg = container.querySelector("svg")
    expect(svg).toHaveAttribute("width", "24")
    expect(svg).toHaveAttribute("height", "24")
    expect(svg).toHaveClass("custom-icon")
  })

  it("returns null for unknown icon names", () => {
    const { container } = render(<Icon name="unknown-icon-name" />)
    expect(container.querySelector("svg")).toBeNull()
  })
})
