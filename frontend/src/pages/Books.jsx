// import { useState, useMemo } from 'react'
// import BookCard from '../components/BookCard'
// import SearchBar from '../components/SearchBar'
// import { useLanguage } from '../context/LanguageContext'
// import { books, categories } from '../data/books'

// const Books = () => {
//   const { t, language, isRTL } = useLanguage()
//   const isPS = language === 'ps'

//   const [searchQuery, setSearchQuery] = useState('')
//   const [activeCategory, setActiveCategory] = useState('all')

//   const filteredBooks = useMemo(() => {
//     const q = searchQuery.toLowerCase().trim()
//     return books.filter((book) => {
//       const matchesCategory =
//         activeCategory === 'all' || book.category === activeCategory
//       if (!q) return matchesCategory
//       const matchesSearch =
//         book.title.en.toLowerCase().includes(q) ||
//         book.title.ps.includes(searchQuery.trim()) ||
//         book.author.en.toLowerCase().includes(q) ||
//         book.author.ps.includes(searchQuery.trim())
//       return matchesCategory && matchesSearch
//     })
//   }, [searchQuery, activeCategory])

//   return (
//     <div className="min-h-screen px-4 py-16 sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-7xl">
//         {/* Header */}
//         <div className="mb-12 text-center">
//           <h1
//             className={`font-display text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 ${
//               isPS ? 'pashto-text' : ''
//             }`}
//           >
//             {t('books.title')}
//           </h1>
//           <p
//             className={`text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto ${
//               isPS ? 'pashto-text' : ''
//             }`}
//           >
//             {t('books.subtitle')}
//           </p>
//         </div>

//         {/* Search */}
//         <div className="mb-10">
//           <SearchBar
//             value={searchQuery}
//             onChange={setSearchQuery}
//             placeholder={t('books.search')}
//           />
//         </div>

//         {/* Category Filters */}
//         <div className="flex flex-wrap justify-center gap-3 mb-12">
//           {categories.map((cat) => (
//             <button
//               key={cat.id}
//               onClick={() => setActiveCategory(cat.id)}
//               className={`px-5 py-2 rounded-full font-semibold transition-all ${
//                 activeCategory === cat.id
//                   ? 'bg-gradient-to-r from-primary-500 to-gold-500 text-white shadow-md'
//                   : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary-500 hover:text-primary-600'
//               } ${isPS ? 'pashto-text' : ''}`}
//             >
//               {cat[language]}
//             </button>
//           ))}
//         </div>

//         {/* Books Grid */}
//         {filteredBooks.length > 0 ? (
//           <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {filteredBooks.map((book) => (
//               <BookCard key={book.id} book={book} />
//             ))}
//           </div>
//         ) : (
//           <div className="py-20 text-center">
//             <p
//               className={`text-xl text-gray-500 dark:text-gray-400 ${
//                 isPS ? 'pashto-text' : ''
//               }`}
//             >
//               {t('books.noResults')}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default Books


import { useState, useMemo, useEffect } from 'react'
import SEO from '../seo/SEO'
import BookCard from '../components/BookCard'
import SearchBar from '../components/SearchBar'
import { useLanguage } from '../context/LanguageContext'
import { books as fallbackBooks, categories } from '../data/books'
import api from '../api/axios'

const Books = () => {
  const { t, language } = useLanguage()
  const isPS = language === 'ps'

  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  // Fetch books from backend on mount
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const res = await api.get('/books', { params: { limit: 100 } })
        if (cancelled) return
        const apiBooks = res.data?.books ?? []
        // If the DB is empty, fall back to the seeded static list so the page is never blank
        setBooks(apiBooks.length > 0 ? apiBooks : fallbackBooks)
      } catch (err) {
        if (cancelled) return
        console.error('Failed to load books:', err)
        setErrorMsg('Could not reach the server. Showing offline books.')
        setBooks(fallbackBooks)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const filteredBooks = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return books.filter((book) => {
      const matchesCategory =
        activeCategory === 'all' || book.category === activeCategory
      if (!q) return matchesCategory
      const matchesSearch =
        book.title?.en?.toLowerCase().includes(q) ||
        book.title?.ps?.includes(searchQuery.trim()) ||
        book.author?.en?.toLowerCase().includes(q) ||
        book.author?.ps?.includes(searchQuery.trim())
      return matchesCategory && matchesSearch
    })
  }, [searchQuery, activeCategory, books])

  return (
    <div className="min-h-screen px-4 py-16 sm:px-6 lg:px-8">
      <SEO
        title={isPS ? 'د پښتو کتابونه' : 'Pashto Books'}
        description={isPS
          ? 'د پښتو کتابونو لويه کتابتونه — شعر، تاريخ، افسانه، مذهب، فرهنګ او د ماشومانو کتابونه آنلاين ولولئ.'
          : 'Browse and read Pashto books online — poetry, history, fiction, religion, culture and children’s books, all free.'}
        path="/books"
        lang={language}
      />
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1
            className={`font-display text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 ${
              isPS ? 'pashto-text' : ''
            }`}
          >
            {t('books.title')}
          </h1>
          <p
            className={`text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto ${
              isPS ? 'pashto-text' : ''
            }`}
          >
            {t('books.subtitle')}
          </p>
        </div>

        {/* Search */}
        <div className="mb-10">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={t('books.search')}
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-primary-500 to-gold-500 text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary-500 hover:text-primary-600'
              } ${isPS ? 'pashto-text' : ''}`}
            >
              {cat[language]}
            </button>
          ))}
        </div>

        {errorMsg && (
          <div className="p-3 mb-6 text-sm text-yellow-800 border border-yellow-200 bg-yellow-50 rounded-xl dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-800">
            {errorMsg}
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center text-gray-500 dark:text-gray-400">Loading books…</div>
        ) : filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBooks.map((book) => (
              <BookCard key={book._id || book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p
              className={`text-xl text-gray-500 dark:text-gray-400 ${
                isPS ? 'pashto-text' : ''
              }`}
            >
              {t('books.noResults')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Books