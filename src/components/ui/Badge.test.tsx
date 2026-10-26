import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Badge } from "./Badge"

describe("Badge component", () => {
  it("renders text and slugifies children into class name if tone is omitted", () => {
    render(<Badge>Under Review</Badge>)
    const el = screen.getByText("Under Review")
    expect(el).toBeInTheDocument()
    expect(el.closest(".mg-badge")).toHaveClass("under-review")
  })

  it("uses explicit tone when provided", () => {
    const { container } = render(<Badge tone="active">In Stock</Badge>)
    expect(container.firstChild).toHaveClass("mg-badge", "active")
  })
})
