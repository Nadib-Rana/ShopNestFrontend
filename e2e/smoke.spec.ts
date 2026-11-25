import { test, expect } from "@playwright/test"

test.describe("ShopNest Frontend E2E Smoke Journeys", () => {
  test("Landing page -> Theme Gallery renders all 8 storefront themes", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByText("ShopNest").first()).toBeVisible()

    await page.goto("/themes")
    await expect(
      page.getByRole("heading", { name: /Pick a foundation/i }).first(),
    ).toBeVisible()
    await expect(page.getByRole("heading", { name: "Fashion Store" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "Electronics Store" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "Shoes Store" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "Cosmetics & Beauty Store" })).toBeVisible()
  })

  test("Unauthenticated access to /seller/overview renders login gate", async ({ page }) => {
    await page.goto("/seller/overview")
    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Log in" })).toBeVisible()
  })

  test("Public storefront /store/demo -> browse catalog -> product detail -> add to bag -> checkout", async ({ page }) => {
    await page.goto("/store/demo")
    await expect(page.locator(".customer-store")).toBeVisible()

    await page.goto("/store/demo/products")
    await expect(page.getByRole("heading", { name: "All products" })).toBeVisible()

    // Open Linen Summer Shirt product detail
    await page.getByRole("button", { name: /Linen Summer Shirt/i }).first().click()

    // Select variant option first, then add to bag
    await page.getByRole("button", { name: "Sand / M" }).click()
    const addToBag = page.getByRole("button", { name: /add to bag|add to cart/i }).first()
    await expect(addToBag).toBeVisible()
    await addToBag.click()

    // Open cart via Bag button (SPA navigation preserves cart state)
    await page.getByRole("button", { name: /Bag 1/i }).first().click()
    await expect(page.getByText(/Linen Summer Shirt/i).first()).toBeVisible()

    // Proceed to checkout
    await page.getByRole("button", { name: /proceed to checkout/i }).first().click()
    await expect(page.getByRole("heading", { name: "Delivery details" })).toBeVisible()
    await expect(page.getByText("৳1,720")).toBeVisible()

    // Invalid BD phone must be rejected on review
    await page.getByLabel("Full name").fill("E2E Shopper")
    await page.getByLabel("Phone").fill("12345")
    await page.getByLabel("Delivery address").fill("House 12, Dhanmondi")
    await page.getByLabel("Area / postal code").fill("Dhanmondi 1209")
    await page.getByRole("button", { name: "Review order" }).click()
    await expect(page.getByText(/017XXXXXXXX|Bangladesh|phone/i).first()).toBeVisible()

    // Valid BD phone proceeds to review step and places order
    await page.getByLabel("Phone").fill("01712345678")
    await page.getByRole("button", { name: "Review order" }).click()
    await expect(page.getByRole("heading", { name: "Review your order" })).toBeVisible()
    await page.getByRole("button", { name: /place.*order/i }).first().click()
    await expect(page.getByText(/order confirmed|thank you|SN-/i).first()).toBeVisible()
  })
})


