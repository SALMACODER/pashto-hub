import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi'
import SEO from '../seo/SEO'
import { useLanguage } from '../context/LanguageContext'
import api from '../api/axios'

const SignIn = () => {
  const { t, language } = useLanguage()
  const isPS = language === 'ps'
  const navigate = useNavigate()
  const location = useLocation()
  const qc = useQueryClient()
  // RequireAdmin (and other guards) redirect here with `state: { from: '<url>' }`.
  // Honor that so post-login lands the user back where they were trying to go.
  const from = location.state?.from || '/'

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
    if (errorMsg) setErrorMsg('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      const res = await api.post('/auth/login', {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      })
      // Auth tokens live in httpOnly cookies (set by the server).
      // We mirror the user into the ['me'] query cache so RequireAdmin and other
      // guards see the new user on the very next render — no race against the
      // background refetch that would otherwise return the stale `null` cached
      // when the page loaded unauthenticated.
      const user = res.data?.data?.user || res.data?.user
      if (user) {
        qc.setQueryData(['me'], { success: true, data: { user } })
        localStorage.setItem('pashtohub-user', JSON.stringify(user))
        navigate(from, { replace: true })
      } else {
        setErrorMsg('Unexpected response from server.')
      }
    } catch (error) {
      console.error('Login error:', error)

      if (!error.response) {
        // Network / connection error
        setErrorMsg(
          error.message ||
          'Cannot reach server. Make sure the backend is running on port 5000.'
        )
      } else if (error.response.status === 401) {
        setErrorMsg('Invalid email or password.')
      } else if (error.response.status === 429) {
        setErrorMsg('Too many login attempts. Please wait 15 minutes and try again.')
      } else if (error.response.data?.message) {
        setErrorMsg(error.response.data.message)
      } else {
        setErrorMsg('Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-16 bg-gradient-to-br from-primary-50 via-sand-50 to-gold-50 dark:from-gray-950 dark:to-primary-950">
      <SEO
        title={isPS ? 'حساب جوړول' : 'Sign In'}
        description="Sign in to your PashtoHub account to save books, track lessons and personalize your experience."
        path="/signin"
        lang={language}
        noindex
      />
      <div className="w-full max-w-md">
        <div className="p-8 bg-white border border-gray-100 shadow-xl dark:bg-gray-900 rounded-3xl md:p-10 dark:border-gray-800">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center mb-4 text-white shadow-lg w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 via-gold-500 to-crimson-500">
              <FiLogIn size={24} />
            </div>
            <h1
              className={`font-display text-3xl font-bold text-gray-900 dark:text-white mb-2 ${
                isPS ? 'pashto-text' : ''
              }`}
            >
              {t('auth.signInTitle')}
            </h1>
            <p
              className={`text-gray-600 dark:text-gray-400 ${
                isPS ? 'pashto-text' : ''
              }`}
            >
              {t('auth.signInSubtitle')}
            </p>
          </div>

          {errorMsg && (
            <div className="px-4 py-3 mb-4 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className={`block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ${
                  isPS ? 'pashto-text' : ''
                }`}
              >
                {t('auth.email')}
              </label>
              <div className="relative">
                <FiMail
                  size={18}
                  className="absolute text-gray-400 -translate-y-1/2 top-1/2 left-3"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full py-3 pl-10 pr-4 text-gray-900 transition-all border border-gray-200 rounded-xl dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label
                className={`block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ${
                  isPS ? 'pashto-text' : ''
                }`}
              >
                {t('auth.password')}
              </label>
              <div className="relative">
                <FiLock
                  size={18}
                  className="absolute text-gray-400 -translate-y-1/2 top-1/2 left-3"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full py-3 pl-10 pr-10 text-gray-900 transition-all border border-gray-200 rounded-xl dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute text-gray-400 -translate-y-1/2 top-1/2 right-3 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="w-4 h-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
                />
                <span
                  className={`text-sm text-gray-600 dark:text-gray-400 ${
                    isPS ? 'pashto-text' : ''
                  }`}
                >
                  {t('auth.remember')}
                </span>
              </label>
              <Link
                to="/forgot-password"
                className={`text-sm text-primary-600 dark:text-gold-400 hover:underline ${
                  isPS ? 'pashto-text' : ''
                }`}
              >
                {t('auth.forgot')}
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="justify-center w-full btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : t('auth.signIn')}
            </button>
          </form>

          <p
            className={`text-center text-sm text-gray-600 dark:text-gray-400 mt-6 ${
              isPS ? 'pashto-text' : ''
            }`}
          >
            {t('auth.noAccount')}{' '}
            <Link
              to="/signup"
              className="font-semibold text-primary-600 dark:text-gold-400 hover:underline"
            >
              {t('auth.signUp')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignIn