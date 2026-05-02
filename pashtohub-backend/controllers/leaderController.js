const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Leader = require('../models/Leader');
const { deleteByPublicId, RESOURCE } = require('../services/uploadService');
const { isLocalPublicId, deleteLocal } = require('../services/localUploadService');

/**
 * Cleanup a single asset, dispatching to local-disk vs Cloudinary by prefix.
 * Best-effort — Cloudinary outages or missing local files never bubble up.
 */
const cleanupAsset = (publicId, resourceType = RESOURCE.IMAGE) => {
  if (!publicId) return;
  if (isLocalPublicId(publicId)) deleteLocal(publicId);
  else deleteByPublicId(publicId, resourceType);
};

/**
 * @desc   List leaders.
 * @route  GET /api/leaders
 * @access Public
 * @query  q, page, limit
 */
const getLeaders = asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (q && q.trim()) {
    const rx = new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ 'name.en': rx }, { 'name.ps': rx }, { slug: rx }];
  }
  const pageNum  = Math.max(parseInt(page, 10)  || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 100);

  const [total, leaders] = await Promise.all([
    Leader.countDocuments(filter),
    Leader.find(filter)
      .sort({ order: 1, createdAt: 1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean(),
  ]);

  res.json({
    success: true,
    data: { items: leaders, pagination: { page: pageNum, pageSize: limitNum, total, pages: Math.ceil(total / limitNum) } },
    leaders,
    count: leaders.length,
    total,
  });
});

/**
 * @desc   Fetch a leader by Mongo id OR slug.
 *         The frontend route `/leaders/:id` may carry either; this handles both.
 * @route  GET /api/leaders/:idOrSlug
 * @access Public
 */
const getLeaderByIdOrSlug = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug) && /^[a-f0-9]{24}$/i.test(idOrSlug);

  const leader = isObjectId
    ? await Leader.findById(idOrSlug)
    : await Leader.findOne({ slug: String(idOrSlug).toLowerCase() });

  if (!leader) {
    res.status(404);
    throw new Error('Leader not found');
  }
  res.json({ success: true, data: { leader }, leader });
});

const createLeader = asyncHandler(async (req, res) => {
  const leader = await Leader.create({ ...req.body, addedBy: req.user._id });
  res.status(201).json({ success: true, message: 'Leader created', data: { leader }, leader });
});

const updateLeader = asyncHandler(async (req, res) => {
  const leader = await Leader.findById(req.params.id);
  if (!leader) { res.status(404); throw new Error('Leader not found'); }

  const prevPhotoPublicId = leader.photoPublicId;

  Object.assign(leader, req.body);
  const updated = await leader.save();

  // Photo replaced or removed → drop the old asset
  if (prevPhotoPublicId && prevPhotoPublicId !== updated.photoPublicId) {
    cleanupAsset(prevPhotoPublicId, RESOURCE.IMAGE);
  }

  res.json({ success: true, message: 'Leader updated', data: { leader: updated }, leader: updated });
});

const deleteLeader = asyncHandler(async (req, res) => {
  const leader = await Leader.findById(req.params.id);
  if (!leader) { res.status(404); throw new Error('Leader not found'); }

  const photo = leader.photoPublicId;
  await leader.deleteOne();
  if (photo) cleanupAsset(photo, RESOURCE.IMAGE);

  res.json({ success: true, message: 'Leader deleted' });
});

module.exports = {
  getLeaders,
  getLeader: getLeaderByIdOrSlug,
  getLeaderByIdOrSlug,
  createLeader,
  updateLeader,
  deleteLeader,
};
