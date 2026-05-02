import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { FiSun, FiMoon, FiMenu, FiX, FiGlobe } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'

const Navbar = () => {
  const { theme, toggleTheme } = useTheme()
  const { language, toggleLanguage, t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // close menu on route change
  useEffect(() => setOpen(false), [location.pathname])

  // shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/books', label: t('nav.books') },
    { to: '/learn', label: t('nav.learn') },
    { to: '/dictionary', label: t('nav.dictionary') },
    { to: '/about', label: t('nav.about') },
  ]

  const linkClass = ({ isActive }) =>
    `relative font-medium transition-colors duration-200 ${
      isActive
        ? 'text-primary-600 dark:text-gold-400'
        : 'text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-gold-400'
    }`

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 dark:bg-gray-950/85 shadow-md'
          : 'bg-white/60 dark:bg-gray-950/60'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 via-gold-500 to-crimson-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-xl font-display">پ</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display font-bold text-xl text-gray-900 dark:text-white">
                PashtoHub
              </span>
              <span className="text-xs text-gold-600 dark:text-gold-400 pashto-text">
                پښتو هب
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-8">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} className={linkClass} end={l.to === '/'}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right controls */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold
                         text-gray-700 dark:text-gray-200
                         hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle language"
              title="Toggle language"
            >
              <FiGlobe className="w-4 h-4" />
              <span>{language === 'en' ? 'پښتو' : 'EN'}</span>
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg text-gray-700 dark:text-gold-400
                         hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {theme === 'dark' ? (
                <FiSun className="w-5 h-5" />
              ) : (
                <FiMoon className="w-5 h-5" />
              )}
            </button>

            {/* Auth buttons */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/signin"
                className="px-4 py-2 rounded-lg font-semibold text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-gray-800 transition-colors"
              >
                {t('nav.signin')}
              </Link>
              <Link to="/signup" className="btn-primary !py-2">
                {t('nav.signup')}
              </Link>
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Open menu"
            >
              {open ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden animate-slide-up pb-4">
            <ul className="flex flex-col gap-1 pt-2 border-t border-gray-200 dark:border-gray-800">
              {links.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.to === '/'}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-lg font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-50 dark:bg-gray-800 text-primary-700 dark:text-gold-400'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900'
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
              <li className="flex gap-2 mt-3 px-2">
                <Link to="/signin" className="btn-outline flex-1 !py-2">
                  {t('nav.signin')}
                </Link>
                <Link to="/signup" className="btn-primary flex-1 !py-2">
                  {t('nav.signup')}
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Navbar