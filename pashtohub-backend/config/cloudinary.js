/**
 * Cloudinary SDK initialization.
 *
 * Reads credentials from env. Configuration is silent if creds are missing —
 * upload calls will fail at request time instead of crashing boot.
 *
 * Required env vars:
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 *
 * Optional:
 *   CLOUDINARY_BASE_FOLDER  (default: "pashto-hub")
 */
const cloudinary = require('cloudinary').v2;

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_BASE_FOLDER = 'pashto-hub',
} = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key:    CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure:     true,
});

const isConfigured = Boolean(
  CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET
);

if (!isConfigured) {
  console.warn('[cloudinary] credentials missing — upload endpoints will fail until CLOUDINARY_* env vars are set');
}

module.exports = { cloudinary, baseFolder: CLOUDINARY_BASE_FOLDER, isConfigured };
