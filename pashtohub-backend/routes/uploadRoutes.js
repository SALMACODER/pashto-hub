/**
 * Upload routes — admin only.
 *
 * Mounted at /api/admin/uploads in server.js.
 *
 * The CSRF middleware applied globally to /api/* still applies here:
 * the multipart request must carry the X-CSRF-Token header.
 * Multer parses the body AFTER CSRF runs, so this works correctly.
 */
const express = require('express');
const router = express.Router();

const { protect, admin } = require('../middleware/authMiddleware');
const {
  imageUpload,
  pdfUpload,
  handleMulterError,
} = require('../middleware/uploadMiddleware');
const {
  postImage,
  postPdf,
  deleteAsset,
  getConfig,
} = require('../controllers/uploadController');

router.use(protect, admin);

// Tells the admin UI which storage modes are available
router.get('/config', getConfig);

// Single image — multipart field name: "file"
router.post(
  '/image',
  imageUpload.single('file'),
  handleMulterError,
  postImage,
);

// Single PDF — multipart field name: "file"
router.post(
  '/pdf',
  pdfUpload.single('file'),
  handleMulterError,
  postPdf,
);

// Delete by public_id (?publicId=...&resourceType=image|raw)
router.delete('/', deleteAsset);

module.exports = router;
