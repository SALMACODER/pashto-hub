import axios from 'axios'

/**
 * Centralized HTTP client.
 *
 * Strategy:
 *   - baseURL: VITE_API_URL if set, else "/api" (Vite dev proxy forwards to Express:5000).
 *   - withCredentials: true → browser includes the httpOnly auth + CSRF cookies.
 *   - On every state-changing request, attach the cached CSRF token.
 *   - On 401, try POST /auth/refresh once, then retry.
 *   - On 403 with a CSRF error, refetch the CSRF token once and retry.
 *
 * The CSRF flow uses the double-submit cookie pattern:
 *   1. GET /api/csrf  → server sets httpOnly `x-csrf-token` cookie + returns
 *      a JS-readable token in the JSON response. We cache it in memory.
 *   2. State-changing requests → we attach the cached token as `X-CSRF-Token`.
 *   3. Server validates header against cookie. Mismatch → 403.
 *
 * Why we auto-retry on 403:
 *   The cached token can go stale if the server restarts, the CSRF cookie
 *   expires, or the user's network identifier shifts. We treat 403 as a
 *   recoverable condition by clearing the cache and retrying once.
 */

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

let csrfToken = null
let csrfFetchInFlight = null

const ensureCsrf = async () => {
  if (csrfToken) return csrfToken
  if (!csrfFetchInFlight) {
    csrfFetchInFlight = client.get('/csrf')
      .then((r) => { csrfToken = r.data?.data?.csrfToken; return csrfToken })
      .finally(() => { csrfFetchInFlight = null })
  }
  return csrfFetchInFlight
}

/**
 * Drop the cached CSRF token. Call after login/logout if you want the next
 * mutation to mint a fresh token deterministically (the auto-retry on 403
 * also handles this transparently, so calling it is optional).
 */
export const clearCsrf = () => { csrfToken = null }

const STATE_CHANGING = new Set(['post', 'put', 'patch', 'delete'])

const isCsrfExempt = (url = '') =>
  url.endsWith('/auth/login') ||
  url.endsWith('/auth/register') ||
  url.endsWith('/auth/refresh') ||
  url.endsWith('/csrf')

client.interceptors.request.use(async (config) => {
  if (STATE_CHANGING.has(config.method)) {
    if (!isCsrfExempt(config.url || '')) {
      try {
        const token = await ensureCsrf()
        if (token) {
          // Use AxiosHeaders.set if available (axios ≥1.4), fall back to direct
          // assignment. This avoids losing the header on FormData configs that
          // start with a plain object.
          if (config.headers && typeof config.headers.set === 'function') {
            config.headers.set('X-CSRF-Token', token)
          } else {
            config.headers = { ...(config.headers || {}), 'X-CSRF-Token': token }
          }
        }
      } catch {
        // CSRF endpoint unreachable — let the request fail naturally
      }
    }
  }
  return config
})

let refreshInFlight = null

/**
 * Detect "this 403 is a CSRF rejection" rather than a generic permission
 * denial. csrf-csrf returns a code/message, but to stay defensive we accept
 * either signal — code === 'EBADCSRFTOKEN', or any "csrf"-tinged message.
 */
const isCsrfFailure = (error) => {
  if (error?.response?.status !== 403) return false
  const data = error.response.data || {}
  const code = data.error?.code || data.code || ''
  const msg  = data.error?.message || data.message || ''
  return /csrf/i.test(`${code} ${msg}`)
}

client.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config
    const status = error.response?.status

    // ── 403 due to a stale CSRF token: drop cache, refetch, retry once ──
    if (isCsrfFailure(error) && original && !original._csrfRetried) {
      original._csrfRetried = true
      clearCsrf()
      try {
        const token = await ensureCsrf()
        if (token) {
          if (original.headers && typeof original.headers.set === 'function') {
            original.headers.set('X-CSRF-Token', token)
          } else {
            original.headers = { ...(original.headers || {}), 'X-CSRF-Token': token }
          }
        }
        return client(original)
      } catch {
        return Promise.reject(error)
      }
    }

    // Don't retry network errors or non-401s
    if (!status || status !== 401 || original?._retried) {
      return Promise.reject(error)
    }
    // Don't try to refresh on the auth endpoints themselves
    const url = original?.url || ''
    if (url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/refresh')) {
      return Promise.reject(error)
    }

    // ── 401 → attempt refresh, then retry the original request ──
    try {
      if (!refreshInFlight) refreshInFlight = client.post('/auth/refresh')
      await refreshInFlight
      refreshInFlight = null
      original._retried = true
      return client(original)
    } catch (refreshErr) {
      refreshInFlight = null
      return Promise.reject(refreshErr)
    }
  },
)

export default client
