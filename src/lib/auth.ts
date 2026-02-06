export type UserSession = {
  username: string
}

const SESSION_KEY = "amfe_session"

export function getSession(): UserSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    if (typeof parsed !== "object" || parsed === null) return null
    const username = (parsed as { username?: unknown }).username
    if (typeof username !== "string" || username.trim().length === 0) return null
    return { username }
  } catch {
    return null
  }
}

export function setSession(session: UserSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}
