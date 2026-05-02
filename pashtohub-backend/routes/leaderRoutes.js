const express = require('express');
const router = express.Router();

const validate = require('../middleware/validateMiddleware');
const {
  getLeaders,
  getLeaderByIdOrSlug,
} = require('../controllers/leaderController');
const {
  listRules,
  idOrSlugParam,
} = require('../validators/leaderValidator');

router.get('/',           listRules,     validate, getLeaders);
router.get('/:idOrSlug',  idOrSlugParam, validate, getLeaderByIdOrSlug);

module.exports = router;
