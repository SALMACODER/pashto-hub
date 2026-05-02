const express = require('express');
const router = express.Router();

const {
  getLessons,
  getLessonByIdOrSlug,
  createLesson,
  updateLesson,
  deleteLesson,
} = require('../controllers/lessonController');

const { protect, admin } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const {
  createRules,
  updateRules,
  listRules,
  idParam,
  idOrSlugParam,
} = require('../validators/lessonValidator');

// Public
router.get('/',           listRules,     validate, getLessons);
router.get('/:idOrSlug',  idOrSlugParam, validate, getLessonByIdOrSlug);

// Admin (kept here for back-compat — also exposed under /api/admin/lessons)
router.post('/',      protect, admin, createRules, validate, createLesson);
router.put('/:id',    protect, admin, idParam, updateRules, validate, updateLesson);
router.delete('/:id', protect, admin, idParam, validate, deleteLesson);

module.exports = router;
