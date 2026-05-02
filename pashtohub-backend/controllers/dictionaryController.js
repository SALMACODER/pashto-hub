const asyncHandler = require('express-async-handler');
const Dictionary = require('../models/Dictionary');

const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * @desc   Search / list dictionary words.
 * @route  GET /api/dictionary
 * @access Public
 * @query  q | search   — search term
 *         lang         — 'en' (English-only) | 'ps' (Pashto-only) | omitted (both)
 *         page, limit
 *
 * Lang behavior:
 *   - lang=en  → search english + transliteration only
 *   - lang=ps  → search pashto only
 *   - omitted  → search across all three (back-compat)
 */
const getWords = asyncHandler(async (req, res) => {
  const { q, search, lang, page = 1, limit = 30 } = req.query;
  const query = (q || search || '').trim();

  const filter = {};
  if (query) {
    const rx = new RegExp(escapeRegex(query), 'i');
    if (lang === 'en') {
      filter.$or = [{ english: rx }, { transliteration: rx }];
    } else if (lang === 'ps') {
      filter.pashto = rx;
    } else {
      filter.$or = [
        { english: rx },
        { pashto: rx },
        { transliteration: rx },
      ];
    }
  }

  const pageNum  = Math.max(parseInt(page, 10)  || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 30, 1), 100);

  // Sort: when searching, alphabetize on the language being searched.
  const sortKey = lang === 'ps' ? { pashto: 1 } : { english: 1 };

  const [total, words] = await Promise.all([
    Dictionary.countDocuments(filter),
    Dictionary.find(filter)
      .sort(sortKey)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean(),
  ]);

  res.json({
    success: true,
    data: {
      items: words,
      pagination: {
        page: pageNum,
        pageSize: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    },
    // legacy fields kept so existing frontend keeps working
    words,
    count: words.length,
    total,
  });
});

/**
 * @desc   Featured "popular searches" — admin-curated, language-agnostic.
 *         The frontend renders the headword in whichever language is active.
 *         Falls back to recent additions if no entries are flagged featured,
 *         so a fresh DB doesn't render an empty pill row.
 * @route  GET /api/dictionary/popular
 * @access Public
 * @query  lang (optional, only used to bias sort), limit (default 8)
 */
const getPopular = asyncHandler(async (req, res) => {
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 8, 1), 50);

  let items = await Dictionary.find({ featured: true })
    .sort({ featuredOrder: 1, english: 1 })
    .limit(limit)
    .lean();

  if (items.length === 0) {
    items = await Dictionary.find()
      .sort({ lookups: -1, createdAt: -1 })
      .limit(limit)
      .lean();
  }

  res.json({ success: true, data: { items }, items });
});

/**
 * @desc   Get a single word by id (also bumps `lookups` for analytics).
 * @route  GET /api/dictionary/:id
 * @access Public
 */
const getWordById = asyncHandler(async (req, res) => {
  const word = await Dictionary.findById(req.params.id).lean();
  if (!word) {
    res.status(404);
    throw new Error('Word not found');
  }
  Dictionary.updateOne({ _id: word._id }, { $inc: { lookups: 1 } }).catch(() => {});
  res.json({ success: true, data: { word }, word });
});

const createWord = asyncHandler(async (req, res) => {
  const word = await Dictionary.create({ ...req.body, addedBy: req.user._id });
  res.status(201).json({ success: true, message: 'Word added', data: { word }, word });
});

const updateWord = asyncHandler(async (req, res) => {
  const word = await Dictionary.findById(req.params.id);
  if (!word) { res.status(404); throw new Error('Word not found'); }
  Object.assign(word, req.body);
  const updated = await word.save();
  res.json({ success: true, message: 'Word updated', data: { word: updated }, word: updated });
});

const deleteWord = asyncHandler(async (req, res) => {
  const word = await Dictionary.findById(req.params.id);
  if (!word) { res.status(404); throw new Error('Word not found'); }
  await word.deleteOne();
  res.json({ success: true, message: 'Word deleted' });
});

module.exports = {
  getWords,
  getPopular,
  getWordById,
  createWord,
  updateWord,
  deleteWord,
};
