import client from './client'

/**
 * Public dictionary API.
 *
 * Both endpoints are language-aware:
 *   - searchWords({ q, lang })   → matches only the selected language's headword(s)
 *   - fetchPopular({ lang })     → admin-curated featured row; lang affects sort
 *
 * Responses come back wrapped in the standard envelope: { success, data: { items } }.
 */

const VALID_LANGS = new Set(['en', 'ps'])

const normLang = (l) =>
  VALID_LANGS.has(String(l || '').toLowerCase()) ? String(l).toLowerCase() : undefined

/**
 * @param {{ q?: string, lang?: 'en'|'ps', page?: number, limit?: number }} opts
 * @returns {Promise<Array>} list of word docs (already unwrapped)
 */
export const searchWords = async ({ q = '', lang, page = 1, limit = 30 } = {}) => {
  const params = { page, limit }
  if (q.trim()) params.q = q.trim()
  const normalizedLang = normLang(lang)
  if (normalizedLang) params.lang = normalizedLang

  const res = await client.get('/dictionary', { params })
  return res.data?.data?.items ?? res.data?.words ?? []
}

/**
 * @param {{ lang?: 'en'|'ps', limit?: number }} opts
 * @returns {Promise<Array>} list of featured word docs
 */
export const fetchPopular = async ({ lang, limit = 8 } = {}) => {
  const params = { limit }
  const normalizedLang = normLang(lang)
  if (normalizedLang) params.lang = normalizedLang

  const res = await client.get('/dictionary/popular', { params })
  return res.data?.data?.items ?? res.data?.items ?? []
}

// Legacy helper kept for any caller that imports the old name.
export const searchDictionary = (params = {}) =>
  client.get('/dictionary', { params }).then((r) => r.data)
