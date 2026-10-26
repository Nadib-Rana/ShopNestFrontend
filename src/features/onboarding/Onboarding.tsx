import React, { useState } from "react"
import { Icon } from "../../components/ui/Icon"
import {
  themeDefinitions,
  themeDefaults,
  saveStoreThemeConfig,
} from "../../repositories/themeStore"

function Logo() {
  return (
    <div className="auth-logo">
      <span className="brand-mark"><span /></span>
      <strong>ShopNest</strong>
    </div>
  )
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  inputMode,
  large,
}: {
  label: string
  name: string
  type?: string
  placeholder: string
  inputMode?: "numeric"
  large?: boolean
}) {
  return (
    <label className={`field ${large ? "code-field" : ""}`}>
      <span>{label}</span>
      <input name={name} type={type} inputMode={inputMode} placeholder={placeholder} />
    </label>
  )
}

const onboardingSteps = [
  { key: "welcome", label: "Welcome" },
  { key: "business", label: "Business" },
  { key: "store", label: "Store" },
  { key: "theme", label: "Theme" },
  { key: "branding", label: "Branding" },
  { key: "complete", label: "Review" },
]

export function Onboarding({ path, go }: { path: string; go: (path: string) => void }) {
  const current = path.split("/").pop() || "welcome"
  const index = Math.max(0, onboardingSteps.findIndex((step) => step.key === current))

  const initialTheme = (() => {
    try {
      const pending = localStorage.getItem("shopnest_pending_theme")
      if (pending) {
        const found = themeDefinitions.find((t) => t.id === pending)
        if (found) return found
      }
    } catch {}
    return themeDefinitions[0]
  })()

  const [subdomain, setSubdomain] = useState(initialTheme.slug || "trendora")
  const [theme, setTheme] = useState(initialTheme.id)
  const [brand, setBrand] = useState("#4b4bc7")
  const next = () => {
    if (index === onboardingSteps.length - 1) {
      try {
        const nextConfig = {
          ...themeDefaults(theme, "demo"),
          primary: brand,
          status: "Published" as const,
        }
        saveStoreThemeConfig(nextConfig)
        localStorage.removeItem("shopnest_pending_theme")
      } catch {}
      go("/seller/overview")
    } else {
      go(`/onboarding/${onboardingSteps[index + 1].key}`)
    }
  }
  const back = () =>
    index > 0 ? go(`/onboarding/${onboardingSteps[index - 1].key}`) : go("/signup")
  const invalidSubdomain = subdomain.length < 3 || !/^[a-z0-9-]+$/.test(subdomain)
  const unavailable = ["shop", "admin", "store"].includes(subdomain)

  return (
    <div className="onboarding-shell">
      <header>
        <Logo />
        <span>7-day free trial</span>
        <button onClick={() => go("/login")}>Save and exit</button>
      </header>
      <div className="onboarding-progress">
        {onboardingSteps.map((step, i) => (
          <div className={i <= index ? "active" : ""} key={step.key}>
            <span>{i < index ? "✓" : i + 1}</span>
            <b>{step.label}</b>
          </div>
        ))}
      </div>
      <main className="onboarding-main">
        {current === "welcome" && <OnboardingIntro />}
        {current === "business" && <OnboardingBusiness />}
        {current === "store" && (
          <OnboardingStore
            subdomain={subdomain}
            setSubdomain={setSubdomain}
            invalid={invalidSubdomain}
            unavailable={unavailable}
          />
        )}
        {current === "theme" && <OnboardingTheme theme={theme} setTheme={setTheme} go={go} />}
        {current === "branding" && <OnboardingBrand brand={brand} setBrand={setBrand} />}
        {current === "complete" && (
          <OnboardingComplete
            subdomain={subdomain}
            theme={theme}
            brand={brand}
            go={go}
          />
        )}
        <div className="onboarding-actions">
          <button className="secondary" onClick={back}>
            Back
          </button>
          <button
            className="primary"
            disabled={current === "store" && (invalidSubdomain || unavailable)}
            onClick={next}
          >
            {current === "complete" ? "Enter seller dashboard" : "Continue"}{" "}
            <Icon name="arrow" />
          </button>
        </div>
      </main>
      <p className="prototype-note">
        Prototype only — account creation, verification, and store provisioning are simulated locally.
      </p>
    </div>
  )
}

