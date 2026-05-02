/**
 * Cloudinary URL transformation helpers.
 *
 * The backend stores the *original* secure_url Cloudinary returns, e.g.
 *   https://res.cloudinary.com/<cloud>/image/upload/v123/pashto-hub/books/abc.jpg
 *
 * These helpers inject a `/c_<crop>,w_<w>,h_<h>,q_auto,f_auto/` segment after
 * `/upload/`, so the same stored URL can deliver a 200×300 thumb on a card
 * and an 800×1200 hero on a detail page — without re-uploading.
 *
 * If the input isn't a Cloudinary URL (e.g. a static fallback path or an
 * external image), we return it unchanged. Safe to call on any image src.
 */

const CLOUDINARY_HOST = 'res.cloudinary.com';
const UPLOAD_MARKER = '/upload/';

const isCloudinary = (url) => typeof url === 'string' && url.includes(CLOUDINARY_HOST) && url.includes(UPLOAD_MARKER);

/**
 * Inject a transformation segment after `/upload/`.
 * Skips silently for non-Cloudinary URLs.
 */
const withTransform = (url, transform) => {
  if (!isCloudinary(url) || !transform) return url;
  const [base, rest] = url.split(UPLOAD_MARKER);
  return `${base}${UPLOAD_MARKER}${transform}/${rest}`;
};

/**
 * Build a transformation string from named options.
 *
 *   buildTransform({ width: 600, height: 800, crop: 'fill', dpr: 'auto' })
 *   →  "c_fill,w_600,h_800,dpr_auto,q_auto,f_auto"
 *
 * `q_auto,f_auto` are appended automatically — they're the two most impactful
 * Cloudinary params (intelligent quality + auto-WebP/AVIF), and there's no
 * realistic case where you'd want to omit them.
 */
const buildTransform = ({
  width,
  height,
  crop = 'fill',
  gravity = 'auto',
  dpr = 'auto',
  quality = 'auto',
  format = 'auto',
} = {}) => {
  const parts = [];
  if (crop)    parts.push(`c_${crop}`);
  if (gravity) parts.push(`g_${gravity}`);
  if (width)   parts.push(`w_${Math.round(width)}`);
  if (height)  parts.push(`h_${Math.round(height)}`);
  if (dpr)     parts.push(`dpr_${dpr}`);
  if (quality) parts.push(`q_${quality}`);
  if (format)  parts.push(`f_${format}`);
  return parts.join(',');
};

/**
 * Convenience: produce a ready-to-use src for an <img> tag.
 *   cloudImg(book.coverImage, { width: 480, height: 640 })
 */
export const cloudImg = (url, opts = {}) =>
  withTransform(url, buildTransform(opts));

/**
 * Build a `srcset` string for responsive images.
 *   srcSet(url, [320, 640, 960], { height: 'auto' })
 *   →  ".../w_320,..." 320w, ".../w_640,..." 640w, ...
 *
 * Pair with a `sizes` attribute to let the browser pick the best size.
 */
export const cloudSrcSet = (url, widths, baseOpts = {}) => {
  if (!isCloudinary(url) || !Array.isArray(widths)) return undefined;
  return widths
    .map((w) => `${withTransform(url, buildTransform({ ...baseOpts, width: w }))} ${w}w`)
    .join(', ');
};

/**
 * Tiny blurred placeholder (LQIP) for skeleton/loading states.
 *   <img src={blurPlaceholder(url)} ... onLoad={…} />
 */
export const cloudBlur = (url) =>
  withTransform(url, 'w_20,e_blur:1000,q_auto,f_auto');

export { isCloudinary };
