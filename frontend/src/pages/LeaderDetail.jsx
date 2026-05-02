import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft, FiAward, FiLoader } from 'react-icons/fi'
import SEO from '../seo/SEO'
import { useLanguage } from '../context/LanguageContext'
import { leaders as fallbackLeaders } from '../data/leaders'
import { getLeader } from '../api/leaders'
import { cloudImg } from '../utils/cloudinaryUrl'

const findInFallback = (idOrSlug) =>
  fallbackLeaders.find(
    (l) => l.slug === idOrSlug || String(l.id) === String(idOrSlug),
  )

const LeaderDetail = () => {
  const { id } = useParams()                   // route param is `:id` but it carries a slug
  const navigate = useNavigate()
  const { language } = useLanguage()
  const isPS = language === 'ps'

  const [leader, setLeader] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setErrorMsg('')
    ;(async () => {
      try {
        const res = await getLeader(id)
        if (cancelled) return
        const apiLeader = res?.data?.leader || res?.leader
        if (apiLeader) {
          setLeader(apiLeader)
          return
        }
        throw new Error('no leader in response')
      } catch (err) {
        if (cancelled) return
        const fb = findInFallback(id)
        if (fb) {
          setLeader(fb)
          if (err?.response?.status && err.response.status !== 404) {
            setErrorMsg('Server unreachable — showing offline content.')
          }
        } else {
          setLeader(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500" role="status" aria-live="polite">
        <FiLoader className="mr-2 animate-spin" /> Loading…
      </div>
    )
  }

  if (!leader) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <SEO title="Not Found" path={`/leaders/${id}`} noindex />
        <div className="text-center">
          <p className="mb-4 text-xl text-gray-500">Leader not found.</p>
          <button onClick={() => navigate('/leaders')} className="btn-primary">
            Back to Leaders
          </button>
        </div>
      </div>
    )
  }

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: leader.name?.en || leader.name?.ps,
    alternateName: leader.name?.ps,
    description: leader.description?.en || leader.description?.ps,
    jobTitle: leader.role?.en,
    nationality: 'Pashtun',
    sameAs: [],
  }

  const photoSrc = leader.photoUrl ? cloudImg(leader.photoUrl, { width: 800, height: 800 }) : null

  return (
    <div className="min-h-screen">
      <SEO
        title={leader.name?.[language] || leader.name?.en}
        description={leader.description?.[language] || leader.description?.en}
        path={`/leaders/${leader.slug || leader._id || leader.id}`}
        type="profile"
        lang={language}
        jsonLd={personJsonLd}
      />

      {errorMsg && (
        <div className="px-4 mx-auto max-w-5xl pt-4 sm:px-6 lg:px-8">
          <div className="p-3 text-sm text-yellow-800 border border-yellow-200 rounded-xl bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-800">
            {errorMsg}
          </div>
        </div>
      )}

      {/* Hero banner */}
      <div className={`bg-gradient-to-br ${leader.color || 'from-primary-700 to-primary-900'} text-white`}>
        <div className="max-w-5xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/leaders')}
            className="flex items-center gap-2 mb-8 text-sm font-semibold text-white/80 hover:text-white"
          >
            <FiArrowLeft /> {isPS ? 'ټولو مشرانو ته ستنیدل' : 'Back to Leaders'}
          </button>

          <div className="flex flex-col items-center gap-8 md:flex-row">
            {/* Photo or emoji */}
            <div className="flex items-center justify-center flex-shrink-0 w-40 h-40 overflow-hidden text-8xl bg-white/20 backdrop-blur rounded-3xl">
              {photoSrc ? (
                <img
                  src={photoSrc}
                  alt={leader.name?.en || ''}
                  width="320" height="320"
                  loading="eager"
                  decoding="async"
                  className="object-cover w-full h-full"
                />
              ) : (
                <span>{leader.emoji || '🌟'}</span>
              )}
            </div>

            <div>
              {leader.type?.[language] && (
                <div className="mb-2 text-sm font-semibold tracking-widest uppercase text-white/70">
                  {leader.type[language]}
                </div>
              )}
              <h1 className={`font-display text-4xl md:text-5xl font-bold mb-2 ${isPS ? 'pashto-text' : ''}`}>
                {leader.name?.[language]}
              </h1>
              {leader.role?.[language] && (
                <p className={`text-lg text-white/80 mb-2 ${isPS ? 'pashto-text' : ''}`}>
                  {leader.role[language]}
                </p>
              )}
              {leader.era && <p className="text-white/60">{leader.era}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl px-4 py-12 mx-auto sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">

          {/* Main content */}
          <div className="space-y-8 lg:col-span-2">

            {/* Biography */}
            {leader.biography?.[language] && (
              <section className="p-6 bg-white border border-gray-100 dark:bg-gray-800 dark:border-gray-700 rounded-2xl">
                <h2 className={`text-xl font-bold text-gray-900 dark:text-white mb-4 ${isPS ? 'pashto-text' : ''}`}>
                  {isPS ? 'ژوند لیک' : 'Biography'}
                </h2>
                <p className={`text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line ${isPS ? 'pashto-text text-right' : ''}`}>
                  {leader.biography[language]}
                </p>
              </section>
            )}

            {/* Quotes */}
            {Array.isArray(leader.quotes) && leader.quotes.length > 0 && (
              <section>
                <h2 className={`text-xl font-bold text-gray-900 dark:text-white mb-4 ${isPS ? 'pashto-text' : ''}`}>
                  {isPS ? 'مشهور اقتباسات' : 'Famous Quotes'}
                </h2>
                <div className="space-y-4">
                  {leader.quotes.map((quote, i) => (
                    <div key={i} className="p-5 border-l-4 border-primary-500 bg-primary-50 dark:bg-primary-900/20 rounded-r-2xl">
                      {quote.ps && (
                        <p className="mb-2 text-xl font-bold text-right pashto-text text-primary-700 dark:text-gold-400">
                          {quote.ps}
                        </p>
                      )}
                      {quote.en && (
                        <p className="text-sm italic text-gray-500 dark:text-gray-400">
                          “{quote.en}”
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar — achievements */}
          {Array.isArray(leader.achievements?.[language]) && leader.achievements[language].length > 0 && (
            <aside>
              <div className="sticky p-6 bg-white border border-gray-100 dark:bg-gray-800 dark:border-gray-700 rounded-2xl top-24">
                <h2 className={`text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 ${isPS ? 'pashto-text' : ''}`}>
                  <FiAward className="text-primary-500" />
                  {isPS ? 'لاسته راوړنې' : 'Achievements'}
                </h2>
                <ul className="space-y-3">
                  {leader.achievements[language].map((item, i) => (
                    <li
                      key={i}
                      className={`flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300 ${isPS ? 'pashto-text text-right flex-row-reverse' : ''}`}
                    >
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs font-bold mt-0.5">
                        {i + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}

        </div>
      </div>
    </div>
  )
}

export default LeaderDetail
