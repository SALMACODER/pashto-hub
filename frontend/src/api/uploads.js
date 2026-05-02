import client from './client'

/**
 * Upload API.
 *
 * Two storage modes:
 *   - 'cloudinary'  → backend streams to Cloudinary (default)
 *   - 'local'       → backend writes to <UPLOAD_DIR>/<bucket>/<file> and
 *                     returns "/uploads/<bucket>/<file>" + a "local:" publicId
 *
 * Both return the same shape:
 *   { url, publicId, bytes, format, width, height, resourceType, originalFilename, storage }
 *
 * The backend's API secret is never exposed — uploads always go via Express.
 */

const VALID_BUCKETS = new Set(['books', 'leaders', 'lessons', 'dictionary', 'misc'])
const VALID_MODES   = new Set(['cloudinary', 'local'])

const normBucket = (b) =>
  VALID_BUCKETS.has(String(b || '').toLowerCase())
    ? String(b).toLowerCase()
    : 'misc'

const normMode = (m) =>
  VALID_MODES.has(String(m || '').toLowerCase())
    ? String(m).toLowerCase()
    : 'cloudinary'

/**
 * Build a multipart-friendly request config.
 *
 * Setting Content-Type to `undefined` here is deliberate: it overrides the
 * client's default `application/json` so axios falls back to its built-in
 * FormData handling, which produces `multipart/form-data; boundary=...`
 * with the correct boundary string. Setting `'multipart/form-data'`
 * manually (without a boundary) is fragile and version-dependent — multer
 * can fail to parse those bodies on some platforms.
 *
 * The client's CSRF interceptor still attaches `X-CSRF-Token` to multipart
 * requests because it's appended to the merged headers regardless of
 * Content-Type.
 */
const multipartConfig = (extra = {}) => ({
  headers: { 'Content-Type': undefined },
  ...extra,
})

const buildUrl = (path, bucket, mode) =>
  `${path}?bucket=${normBucket(bucket)}&mode=${normMode(mode)}`

/**
 * @param {File} file
 * @param {string} bucket   'books' | 'leaders' | 'lessons' | 'dictionary' | 'misc'
 * @param {(loaded:number, total:number) => void} [onProgress]
 * @param {{ mode?: 'cloudinary' | 'local' }} [opts]
 */
export const uploadImage = async (file, bucket = 'misc', onProgress, opts = {}) => {
  const fd = new FormData()
  fd.append('file', file)
  const res = await client.post(
    buildUrl('/admin/uploads/image', bucket, opts.mode),
    fd,
    multipartConfig({
      onUploadProgress: onProgress
        ? (e) => onProgress(e.loaded, e.total || e.loaded)
        : undefined,
    }),
  )
  return res.data?.data
}

export const uploadPdf = async (file, bucket = 'misc', onProgress, opts = {}) => {
  const fd = new FormData()
  fd.append('file', file)
  const res = await client.post(
    buildUrl('/admin/uploads/pdf', bucket, opts.mode),
    fd,
    multipartConfig({
      onUploadProgress: onProgress
        ? (e) => onProgress(e.loaded, e.total || e.loaded)
        : undefined,
    }),
  )
  return res.data?.data
}

/**
 * Delete an asset by publicId. The backend dispatches to local-disk or
 * Cloudinary based on the publicId prefix — clients don't need to know.
 *
 * Best-effort — never throws.
 */
export const deleteAsset = async (publicId, resourceType = 'image') => {
  if (!publicId) return false
  try {
    const res = await client.delete('/admin/uploads', {
      params: { publicId, resourceType },
    })
    return Boolean(res.data?.data?.deleted)
  } catch {
    return false
  }
}

/**
 * Tells the form which storage modes are usable. Cached per session.
 */
export const fetchUploadConfig = () =>
  client.get('/admin/uploads/config').then((r) => r.data?.data)
