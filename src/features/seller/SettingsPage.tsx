import React, { useState } from "react"
import { Icon } from "../../components/ui/Icon"
import { Badge } from "../../components/ui/Badge"
import { Status } from "../../components/ui/Status"
import type { StoreSettings } from "../../types"
import {
  defaultStoreSettings,
  getStoreSettings,
  saveStoreSettings,
  resetStoreSettings,
} from "../../repositories/settingsStore"

export interface SettingsPageProps {
  notify: (message: string) => void
}

type TabType = "general" | "contact" | "legal" | "preferences" | "notifications" | "social" | "danger"

export default function SettingsPage({ notify }: SettingsPageProps) {
  const [settings, setSettings] = useState<StoreSettings>(getStoreSettings)
  const [activeTab, setActiveTab] = useState<TabType>("general")
  const [isDirty, setIsDirty] = useState<boolean>(false)
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false)

  const updateSetting = <K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) => {
    setSettings((prev: StoreSettings) => ({
      ...prev,
      [key]: value,
    }))
    setIsDirty(true)
  }

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!settings.storeName.trim()) {
      notify("Store name cannot be empty.")
      return
    }
    if (!settings.supportEmail.trim() || !settings.supportEmail.includes("@")) {
      notify("Please provide a valid support email address.")
      return
    }
    if (!settings.phone.trim()) {
      notify("Please enter a customer hotline or support phone number.")
      return
    }

    saveStoreSettings(settings)
    setIsDirty(false)
    notify("Store settings have been saved successfully.")
  }

  const handleResetToDefaults = () => {
    const defaults = resetStoreSettings()
    setSettings(defaults)
    setIsDirty(false)
    setResetConfirmOpen(false)
    notify("Store settings restored to default presets.")
  }

  return (
    <div className="content" style={{ maxWidth: "1160px", margin: "0 auto", paddingBottom: "60px" }}>
      {/* Top Header */}
      <div className="section-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h2 style={{ margin: 0, fontSize: "24px", fontFamily: "var(--font-display)", fontWeight: 700 }}>
              Store Settings
            </h2>
            <Badge tone={settings.maintenanceMode ? "draft" : "active"}>
              {settings.maintenanceMode ? "Maintenance Mode" : "Live Store"}
            </Badge>
          </div>
          <p style={{ margin: "6px 0 0", color: "#667085", fontSize: "14px" }}>
            Configure your brand identity, business registration, localization, and customer operations.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {isDirty && (
            <span style={{ fontSize: "12px", color: "var(--primary, #4b4bc7)", fontWeight: 600 }}>
              ● Unsaved changes
            </span>
          )}
          <button
            type="button"
            className="secondary"
            onClick={() => setResetConfirmOpen(true)}
            style={{ fontSize: "13px", padding: "8px 14px" }}
          >
            Reset
          </button>
          <button
            type="button"
            className="primary"
            onClick={() => handleSave()}
            style={{
              fontSize: "13px",
              padding: "8px 18px",
              backgroundColor: isDirty ? "var(--primary, #4b4bc7)" : undefined,
              boxShadow: isDirty ? "0 2px 8px rgba(75, 75, 199, 0.3)" : undefined,
            }}
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "14px",
          marginBottom: "24px",
        }}
      >
        <div className="mg-card" style={{ padding: "16px 18px" }}>
          <span style={{ color: "#8490a2", fontSize: "11px", textTransform: "uppercase", fontWeight: 700, letterSpacing: ".04em" }}>
            Storefront Status
          </span>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: "6px" }}>
            <strong style={{ fontSize: "18px", fontFamily: "var(--font-display)", color: settings.maintenanceMode ? "#e05638" : "#24a875" }}>
              {settings.maintenanceMode ? "Offline (Notice)" : "Online & Active"}
            </strong>
            <Status tone={settings.maintenanceMode ? "amber" : "green"}>
              {settings.maintenanceMode ? "Under Maintenance" : "Healthy"}
            </Status>
          </div>
        </div>

        <div className="mg-card" style={{ padding: "16px 18px" }}>
          <span style={{ color: "#8490a2", fontSize: "11px", textTransform: "uppercase", fontWeight: 700, letterSpacing: ".04em" }}>
            Currency & Timezone
          </span>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: "6px" }}>
            <strong style={{ fontSize: "18px", fontFamily: "var(--font-display)" }}>
              {settings.currency}
            </strong>
            <span style={{ fontSize: "12px", color: "#667085" }}>GMT+6 (Dhaka)</span>
          </div>
        </div>

        <div className="mg-card" style={{ padding: "16px 18px" }}>
          <span style={{ color: "#8490a2", fontSize: "11px", textTransform: "uppercase", fontWeight: 700, letterSpacing: ".04em" }}>
            Guest Checkout
          </span>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: "6px" }}>
            <strong style={{ fontSize: "18px", fontFamily: "var(--font-display)" }}>
              {settings.allowGuestCheckout ? "Enabled" : "Account Required"}
            </strong>
            <Badge tone={settings.allowGuestCheckout ? "active" : "draft"}>
              {settings.allowGuestCheckout ? "High Conversion" : "Strict"}
            </Badge>
          </div>
        </div>

        <div className="mg-card" style={{ padding: "16px 18px" }}>
          <span style={{ color: "#8490a2", fontSize: "11px", textTransform: "uppercase", fontWeight: 700, letterSpacing: ".04em" }}>
            Order Alerts
          </span>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: "6px" }}>
            <strong style={{ fontSize: "18px", fontFamily: "var(--font-display)" }}>
              {settings.smsOrderNotification && settings.emailOrderNotification
                ? "SMS & Email"
                : settings.smsOrderNotification
                ? "SMS Only"
                : settings.emailOrderNotification
                ? "Email Only"
                : "Disabled"}
            </strong>
            <Status tone="blue">Realtime</Status>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mg-tabs" style={{ marginBottom: "22px", flexWrap: "wrap" }}>
        <button
          className={activeTab === "general" ? "active" : ""}
          onClick={() => setActiveTab("general")}
        >
          General Profile
        </button>
        <button
          className={activeTab === "contact" ? "active" : ""}
          onClick={() => setActiveTab("contact")}
        >
          Contact & Address
        </button>
        <button
          className={activeTab === "legal" ? "active" : ""}
          onClick={() => setActiveTab("legal")}
        >
          Business & Legal
        </button>
        <button
          className={activeTab === "preferences" ? "active" : ""}
          onClick={() => setActiveTab("preferences")}
        >
          Checkout & Preferences
        </button>
        <button
          className={activeTab === "notifications" ? "active" : ""}
          onClick={() => setActiveTab("notifications")}
        >
          Notifications & Alerts
        </button>
        <button
          className={activeTab === "social" ? "active" : ""}
          onClick={() => setActiveTab("social")}
        >
          WhatsApp & Social
        </button>
        <button
          className={activeTab === "danger" ? "active" : ""}
          onClick={() => setActiveTab("danger")}
          style={{ color: activeTab === "danger" ? "#e05638" : undefined }}
        >
          Maintenance & Danger Zone
        </button>
      </div>

      {/* TAB CONTENT */}

      {/* 1. GENERAL PROFILE */}
      {activeTab === "general" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="mg-card" style={{ padding: "24px" }}>
            <h3 style={{ margin: "0 0 6px", fontSize: "16px", fontFamily: "var(--font-display)", fontWeight: 700 }}>
              Brand Identity
            </h3>
            <p style={{ margin: "0 0 20px", color: "#667085", fontSize: "13px" }}>
              These brand details are displayed on your customer storefront, invoice receipts, and notification emails.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", marginBottom: "18px" }}>
              <div className="mg-field">
                <span style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>
                  Store Display Name *
                </span>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) => updateSetting("storeName", e.target.value)}
                  placeholder="e.g. Trendora Fashion"
                  required
                />
              </div>

              <div className="mg-field">
                <span style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>
                  Registered Business Name
                </span>
                <input
                  type="text"
                  value={settings.legalBusinessName}
                  onChange={(e) => updateSetting("legalBusinessName", e.target.value)}
                  placeholder="e.g. Trendora Apparel Bangladesh Ltd."
                />
              </div>
            </div>

            <div className="mg-field" style={{ marginBottom: "18px" }}>
              <span style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>
                Store Tagline / Slogan
              </span>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => updateSetting("tagline", e.target.value)}
                placeholder="e.g. Elevated everyday apparel and sustainable essentials."
              />
              <small style={{ color: "#8490a2", fontSize: "11px", marginTop: "4px", display: "block" }}>
                Displayed under your store logo and on SEO meta descriptions.
              </small>
            </div>

            <div style={{ padding: "16px", backgroundColor: "#f8f9fc", borderRadius: "8px", border: "1px solid #eaecf0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "8px", backgroundColor: "#e0e3eb", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "18px", color: "var(--primary, #4b4bc7)" }}>
                  {settings.storeName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <strong style={{ fontSize: "14px", display: "block" }}>Store Brand Logo</strong>
                  <span style={{ fontSize: "12px", color: "#667085" }}>Managed via Live Theme Customizer</span>
                </div>
              </div>
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  window.history.pushState({}, "", "/seller/customizer")
                  window.dispatchEvent(new PopStateEvent("popstate"))
                }}
                style={{ fontSize: "12px" }}
              >
                Open Customizer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. CONTACT & ADDRESS */}
      {activeTab === "contact" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="mg-card" style={{ padding: "24px" }}>
            <h3 style={{ margin: "0 0 6px", fontSize: "16px", fontFamily: "var(--font-display)", fontWeight: 700 }}>
              Customer Support & Contact Info
            </h3>
            <p style={{ margin: "0 0 20px", color: "#667085", fontSize: "13px" }}>
              Where customers can reach you for inquiries, order verification, and parcel returns.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", marginBottom: "18px" }}>
              <div className="mg-field">
                <span style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>
                  Customer Support Email *
                </span>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => updateSetting("supportEmail", e.target.value)}
                  placeholder="support@yourdomain.com"
                  required
                />
              </div>

              <div className="mg-field">
                <span style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>
                  Customer Support Helpline *
                </span>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => updateSetting("phone", e.target.value)}
                  placeholder="+880 1712-345678"
                  required
                />
              </div>
            </div>

            <div className="mg-field" style={{ marginBottom: "18px" }}>
              <span style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>
                Physical Business Address
              </span>
              <textarea
                rows={2}
                value={settings.businessAddress}
                onChange={(e) => updateSetting("businessAddress", e.target.value)}
                placeholder="e.g. House 42, Road 11, Block D, Banani"
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d0d5dd", fontFamily: "inherit", fontSize: "13px" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
              <div className="mg-field">
                <span style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>
                  City / Region
                </span>
                <input
                  type="text"
                  value={settings.city}
                  onChange={(e) => updateSetting("city", e.target.value)}
                  placeholder="Dhaka"
                />
              </div>

              <div className="mg-field">
                <span style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>
                  Postal Code
                </span>
                <input
                  type="text"
                  value={settings.postalCode}
                  onChange={(e) => updateSetting("postalCode", e.target.value)}
                  placeholder="1213"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. BUSINESS & LEGAL */}
      {activeTab === "legal" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="mg-card" style={{ padding: "24px" }}>
            <h3 style={{ margin: "0 0 6px", fontSize: "16px", fontFamily: "var(--font-display)", fontWeight: 700 }}>
              Bangladeshi Trade & Legal Registration
            </h3>
            <p style={{ margin: "0 0 20px", color: "#667085", fontSize: "13px" }}>
              Keep your e-commerce operations compliant with Bangladesh Commerce Ministry guidelines and courier KYC.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", marginBottom: "18px" }}>
              <div className="mg-field">
                <span style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>
                  Trade License Number
                </span>
                <input
                  type="text"
                  value={settings.tradeLicenseNumber}
                  onChange={(e) => updateSetting("tradeLicenseNumber", e.target.value)}
                  placeholder="e.g. TRAD/DNCC/029182/2024"
                />
                <small style={{ color: "#8490a2", fontSize: "11px", marginTop: "4px", display: "block" }}>
                  Required for courier enterprise merchant accounts.
                </small>
              </div>

              <div className="mg-field">
                <span style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>
                  TIN / BIN Registration Number
                </span>
                <input
                  type="text"
                  value={settings.tinNumber}
                  onChange={(e) => updateSetting("tinNumber", e.target.value)}
                  placeholder="e.g. 7291-8392-1029"
                />
                <small style={{ color: "#8490a2", fontSize: "11px", marginTop: "4px", display: "block" }}>
                  12-digit e-TIN or 9-digit Business Identification Number.
                </small>
              </div>
            </div>

            <div style={{ padding: "16px", backgroundColor: "#f0fdf4", borderRadius: "8px", border: "1px solid #bbf7d0" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <span style={{ color: "#16a34a", fontSize: "18px" }}>✓</span>
                <div>
                  <strong style={{ fontSize: "13px", color: "#15803d" }}>Verified Compliance Ready</strong>
                  <p style={{ margin: "4px 0 0", color: "#166534", fontSize: "12px" }}>
                    Your store records will automatically sync with Pathao, Steadfast, and RedX logistics merchant APIs for COD disbursement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. PREFERENCES & CHECKOUT */}
      {activeTab === "preferences" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="mg-card" style={{ padding: "24px" }}>
            <h3 style={{ margin: "0 0 6px", fontSize: "16px", fontFamily: "var(--font-display)", fontWeight: 700 }}>
              Regional Localization
            </h3>
            <p style={{ margin: "0 0 20px", color: "#667085", fontSize: "13px" }}>
              Currency, timezone, and language preferences.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "18px", marginBottom: "24px" }}>
              <div className="mg-field">
                <span style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>
                  Primary Currency
                </span>
                <select
                  value={settings.currency}
                  onChange={(e) => updateSetting("currency", e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d0d5dd", fontSize: "13px" }}
                >
                  <option value="BDT (৳)">BDT (৳) — Bangladeshi Taka</option>
                  <option value="USD ($)">USD ($) — US Dollar</option>
                  <option value="EUR (€)">EUR (€) — Euro</option>
                </select>
              </div>

              <div className="mg-field">
                <span style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>
                  Store Timezone
                </span>
                <select
                  value={settings.timezone}
                  onChange={(e) => updateSetting("timezone", e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d0d5dd", fontSize: "13px" }}
                >
                  <option value="Asia/Dhaka (GMT+6)">Asia/Dhaka (GMT+6)</option>
                  <option value="UTC (GMT+0)">UTC (GMT+0)</option>
                  <option value="America/New_York (EST)">America/New_York (EST)</option>
                </select>
              </div>

              <div className="mg-field">
                <span style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>
                  Default Storefront Language
                </span>
                <select
                  value={settings.defaultLanguage}
                  onChange={(e) => updateSetting("defaultLanguage", e.target.value as "bn" | "en")}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d0d5dd", fontSize: "13px" }}
                >
                  <option value="en">English (Default)</option>
                  <option value="bn">বাংলা (Bengali)</option>
                </select>
              </div>
            </div>

            <hr style={{ border: 0, borderTop: "1px solid #eaecf0", margin: "24px 0" }} />

            <h3 style={{ margin: "0 0 6px", fontSize: "16px", fontFamily: "var(--font-display)", fontWeight: 700 }}>
              Checkout Rules & Authentication
            </h3>
            <p style={{ margin: "0 0 20px", color: "#667085", fontSize: "13px" }}>
              Control friction during buyer checkout.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={settings.allowGuestCheckout}
                  onChange={(e) => updateSetting("allowGuestCheckout", e.target.checked)}
                  style={{ marginTop: "4px" }}
                />
                <div>
                  <strong style={{ fontSize: "14px", display: "block" }}>Allow Guest Checkout (Recommended)</strong>
                  <span style={{ fontSize: "12px", color: "#667085" }}>
                    Buyers can place orders by entering only their phone and shipping address without creating an account.
                  </span>
                </div>
              </label>

              <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={settings.requirePhoneVerification}
                  onChange={(e) => updateSetting("requirePhoneVerification", e.target.checked)}
                  style={{ marginTop: "4px" }}
                />
                <div>
                  <strong style={{ fontSize: "14px", display: "block" }}>Strict 11-digit Bangladeshi Phone Validation</strong>
                  <span style={{ fontSize: "12px", color: "#667085" }}>
                    Ensures mobile numbers strictly match `013/014/015/016/017/018/019` prefixes to reduce fake/return orders.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* 5. NOTIFICATIONS & ALERTS */}
      {activeTab === "notifications" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="mg-card" style={{ padding: "24px" }}>
            <h3 style={{ margin: "0 0 6px", fontSize: "16px", fontFamily: "var(--font-display)", fontWeight: 700 }}>
              Order Notifications
            </h3>
            <p style={{ margin: "0 0 20px", color: "#667085", fontSize: "13px" }}>
              Receive instant alerts whenever a new order is placed in your store.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={settings.smsOrderNotification}
                  onChange={(e) => updateSetting("smsOrderNotification", e.target.checked)}
                  style={{ marginTop: "4px" }}
                />
                <div>
                  <strong style={{ fontSize: "14px", display: "block" }}>Instant SMS Order Alert</strong>
                  <span style={{ fontSize: "12px", color: "#667085" }}>
                    Send an SMS notification to `{settings.phone}` when an order is placed.
                  </span>
                </div>
              </label>

              <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={settings.emailOrderNotification}
                  onChange={(e) => updateSetting("emailOrderNotification", e.target.checked)}
                  style={{ marginTop: "4px" }}
                />
                <div>
                  <strong style={{ fontSize: "14px", display: "block" }}>Email Notification</strong>
                  <span style={{ fontSize: "12px", color: "#667085" }}>
                    Receive a comprehensive invoice breakdown at `{settings.supportEmail}`.
                  </span>
                </div>
              </label>
            </div>

            <hr style={{ border: 0, borderTop: "1px solid #eaecf0", margin: "24px 0" }} />

            <h3 style={{ margin: "0 0 6px", fontSize: "16px", fontFamily: "var(--font-display)", fontWeight: 700 }}>
              Inventory Stock Alerts
            </h3>
            <p style={{ margin: "0 0 20px", color: "#667085", fontSize: "13px" }}>
              Get warned before products run out of stock.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={settings.lowStockAlert}
                  onChange={(e) => updateSetting("lowStockAlert", e.target.checked)}
                />
                <span style={{ fontSize: "14px", fontWeight: 600 }}>Enable Low Stock Warnings</span>
              </label>

              {settings.lowStockAlert && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "13px", color: "#667085" }}>Trigger when stock reaches:</span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={settings.lowStockThreshold}
                    onChange={(e) => updateSetting("lowStockThreshold", Math.max(1, Number(e.target.value)))}
                    style={{ width: "70px", padding: "6px 8px", borderRadius: "6px", border: "1px solid #d0d5dd", fontSize: "13px" }}
                  />
                  <span style={{ fontSize: "13px", color: "#667085" }}>units</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. WHATSAPP & SOCIAL */}
      {activeTab === "social" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="mg-card" style={{ padding: "24px" }}>
            <h3 style={{ margin: "0 0 6px", fontSize: "16px", fontFamily: "var(--font-display)", fontWeight: 700 }}>
              Direct Chat & Social Commerce Channels
            </h3>
            <p style={{ margin: "0 0 20px", color: "#667085", fontSize: "13px" }}>
              Connect your official social media pages and WhatsApp floating button for fast customer communication.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div className="mg-field">
                <span style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>
                  WhatsApp Direct Chat / Order Number
                </span>
                <input
                  type="text"
                  value={settings.whatsappNumber}
                  onChange={(e) => updateSetting("whatsappNumber", e.target.value)}
                  placeholder="+880 1819-876543"
                />
                <small style={{ color: "#8490a2", fontSize: "11px", marginTop: "4px", display: "block" }}>
                  Used to generate 1-click WhatsApp order buttons on your product detail pages.
                </small>
              </div>

              <div className="mg-field">
                <span style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>
                  Facebook Page URL
                </span>
                <input
                  type="text"
                  value={settings.facebookUrl}
                  onChange={(e) => updateSetting("facebookUrl", e.target.value)}
                  placeholder="https://facebook.com/yourstore"
                />
              </div>

              <div className="mg-field">
                <span style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>
                  Instagram Handle / URL
                </span>
                <input
                  type="text"
                  value={settings.instagramHandle}
                  onChange={(e) => updateSetting("instagramHandle", e.target.value)}
                  placeholder="@yourstore or https://instagram.com/yourstore"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. MAINTENANCE & DANGER ZONE */}
      {activeTab === "danger" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="mg-card" style={{ padding: "24px" }}>
            <h3 style={{ margin: "0 0 6px", fontSize: "16px", fontFamily: "var(--font-display)", fontWeight: 700 }}>
              Storefront Maintenance Mode
            </h3>
            <p style={{ margin: "0 0 20px", color: "#667085", fontSize: "13px" }}>
              Temporarily show a maintenance notice to visitors while you update your catalog or redesign your store.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => updateSetting("maintenanceMode", e.target.checked)}
                  style={{ marginTop: "4px" }}
                />
                <div>
                  <strong style={{ fontSize: "14px", display: "block", color: settings.maintenanceMode ? "#e05638" : undefined }}>
                    Enable Maintenance Mode {settings.maintenanceMode ? "(Store is Offline)" : ""}
                  </strong>
                  <span style={{ fontSize: "12px", color: "#667085" }}>
                    Storefront displays a friendly banner informing visitors that updates are in progress.
                  </span>
                </div>
              </label>

              {settings.maintenanceMode && (
                <div className="mg-field" style={{ marginTop: "8px" }}>
                  <span style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>
                    Maintenance Notice Banner Message
                  </span>
                  <textarea
                    rows={3}
                    value={settings.maintenanceMessage}
                    onChange={(e) => updateSetting("maintenanceMessage", e.target.value)}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d0d5dd", fontFamily: "inherit", fontSize: "13px" }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Danger Zone */}
          <div
            className="mg-card"
            style={{
              padding: "24px",
              border: "1px solid #fecaca",
              backgroundColor: "#fff5f5",
            }}
          >
            <h3 style={{ margin: "0 0 6px", fontSize: "16px", color: "#b91c1c", fontWeight: 700 }}>
              Danger Zone
            </h3>
            <p style={{ margin: "0 0 20px", color: "#7f1d1d", fontSize: "13px" }}>
              Irreversible actions affecting your store data and configuration.
            </p>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderTop: "1px solid #fee2e2" }}>
              <div>
                <strong style={{ fontSize: "14px", display: "block", color: "#991b1b" }}>Reset Store Configuration</strong>
                <span style={{ fontSize: "12px", color: "#7f1d1d" }}>
                  Restore all settings, contact information, and preferences to defaults.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setResetConfirmOpen(true)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  backgroundColor: "#ffffff",
                  color: "#b91c1c",
                  border: "1px solid #f87171",
                  fontWeight: 600,
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Reset Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Reset */}
      {resetConfirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              maxWidth: "460px",
              width: "100%",
              padding: "24px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          >
            <h3 style={{ margin: "0 0 10px", fontSize: "18px", fontWeight: 700, color: "#111827" }}>
              Reset Settings to Default Presets?
            </h3>
            <p style={{ margin: "0 0 20px", fontSize: "13px", color: "#6b7280", lineHeight: 1.5 }}>
              This will overwrite your store profile, contact numbers, and preferences with initial defaults. This action cannot be undone.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                className="secondary"
                onClick={() => setResetConfirmOpen(false)}
                style={{ padding: "8px 16px", fontSize: "13px" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetToDefaults}
                style={{
                  padding: "8px 18px",
                  borderRadius: "6px",
                  backgroundColor: "#dc2626",
                  color: "#ffffff",
                  border: "none",
                  fontWeight: 600,
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
