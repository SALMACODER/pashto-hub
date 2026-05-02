// import { FiStar, FiBookOpen, FiArrowRight } from 'react-icons/fi'
// import { useNavigate } from 'react-router-dom'
// import { useLanguage } from '../context/LanguageContext'

// const BookCard = ({ book }) => {
//   const { language, t } = useLanguage()
//   const navigate = useNavigate()

//   const handleReadNow = () => {
//     if (book.fileUrl) {
//       // Full page reader pe navigate karo, book data saath bhejo
//       navigate('/books/read', { state: { book } })
//     } else {
//       alert('This book is not available online yet.')
//     }
//   }

//   return (
//     <div className="flex flex-col overflow-hidden card group">

//       {/* Cover */}
      
//       <div className={`relative aspect-[3/4] bg-gradient-to-br ${book.color} flex items-center justify-center p-6 overflow-hidden`}>
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_50%)]" />

//         <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs font-semibold text-gray-800 px-2.5 py-1 rounded-full flex items-center gap-1">
//           <FiStar className="w-3 h-3 text-gold-500 fill-gold-500" />
//           {book.rating}
//         </div>

//         <div className="relative text-center">
//           <div className="text-2xl font-bold leading-snug text-white pashto-text md:text-3xl drop-shadow-lg">
//             {book.title?.ps}
//           </div>
//           <div className="mt-3 text-sm font-semibold tracking-wide text-white/90">
//             {book.title?.en}
//           </div>
//         </div>

//         <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/0 via-white/50 to-white/0" />
        
//       </div>

//       {/* Body */}
//       <div className="flex flex-col flex-1 p-5">
//         <div className="mb-1 text-xs font-semibold tracking-wide uppercase text-primary-600 dark:text-gold-400">
//           {t('books.by')} {book.author?.[language]}
//         </div>
//         <h3 className={`font-display text-lg font-bold text-gray-900 dark:text-white mb-2 ${language === 'ps' ? 'pashto-text' : ''}`}>
//           {book.title?.[language]}
//         </h3>
//         <p className={`text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 ${language === 'ps' ? 'pashto-text' : ''}`}>
//           {book.description?.[language]}
//         </p>

//         <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100 dark:border-gray-800">
//           <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
//             <FiBookOpen /> {book.pages} pages
//           </span>
//           <button
//             onClick={handleReadNow}
//             className="inline-flex items-center gap-1 text-sm font-semibold transition-all text-primary-600 dark:text-gold-400 group-hover:gap-2"
//           >
//             {t('books.read')} <FiArrowRight />
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default BookCard

import { memo, useCallback } from 'react'
import { FiStar, FiBookOpen, FiArrowRight } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const BookCard = ({ book }) => {
  const { language, t } = useLanguage()
  const navigate = useNavigate()

  const handleReadNow = useCallback(() => {
    if (book.fileUrl) {
      navigate('/books/read', { state: { book } })
    } else {
      alert('This book is not available online yet.')
    }
  }, [book, navigate])

  return (
    <article className="flex flex-col overflow-hidden card group">

      {/* Cover */}
      <div className={`relative aspect-[3/4] bg-gradient-to-br ${book.color} flex items-center justify-center p-6 overflow-hidden`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_50%)]" />

        {/* ✅ Book Cover Image - sirf tab show ho jab coverImage ho */}
        {book.coverImage && (
          <img
            src={book.coverImage}
            alt={book.title?.en || book.title?.ps || 'Book cover'}
            width="480"
            height="640"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 object-cover w-full h-full"
          />
        )}

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs font-semibold text-gray-800 px-2.5 py-1 rounded-full flex items-center gap-1 z-10">
          <FiStar className="w-3 h-3 text-gold-500 fill-gold-500" />
          {book.rating}
        </div>

        {/* Title - sirf tab show ho jab coverImage NA ho */}
        {!book.coverImage && (
          <div className="relative z-10 text-center">
            <div className="text-2xl font-bold leading-snug text-white pashto-text md:text-3xl drop-shadow-lg">
              {book.title?.ps}
            </div>
            <div className="mt-3 text-sm font-semibold tracking-wide text-white/90">
              {book.title?.en}
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 z-10 h-1 bg-gradient-to-r from-white/0 via-white/50 to-white/0" />
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <div className="mb-1 text-xs font-semibold tracking-wide uppercase text-primary-600 dark:text-gold-400">
          {t('books.by')} {book.author?.[language]}
        </div>
        <h3 className={`font-display text-lg font-bold text-gray-900 dark:text-white mb-2 ${language === 'ps' ? 'pashto-text' : ''}`}>
          {book.title?.[language]}
        </h3>
        <p className={`text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 ${language === 'ps' ? 'pashto-text' : ''}`}>
          {book.description?.[language]}
        </p>

        <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100 dark:border-gray-800">
          <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <FiBookOpen /> {book.pages} pages
          </span>
          <button
            onClick={handleReadNow}
            className="inline-flex items-center gap-1 text-sm font-semibold transition-all text-primary-600 dark:text-gold-400 group-hover:gap-2"
          >
            {t('books.read')} <FiArrowRight />
          </button>
        </div>
      </div>
    </article>
  )
}

export default memo(BookCard)