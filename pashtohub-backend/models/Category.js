const mongoose = require('mongoose');
const slugify = require('slugify');

/**
 * Category model. Used by the admin "create new" dropdown so admins can
 * introduce new buckets (e.g. "biography", "drama") without code changes.
 *
 * Slug is auto-derived from name.en and is what gets stored on Book.category,
 * so renaming a category's display name doesn't break existing books.
 */
const categorySchema = new mongoose.Schema(
  {
    name: {
      en: { type: String, required: [true, 'English name is required'], trim: true, maxlength: 60 },
      ps: { type: String, required: [true, 'Pashto name is required'],  trim: true, maxlength: 60 },
    },
    slug: {
      type: String,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9-]+$/,
    },
    icon:  { type: String, default: '📚' },
    color: { type: String, default: 'from-primary-500 to-primary-700' },
    order: { type: Number, default: 0 },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

async function generateUniqueSlug(Model, base, currentId) {
  let slug = base, n = 1;
  while (true) {
    const existing = await Model.findOne({ slug }).select('_id').lean();
    if (!existing || (currentId && existing._id.equals(currentId))) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

categorySchema.pre('validate', async function (next) {
  if (this.slug && !this.isModified('name.en')) return next();
  const source = this.name?.en || this.name?.ps || 'category';
  const base = slugify(source, { lower: true, strict: true, locale: 'en' }) || 'category';
  try {
    this.slug = await generateUniqueSlug(this.constructor, base, this._id);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Category', categorySchema);
