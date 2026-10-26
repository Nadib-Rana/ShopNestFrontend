import { describe, it, expect, beforeEach, vi } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useRoute } from "./useRoute"

describe("useRoute", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/seller/overview")
    window.scrollTo = vi.fn()
  })

  it("initializes with the current window.location.pathname", () => {
    const { result } = renderHook(() => useRoute())
    expect(result.current.path).toBe("/seller/overview")
  })

  it("updates path and history when go() is invoked", () => {
    const { result } = renderHook(() => useRoute())

    act(() => {
      result.current.go("/seller/products")
    })

    expect(result.current.path).toBe("/seller/products")
    expect(window.location.pathname).toBe("/seller/products")
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" })
  })

  it("responds to window popstate events", () => {
    const { result } = renderHook(() => useRoute())

    act(() => {
      window.history.pushState({}, "", "/seller/orders")
      window.dispatchEvent(new PopStateEvent("popstate"))
    })

    expect(result.current.path).toBe("/seller/orders")
  })
})
