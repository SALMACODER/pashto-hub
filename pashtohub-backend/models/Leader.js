const mongoose = require('mongoose');
const slugify = require('slugify');

/**
 * Leader (notable Pashtun figure) — bilingual.
 *
 * Frontend rendering (LeaderDetail) expects:
 *   - hero        : name, role, era, type, color, emoji
 *   - body        : description (short), biography (long)
 *   - sidebar     : achievements (en[] + ps[])
 *   - quotes row  : [{ en, ps }]
 *
 * `photoUrl` accepts a Cloudinary URL OR a local "/uploads/leaders/..." path.
 * When set, the frontend uses it instead of the emoji on the detail page.
 */

const quoteSchema = new mongoose.Schema(
  {
    en: { type: String, default: '', trim: true, maxlength: 500 },
    ps: { type: String, default: '', trim: true, maxlength: 500 },
  },
  { _id: false },
);

const leaderSchema = new mongoose.Schema(
  {
    name: {
      en: { type: String, required: true, trim: true, maxlength: 120 },
      ps: { type: String, required: true, trim: true, maxlength: 120 },
    },
    slug: {
      type: String,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9-]+$/,
    },
    role: {
      en: { type: String, default: '', trim: true, maxlength: 120 },
      ps: { type: String, default: '', trim: true, maxlength: 120 },
    },
    era:  { type: String, default: '', trim: true, maxlength: 60 },
    type: {
      en: { type: String, default: '', trim: true, maxlength: 60 },
      ps: { type: String, default: '', trim: true, maxlength: 60 },
    },

    // Short blurb shown on the listing card
    description: {
      en: { type: String, default: '', maxlength: 1000 },
      ps: { type: String, default: '', maxlength: 1000 },
    },

    // Long-form prose shown on the detail page
    biography: {
      en: { type: String, default: '', maxlength: 20000 },
      ps: { type: String, default: '', maxlength: 20000 },
    },

    // Bullet list — separate per language so admins don't have to maintain
    // 1:1 line correspondence between translations.
    achievements: {
      en: { type: [String], default: [] },
      ps: { type: [String], default: [] },
    },

    // Famous quotes — order shared across languages
    quotes: { type: [quoteSchema], default: [] },

    // Visual styling
    color: { type: String, default: 'from-primary-700 to-primary-900' },
    emoji: { type: String, default: '🌟' },

    // Optional portrait. URL OR /uploads/... path; publicId for cleanup.
    photoUrl:      { type: String, default: '' },
    photoPublicId: { type: String, default: '' },

    order:   { type: Number, default: 0, index: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

// Search-friendly index: lookup by name (en/ps) and the slug.
leaderSchema.index({ 'name.en': 'text', 'name.ps': 'text', slug: 'text' });

// ─────────────────────── slug auto-generation ─────────────────────────────
async function generateUniqueSlug(Model, base, currentId) {
  let slug = base, n = 1;
  while (true) {
    const existing = await Model.findOne({ slug }).select('_id').lean();
    if (!existing || (currentId && existing._id.equals(currentId))) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

leaderSchema.pre('validate', async function (next) {
  if (this.slug && !this.isModified('name.en')) return next();
  const source = this.name?.en || this.name?.ps || 'leader';
  const base   = slugify(source, { lower: true, strict: true, locale: 'en' }) || 'leader';
  try {
    this.slug = await generateUniqueSlug(this.constructor, base, this._id);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Leader', leaderSchema);
