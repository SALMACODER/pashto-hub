const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

/**
 * Dynamic sitemap. Includes:
 *   - Static marketing/learning pages
 *   - Every published book by slug
 *
 * Cached for 6h to keep DB load low; bots typically re-crawl no more than weekly.
 */
const SITE_URL = process.env.SITE_URL || 'https://pashtohub.com';

const STATIC_ROUTES = [
  { path: '/',           changefreq: 'daily',   priority: '1.0' },
  { path: '/books',      changefreq: 'daily',   priority: '0.9' },
  { path: '/learn',      changefreq: 'weekly',  priority: '0.9' },
  { path: '/dictionary', changefreq: 'weekly',  priority: '0.8' },
  { path: '/leaders',    changefreq: 'monthly', priority: '0.8' },
  { path: '/about',      changefreq: 'yearly',  priority: '0.5' },
  { path: '/contact',    changefreq: 'yearly',  priority: '0.4' },
];

const xmlEscape = (s) => String(s).replace(/[<>&'"]/g, (c) => ({
  '<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;'
}[c]));

router.get('/sitemap.xml', async (_req, res) => {
  let books = [];
  try {
    books = await Book.find({}, 'slug updatedAt').lean();
  } catch {
    // DB down — still return static routes
  }

  const urls = [
    ...STATIC_ROUTES.map((r) => ({
      loc: `${SITE_URL}${r.path}`,
      lastmod: new Date().toISOString(),
      changefreq: r.changefreq,
      priority: r.priority,
    })),
    ...books.map((b) => ({
      loc: `${SITE_URL}/books/${b.slug}`,
      lastmod: (b.updatedAt || new Date()).toISOString(),
      changefreq: 'monthly',
      priority: '0.7',
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${xmlEscape(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  res.set('Content-Type', 'application/xml; charset=utf-8');
  res.set('Cache-Control', 'public, max-age=21600'); // 6 hours
  res.send(body);
});

router.get('/robots.txt', (_req, res) => {
  // Hide the admin path even though access is gated by auth — keeps the URL
  // out of search index dumps. Falls back to a sensible default.
  const adminPath = (process.env.ADMIN_PATH || 'pashto-hub').replace(/^\/+/, '');
  res.set('Content-Type', 'text/plain; charset=utf-8');
  res.send([
    'User-agent: *',
    'Allow: /',
    'Disallow: /signin',
    'Disallow: /signup',
    'Disallow: /books/read',
    `Disallow: /${adminPath}/`,
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n'));
});

module.exports = router;
