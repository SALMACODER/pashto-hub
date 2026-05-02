/**
 * Multer middleware factories.
 *
 * Strategy: memory storage. Files are held as Buffers in RAM, then streamed
 * straight to Cloudinary. We never write to disk — no temp files to clean up.
 *
 * Caveats:
 *   - Memory storage means request body lives in RAM; that's why size limits
 *     here are tight (5 MB per image, 50 MB per PDF).
 *   - For very large uploads, switch to disk storage or signed direct-to-cloud.
 */
const multer = require('multer');

const IMAGE_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']);
const PDF_MIME   = new Set(['application/pdf']);

const MB = 1024 * 1024;

const buildFilter = (allowed, label) => (_req, file, cb) => {
  if (allowed.has(file.mimetype)) return cb(null, true);
  const err = new Error(`Unsupported ${label} type: ${file.mimetype}`);
  err.status = 415;
  err.code = 'UNSUPPORTED_MEDIA_TYPE';
  cb(err);
};

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * MB, files: 1 },
  fileFilter: buildFilter(IMAGE_MIME, 'image'),
});

const imagesUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * MB, files: 10 },
  fileFilter: buildFilter(IMAGE_MIME, 'image'),
});

const pdfUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * MB, files: 1 },
  fileFilter: buildFilter(PDF_MIME, 'PDF'),
});

/**
 * Translate multer's own errors into our standard error envelope.
 * Wrap any upload() call with this so the client gets a consistent JSON error.
 */
const handleMulterError = (err, _req, res, next) => {
  if (!err) return next();
  if (err instanceof multer.MulterError) {
    let status = 400, code = 'UPLOAD_ERROR', msg = err.message;
    if (err.code === 'LIMIT_FILE_SIZE') { status = 413; code = 'FILE_TOO_LARGE'; msg = 'File exceeds size limit'; }
    if (err.code === 'LIMIT_FILE_COUNT') { code = 'TOO_MANY_FILES'; }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') { code = 'UNEXPECTED_FIELD'; msg = `Unexpected field "${err.field}"`; }
    return res.status(status).json({
      success: false,
      error: { code, message: msg, ...(err.field ? { details: { field: err.field } } : {}) },
      message: msg,
    });
  }
  if (err.code === 'UNSUPPORTED_MEDIA_TYPE') {
    return res.status(415).json({
      success: false,
      error: { code: err.code, message: err.message },
      message: err.message,
    });
  }
  next(err);
};

module.exports = {
  imageUpload,
  imagesUpload,
  pdfUpload,
  handleMulterError,
  IMAGE_MIME,
  PDF_MIME,
};
