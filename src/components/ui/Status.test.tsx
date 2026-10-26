import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Status } from "./Status"

describe("Status component", () => {
  it("renders children content with default green tone", () => {
    render(<Status>Active Order</Status>)
    const el = screen.getByText("Active Order")
    expect(el).toBeInTheDocument()
    expect(el.closest(".status")).toHaveClass("green")
  })

  it("applies customized tone classes", () => {
    const { container } = render(<Status tone="amber">Pending Approval</Status>)
    expect(container.firstChild).toHaveClass("status", "amber")
  })
})
