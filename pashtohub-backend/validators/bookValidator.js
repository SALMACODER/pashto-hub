const { body, query, param } = require('express-validator');

// Category is now a slug stored on the Book (referencing a Category doc).
// Validate format only — existence is enforced softly (admin can create new
// categories from the UI, so we don't want to block the form on a race).
const CATEGORY_SLUG = /^[a-z0-9-]{1,50}$/;

/**
 * URL OR local upload path (what services/localUploadService.js returns).
 * Cloudinary returns a full https URL; local saves return "/uploads/<bucket>/<file>".
 * Accept both. Reject path traversal in the local form.
 */
const isUrlOrLocalPath = (val) => {
  if (typeof val !== 'string' || !val) return false;
  if (val.startsWith('/uploads/')) {
    return !val.includes('..') && /^\/uploads\/[a-z0-9-]+\/[A-Za-z0-9._-]+$/.test(val);
  }
  try { new URL(val); return true; } catch { return false; }
};

const createBookRules = [
  body('title.en').trim().isLength({ min: 1, max: 200 }).withMessage('English title required (max 200 chars)'),
  body('title.ps').trim().isLength({ min: 1, max: 200 }).withMessage('Pashto title required (max 200 chars)'),
  body('author.en').trim().isLength({ min: 1, max: 120 }),
  body('author.ps').trim().isLength({ min: 1, max: 120 }),
  body('description.en').optional().trim().isLength({ max: 2000 }),
  body('description.ps').optional().trim().isLength({ max: 2000 }),
  body('category').trim().toLowerCase().matches(CATEGORY_SLUG).withMessage('Category must be a slug (a-z, 0-9, hyphens, max 50)'),
  body('language').optional().isIn(['ps', 'en']),
  body('pages').optional().isInt({ min: 1, max: 10000 }),
  body('publishedYear').optional().isInt({ min: 600, max: new Date().getFullYear() + 1 }),
  body('coverImage').optional({ values: 'falsy' }).custom(isUrlOrLocalPath).withMessage('coverImage must be a URL or /uploads/ path'),
  body('coverPublicId').optional({ values: 'falsy' }).isString().isLength({ max: 200 }),
  body('fileUrl').optional({ values: 'falsy' }).custom(isUrlOrLocalPath).withMessage('fileUrl must be a URL or /uploads/ path'),
  body('filePublicId').optional({ values: 'falsy' }).isString().isLength({ max: 200 }),
  body('fileSize').optional().isInt({ min: 0 }),
  body('images').optional().isArray({ max: 20 }),
  body('images.*.url').optional().custom(isUrlOrLocalPath).withMessage('image url must be a URL or /uploads/ path'),
  body('images.*.publicId').optional().isString().isLength({ max: 200 }),
  body('images.*.caption').optional().isString().isLength({ max: 200 }),
];

const updateBookRules = createBookRules.map((r) => r.optional({ values: 'undefined' }));

const searchBookRules = [
  query('q').optional().trim().isLength({ max: 100 }).escape(),
  query('category').optional().trim().toLowerCase().matches(CATEGORY_SLUG),
  query('lang').optional().isIn(['ps', 'en']),
  query('page').optional().isInt({ min: 1, max: 1000 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
];

const idParamRule = [
  param('id').isMongoId().withMessage('Invalid id'),
];

const slugParamRule = [
  param('slug').trim().matches(/^[a-z0-9-]+$/).withMessage('Invalid slug'),
];

module.exports = {
  CATEGORY_SLUG,
  createBookRules,
  updateBookRules,
  searchBookRules,
  idParamRule,
  slugParamRule,
};
