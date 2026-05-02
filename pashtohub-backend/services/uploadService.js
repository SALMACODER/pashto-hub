/**
 * Upload service — single source of truth for ALL Cloudinary I/O.
 *
 * Responsibilities:
 *   - upload buffers (from multer memory storage) to a specific subfolder
 *   - apply image-specific transformations (auto WebP, q_auto)
 *   - delete by public_id (resource_type aware)
 *   - replace files atomically: upload-new → delete-old (only on success)
 *
 * Folders follow:  <baseFolder>/<bucket>     e.g. pashto-hub/books
 */

const { cloudinary, baseFolder, isConfigured } = require('../config/cloudinary');

const BUCKETS = Object.freeze({
  BOOKS:      'books',
  LEADERS:    'leaders',
  LESSONS:    'lessons',
  DICTIONARY: 'dictionary',
  MISC:       'misc',
});

const RESOURCE = Object.freeze({
  IMAGE: 'image',
  RAW:   'raw',     // PDFs, ZIPs, anything non-image/video
  VIDEO: 'video',
});

const requireConfigured = () => {
  if (!isConfigured) {
    const err = new Error('Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env');
    err.status = 503;
    err.code = 'CLOUDINARY_NOT_CONFIGURED';
    throw err;
  }
};

const folderFor = (bucket) => `${baseFolder}/${bucket}`;

/**
 * Promise wrapper around upload_stream — accepts a Buffer + options.
 * Returns { url, publicId, bytes, format, width, height, resourceType }.
 */
const uploadBuffer = (buffer, options) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err);
      if (!result) return reject(new Error('Empty Cloudinary response'));
      resolve({
        url:          result.secure_url,
        publicId:     result.public_id,
        bytes:        result.bytes,
        format:       result.format,
        width:        result.width,
        height:       result.height,
        resourceType: result.resource_type,
        originalFilename: result.original_filename,
      });
    });
    stream.end(buffer);
  });

/**
 * Upload an image. Cloudinary will auto-pick the best modern format (WebP/AVIF)
 * for delivery and apply intelligent quality on the served URL — but we also
 * lock the SOURCE to a sane max size so we never store gigantic originals.
 */
const uploadImage = async (buffer, { bucket = BUCKETS.MISC, filename } = {}) => {
  requireConfigured();
  return uploadBuffer(buffer, {
    folder: folderFor(bucket),
    resource_type: RESOURCE.IMAGE,
    use_filename: Boolean(filename),
    unique_filename: true,
    overwrite: false,
    public_id: filename ? sanitizePublicId(filename) : undefined,
    // Source-side cap: keep originals reasonable to save storage.
    transformation: [
      { width: 2000, height: 2000, crop: 'limit' },
      { quality: 'auto:good', fetch_format: 'auto' },
    ],
  });
};

/**
 * Upload a non-image asset (PDF, etc.) as a Cloudinary "raw" resource.
 */
const uploadRaw = async (buffer, { bucket = BUCKETS.MISC, filename } = {}) => {
  requireConfigured();
  return uploadBuffer(buffer, {
    folder: folderFor(bucket),
    resource_type: RESOURCE.RAW,
    use_filename: Boolean(filename),
    unique_filename: true,
    overwrite: false,
    public_id: filename ? sanitizePublicId(filename) : undefined,
  });
};

/**
 * Delete one asset by public_id. Caller MUST pass the resourceType that was
 * stored alongside it (image vs raw) — Cloudinary needs it to find the asset.
 *
 * Returns true on success, false if the asset didn't exist.
 * Never throws — deletions are best-effort cleanup.
 */
const deleteByPublicId = async (publicId, resourceType = RESOURCE.IMAGE) => {
  if (!publicId || !isConfigured) return false;
  try {
    const res = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });
    return res.result === 'ok';
  } catch (err) {
    // Log and swallow — we never want a stray Cloudinary error to roll back a DB delete.
    console.warn(`[upload] delete failed for ${publicId}:`, err.message);
    return false;
  }
};

/**
 * Replace a file: upload the new one first, only delete the old on success.
 * Use this for cover image changes — never the other way around.
 */
const replaceImage = async (buffer, { bucket, oldPublicId, filename } = {}) => {
  const fresh = await uploadImage(buffer, { bucket, filename });
  if (oldPublicId && oldPublicId !== fresh.publicId) {
    deleteByPublicId(oldPublicId, RESOURCE.IMAGE);   // fire-and-forget
  }
  return fresh;
};

const replaceRaw = async (buffer, { bucket, oldPublicId, filename } = {}) => {
  const fresh = await uploadRaw(buffer, { bucket, filename });
  if (oldPublicId && oldPublicId !== fresh.publicId) {
    deleteByPublicId(oldPublicId, RESOURCE.RAW);
  }
  return fresh;
};

/**
 * Strip path separators / Cloudinary metacharacters from a filename so an
 * attacker can't traverse out of the configured folder.
 */
function sanitizePublicId(filename) {
  return String(filename)
    .replace(/\.[^/.]+$/, '')                // drop extension (Cloudinary infers it)
    .replace(/[^a-zA-Z0-9_-]/g, '_')         // safe charset
    .slice(0, 80) || 'file';
}

module.exports = {
  BUCKETS,
  RESOURCE,
  uploadImage,
  uploadRaw,
  replaceImage,
  replaceRaw,
  deleteByPublicId,
  isConfigured,
};
