/**
 * Admin lesson routes — same controllers as the public read endpoints,
 * with all writes guarded by `protect` + `admin`. Mounted at /api/admin/lessons.
 *
 * Cloudinary / local-disk cleanup on update + delete is handled inside the
 * shared lessonController (cleanupAsset / cleanupRemovedMedia).
 */
const express = require('express');
const router = express.Router();

const { protect, admin } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const {
  getLessons,
  getLessonByIdOrSlug,
  createLesson,
  updateLesson,
  deleteLesson,
} = require('../controllers/lessonController');
const {
  createRules,
  updateRules,
  listRules,
  idParam,
  idOrSlugParam,
} = require('../validators/lessonValidator');

router.use(protect, admin);

router.get('/',           listRules,     validate, getLessons);
router.get('/:idOrSlug',  idOrSlugParam, validate, getLessonByIdOrSlug);
router.post('/',          createRules,   validate, createLesson);
router.put('/:id',        idParam, updateRules, validate, updateLesson);
router.delete('/:id',     idParam, validate, deleteLesson);

module.exports = router;
