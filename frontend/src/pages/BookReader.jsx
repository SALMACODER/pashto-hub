import { useLocation, useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import SEO from '../seo/SEO'
import { useLanguage } from '../context/LanguageContext'

const BookReader = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { language } = useLanguage()

  const book = state?.book

  // Convert Google Drive link to preview format
  const getEmbedUrl = (url) => {
    if (!url) return null
    if (url.includes('/preview')) return url
    if (url.includes('drive.google.com')) {
      return url
        .replace('/view', '/preview')
        .replace('?usp=sharing', '')
        .replace('?usp=drive_link', '')
    }
    return url
  }

  const embedUrl = book ? getEmbedUrl(book.fileUrl) : null

  if (!book || !embedUrl) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="text-center">
          <p className="mb-4 text-xl text-gray-500 dark:text-gray-400">
            Book not found or not available.
          </p>
          <button
            onClick={() => navigate('/books')}
            className="btn-primary"
          >
            Back to Books
          </button>
        </div>
      </div>
    )
  }

  const bookJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title?.en || book.title?.ps,
    alternateName: book.title?.ps,
    author: { '@type': 'Person', name: book.author?.en || book.author?.ps },
    inLanguage: book.language || 'ps',
    numberOfPages: book.pages || undefined,
    datePublished: book.publishedYear ? String(book.publishedYear) : undefined,
    aggregateRating: book.rating ? {
      '@type': 'AggregateRating', ratingValue: book.rating, bestRating: 5,
    } : undefined,
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <SEO
        title={book.title?.[language] || book.title?.en}
        description={book.description?.[language] || book.description?.en || `Read "${book.title?.en}" by ${book.author?.en} on PashtoHub.`}
        path={book.slug ? `/books/${book.slug}` : '/books/read'}
        type="book"
        lang={language}
        noindex
        jsonLd={bookJsonLd}
      />

      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between flex-shrink-0 px-4 py-3 bg-white border-b border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/books')}
            className="flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-gold-400 hover:underline"
          >
            <FiArrowLeft size={18} />
            Back to Books
          </button>
          <div className="w-px h-5 bg-gray-300 dark:bg-gray-600" />
          <div>
            <h1 className={`font-bold text-gray-900 dark:text-white text-sm md:text-base ${language === 'ps' ? 'pashto-text' : ''}`}>
              {book.title?.[language] || book.title?.en}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {book.author?.[language] || book.author?.en} • {book.pages} pages
            </p>
          </div>
        </div>
      </div>
      

      {/* ── PDF Reader (full remaining height) ── */}
      <div className="relative flex-1 overflow-hidden">
        <iframe
          src={embedUrl}
          title={book.title?.en || 'Book Reader'}
          className="w-full h-full border-0"
          allow="autoplay"
          sandbox="allow-scripts allow-same-origin"
        />

       {/* Block Google Drive top-right */}
<div className="absolute top-0 right-0" 
     style={{ width: '150px', height: '70px', zIndex: 10, background: 'transparent' }} />

{/* Block Google Drive top-left */}
<div className="absolute top-0 left-0" 
     style={{ width: '250px', height: '70px', zIndex: 10, background: 'transparent' }} />


        {/* Block bottom download/print bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900" style={{ height: '18px', zIndex: 10 }} />
      </div>

    </div>
  )
}

export default BookReader