import React, { useEffect, useState } from "react"
import { Icon } from "../../components/ui/Icon"
import { consumeReturnToPath, getRegisteredUser, setRegisteredUser, type UserRole } from "../../utils/auth"
import { saveStoreThemeConfig, themeDefaults } from "../../repositories/themeStore"
import { ApiError, isBackendEnabled, setAuthTokens } from "../../services/apiClient"
import { shopnestApi } from "../../services/shopnestApi"
import { syncSellerWorkspaceFromBackend } from "../../services/backendSync"

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
  const [loading, setLoading] = useState(false)
  const [loginRole, setLoginRole] = useState<UserRole>("seller")
  const isLogin = path === "/login"
  const isSignup = path === "/signup"
  const isForgot = path === "/forgot-password"
  const isReset = path === "/reset-password"
  const isVerify = path === "/verify"

  useEffect(() => {
    setError("")
    setSubmitted(false)
  }, [path])

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

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = String(data.get("email") || "").trim()
    const password = String(data.get("password") || "")
    const confirm = String(data.get("confirm") || "")
    const name = String(data.get("name") || "").trim()
    const code = String(data.get("code") || "").trim()

    if (isVerify && code.length !== 6) {
      return setError("Enter the complete 6-digit verification code.")
    }
    if (isSignup && !name) {
      return setError("Enter your full name.")
    }
    if ((isLogin || isSignup || isForgot) && !email.includes("@")) {
      return setError("Enter a valid email address.")
    }
    if ((isLogin || isSignup || isReset) && password.length < 8) {
      return setError("Password must contain at least 8 characters.")
    }
    if (isSignup && password !== confirm) {
      return setError("Passwords do not match.")
    }
    if (isSignup && data.get("terms") !== "on") {
      return setError("Please agree to the Terms and Privacy Policy to continue.")
    }
    setError("")
    setLoading(true)

    try {
      if (isForgot) {
        if (isBackendEnabled()) {
          await shopnestApi.auth.forgotPassword(email).catch(() => undefined)
        }
        setSubmitted(true)
        return
      }

      if (isSignup) {
        const [firstName, ...rest] = name.split(" ")
        if (isBackendEnabled()) {
          const regRes = await shopnestApi.auth.register({
            email,
            password,
            firstName,
            lastName: rest.join(" ") || undefined,
          })
          if (regRes?.accessToken) {
            setAuthTokens(regRes.accessToken, regRes.refreshToken)
          }
        }
        setRegisteredUser({ email, name, role: "seller" })
        const pendingTheme = localStorage.getItem("shopnest_pending_theme")
        if (pendingTheme) {
          saveStoreThemeConfig({ ...themeDefaults(pendingTheme, "demo"), status: "Published" })
        }
        go("/verify")
        return
      }

      if (isVerify) {
        if (isBackendEnabled()) {
          const pendingEmail = getRegisteredUser()?.email
          if (pendingEmail) {
            await shopnestApi.auth.verifyEmail({ email: pendingEmail, code })
          }
        }
        go("/onboarding/welcome")
        return
      }

      if (isReset) {
        go("/login")
        return
      }

      // Login
      let resolvedRole: UserRole = email.toLowerCase().includes("admin") ? "admin" : loginRole
      let resolvedName: string | undefined

      if (isBackendEnabled()) {
        const res = await shopnestApi.auth.login({ email, password })
        if (res?.accessToken) {
          setAuthTokens(res.accessToken, res.refreshToken)
        }
        const backendRole = String(res?.user?.role || "").toUpperCase()
        if (backendRole === "SUPER_ADMIN" || backendRole === "ADMIN") {
          resolvedRole = "admin"
        } else if (backendRole) {
          resolvedRole = "seller"
        }
        const fn = String(res?.user?.firstName || "").trim()
        const ln = String(res?.user?.lastName || "").trim()
        resolvedName = `${fn} ${ln}`.trim() || undefined
      }

      setRegisteredUser({ email, name: resolvedName, role: resolvedRole })
      if (resolvedRole === "seller") {
        await syncSellerWorkspaceFromBackend()
      }

      const returnTo = consumeReturnToPath()
      if (returnTo && ((resolvedRole === "admin" && returnTo.startsWith("/admin")) || returnTo.startsWith("/seller"))) {
        go(returnTo)
        return
      }
      go(resolvedRole === "admin" ? "/admin/overview" : "/seller/overview")
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Unable to reach the backend server. Check that NestJS is running on port 3000.")
      }
    } finally {
      setLoading(false)
    }
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
                <>
                  <label className="field">
                    <span>Sign in as</span>
                    <select value={loginRole} onChange={(e) => setLoginRole(e.target.value as UserRole)}>
                      <option value="seller">Store Seller</option>
                      <option value="admin">Super Admin</option>
                    </select>
                  </label>
                  <div className="form-between">
                    <label><input type="checkbox" /> Remember me</label>
                    <button type="button" onClick={() => go("/forgot-password")}>Forgot password?</button>
                  </div>
                </>
              )}
              {isSignup && (
                <label className="terms">
                  <input name="terms" type="checkbox" required /> I agree to the Terms and Privacy Policy.
                </label>
              )}
              <button className="primary wide" type="submit" disabled={loading}>
                {loading
                  ? "Please wait..."
                  : isLogin
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
