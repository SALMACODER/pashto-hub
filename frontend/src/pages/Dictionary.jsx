import { useEffect, useMemo, useState } from 'react'
import { FiVolume2, FiBookOpen } from 'react-icons/fi'
import SEO from '../seo/SEO'
import SearchBar from '../components/SearchBar'
import { useLanguage } from '../context/LanguageContext'
import { dictionary as fallbackDictionary } from '../data/dictionary'
import { searchWords, fetchPopular } from '../api/dictionary'

/**
 * Bilingual dictionary page.
 *
 * Behavior driven entirely by the active LanguageContext (`language` ∈ 'en'|'ps'):
 *   - Search query is sent with `lang=<language>` so the backend matches only
 *     entries with content in that language's headword.
 *   - "Popular searches" pills come from /api/dictionary/popular and render
 *     each entry's headword in the active language.
 *   - In Pashto mode the result card hides the English headword and English
 *     meaning/example — Pashto-only experience. In English mode both are shown
 *     so the dictionary still works as a learning tool.
 *
 * Static fallbacks kick in only if the API is unreachable.
 */
const Dictionary = () => {
  const { t, language } = useLanguage()
  const isPS = language === 'ps'

  const [searchQuery, setSearchQuery] = useState('')
  const [words, setWords]     = useState([])
  const [popular, setPopular] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  // ────────────────────────────────────────────────────────────────────────
  // Search — debounced, language-aware. Re-runs on language change too so
  // the user immediately sees results scoped to the new language.
  // ────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(async () => {
      setLoading(true)
      setErrorMsg('')
      try {
        const items = await searchWords({ q: searchQuery, lang: language, limit: 30 })
        if (cancelled) return
        if (items.length > 0) {
          setWords(items)
        } else if (!searchQuery.trim()) {
          // Empty DB & no query → seeded list so the page is never blank.
          setWords(fallbackDictionary.slice(0, 12))
        } else {
          setWords([])
        }
      } catch (err) {
        if (cancelled) return
        console.error('[dictionary] search failed:', err)
        setErrorMsg('Could not reach the server. Showing offline results.')
        const q = searchQuery.toLowerCase().trim()
        const filtered = q
          ? fallbackDictionary.filter((w) => {
              if (language === 'ps') return w.pashto.includes(searchQuery.trim())
              return (
                w.english.toLowerCase().includes(q) ||
                w.transliteration.toLowerCase().includes(q)
              )
            })
          : fallbackDictionary.slice(0, 12)
        setWords(filtered)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, 300)

    return () => { cancelled = true; clearTimeout(timer) }
  }, [searchQuery, language])

  // ────────────────────────────────────────────────────────────────────────
  // Popular searches — re-fetch when language changes (so the click-to-search
  // pills actually feed a search in the right language). The data set is the
  // same; only the rendered headword differs.
  // ────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const items = await fetchPopular({ lang: language, limit: 8 })
        if (!cancelled) setPopular(items)
      } catch (err) {
        if (cancelled) return
        // Fallback: pick the first 6 from the offline seed.
        setPopular(fallbackDictionary.slice(0, 6))
      }
    })()
    return () => { cancelled = true }
  }, [language])

  // The headword shown in the prominent card title — switches to Pashto on PS mode.
  const headword = (w) => (isPS ? w.pashto : w.english)
  const subword  = (w) => (isPS ? w.english : w.pashto)
  const meaning  = (w) => w.meaning?.[language] || ''
  const example  = (w) => w.example?.[language] || ''
  const partOfSpeech = (w) =>
    typeof w.partOfSpeech === 'string'
      ? w.partOfSpeech
      : (w.partOfSpeech?.[language] || w.partOfSpeech?.en || '')

  // Popular pill click — feed search with the headword in the current language.
  const popularPills = useMemo(
    () => popular.map((w) => ({
      key:   w._id || w.id || `${w.english}-${w.pashto}`,
      label: isPS ? w.pashto : w.english,
      query: isPS ? w.pashto : w.english,
    })),
    [popular, isPS],
  )

  return (
    <div className="min-h-screen px-4 py-16 sm:px-6 lg:px-8">
      <SEO
        title={isPS ? 'پښتو-انګليسي قاموس' : 'Pashto–English Dictionary'}
        description={isPS
          ? 'د پښتو او انګليسي ژبو ترمنځ آنلاين ژباړه — د کلمو معنا، تلفظ او مثالونه ولټوئ.'
          : 'Free online Pashto–English dictionary. Look up word meanings, pronunciation and examples in both directions.'}
        path="/dictionary"
        lang={language}
      />
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 text-white shadow-lg rounded-2xl bg-gradient-to-br from-primary-500 via-gold-500 to-crimson-500">
            <FiBookOpen size={28} />
          </div>
          <h1 className={`font-display text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 ${isPS ? 'pashto-text' : ''}`}>
            {t('dictionary.title')}
          </h1>
          <p className={`text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto ${isPS ? 'pashto-text' : ''}`}>
            {t('dictionary.subtitle')}
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={t('dictionary.search')}
          />
        </div>

        {/* Popular searches — dynamic, language-aware */}
        {!searchQuery && popularPills.length > 0 && (
          <div className="mb-10 text-center">
            <p className={`text-sm text-gray-500 dark:text-gray-400 mb-3 ${isPS ? 'pashto-text' : ''}`}>
              {t('dictionary.popular')}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularPills.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setSearchQuery(p.query)}
                  className={[
                    'px-4 py-1.5 text-sm rounded-full bg-white dark:bg-gray-800',
                    'border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300',
                    'hover:border-primary-500 hover:text-primary-600 dark:hover:text-gold-400 transition-all',
                    isPS ? 'pashto-text' : '',
                  ].join(' ')}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 mb-6 text-sm text-yellow-800 border border-yellow-200 bg-yellow-50 rounded-xl dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-800">
            {errorMsg}
          </div>
        )}

        {/* Results */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-12 text-center text-gray-500 dark:text-gray-400">
              {t('dictionary.searching') || 'Searching…'}
            </div>
          ) : words.length > 0 ? (
            words.map((word) => (
              <article
                key={word._id || word.id}
                className="p-6 transition-all bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-2xl hover:shadow-md group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Headline row: prominent headword in active language */}
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3
                        className={[
                          'text-2xl font-bold text-primary-700 dark:text-gold-400',
                          isPS ? 'pashto-text' : '',
                        ].join(' ')}
                      >
                        {headword(word)}
                      </h3>
                      {/* In English mode the transliteration helps learners. In Pashto-only mode it’s noise. */}
                      {!isPS && word.transliteration && (
                        <span className="text-sm italic text-gray-500 dark:text-gray-400">
                          [{word.transliteration}]
                        </span>
                      )}
                      {partOfSpeech(word) && (
                        <span
                          className={[
                            'text-xs px-2 py-0.5 rounded-full bg-gold-100 dark:bg-gold-900/40',
                            'text-gold-700 dark:text-gold-300',
                            isPS ? 'pashto-text' : '',
                          ].join(' ')}
                        >
                          {partOfSpeech(word)}
                        </span>
                      )}
                    </div>

                    {/*
                      Secondary headword line:
                        - English mode → show Pashto translation (bilingual UX)
                        - Pashto mode  → hide English headword (Pashto-only UX)
                    */}
                    {!isPS && word.pashto && (
                      <p className="mb-2 text-lg font-semibold text-gray-800 pashto-text dark:text-gray-200">
                        {word.pashto}
                      </p>
                    )}

                    {/* Meaning — only render if we have content in the active language. */}
                    {meaning(word) && (
                      <p
                        className={[
                          'text-sm text-gray-600 dark:text-gray-400 mb-2',
                          isPS ? 'pashto-text' : '',
                        ].join(' ')}
                      >
                        <span className="font-semibold">
                          {t('dictionary.meaning')}:
                        </span>{' '}
                        {meaning(word)}
                      </p>
                    )}

                    {/* Example sentence — same rule. */}
                    {example(word) && (
                      <p
                        className={[
                          'text-sm text-gray-500 dark:text-gray-400 italic mt-3 pt-3',
                          'border-t border-gray-100 dark:border-gray-700',
                          isPS ? 'pashto-text' : '',
                        ].join(' ')}
                      >
                        <span className="font-semibold">
                          {t('dictionary.example')}:
                        </span>{' '}
                        {example(word)}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    className="flex-shrink-0 p-2.5 rounded-full bg-primary-50 dark:bg-gray-700 text-primary-600 dark:text-gold-400 hover:bg-primary-100 dark:hover:bg-gray-600 transition-all"
                    aria-label={t('dictionary.pronounce')}
                    title={t('dictionary.pronounce')}
                  >
                    <FiVolume2 size={18} />
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="py-16 text-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
              <p className={`text-lg text-gray-500 dark:text-gray-400 ${isPS ? 'pashto-text' : ''}`}>
                {t('dictionary.noResults')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dictionary
