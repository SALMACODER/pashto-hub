import { createContext, useContext, useEffect, useState } from 'react'
import { translations } from '../data/translations'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    if (typeof window === 'undefined') return 'ps'  // ✅ 'en' → 'ps'
    return localStorage.getItem('pashtohub-lang') || 'ps'  // ✅ 'en' → 'ps'
  })

  useEffect(() => {
    localStorage.setItem('pashtohub-lang', language)
    document.documentElement.setAttribute('lang', language === 'ps' ? 'ps' : 'en')
    document.documentElement.setAttribute('dir', language === 'ps' ? 'rtl' : 'ltr')
  }, [language])

  const toggleLanguage = () => setLanguage((l) => (l === 'en' ? 'ps' : 'en'))

  const t = (key) => {
    const keys = key.split('.')
    let result = translations[language]
    for (const k of keys) {
      result = result?.[k]
      if (result === undefined) return key
    }
    return result
  }

  const isRTL = language === 'ps'

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)