const AUTH_KEY = "shopnest_registered_user"

export interface RegisteredUser {
  email?: string
  name?: string
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
    localStorage.setItem(
      AUTH_KEY,
      JSON.stringify({
        ...user,
        registered: true,
        registeredAt: user.registeredAt || new Date().toISOString(),
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

export function clearRegisteredUser(): void {
  try {
    localStorage.removeItem(AUTH_KEY)
  } catch {
    // ignore
  }
}
