/**
 * Upload controller — generic image / PDF endpoints.
 *
 * Two storage backends, picked by `?mode=` (default: cloudinary):
 *   - cloudinary   → services/uploadService.js     (default; secure_url + public_id)
 *   - local        → services/localUploadService.js (writes under <UPLOAD_DIR>)
 *
 * Both backends return the same shape:
 *   { url, publicId, bytes, format, width, height, resourceType, originalFilename, storage }
 *
 * The `publicId` is what the caller stores on the resource. For local uploads
 * it carries a "local:" prefix so cleanup code can dispatch correctly.
 *
 * The DELETE endpoint detects local vs cloudinary from the publicId itself —
 * the client doesn't need to remember which mode it used.
 */

const asyncHandler = require('express-async-handler');
const cloud = require('../services/uploadService');
const local = require('../services/localUploadService');

const VALID_BUCKETS = new Set(Object.values(cloud.BUCKETS));
const VALID_MODES   = new Set(['cloudinary', 'local']);

const resolveBucket = (raw) => {
  if (!raw) return cloud.BUCKETS.MISC;
  const v = String(raw).toLowerCase();
  return VALID_BUCKETS.has(v) ? v : cloud.BUCKETS.MISC;
};

const resolveMode = (raw) => {
  const v = String(raw || 'cloudinary').toLowerCase();
  return VALID_MODES.has(v) ? v : 'cloudinary';
};

/**
 * @desc   Upload a single image
 * @route  POST /api/admin/uploads/image?bucket=books&mode=cloudinary|local
 * @access Admin
 */
const postImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded — expected multipart field "file"');
  }
  const bucket = resolveBucket(req.query.bucket || req.body.bucket);
  const mode   = resolveMode(req.query.mode    || req.body.mode);

  const result = mode === 'local'
    ? await local.saveImage(req.file.buffer, {
        bucket,
        originalname: req.file.originalname,
        mimetype:     req.file.mimetype,
      })
    : await cloud.uploadImage(req.file.buffer, {
        bucket,
        filename: req.file.originalname,
      });

  res.status(201).json({ success: true, data: { ...result, storage: result.storage || 'cloudinary' } });
});

/**
 * @desc   Upload a single PDF (or other "raw" asset)
 * @route  POST /api/admin/uploads/pdf?bucket=books&mode=cloudinary|local
 * @access Admin
 */
const postPdf = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded — expected multipart field "file"');
  }
  const bucket = resolveBucket(req.query.bucket || req.body.bucket);
  const mode   = resolveMode(req.query.mode    || req.body.mode);

  const result = mode === 'local'
    ? await local.saveRaw(req.file.buffer, {
        bucket,
        originalname: req.file.originalname,
        mimetype:     req.file.mimetype,
      })
    : await cloud.uploadRaw(req.file.buffer, {
        bucket,
        filename: req.file.originalname,
      });

  res.status(201).json({ success: true, data: { ...result, storage: result.storage || 'cloudinary' } });
});

/**
 * @desc   Delete an asset by publicId. Auto-detects local vs cloudinary.
 * @route  DELETE /api/admin/uploads?publicId=...&resourceType=image|raw
 * @access Admin
 */
const deleteAsset = asyncHandler(async (req, res) => {
  const { publicId, resourceType = cloud.RESOURCE.IMAGE } = req.query;
  if (!publicId) {
    res.status(400);
    throw new Error('publicId query param is required');
  }

  // Local asset?
  if (local.isLocalPublicId(publicId)) {
    const ok = await local.deleteLocal(publicId);
    return res.json({ success: true, data: { deleted: ok, publicId, storage: 'local' } });
  }

  // Cloudinary path
  if (![cloud.RESOURCE.IMAGE, cloud.RESOURCE.RAW, cloud.RESOURCE.VIDEO].includes(resourceType)) {
    res.status(400);
    throw new Error('Invalid resourceType — must be image, raw or video');
  }
  const baseFolder = require('../config/cloudinary').baseFolder;
  if (!String(publicId).startsWith(`${baseFolder}/`)) {
    res.status(403);
    throw new Error('publicId is outside the managed folder');
  }
  const ok = await cloud.deleteByPublicId(publicId, resourceType);
  return res.json({ success: true, data: { deleted: ok, publicId, storage: 'cloudinary' } });
});

/**
 * @desc   Tells the frontend which storage backends are available so the
 *         toggle UI can disable an unavailable option.
 * @route  GET /api/admin/uploads/config
 * @access Admin
 */
const getConfig = asyncHandler(async (_req, res) => {
  res.json({
    success: true,
    data: {
      cloudinary: cloud.isConfigured,
      local: true,
      defaultMode: cloud.isConfigured ? 'cloudinary' : 'local',
    },
  });
});

module.exports = { postImage, postPdf, deleteAsset, getConfig };
