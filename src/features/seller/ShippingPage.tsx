import React, { useState } from "react"
import { Icon } from "../../components/ui/Icon"
import { Status } from "../../components/ui/Status"
import { Badge } from "../../components/ui/Badge"
import { money } from "../../utils/format"
import {
  CourierPartner,
  ShippingRule,
  ShippingSettings,
  defaultShippingSettings,
  getShippingSettings,
  saveShippingSettings,
} from "../../repositories/shippingStore"

export interface ShippingPageProps {
  notify: (message: string) => void
}

type TabType = "rates" | "couriers" | "pickup"

export default function ShippingPage({ notify }: ShippingPageProps) {
  const [settings, setSettings] = useState<ShippingSettings>(getShippingSettings)
  const [activeTab, setActiveTab] = useState<TabType>("rates")
  const [ruleModalOpen, setRuleModalOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<ShippingRule | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [formError, setFormError] = useState<string>("")
  const [isDirty, setIsDirty] = useState<boolean>(false)

  // Quick helper to mutate state and mark dirty
  const updateSettings = (updater: (prev: ShippingSettings) => ShippingSettings) => {
    setSettings((prev) => {
      const next = updater(prev)
      setIsDirty(true)
      return next
    })
  }

  // Save all settings
  const handleSave = () => {
    if (settings.insideDhakaRate < 0 || settings.outsideDhakaRate < 0 || settings.subDhakaRate < 0) {
      notify("Rates must be non-negative values.")
      return
    }
    if (settings.freeShippingEnabled && settings.freeShippingThreshold < 0) {
      notify("Free shipping threshold must be a positive number.")
      return
    }

    saveShippingSettings(settings)
    setIsDirty(false)
    notify("Shipping and delivery settings saved successfully.")
  }

  // Reset to default presets
  const handleReset = () => {
    if (window.confirm("Reset all shipping configurations to default presets?")) {
      setSettings(defaultShippingSettings)
      saveShippingSettings(defaultShippingSettings)
      setIsDirty(false)
      notify("Shipping settings reset to defaults.")
    }
  }

  // Rule Modal Form State
  const [ruleName, setRuleName] = useState("")
  const [ruleZone, setRuleZone] = useState("Inside Dhaka")
  const [ruleRate, setRuleRate] = useState<number>(70)
  const [ruleDays, setRuleDays] = useState("24-48 Hours")
  const [ruleCondition, setRuleCondition] = useState<"all" | "min_price" | "weight">("all")
  const [ruleMinPrice, setRuleMinPrice] = useState<number>(1000)
  const [ruleEnabled, setRuleEnabled] = useState(true)

  const openAddRuleModal = () => {
    setEditingRule(null)
    setRuleName("")
    setRuleZone("Inside Dhaka")
    setRuleRate(70)
    setRuleDays("24-48 Hours")
    setRuleCondition("all")
    setRuleMinPrice(1000)
    setRuleEnabled(true)
    setFormError("")
    setRuleModalOpen(true)
  }

  const openEditRuleModal = (rule: ShippingRule) => {
    setEditingRule(rule)
    setRuleName(rule.name)
    setRuleZone(rule.zone)
    setRuleRate(rule.rate)
    setRuleDays(rule.estimatedDays)
    setRuleCondition(rule.conditionType)
    setRuleMinPrice(rule.minOrderValue || 0)
    setRuleEnabled(rule.enabled)
    setFormError("")
    setRuleModalOpen(true)
  }

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ruleName.trim()) {
      setFormError("Please enter a rule name.")
      return
    }
    if (isNaN(ruleRate) || ruleRate < 0) {
      setFormError("Rate must be a valid number greater than or equal to 0.")
      return
    }

    const updatedRule: ShippingRule = {
      id: editingRule ? editingRule.id : `rule-${Date.now()}`,
      name: ruleName.trim(),
      zone: ruleZone,
      rate: Number(ruleRate),
      estimatedDays: ruleDays.trim() || "2-4 Days",
      conditionType: ruleCondition,
      minOrderValue: ruleCondition === "min_price" ? Number(ruleMinPrice) : undefined,
      enabled: ruleEnabled,
    }

    if (editingRule) {
      updateSettings((prev) => ({
        ...prev,
        rules: prev.rules.map((r) => (r.id === editingRule.id ? updatedRule : r)),
      }))
      notify(`Shipping rule "${updatedRule.name}" updated.`)
    } else {
      updateSettings((prev) => ({
        ...prev,
        rules: [...prev.rules, updatedRule],
      }))
      notify(`Shipping rule "${updatedRule.name}" added.`)
    }

    setRuleModalOpen(false)
  }

  const handleDeleteRule = (id: string) => {
    const target = settings.rules.find((r) => r.id === id)
    updateSettings((prev) => ({
      ...prev,
      rules: prev.rules.filter((r) => r.id !== id),
    }))
    setDeleteConfirmId(null)
    notify(`Shipping rule "${target?.name || id}" deleted.`)
  }

  const toggleRuleEnabled = (id: string) => {
    updateSettings((prev) => ({
      ...prev,
      rules: prev.rules.map((r) =>
        r.id === id ? { ...r, enabled: !r.enabled } : r
      ),
    }))
  }

  // Courier Actions
  const toggleCourier = (id: string) => {
    updateSettings((prev) => ({
      ...prev,
      couriers: prev.couriers.map((c) =>
        c.id === id ? { ...c, enabled: !c.enabled } : c
      ),
    }))
  }

  const setDefaultCourier = (id: string) => {
    updateSettings((prev) => ({
      ...prev,
      defaultCourier: id,
      couriers: prev.couriers.map((c) => ({
        ...c,
        isDefault: c.id === id,
        enabled: c.id === id ? true : c.enabled,
      })),
    }))
    const courier = settings.couriers.find((c) => c.id === id)
    notify(`${courier?.name || id} is now your default courier partner.`)
  }

  const toggleCourierCod = (id: string) => {
    updateSettings((prev) => ({
      ...prev,
      couriers: prev.couriers.map((c) =>
        c.id === id ? { ...c, codAvailable: !c.codAvailable } : c
      ),
    }))
  }

  const defaultCourierName =
    settings.couriers.find((c) => c.id === settings.defaultCourier)?.name || "Steadfast Courier"

  return (
    <div className="content management">
      {/* Page Header */}
      <div className="section-title">
        <div>
          <h2>Shipping & Delivery</h2>
          <p>Manage domestic delivery rates, courier partners, free shipping rules, and store pickup.</p>
        </div>
        <div style={{ display: "flex", gap: "9px", alignItems: "center" }}>
          {isDirty && (
            <span style={{ fontSize: "11px", color: "var(--color-brand-600)", fontWeight: 600 }}>
              ● Unsaved changes
            </span>
          )}
          <button className="secondary" onClick={handleReset} title="Restore default Bangladesh delivery presets">
            Reset defaults
          </button>
          <button className="primary" onClick={handleSave}>
            <Icon name="check" />
            Save changes
          </button>
        </div>
      </div>

      {/* Highlights / Metric Bar */}
      <div className="mini-metrics" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", marginBottom: "20px" }}>
        <div className="mg-card" style={{ padding: "16px 18px" }}>
          <span style={{ color: "#8490a2", fontSize: "11px", textTransform: "uppercase", fontWeight: 700, letterSpacing: ".04em" }}>
            Inside Dhaka Rate
          </span>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: "6px" }}>
            <strong style={{ fontSize: "22px", fontFamily: "var(--font-display)", color: "#1d2939" }}>
              {money(settings.insideDhakaRate)}
            </strong>
            <Status tone="green">24-48 Hours</Status>
          </div>
        </div>

        <div className="mg-card" style={{ padding: "16px 18px" }}>
          <span style={{ color: "#8490a2", fontSize: "11px", textTransform: "uppercase", fontWeight: 700, letterSpacing: ".04em" }}>
            Outside Dhaka Rate
          </span>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: "6px" }}>
            <strong style={{ fontSize: "22px", fontFamily: "var(--font-display)", color: "#1d2939" }}>
              {money(settings.outsideDhakaRate)}
            </strong>
            <Status tone="blue">3-5 Days</Status>
          </div>
        </div>

        <div className="mg-card" style={{ padding: "16px 18px" }}>
          <span style={{ color: "#8490a2", fontSize: "11px", textTransform: "uppercase", fontWeight: 700, letterSpacing: ".04em" }}>
            Free Shipping
          </span>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: "6px" }}>
            <strong style={{ fontSize: "22px", fontFamily: "var(--font-display)", color: "#1d2939" }}>
              {settings.freeShippingEnabled ? `Above ${money(settings.freeShippingThreshold)}` : "Disabled"}
            </strong>
            <Badge tone={settings.freeShippingEnabled ? "active" : "draft"}>
              {settings.freeShippingEnabled ? "Active" : "Off"}
            </Badge>
          </div>
        </div>

        <div className="mg-card" style={{ padding: "16px 18px" }}>
          <span style={{ color: "#8490a2", fontSize: "11px", textTransform: "uppercase", fontWeight: 700, letterSpacing: ".04em" }}>
            Primary Courier
          </span>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: "6px" }}>
            <strong style={{ fontSize: "17px", fontFamily: "var(--font-display)", color: "var(--color-brand-600)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {defaultCourierName}
            </strong>
            <Status tone="green">COD Active</Status>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mg-tabs" style={{ marginBottom: "20px" }}>
        <button
          className={activeTab === "rates" ? "active" : ""}
          onClick={() => setActiveTab("rates")}
        >
          Delivery Rates & Zones ({settings.rules.length} Rules)
        </button>
        <button
          className={activeTab === "couriers" ? "active" : ""}
          onClick={() => setActiveTab("couriers")}
        >
          Courier Integrations ({settings.couriers.filter((c) => c.enabled).length} Enabled)
        </button>
        <button
          className={activeTab === "pickup" ? "active" : ""}
          onClick={() => setActiveTab("pickup")}
        >
          Store Pickup & Notes
        </button>
      </div>

      {/* TAB 1: DELIVERY RATES & ZONES */}
      {activeTab === "rates" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Standard Rates Section */}
          <div className="mg-card" style={{ padding: "22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "16px", fontFamily: "var(--font-display)", fontWeight: 700 }}>
                  Standard Nationwide Rates
                </h3>
                <p style={{ margin: "4px 0 0", color: "#667085", fontSize: "11px" }}>
                  Base delivery charges applied during customer checkout in Bangladesh.
                </p>
              </div>
            </div>

            <div className="three-col" style={{ gap: "16px" }}>
              <div className="mg-field">
                <span>Inside Dhaka Delivery (৳)</span>
                <input
                  type="number"
                  min="0"
                  value={settings.insideDhakaRate}
                  onChange={(e) =>
                    updateSettings((prev) => ({
                      ...prev,
                      insideDhakaRate: Math.max(0, Number(e.target.value)),
                    }))
                  }
                  placeholder="70"
                />
                <span className="helper">Applicable to all Dhaka City Corporation zones (24-48h).</span>
              </div>

              <div className="mg-field">
                <span>Sub-Dhaka / Greater Area (৳)</span>
                <input
                  type="number"
                  min="0"
                  value={settings.subDhakaRate}
                  onChange={(e) =>
                    updateSettings((prev) => ({
                      ...prev,
                      subDhakaRate: Math.max(0, Number(e.target.value)),
                    }))
                  }
                  placeholder="100"
                />
                <span className="helper">Gazipur, Savar, Keraniganj, Narayanganj (2-3 days).</span>
              </div>

              <div className="mg-field">
                <span>Outside Dhaka / Nationwide (৳)</span>
                <input
                  type="number"
                  min="0"
                  value={settings.outsideDhakaRate}
                  onChange={(e) =>
                    updateSettings((prev) => ({
                      ...prev,
                      outsideDhakaRate: Math.max(0, Number(e.target.value)),
                    }))
                  }
                  placeholder="130"
                />
                <span className="helper">All other districts across Bangladesh (3-5 days).</span>
              </div>
            </div>

            {/* Additional Delivery Toggles: Free Shipping & Express */}
            <hr style={{ border: 0, borderTop: "1px solid #eff1f3", margin: "18px 0" }} />

            <div className="two-col" style={{ gap: "20px" }}>
              {/* Free Shipping Setting */}
              <div style={{ background: "#f8f9fc", border: "1px solid #e9ecf2", borderRadius: "10px", padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ fontSize: "13px", color: "#1d2939" }}>Free Delivery Threshold</strong>
                    <p style={{ margin: "3px 0 0", fontSize: "11px", color: "#667085" }}>
                      Automatically waive delivery charges for large carts.
                    </p>
                  </div>
                  <label style={{ display: "inline-flex", alignItems: "center", cursor: "pointer", gap: "6px" }}>
                    <input
                      type="checkbox"
                      checked={settings.freeShippingEnabled}
                      onChange={(e) =>
                        updateSettings((prev) => ({
                          ...prev,
                          freeShippingEnabled: e.target.checked,
                        }))
                      }
                    />
                    <span style={{ fontSize: "12px", fontWeight: 600 }}>Enable</span>
                  </label>
                </div>
                {settings.freeShippingEnabled && (
                  <div className="mg-field" style={{ marginTop: "12px", marginBottom: 0 }}>
                    <span>Qualifying Minimum Order Amount (৳)</span>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={settings.freeShippingThreshold}
                      onChange={(e) =>
                        updateSettings((prev) => ({
                          ...prev,
                          freeShippingThreshold: Math.max(0, Number(e.target.value)),
                        }))
                      }
                      placeholder="2500"
                    />
                    <span className="helper">Orders of {money(settings.freeShippingThreshold)} and above qualify for free shipping.</span>
                  </div>
                )}
              </div>

              {/* Express Same-Day Setting */}
              <div style={{ background: "#f8f9fc", border: "1px solid #e9ecf2", borderRadius: "10px", padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ fontSize: "13px", color: "#1d2939" }}>Express Same-Day Delivery</strong>
                    <p style={{ margin: "3px 0 0", fontSize: "11px", color: "#667085" }}>
                      Offer urgent rush dispatch for Inside Dhaka customers.
                    </p>
                  </div>
                  <label style={{ display: "inline-flex", alignItems: "center", cursor: "pointer", gap: "6px" }}>
                    <input
                      type="checkbox"
                      checked={settings.expressDeliveryEnabled}
                      onChange={(e) =>
                        updateSettings((prev) => ({
                          ...prev,
                          expressDeliveryEnabled: e.target.checked,
                        }))
                      }
                    />
                    <span style={{ fontSize: "12px", fontWeight: 600 }}>Enable</span>
                  </label>
                </div>
                {settings.expressDeliveryEnabled && (
                  <div className="mg-field" style={{ marginTop: "12px", marginBottom: 0 }}>
                    <span>Express Rate (৳)</span>
                    <input
                      type="number"
                      min="0"
                      value={settings.expressDeliveryRate}
                      onChange={(e) =>
                        updateSettings((prev) => ({
                          ...prev,
                          expressDeliveryRate: Math.max(0, Number(e.target.value)),
                        }))
                      }
                      placeholder="160"
                    />
                    <span className="helper">Customer receives item on the same day if ordered before 12:00 PM.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Custom Rules List */}
          <div className="mg-card" style={{ padding: "22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "16px", fontFamily: "var(--font-display)", fontWeight: 700 }}>
                  Custom Shipping Rules & Conditions
                </h3>
                <p style={{ margin: "4px 0 0", color: "#667085", fontSize: "11px" }}>
                  Define custom shipping rates based on location zones or minimum cart values.
                </p>
              </div>
              <button className="primary" onClick={openAddRuleModal}>
                <Icon name="plus" />
                Add shipping rule
              </button>
            </div>

            <div className="mg-table" style={{ border: "1px solid #eff1f3", borderRadius: "9px" }}>
              <div
                className="mg-row mg-head"
                style={{
                  gridTemplateColumns: "1.4fr 1fr .8fr 1.2fr .7fr 120px",
                  display: "grid",
                  padding: "10px 16px",
                }}
              >
                <span>Rule Name</span>
                <span>Zone</span>
                <span>Rate</span>
                <span>Delivery Time</span>
                <span>Status</span>
                <span style={{ textAlign: "right" }}>Actions</span>
              </div>

              {settings.rules.map((rule) => (
                <div
                  className="mg-row"
                  key={rule.id}
                  style={{
                    gridTemplateColumns: "1.4fr 1fr .8fr 1.2fr .7fr 120px",
                    display: "grid",
                    padding: "12px 16px",
                    alignItems: "center",
                    opacity: rule.enabled ? 1 : 0.6,
                  }}
                >
                  <div>
                    <strong style={{ color: "#344054", fontSize: "13px" }}>{rule.name}</strong>
                    {rule.conditionType === "min_price" && rule.minOrderValue && (
                      <small style={{ color: "#8490a2", display: "block" }}>
                        Condition: Cart ≥ {money(rule.minOrderValue)}
                      </small>
                    )}
                  </div>
                  <span>{rule.zone}</span>
                  <strong style={{ color: rule.rate === 0 ? "#16845a" : "#1d2939" }}>
                    {rule.rate === 0 ? "FREE" : money(rule.rate)}
                  </strong>
                  <span>{rule.estimatedDays}</span>
                  <div>
                    <button
                      onClick={() => toggleRuleEnabled(rule.id)}
                      style={{
                        border: 0,
                        background: "transparent",
                        cursor: "pointer",
                        padding: 0,
                      }}
                      title="Click to toggle status"
                    >
                      <Badge tone={rule.enabled ? "active" : "draft"}>
                        {rule.enabled ? "Active" : "Disabled"}
                      </Badge>
                    </button>
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                    <button
                      className="row-action"
                      onClick={() => openEditRuleModal(rule)}
                    >
                      Edit
                    </button>
                    <button
                      className="row-action danger-link"
                      onClick={() => setDeleteConfirmId(rule.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {settings.rules.length === 0 && (
                <div style={{ padding: "35px", textAlign: "center", color: "#8490a2" }}>
                  <Icon name="truck" size={32} />
                  <p style={{ marginTop: "10px", fontSize: "13px" }}>No custom shipping rules defined yet.</p>
                  <button className="secondary" onClick={openAddRuleModal} style={{ marginTop: "8px" }}>
                    Create first rule
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COURIER PARTNERS */}
      {activeTab === "couriers" && (
        <div className="mg-card" style={{ padding: "22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontFamily: "var(--font-display)", fontWeight: 700 }}>
                Courier Partners & Delivery Services
              </h3>
              <p style={{ margin: "4px 0 0", color: "#667085", fontSize: "11px" }}>
                Select integrated delivery partners for parcel pickup, label generation, and Cash on Delivery (COD).
              </p>
            </div>
            <span style={{ fontSize: "11px", color: "#8490a2" }}>
              Active default: <strong style={{ color: "var(--color-brand-600)" }}>{defaultCourierName}</strong>
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
            {settings.couriers.map((courier) => (
              <div
                key={courier.id}
                style={{
                  border: courier.isDefault ? "2px solid var(--color-brand-600)" : "1px solid #e6e8ec",
                  borderRadius: "12px",
                  padding: "18px",
                  background: courier.enabled ? "#ffffff" : "#fbfbfc",
                  position: "relative",
                  boxShadow: courier.isDefault ? "0 4px 14px rgba(75,75,199,.12)" : "0 1px 2px rgba(16,24,40,.02)",
                }}
              >
                {courier.isDefault && (
                  <span
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      background: "var(--color-brand-50)",
                      color: "var(--color-brand-600)",
                      fontWeight: 700,
                      fontSize: "9px",
                      padding: "3px 8px",
                      borderRadius: "6px",
                      textTransform: "uppercase",
                    }}
                  >
                    ★ Default Courier
                  </span>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "10px",
                      background: courier.enabled ? "var(--color-brand-50)" : "#f0f2f5",
                      color: courier.enabled ? "var(--color-brand-600)" : "#98a2b3",
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 800,
                      fontSize: "14px",
                    }}
                  >
                    {courier.code}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: "14px", color: "#1d2939" }}>{courier.name}</h4>
                    <span style={{ fontSize: "11px", color: "#8490a2" }}>{courier.coverage}</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px", margin: "14px 0", flexWrap: "wrap" }}>
                  <button
                    onClick={() => toggleCourierCod(courier.id)}
                    style={{
                      border: 0,
                      background: "transparent",
                      padding: 0,
                      cursor: "pointer",
                    }}
                    title="Click to toggle COD availability"
                  >
                    <Badge tone={courier.codAvailable ? "cash-on-delivery" : "draft"}>
                      {courier.codAvailable ? "COD Supported" : "Prepaid Only"}
                    </Badge>
                  </button>

                  <Badge tone={courier.enabled ? "active" : "draft"}>
                    {courier.enabled ? "Active Integration" : "Inactive"}
                  </Badge>
                </div>

                <hr style={{ border: 0, borderTop: "1px solid #eff1f3", margin: "14px 0" }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{ display: "inline-flex", alignItems: "center", gap: "7px", cursor: "pointer", fontSize: "11px", color: "#344054", fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={courier.enabled}
                      onChange={() => toggleCourier(courier.id)}
                    />
                    Enable partner
                  </label>

                  <button
                    className={courier.isDefault ? "secondary" : "select-button"}
                    disabled={courier.isDefault}
                    onClick={() => setDefaultCourier(courier.id)}
                    style={{
                      fontSize: "11px",
                      padding: "0 10px",
                      minHeight: "32px",
                      opacity: courier.isDefault ? 0.7 : 1,
                    }}
                  >
                    {courier.isDefault ? "Primary Partner" : "Set as default"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: STORE PICKUP & INSTRUCTIONS */}
      {activeTab === "pickup" && (
        <div className="mg-card" style={{ padding: "22px" }}>
          <h3 style={{ margin: "0 0 4px", fontSize: "16px", fontFamily: "var(--font-display)", fontWeight: 700 }}>
            Store Pickup & Customer Instructions
          </h3>
          <p style={{ margin: "0 0 18px", color: "#667085", fontSize: "11px" }}>
            Enable in-store customer collection and customize checkout delivery policies.
          </p>

          <div className="editor-grid" style={{ gridTemplateColumns: "minmax(0, 1.4fr) minmax(280px, .9fr)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ background: "#f8f9fc", border: "1px solid #e9ecf2", borderRadius: "10px", padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <div>
                    <strong style={{ fontSize: "13px", color: "#1d2939" }}>Store Pickup (Click & Collect)</strong>
                    <p style={{ margin: "3px 0 0", fontSize: "11px", color: "#667085" }}>
                      Allow local buyers to pick up orders directly from your physical shop or warehouse (৳0 shipping).
                    </p>
                  </div>
                  <label style={{ display: "inline-flex", alignItems: "center", cursor: "pointer", gap: "6px" }}>
                    <input
                      type="checkbox"
                      checked={settings.pickupEnabled}
                      onChange={(e) =>
                        updateSettings((prev) => ({
                          ...prev,
                          pickupEnabled: e.target.checked,
                        }))
                      }
                    />
                    <span style={{ fontSize: "12px", fontWeight: 600 }}>Enable Pickup</span>
                  </label>
                </div>

                {settings.pickupEnabled && (
                  <div className="mg-field" style={{ marginBottom: 0 }}>
                    <span>Pickup Address & Hours</span>
                    <textarea
                      value={settings.pickupAddress}
                      onChange={(e) =>
                        updateSettings((prev) => ({
                          ...prev,
                          pickupAddress: e.target.value,
                        }))
                      }
                      rows={3}
                      placeholder="Enter full physical address, landmark, and operating hours..."
                    />
                    <span className="helper">Displayed to customers during checkout when they select Store Pickup.</span>
                  </div>
                )}
              </div>

              <div className="mg-field">
                <span>Checkout Delivery Note & Policy</span>
                <textarea
                  value={settings.specialNotes}
                  onChange={(e) =>
                    updateSettings((prev) => ({
                      ...prev,
                      specialNotes: e.target.value,
                    }))
                  }
                  rows={4}
                  placeholder="e.g. Please check the parcel in front of the delivery person. COD available across all 64 districts."
                />
                <span className="helper">This message is shown under the delivery selection step on customer checkout.</span>
              </div>
            </div>

            <div style={{ background: "#fafbfc", border: "1px solid #eff1f3", borderRadius: "10px", padding: "18px" }}>
              <h4 style={{ margin: "0 0 10px", fontSize: "13px", color: "#344054" }}>
                <Icon name="truck" size={16} /> Bangladesh Delivery Summary
              </h4>
              <ul style={{ margin: 0, paddingLeft: "18px", color: "#667085", fontSize: "11px", lineHeight: 1.8 }}>
                <li>Standard Inside Dhaka: <strong>{money(settings.insideDhakaRate)}</strong></li>
                <li>Standard Sub-Dhaka: <strong>{money(settings.subDhakaRate)}</strong></li>
                <li>Nationwide Outside Dhaka: <strong>{money(settings.outsideDhakaRate)}</strong></li>
                <li>Express Delivery: <strong>{settings.expressDeliveryEnabled ? money(settings.expressDeliveryRate) : "Disabled"}</strong></li>
                <li>Free Shipping: <strong>{settings.freeShippingEnabled ? `Above ${money(settings.freeShippingThreshold)}` : "Disabled"}</strong></li>
                <li>Store Pickup: <strong>{settings.pickupEnabled ? "Available" : "Disabled"}</strong></li>
                <li>Default Courier: <strong>{defaultCourierName}</strong></li>
              </ul>
              <button
                className="primary wide"
                onClick={handleSave}
                style={{ marginTop: "16px" }}
              >
                Save all settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT RULE MODAL */}
      {ruleModalOpen && (
        <div className="modal-backdrop" onClick={() => setRuleModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "520px" }}>
            <div className="modal-head">
              <div>
                <h2>{editingRule ? "Edit Shipping Rule" : "Add Shipping Rule"}</h2>
                <p>Define rate and delivery expectations for specific geographical areas.</p>
              </div>
              <button onClick={() => setRuleModalOpen(false)} aria-label="Close dialog">
                ×
              </button>
            </div>

            {formError && (
              <div className="form-error" style={{ marginBottom: "15px" }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveRule}>
              <div className="mg-field">
                <span>Rule Name</span>
                <input
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  placeholder="e.g. Inside Dhaka Standard, Chattogram Express"
                  required
                />
              </div>

              <div className="two-col">
                <div className="mg-field">
                  <span>Coverage Zone</span>
                  <select
                    value={ruleZone}
                    onChange={(e) => setRuleZone(e.target.value)}
                  >
                    <option value="Inside Dhaka">Inside Dhaka</option>
                    <option value="Sub-Dhaka">Sub-Dhaka (Gazipur, Savar, Narayanganj)</option>
                    <option value="Outside Dhaka">Outside Dhaka</option>
                    <option value="Chittagong Metro">Chittagong Metro</option>
                    <option value="Sylhet Metro">Sylhet Metro</option>
                    <option value="All Bangladesh">All Bangladesh</option>
                  </select>
                </div>

                <div className="mg-field">
                  <span>Shipping Charge (৳)</span>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={ruleRate}
                    onChange={(e) => setRuleRate(Number(e.target.value))}
                    placeholder="70"
                    required
                  />
                </div>
              </div>

              <div className="two-col">
                <div className="mg-field">
                  <span>Estimated Delivery Time</span>
                  <input
                    value={ruleDays}
                    onChange={(e) => setRuleDays(e.target.value)}
                    placeholder="e.g. 24-48 Hours, 2-3 Days"
                    required
                  />
                </div>

                <div className="mg-field">
                  <span>Rule Condition</span>
                  <select
                    value={ruleCondition}
                    onChange={(e) => setRuleCondition(e.target.value as any)}
                  >
                    <option value="all">Apply to all orders</option>
                    <option value="min_price">Minimum cart total threshold</option>
                  </select>
                </div>
              </div>

              {ruleCondition === "min_price" && (
                <div className="mg-field">
                  <span>Minimum Cart Value for this rate (৳)</span>
                  <input
                    type="number"
                    min="0"
                    value={ruleMinPrice}
                    onChange={(e) => setRuleMinPrice(Number(e.target.value))}
                    placeholder="2500"
                  />
                  <span className="helper">Rate applies only if order total reaches this value.</span>
                </div>
              )}

              <div style={{ margin: "14px 0" }}>
                <label style={{ display: "inline-flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={ruleEnabled}
                    onChange={(e) => setRuleEnabled(e.target.checked)}
                  />
                  Enable rule immediately
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary"
                  onClick={() => setRuleModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary">
                  {editingRule ? "Save Rule" : "Create Rule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteConfirmId && (
        <div className="modal-backdrop" onClick={() => setDeleteConfirmId(null)}>
          <div className="modal-card confirm-card" onClick={(e) => e.stopPropagation()}>
            <div className="danger-icon">!</div>
            <h2>Delete Shipping Rule?</h2>
            <p>
              Are you sure you want to delete this shipping rule? Customers in this zone will fall back to default nationwide rates.
            </p>
            <div className="modal-actions" style={{ justifyContent: "center" }}>
              <button className="secondary" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </button>
              <button
                className="danger-button"
                onClick={() => handleDeleteRule(deleteConfirmId)}
              >
                Delete Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
