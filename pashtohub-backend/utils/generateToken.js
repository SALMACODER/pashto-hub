const jwt = require('jsonwebtoken');

/**
 * Token strategy:
 *  - Access token : short-lived (15m), sent on every API request.
 *  - Refresh token: long-lived (7d), used only by /api/auth/refresh to mint a new access token.
 *
 * Both are stored as httpOnly + Secure + SameSite=Strict cookies — never in localStorage,
 * which is XSS-readable.
 */

const ACCESS_TTL  = process.env.JWT_ACCESS_EXPIRE  || '15m';
const REFRESH_TTL = process.env.JWT_REFRESH_EXPIRE || '7d';

const signAccessToken = (userId) =>
  jwt.sign({ id: userId, type: 'access' }, process.env.JWT_SECRET, { expiresIn: ACCESS_TTL });

const signRefreshToken = (userId) =>
  jwt.sign({ id: userId, type: 'refresh' }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: REFRESH_TTL,
  });

const verifyAccessToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET);

const verifyRefreshToken = (token) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);

/**
 * In production the frontend (e.g. https://pashto-hub.vercel.app) and the
 * backend (e.g. https://api.example.com) are on DIFFERENT registrable domains,
 * which makes auth cookies third-party. Browsers block third-party cookies
 * unless they are SameSite=None + Secure. So:
 *   - dev   : sameSite=lax  (same-origin via Vite proxy, no Secure required)
 *   - prod  : sameSite=none (cross-origin), secure=true (mandatory for None)
 *
 * If you ever serve the frontend from the SAME origin as the backend (e.g.
 * the SPA fallback route in server.js), you can bump sameSite back to 'strict'
 * for tighter CSRF defence — but 'none' works in both cases.
 */
const cookieOptions = (maxAgeMs) => ({
  httpOnly: true,
  secure:   process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge:   maxAgeMs,
  path:     '/',
});

const ACCESS_COOKIE  = 'access_token';
const REFRESH_COOKIE = 'refresh_token';
const ACCESS_MAX_AGE  = 15 * 60 * 1000;             // 15 minutes
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000;    // 7 days

const setAuthCookies = (res, userId) => {
  res.cookie(ACCESS_COOKIE,  signAccessToken(userId),  cookieOptions(ACCESS_MAX_AGE));
  res.cookie(REFRESH_COOKIE, signRefreshToken(userId), cookieOptions(REFRESH_MAX_AGE));
};

const clearAuthCookies = (res) => {
  res.clearCookie(ACCESS_COOKIE,  cookieOptions(0));
  res.clearCookie(REFRESH_COOKIE, cookieOptions(0));
};

// Backwards-compatible single-token helper for callers that still expect it.
const generateToken = (userId) => signAccessToken(userId);

module.exports = {
  generateToken,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  setAuthCookies,
  clearAuthCookies,
  ACCESS_COOKIE,
  REFRESH_COOKIE,
};
