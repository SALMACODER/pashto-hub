const { body, param, query } = require('express-validator');

const LEVELS  = ['Beginner', 'Intermediate', 'Advanced'];
const TYPES   = ['alphabet', 'phrases', 'colors', 'names', 'rich'];
const SLUG_RE = /^[a-z0-9-]{1,80}$/;

const isUrlOrLocal = (val) => {
  if (typeof val !== 'string' || !val) return false;
  if (val.startsWith('/uploads/')) {
    return !val.includes('..') && /^\/uploads\/[a-z0-9-]+\/[A-Za-z0-9._-]+$/.test(val);
  }
  try { new URL(val); return true; } catch { return false; }
};

const createRules = [
  body('title.en').trim().isLength({ min: 1, max: 200 }).withMessage('English title required'),
  body('title.ps').trim().isLength({ min: 1, max: 200 }).withMessage('Pashto title required'),
  body('description.en').optional().trim().isLength({ max: 2000 }),
  body('description.ps').optional().trim().isLength({ max: 2000 }),
  body('level').isIn(LEVELS).withMessage(`Level must be one of: ${LEVELS.join(', ')}`),
  body('levelPs').optional().trim().isLength({ max: 60 }),
  body('duration').optional().trim().isLength({ max: 30 }),
  body('color').optional().trim().isLength({ max: 100 }),
  body('icon').optional().trim().isLength({ max: 10 }),
  body('order').optional().isInt({ min: 0, max: 9999 }),
  body('content.en').optional().trim().isLength({ max: 20000 }),
  body('content.ps').optional().trim().isLength({ max: 20000 }),
  body('videoUrl').optional({ values: 'falsy' }).custom(isUrlOrLocal),
  body('coverImage').optional({ values: 'falsy' }).custom(isUrlOrLocal),
  body('coverPublicId').optional({ values: 'falsy' }).isString().isLength({ max: 200 }),

  // Chapter rules — applied to every entry in the chapters[] array.
  body('chapters').optional().isArray({ max: 50 }),
  body('chapters.*.title.en').optional().trim().isLength({ min: 1, max: 200 }),
  body('chapters.*.title.ps').optional().trim().isLength({ max: 200 }),
  body('chapters.*.description.en').optional().trim().isLength({ max: 1000 }),
  body('chapters.*.description.ps').optional().trim().isLength({ max: 1000 }),
  body('chapters.*.type').optional().isIn(TYPES),
  body('chapters.*.order').optional().isInt({ min: 0, max: 9999 }),
  body('chapters.*.body.en').optional().trim().isLength({ max: 20000 }),
  body('chapters.*.body.ps').optional().trim().isLength({ max: 20000 }),
  // chapters.*.items is mixed — let the controller / frontend validate shape.

  // Inline media list
  body('media').optional().isArray({ max: 30 }),
  body('media.*.url').optional().custom(isUrlOrLocal),
  body('media.*.publicId').optional().isString().isLength({ max: 200 }),
  body('media.*.resourceType').optional().isIn(['image', 'raw', 'video']),
  body('media.*.caption').optional().isString().isLength({ max: 200 }),
];

const updateRules = createRules.map((r) => r.optional({ values: 'undefined' }));

const listRules = [
  query('level').optional().isIn(LEVELS),
  query('q').optional().trim().isLength({ max: 80 }).escape(),
  query('page').optional().isInt({ min: 1, max: 1000 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
];

const idParam       = [param('id').isMongoId().withMessage('Invalid id')];
const idOrSlugParam = [param('idOrSlug').isString().isLength({ min: 1, max: 80 })];

module.exports = { createRules, updateRules, listRules, idParam, idOrSlugParam, LEVELS, TYPES, SLUG_RE };
