const { body, query, param } = require('express-validator');

/** Shared regex — slug-safe identifiers. */
const POS_EN = ['Noun', 'Verb', 'Adjective', 'Adverb', 'Pronoun', 'Interjection', 'Other'];
const LANG   = ['en', 'ps'];

const createRules = [
  body('english').trim().isLength({ min: 1, max: 80 }).withMessage('English word required (max 80)'),
  body('pashto').trim().isLength({ min: 1, max: 80 }).withMessage('Pashto word required (max 80)'),
  body('transliteration').optional().trim().isLength({ max: 80 }),
  body('partOfSpeech.en').optional().isIn(POS_EN),
  body('partOfSpeech.ps').optional().trim().isLength({ max: 40 }),
  body('meaning.en').optional().trim().isLength({ max: 1000 }),
  body('meaning.ps').optional().trim().isLength({ max: 1000 }),
  body('example.en').optional().trim().isLength({ max: 500 }),
  body('example.ps').optional().trim().isLength({ max: 500 }),
  body('audioUrl').optional({ values: 'falsy' }).isURL(),
  body('featured').optional().isBoolean().toBoolean(),
  body('featuredOrder').optional().isInt({ min: 0, max: 9999 }).toInt(),
];

const updateRules = createRules.map((r) => r.optional({ values: 'undefined' }));

const searchRules = [
  query('q').optional().trim().isLength({ max: 80 }).escape(),
  query('search').optional().trim().isLength({ max: 80 }).escape(),  // legacy alias
  query('lang').optional().isIn(LANG),
  query('page').optional().isInt({ min: 1, max: 1000 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
];

const popularRules = [
  query('lang').optional().isIn(LANG),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
];

const idParam = [param('id').isMongoId().withMessage('Invalid id')];

module.exports = { createRules, updateRules, searchRules, popularRules, idParam };
