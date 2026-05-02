const express = require('express');
const router = express.Router();

const {
  getWords,
  getPopular,
  getWordById,
  createWord,
  updateWord,
  deleteWord,
} = require('../controllers/dictionaryController');

const { protect, admin } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const {
  createRules,
  updateRules,
  searchRules,
  popularRules,
  idParam,
} = require('../validators/dictionaryValidator');

// Public — featured row for the dictionary page's "Popular" pills.
// Mounted BEFORE /:id so "popular" doesn't get caught by the id route.
router.get('/popular', popularRules, validate, getPopular);

// Public — main search/list endpoint.
router.get('/',  searchRules, validate, getWords);
router.get('/:id', idParam,   validate, getWordById);

// Admin
router.post('/',      protect, admin, createRules, validate, createWord);
router.put('/:id',    protect, admin, idParam, updateRules, validate, updateWord);
router.delete('/:id', protect, admin, idParam, validate, deleteWord);

module.exports = router;
