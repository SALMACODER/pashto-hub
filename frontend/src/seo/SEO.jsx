import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'PashtoHub'
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://pashtohub.com'
const DEFAULT_IMAGE = `${SITE_URL}/og-default.jpg`
const DEFAULT_DESC =
  'PashtoHub — learn Pashto, read Pashto books, and explore the rich Pashto language and culture.'

/**
 * Per-page SEO. Drop one of these at the top of every route component.
 *
 * Props:
 *   title       — page title (will be appended with " | PashtoHub")
 *   description — meta description (~150–160 chars)
 *   image       — absolute URL to social-share image (1200x630 recommended)
 *   path        — pathname without origin, e.g. "/books/da-pashtano-tarikh"
 *   type        — OG type: 'website' (default), 'article', 'book', 'profile'
 *   lang        — content language: 'en' or 'ps'
 *   noindex     — true to add <meta name="robots" content="noindex">
 *   jsonLd      — optional structured data object (will be JSON-stringified)
 */
const SEO = ({
  title,
  description = DEFAULT_DESC,
  image = DEFAULT_IMAGE,
  path = '',
  type = 'website',
  lang = 'en',
  noindex = false,
  jsonLd,
}) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Learn, Read and Explore Pashto Language`
  const url = `${SITE_URL}${path}`

  return (
    <Helmet htmlAttributes={{ lang, dir: lang === 'ps' ? 'rtl' : 'ltr' }}>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content={lang === 'ps' ? 'ps_AF' : 'en_US'} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Pashto language hint for crawlers */}
      <meta httpEquiv="content-language" content="ps,en" />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  )
}

export default SEO
