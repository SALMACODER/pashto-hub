import client from './client'

export const register = (payload) =>
  client.post('/auth/register', payload).then((r) => r.data)

export const login = (payload) =>
  client.post('/auth/login', payload).then((r) => r.data)

export const logout = () =>
  client.post('/auth/logout').then((r) => r.data)

export const refresh = () =>
  client.post('/auth/refresh').then((r) => r.data)

export const me = () =>
  client.get('/auth/me').then((r) => r.data)

/**
 * Send a password-reset email.
 * Backend ALWAYS returns success (even for unknown emails) to prevent
 * account enumeration — surface the generic message to the user.
 */
export const forgotPassword = (email) =>
  client.post('/auth/forgot-password', { email }).then((r) => r.data)

/**
 * Submit a new password using the token from the email link.
 *   await resetPassword(tokenFromUrl, 'NewPass123')
 */
export const resetPassword = (token, password) =>
  client
    .put(`/auth/reset-password/${encodeURIComponent(token)}`, { password })
    .then((r) => r.data)
