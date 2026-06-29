// Client-side login rate limiter using localStorage.
// Prevents brute-force attacks from the browser UI.
// Not a substitute for server-side protection, but effective against casual abuse.

const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes

export function checkRateLimit(key) {
  try {
    const raw = localStorage.getItem(`rl_${key}`)
    if (!raw) return { blocked: false }

    const { count, resetAt } = JSON.parse(raw)
    if (Date.now() > resetAt) {
      localStorage.removeItem(`rl_${key}`)
      return { blocked: false }
    }
    if (count >= MAX_ATTEMPTS) {
      const minutesLeft = Math.ceil((resetAt - Date.now()) / 60000)
      return { blocked: true, minutesLeft }
    }
    return { blocked: false }
  } catch {
    return { blocked: false }
  }
}

export function recordFailedAttempt(key) {
  try {
    const raw = localStorage.getItem(`rl_${key}`)
    const now = Date.now()
    if (!raw) {
      localStorage.setItem(`rl_${key}`, JSON.stringify({ count: 1, resetAt: now + WINDOW_MS }))
      return
    }
    const data = JSON.parse(raw)
    if (now > data.resetAt) {
      localStorage.setItem(`rl_${key}`, JSON.stringify({ count: 1, resetAt: now + WINDOW_MS }))
    } else {
      localStorage.setItem(`rl_${key}`, JSON.stringify({ count: data.count + 1, resetAt: data.resetAt }))
    }
  } catch {
    // ignore localStorage errors (e.g. private mode / storage full)
  }
}

export function clearRateLimit(key) {
  try {
    localStorage.removeItem(`rl_${key}`)
  } catch {
    // ignore
  }
}
