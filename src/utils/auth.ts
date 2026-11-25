import { clearAuthTokens } from "../services/apiClient"

const AUTH_KEY = "shopnest_registered_user"
const RETURN_TO_KEY = "shopnest_return_to"

export type UserRole = "seller" | "admin"

export interface RegisteredUser {
  email?: string
  name?: string
  role?: UserRole
  registered?: boolean
  registeredAt?: string
}

export function isUserRegistered(): boolean {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return false
    const parsed = JSON.parse(raw)
    return Boolean(parsed && (parsed.email || parsed.registered))
  } catch {
    return false
  }
}

export function setRegisteredUser(user: RegisteredUser): void {
  try {
    const existing = getRegisteredUser()
    const resolvedRole: UserRole = user.role || existing?.role || "seller"
    localStorage.setItem(
      AUTH_KEY,
      JSON.stringify({
        ...existing,
        ...user,
        role: resolvedRole,
        registered: true,
        registeredAt: user.registeredAt || existing?.registeredAt || new Date().toISOString(),
      })
    )
  } catch {
    // ignore
  }
}

export function getRegisteredUser(): RegisteredUser | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function getUserRole(): UserRole {
  return getRegisteredUser()?.role || "seller"
}

export function isAdminUser(): boolean {
  return isUserRegistered() && getUserRole() === "admin"
}

export function clearRegisteredUser(): void {
  try {
    localStorage.removeItem(AUTH_KEY)
    clearAuthTokens()
  } catch {
    // ignore
  }
}

export function setReturnToPath(path: string): void {
  try {
    sessionStorage.setItem(RETURN_TO_KEY, path)
  } catch {
    // ignore
  }
}

export function consumeReturnToPath(): string | null {
  try {
    const target = sessionStorage.getItem(RETURN_TO_KEY)
    if (target) sessionStorage.removeItem(RETURN_TO_KEY)
    return target
  } catch {
    return null
  }
}