function OnboardingIntro() {
  return (
    <section className="onboarding-panel intro-panel">
      <div className="intro-icon"><Icon name="store" size={28} /></div>
      <span className="eyebrow">WELCOME TO SHOPNEST</span>
      <h1>Let’s bring your store to life.</h1>
      <p>We’ll guide you through the essentials. You can update everything later from your seller dashboard.</p>
      <div className="setup-list">
        <span><Icon name="check" />Tell us about your business</span>
        <span><Icon name="check" />Choose your store address</span>
        <span><Icon name="check" />Select a storefront theme</span>
      </div>
      <div className="trial-card">
        <Icon name="clock" />
        <div>
          <strong>Your free trial starts when your store is created</strong>
          <span>Explore every feature for 7 days. No payment details required.</span>
        </div>
      </div>
    </section>
  )
}

function OnboardingBusiness() {
  return (
    <section className="onboarding-panel">
      <span className="eyebrow">STEP 2 OF 6</span>
      <h1>Tell us about your business</h1>
      <p>This helps us tailor your setup experience.</p>
      <div className="form-grid">
        <Field label="Business name" name="business" placeholder="Trendora Fashion" />
        <label className="field">
          <span>Business category</span>
          <select defaultValue="fashion">
            <option value="fashion">Fashion & clothing</option>
            <option>Electronics</option>
            <option>Beauty & cosmetics</option>
            <option>Home & lifestyle</option>
          </select>
        </label>
        <Field label="Owner name" name="owner" placeholder="Saif Rahman" />
        <Field label="Contact number" name="phone" placeholder="+880 1XXX-XXXXXX" />
        <label className="field full">
          <span>Business description <em>Optional</em></span>
          <textarea placeholder="Tell customers what makes your business special." />
        </label>
      </div>
    </section>
  )
}

function OnboardingStore({
  subdomain,
  setSubdomain,
  invalid,
  unavailable,
}: {
  subdomain: string
  setSubdomain: (v: string) => void
  invalid: boolean
  unavailable: boolean
}) {
  const available = !invalid && !unavailable
  return (
    <section className="onboarding-panel">
      <span className="eyebrow">STEP 3 OF 6</span>
      <h1>Create your store</h1>
      <p>Choose a recognizable name and your free ShopNest address.</p>
      <Field label="Store name" name="store" placeholder="Trendora Fashion" />
      <label className="field">
        <span>Store address</span>
        <div className={`domain-input ${available ? "valid" : "invalid"}`}>
          <input
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value.toLowerCase())}
          />
          <b>.shopnest.app</b>
        </div>
        <small className={available ? "success-text" : "error-text"}>
          {invalid
            ? "Use at least 3 lowercase letters, numbers, or hyphens."
            : unavailable
            ? "This address is reserved. Try another name."
            : `trendora.shopnest.app is available.`}
        </small>
      </label>
      <div className="url-preview">
        <Icon name="external" />
        <div>
          <span>Your store URL</span>
          <strong>https://{subdomain || "your-store"}.shopnest.app</strong>
        </div>
      </div>
    </section>
  )
}

