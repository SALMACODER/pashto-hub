/**
 * Admin leader routes — guarded by `protect` + `admin`. Mounted at /api/admin/leaders.
 * Cloudinary / local-disk cleanup on update + delete is handled inside leaderController.
 */
const express = require('express');
const router = express.Router();

const { protect, admin } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const {
  getLeaders,
  getLeaderByIdOrSlug,
  createLeader,
  updateLeader,
  deleteLeader,
} = require('../controllers/leaderController');
const {
  createRules,
  updateRules,
  listRules,
  idParam,
  idOrSlugParam,
} = require('../validators/leaderValidator');

router.use(protect, admin);

router.get('/',           listRules,     validate, getLeaders);
router.get('/:idOrSlug',  idOrSlugParam, validate, getLeaderByIdOrSlug);
router.post('/',          createRules,   validate, createLeader);
router.put('/:id',        idParam, updateRules, validate, updateLeader);
router.delete('/:id',     idParam, validate, deleteLeader);

module.exports = router;
