import React, { useState } from "react"
import { Icon } from "../../components/ui/Icon"
import { setRegisteredUser } from "../../utils/auth"
import { saveStoreThemeConfig, themeDefaults } from "../../repositories/themeStore"

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

export function AuthPage({ path, go }: { path: string; go: (path: string) => void }) {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const isLogin = path === "/login"
  const isSignup = path === "/signup"
  const isForgot = path === "/forgot-password"
  const isReset = path === "/reset-password"
  const isVerify = path === "/verify"

  const title = isLogin
    ? "Welcome back"
    : isSignup
    ? "Create your account"
    : isForgot
    ? "Reset your password"
    : isReset
    ? "Choose a new password"
    : "Verify your contact"

  const description = isLogin
    ? "Manage your store and keep your business moving."
    : isSignup
    ? "Start your 7-day free trial. No payment required."
    : isForgot
    ? "Enter your email and we’ll show the prototype recovery state."
    : isReset
    ? "Use at least 8 characters with a number."
    : "We sent a 6-digit prototype code to sa•••@example.com."

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    if (isVerify && String(data.get("code")).length !== 6) {
      return setError("Enter the complete 6-digit verification code.")
    }
    if ((isLogin || isSignup) && !String(data.get("email")).includes("@")) {
      return setError("Enter a valid email address.")
    }
    if ((isLogin || isSignup || isReset) && String(data.get("password")).length < 8) {
      return setError("Password must contain at least 8 characters.")
    }
    setError("")
    if (isForgot) return setSubmitted(true)
    if (isSignup) {
      setRegisteredUser({
        email: String(data.get("email")),
        name: String(data.get("name") || ""),
      })
      const pendingTheme = localStorage.getItem("shopnest_pending_theme")
      if (pendingTheme) {
        saveStoreThemeConfig({ ...themeDefaults(pendingTheme, "demo"), status: "Published" })
      }
      return go("/verify")
    }
    if (isVerify) return go("/onboarding/welcome")
    if (isReset) return go("/login")
    setRegisteredUser({
      email: String(data.get("email")),
    })
    go("/seller/overview")
  }

  return (
    <div className="auth-shell">
      <aside className="auth-art">
        <Logo />
        <div>
          <span className="eyebrow">SELL SMARTER</span>
          <h2>Your business deserves a beautiful home online.</h2>
          <p>Join growing independent brands using ShopNest to sell with confidence.</p>
        </div>
        <blockquote>
          “The setup felt clear from the first step. Our store was ready in an afternoon.”
          <footer>— Fictional prototype testimonial</footer>
        </blockquote>
      </aside>

      <main className="auth-main">
        <button className="auth-back" onClick={() => go("/")}>
          ← Back to ShopNest
        </button>
        <div className="auth-card">
          <h1>{title}</h1>
          <p>{description}</p>
          {submitted ? (
            <div className="success-panel">
              <div><Icon name="check" /></div>
              <h2>Check your inbox</h2>
              <p>This prototype has simulated sending recovery instructions.</p>
              <button className="primary wide" onClick={() => go("/reset-password")}>
                Continue prototype
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              {isSignup && <Field label="Full name" name="name" placeholder="Saif Rahman" />}
              {(isLogin || isSignup || isForgot) && (
                <Field label="Email address" name="email" type="email" placeholder="you@example.com" />
              )}
              {(isLogin || isSignup || isReset) && (
                <Field
                  label={isReset ? "New password" : "Password"}
                  name="password"
                  type="password"
                  placeholder="At least 8 characters"
                />
              )}
              {isSignup && <Field label="Confirm password" name="confirm" type="password" placeholder="Repeat your password" />}
              {isVerify && <Field label="Verification code" name="code" inputMode="numeric" placeholder="000000" large />}
              {error && <div className="form-error" role="alert">{error}</div>}
              {isLogin && (
                <div className="form-between">
                  <label><input type="checkbox" /> Remember me</label>
                  <button type="button" onClick={() => go("/forgot-password")}>Forgot password?</button>
                </div>
              )}
              {isSignup && (
                <label className="terms">
                  <input type="checkbox" required /> I agree to the Terms and Privacy Policy.
                </label>
              )}
              <button className="primary wide" type="submit">
                {isLogin
                  ? "Log in"
                  : isSignup
                  ? "Create account"
                  : isForgot
                  ? "Send recovery instructions"
                  : isReset
                  ? "Reset password"
                  : "Verify and continue"}
              </button>
            </form>
          )}
          {(isLogin || isSignup) && (
            <div className="auth-switch">
              {isLogin ? "New to ShopNest?" : "Already have an account?"}
              <button onClick={() => go(isLogin ? "/signup" : "/login")}>
                {isLogin ? "Create an account" : "Log in"}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default AuthPage
