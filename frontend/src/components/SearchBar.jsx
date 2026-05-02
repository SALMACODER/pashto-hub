import { FiSearch } from 'react-icons/fi'
import { useLanguage } from '../context/LanguageContext'

const SearchBar = ({ value, onChange, onSubmit, placeholder }) => {
  const { language, isRTL } = useLanguage()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSubmit) onSubmit(value)
  }

  const defaultPlaceholder = language === 'ps' ? 'لټون...' : 'Search...'
  const searchLabel = language === 'ps' ? 'لټون' : 'Search'

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
      <div className="relative group">
        <div
          className={`absolute top-1/2 -translate-y-1/2 ${
            isRTL ? 'right-4' : 'left-4'
          } text-gray-400 group-focus-within:text-primary-500 transition-colors`}
        >
          <FiSearch size={20} />
        </div>

        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder={placeholder || defaultPlaceholder}
          dir={isRTL ? 'rtl' : 'ltr'}
          className={`w-full py-3.5 ${
            isRTL ? 'pr-12 pl-28' : 'pl-12 pr-28'
          } rounded-full border border-gray-200 dark:border-gray-700
             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
             placeholder-gray-400 dark:placeholder-gray-500 shadow-sm
             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
             transition-all duration-300 ${
               language === 'ps' ? 'pashto-text text-right' : ''
             }`}
        />

        <button
          type="submit"
          className={`absolute top-1/2 -translate-y-1/2 ${
            isRTL ? 'left-2' : 'right-2'
          } px-5 py-2 bg-gradient-to-r from-primary-500 to-gold-500
             hover:from-primary-600 hover:to-gold-600 text-white text-sm font-semibold
             rounded-full shadow-md hover:shadow-lg transition-all`}
        >
          {searchLabel}
        </button>
      </div>
    </form>
  )
}

export default SearchBar