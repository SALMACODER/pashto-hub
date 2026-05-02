/**
 * Local-disk upload service. Same shape as services/uploadService.js so the
 * controller can swap them based on a `mode` flag without caring which side
 * is in play.
 *
 * Storage layout:
 *   <UPLOAD_DIR>/<bucket>/<timestamp>-<rand>-<safeName>.<ext>
 *
 * URL exposed to the client:
 *   /uploads/<bucket>/<filename>
 *   (server.js mounts express.static at /uploads)
 *
 * publicId convention (so the same cleanup code can tell local from Cloudinary):
 *   local:<bucket>/<filename>
 *
 * Cleanup code MUST treat anything starting with "local:" as a local asset.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads'));
const URL_PREFIX = '/uploads';
const LOCAL_PUBLIC_ID_PREFIX = 'local:';

// Ensure base dir exists at boot — cheap, idempotent.
try { fs.mkdirSync(UPLOAD_DIR, { recursive: true }); } catch { /* ignore */ }

const sanitizeBaseName = (name = 'file') => {
  const base = path.basename(String(name));
  // Strip extension; we keep it separately to control casing/length.
  const ext = path.extname(base).toLowerCase().slice(1);
  const noExt = base.slice(0, base.length - (ext ? ext.length + 1 : 0));
  const safe = noExt.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 60) || 'file';
  return { stem: safe, ext };
};

const randomId = (n = 4) => crypto.randomBytes(n).toString('hex');

/**
 * Persist a Buffer under <UPLOAD_DIR>/<bucket>/<filename>. Returns the same
 * shape uploadService returns — caller can store it on the resource directly.
 */
const saveBuffer = async (buffer, { bucket, originalname, mimetype }) => {
  if (!buffer || !buffer.length) {
    const err = new Error('Empty file buffer'); err.status = 400; throw err;
  }
  const safeBucket = String(bucket || 'misc').replace(/[^a-z0-9-]/gi, '');
  const dir = path.join(UPLOAD_DIR, safeBucket);
  await fs.promises.mkdir(dir, { recursive: true });

  const { stem, ext: nameExt } = sanitizeBaseName(originalname);
  // Prefer the extension from the filename; fall back to a sensible default
  // derived from MIME (image/jpeg → jpg, application/pdf → pdf).
  const ext = nameExt || mimeToExt(mimetype) || 'bin';
  const filename = `${Date.now()}-${randomId()}-${stem}.${ext}`;
  const fullPath = path.join(dir, filename);

  await fs.promises.writeFile(fullPath, buffer);

  return {
    url:           `${URL_PREFIX}/${safeBucket}/${filename}`,
    publicId:      `${LOCAL_PUBLIC_ID_PREFIX}${safeBucket}/${filename}`,
    bytes:         buffer.length,
    format:        ext,
    width:         null,
    height:        null,
    resourceType:  isImageMime(mimetype) ? 'image' : 'raw',
    originalFilename: originalname,
    storage:       'local',
  };
};

const saveImage = (buffer, opts = {}) => saveBuffer(buffer, opts);
const saveRaw   = (buffer, opts = {}) => saveBuffer(buffer, opts);

/**
 * Delete a local file by publicId (the "local:bucket/filename" form) OR by
 * the raw URL ("/uploads/bucket/filename"). Best-effort — never throws.
 *
 * Defense in depth: resolves the requested path, then asserts it stays
 * inside UPLOAD_DIR. Anything escaping the base dir is refused.
 */
const deleteLocal = async (publicIdOrUrl) => {
  if (!publicIdOrUrl) return false;
  let rel;
  if (publicIdOrUrl.startsWith(LOCAL_PUBLIC_ID_PREFIX)) {
    rel = publicIdOrUrl.slice(LOCAL_PUBLIC_ID_PREFIX.length);
  } else if (publicIdOrUrl.startsWith(`${URL_PREFIX}/`)) {
    rel = publicIdOrUrl.slice(URL_PREFIX.length + 1);
  } else {
    return false;
  }

  const target = path.resolve(UPLOAD_DIR, rel);
  if (!target.startsWith(UPLOAD_DIR + path.sep) && target !== UPLOAD_DIR) {
    console.warn(`[local-upload] refused path-traversal delete: ${publicIdOrUrl}`);
    return false;
  }

  try {
    await fs.promises.unlink(target);
    return true;
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.warn(`[local-upload] delete failed for ${target}:`, err.message);
    }
    return false;
  }
};

const isLocalPublicId = (publicId) => typeof publicId === 'string' && publicId.startsWith(LOCAL_PUBLIC_ID_PREFIX);
const isLocalUrl      = (url)      => typeof url === 'string' && url.startsWith(`${URL_PREFIX}/`);

const isImageMime = (m) => typeof m === 'string' && m.startsWith('image/');
const mimeToExt = (m) => ({
  'image/jpeg': 'jpg',
  'image/png':  'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif':  'gif',
  'application/pdf': 'pdf',
})[m] || null;

module.exports = {
  UPLOAD_DIR,
  URL_PREFIX,
  LOCAL_PUBLIC_ID_PREFIX,
  saveImage,
  saveRaw,
  deleteLocal,
  isLocalPublicId,
  isLocalUrl,
};
