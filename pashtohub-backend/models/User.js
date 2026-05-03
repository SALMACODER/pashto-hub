const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // never return by default
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    avatar: {
      type: String,
      default: '',
    },
    preferredLanguage: {
      type: String,
      enum: ['en', 'ps'],
      default: 'en',
    },

    // ── Password reset ────────────────────────────────────────────────────
    // The PLAIN token is sent in the email link; the SHA-256 HASH of it is
    // stored here. If the DB ever leaks, an attacker still can't use the
    // tokens because they only have hashes.
    resetPasswordToken:  { type: String, select: false },
    resetPasswordExpire: { type: Date,   select: false },
  },
  { timestamps: true },
);

// Index speeds up the `findOne({ resetPasswordToken, resetPasswordExpire: { $gt: now } })`
// lookup the reset endpoint runs on every submit.
userSchema.index({ resetPasswordToken: 1, resetPasswordExpire: 1 });

// Hash password before save. Cost 12 ≈ 250–400ms on 2025 hardware (industry standard).
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method — compare plain-text password with hashed one
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Clean JSON output — strip sensitive fields
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);