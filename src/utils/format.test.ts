import { describe, it, expect } from "vitest"
import { money, formatNumber, slugify } from "./format"

describe("format utilities", () => {
  describe("money", () => {
    it("formats amounts in Bangladeshi Taka with ৳ prefix", () => {
      expect(money(0)).toBe("৳0")
      expect(money(500)).toBe("৳500")
      expect(money(1850)).toBe("৳1,850")
      expect(money(84250)).toBe("৳84,250")
    })
  })

  describe("formatNumber", () => {
    it("formats integers with comma grouping", () => {
      expect(formatNumber(100)).toBe("100")
      expect(formatNumber(12500)).toBe("12,500")
      expect(formatNumber(1000000)).toBe("1,000,000")
    })
  })

  describe("slugify", () => {
    it("converts strings into URL-safe slugs", () => {
      expect(slugify("Trendora Fashion")).toBe("trendora-fashion")
      expect(slugify("Men's Summer Wear!")).toBe("mens-summer-wear")
      expect(slugify("  Casual & Modern T-Shirts  ")).toBe("casual-modern-t-shirts")
    })
  })
})
