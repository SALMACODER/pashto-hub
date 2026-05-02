const { body, param, query } = require('express-validator');

const isUrlOrLocal = (val) => {
  if (typeof val !== 'string' || !val) return false;
  if (val.startsWith('/uploads/')) {
    return !val.includes('..') && /^\/uploads\/[a-z0-9-]+\/[A-Za-z0-9._-]+$/.test(val);
  }
  try { new URL(val); return true; } catch { return false; }
};

const createRules = [
  body('name.en').trim().isLength({ min: 1, max: 120 }).withMessage('English name required'),
  body('name.ps').trim().isLength({ min: 1, max: 120 }).withMessage('Pashto name required'),

  body('role.en').optional().trim().isLength({ max: 120 }),
  body('role.ps').optional().trim().isLength({ max: 120 }),

  body('era').optional().trim().isLength({ max: 60 }),
  body('type.en').optional().trim().isLength({ max: 60 }),
  body('type.ps').optional().trim().isLength({ max: 60 }),

  body('description.en').optional().trim().isLength({ max: 1000 }),
  body('description.ps').optional().trim().isLength({ max: 1000 }),

  body('biography.en').optional().trim().isLength({ max: 20000 }),
  body('biography.ps').optional().trim().isLength({ max: 20000 }),

  body('achievements.en').optional().isArray({ max: 50 }),
  body('achievements.ps').optional().isArray({ max: 50 }),
  body('achievements.en.*').optional().isString().trim().isLength({ max: 500 }),
  body('achievements.ps.*').optional().isString().trim().isLength({ max: 500 }),

  body('quotes').optional().isArray({ max: 50 }),
  body('quotes.*.en').optional().trim().isLength({ max: 500 }),
  body('quotes.*.ps').optional().trim().isLength({ max: 500 }),

  body('color').optional().trim().isLength({ max: 100 }),
  body('emoji').optional().trim().isLength({ max: 10 }),
  body('order').optional().isInt({ min: 0, max: 9999 }),

  body('photoUrl').optional({ values: 'falsy' }).custom(isUrlOrLocal).withMessage('photoUrl must be a URL or /uploads/ path'),
  body('photoPublicId').optional({ values: 'falsy' }).isString().isLength({ max: 200 }),
];

const updateRules = createRules.map((r) => r.optional({ values: 'undefined' }));

const listRules = [
  query('q').optional().trim().isLength({ max: 80 }).escape(),
  query('page').optional().isInt({ min: 1, max: 1000 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
];

const idParam       = [param('id').isMongoId().withMessage('Invalid id')];
const idOrSlugParam = [param('idOrSlug').isString().isLength({ min: 1, max: 80 })];

module.exports = { createRules, updateRules, listRules, idParam, idOrSlugParam };
