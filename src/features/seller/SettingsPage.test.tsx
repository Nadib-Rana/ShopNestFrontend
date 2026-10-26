import React from "react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import SettingsPage from "./SettingsPage"
import { defaultStoreSettings, saveStoreSettings } from "../../repositories/settingsStore"

describe("SettingsPage", () => {
  const notifyMock = vi.fn()

  beforeEach(() => {
    localStorage.clear()
    notifyMock.mockClear()
  })

  it("renders the Store Settings workspace with header and stat cards", () => {
    render(<SettingsPage notify={notifyMock} />)

    expect(screen.getByRole("heading", { name: "Store Settings" })).toBeInTheDocument()
    expect(screen.getByText("Configure your brand identity, business registration, localization, and customer operations.")).toBeInTheDocument()
    expect(screen.getByText("Storefront Status")).toBeInTheDocument()
    expect(screen.getByText("BDT (৳)")).toBeInTheDocument()
  })

  it("switches tabs between General, Contact, Legal, Preferences, and Danger Zone", () => {
    render(<SettingsPage notify={notifyMock} />)

    // Initially General Profile is active
    expect(screen.getByText("Brand Identity")).toBeInTheDocument()

    // Switch to Contact & Address
    fireEvent.click(screen.getByRole("button", { name: "Contact & Address" }))
    expect(screen.getByText("Customer Support & Contact Info")).toBeInTheDocument()

    // Switch to Business & Legal
    fireEvent.click(screen.getByRole("button", { name: "Business & Legal" }))
    expect(screen.getByText("Bangladeshi Trade & Legal Registration")).toBeInTheDocument()

    // Switch to Checkout & Preferences
    fireEvent.click(screen.getByRole("button", { name: "Checkout & Preferences" }))
    expect(screen.getByText("Regional Localization")).toBeInTheDocument()

    // Switch to Maintenance & Danger Zone
    fireEvent.click(screen.getByRole("button", { name: "Maintenance & Danger Zone" }))
    expect(screen.getByText("Storefront Maintenance Mode")).toBeInTheDocument()
    expect(screen.getByText("Danger Zone")).toBeInTheDocument()
  })

  it("allows updating store name and saving changes successfully", () => {
    render(<SettingsPage notify={notifyMock} />)

    const storeNameInput = screen.getByPlaceholderText("e.g. Trendora Fashion")
    fireEvent.change(storeNameInput, { target: { value: "Apex Leatherworks" } })

    const saveButton = screen.getByRole("button", { name: "Save Changes" })
    fireEvent.click(saveButton)

    expect(notifyMock).toHaveBeenCalledWith("Store settings have been saved successfully.")
    expect(localStorage.getItem("shopnest-store-settings")).toContain("Apex Leatherworks")
  })

  it("toggles maintenance mode and reveals maintenance notice message textarea", () => {
    render(<SettingsPage notify={notifyMock} />)

    // Navigate to danger tab
    fireEvent.click(screen.getByRole("button", { name: "Maintenance & Danger Zone" }))

    const maintenanceCheckbox = screen.getByRole("checkbox")
    expect(maintenanceCheckbox).not.toBeChecked()

    // Toggle maintenance mode on
    fireEvent.click(maintenanceCheckbox)
    expect(maintenanceCheckbox).toBeChecked()

    // Textarea for banner message should now be visible
    expect(screen.getByText("Maintenance Notice Banner Message")).toBeInTheDocument()
  })
})
