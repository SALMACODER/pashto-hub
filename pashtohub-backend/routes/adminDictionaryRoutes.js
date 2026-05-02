/**
 * Admin dictionary routes — guarded by `protect` + `admin`. Mounted at
 * /api/admin/dictionary. The same controllers are also exposed via the public
 * router (POST/PUT/DELETE there are admin-only too) — this dedicated mount
 * keeps the URL pattern consistent with /api/admin/books, /admin/lessons, etc.
 */
const express = require('express');
const router = express.Router();

const { protect, admin } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const {
  getWords,
  getWordById,
  createWord,
  updateWord,
  deleteWord,
} = require('../controllers/dictionaryController');
const {
  createRules,
  updateRules,
  searchRules,
  idParam,
} = require('../validators/dictionaryValidator');

router.use(protect, admin);

router.get('/',       searchRules, validate, getWords);
router.get('/:id',    idParam,     validate, getWordById);
router.post('/',      createRules, validate, createWord);
router.put('/:id',    idParam, updateRules, validate, updateWord);
router.delete('/:id', idParam, validate, deleteWord);

module.exports = router;