function OnboardingTheme({
  theme,
  setTheme,
  go,
}: {
  theme: string
  setTheme: (v: string) => void
  go: (path: string) => void
}) {
  const [filter, setFilter] = useState("all")

  const handlePreview = (slug: string) => {
    try {
      localStorage.setItem("shopnest_preview_return", "/onboarding/theme")
    } catch {}
    go(`/store/${slug}/preview`)
  }

  const categories = [
    { id: "all", label: "All Themes" },
    { id: "fashion", label: "Fashion" },
    { id: "shoes", label: "Shoes" },
    { id: "electronics", label: "Electronics" },
    { id: "beauty", label: "Beauty" },
    { id: "grocery", label: "Grocery" },
    { id: "decor", label: "Home Decor" },
    { id: "furniture", label: "Furniture" },
    { id: "retail", label: "General Retail" },
  ]

  const filteredThemes = filter === "all"
    ? themeDefinitions
    : themeDefinitions.filter((t) => t.id === filter)

  return (
    <section className="onboarding-panel wide-panel">
      <span className="eyebrow">STEP 4 OF 6</span>
      <h1>Choose your starting theme</h1>
      <p>Browse 8 distinct storefront architectures tailored for Bangladeshi merchants. Experience authentic headers, typography, and merchandising. You can switch or customize your theme anytime.</p>

      {/* Filter Chips */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", margin: "20px 0 26px" }}>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setFilter(c.id)}
            style={{
              border: filter === c.id ? "1px solid #4b4bc7" : "1px solid #e4e7ec",
              background: filter === c.id ? "#f4f3ff" : "#fff",
              color: filter === c.id ? "#4b4bc7" : "#475467",
              fontWeight: filter === c.id ? 700 : 500,
              fontSize: "12px",
              padding: "7px 14px",
              borderRadius: "20px",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Theme Cards Grid */}
      <div className="theme-gallery-grid">
        {filteredThemes.map((item) => {
          const isSelected = theme === item.id
          return (
            <article
              className={`theme-gallery-card ${isSelected ? "active" : ""}`}
              key={item.id}
              onClick={() => setTheme(item.id)}
              style={{ cursor: "pointer", transition: "all 0.2s ease" }}
            >
              <div className={`theme-card-visual visual-${item.id}`}>
                <div className="tc-head">
                  <b>{item.name}</b>
                  <span>Shop　Story　Bag</span>
                </div>
                <div className="tc-hero">
                  <small>{item.label}</small>
                  <strong>{item.hero}</strong>
                  <i />
                </div>
                <div className="tc-products">
                  <i /><i /><i />
                </div>
              </div>
              <div className="theme-card-info">
                <div>
                  <span>{item.label}</span>
                  {isSelected && <em>Selected ✓</em>}
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => handlePreview(item.slug)}
                  >
                    Preview
                  </button>
                  <button
                    type="button"
                    className={isSelected ? "primary" : "secondary"}
                    onClick={() => setTheme(item.id)}
                  >
                    {isSelected ? "Selected ✓" : "Select theme"}
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function OnboardingBrand({
  brand,
  setBrand,
}: {
  brand: string
  setBrand: (v: string) => void
}) {
  const colors = ["#4b4bc7", "#173b35", "#b85b45", "#2f6eaf", "#8a4774"]
  return (
    <section className="onboarding-panel">
      <span className="eyebrow">STEP 5 OF 6</span>
      <h1>Add your brand</h1>
      <p>Make the storefront feel like yours. These settings can be refined later.</p>
      <label className="upload-box">
        <input type="file" accept="image/*" />
        <div className="upload-icon"><Icon name="plus" /></div>
        <strong>Upload your logo</strong>
        <span>PNG, JPG or SVG · up to 5MB</span>
      </label>
      <label className="field">
        <span>Brand color</span>
        <div className="color-options">
          {colors.map((color) => (
            <button
              aria-label={`Select color ${color}`}
              className={brand === color ? "selected" : ""}
              style={{ backgroundColor: color }}
              onClick={() => setBrand(color)}
              key={color}
            />
          ))}
        </div>
      </label>
      <Field label="Store tagline" name="tagline" placeholder="Everyday style, thoughtfully made." />
    </section>
  )
}

function OnboardingComplete({
  subdomain,
  theme,
  brand,
  go,
}: {
  subdomain: string
  theme: string
  brand: string
  go: (p: string) => void
}) {
  const currentTheme = themeDefinitions.find((t) => t.id === theme) || themeDefinitions[0]
  return (
    <section className="onboarding-panel complete-panel">
      <div className="success-orbit"><Icon name="check" size={28} /></div>
      <span className="eyebrow">READY TO GO</span>
      <h1>Your store foundation is ready.</h1>
      <p>Review the prototype setup below, then enter your dashboard to add your first product.</p>
      <div className="review-list">
        <div>
          <span>Business</span>
          <strong>Trendora Fashion</strong>
          <button onClick={() => go("/onboarding/business")}>Edit</button>
        </div>
        <div>
          <span>Store address</span>
          <strong>{subdomain}.shopnest.app</strong>
          <button onClick={() => go("/onboarding/store")}>Edit</button>
        </div>
        <div>
          <span>Theme</span>
          <strong>{currentTheme.title}</strong>
          <button onClick={() => go("/onboarding/theme")}>Edit</button>
        </div>
        <div>
          <span>Brand color</span>
          <strong>
            <i style={{ backgroundColor: brand }} />
            {brand}
          </strong>
          <button onClick={() => go("/onboarding/branding")}>Edit</button>
        </div>
      </div>
    </section>
  )
}

export default Onboarding
