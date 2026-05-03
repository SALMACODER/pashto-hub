import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMail, FiArrowLeft, FiCheckCircle, FiAlertCircle, FiLoader } from 'react-icons/fi'
import SEO from '../seo/SEO'
import { useLanguage } from '../context/LanguageContext'
import { forgotPassword } from '../api/auth'

/**
 * Forgot-password screen.
 *
 * The backend always responds with the same generic message regardless of
 * whether the email exists (anti-enumeration). We mirror that behaviour in
 * the UI: success state is shown for any successful 200, with the same copy
 * either way. Errors are reserved for actual server / network failures.
 */
const ForgotPassword = () => {
  const { language } = useLanguage()
  const isPS = language === 'ps'

  const [email, setEmail]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [sent, setSent]         = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    try {
      await forgotPassword(email.trim().toLowerCase())
      setSent(true)
    } catch (err) {
      setErrorMsg(
        err.response?.data?.error?.message
          || err.response?.data?.message
          || 'Could not send the reset email. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-16 bg-gradient-to-br from-primary-50 via-sand-50 to-gold-50 dark:from-gray-950 dark:to-primary-950">
      <SEO
        title={isPS ? 'پټنوم بیرته جوړول' : 'Forgot password'}
        description="Reset your PashtoHub password by email."
        path="/forgot-password"
        lang={language}
        noindex
      />

      <div className="w-full max-w-md">
        <div className="p-8 bg-white border border-gray-100 shadow-xl dark:bg-gray-900 rounded-3xl md:p-10 dark:border-gray-800">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center mb-4 text-white shadow-lg w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 via-gold-500 to-crimson-500">
              <FiMail size={24} />
            </div>
            <h1 className={`font-display text-2xl font-bold text-gray-900 dark:text-white ${isPS ? 'pashto-text' : ''}`}>
              {isPS ? 'پټنوم بیرته جوړول' : 'Forgot your password?'}
            </h1>
            <p className={`mt-2 text-sm text-gray-600 dark:text-gray-400 ${isPS ? 'pashto-text' : ''}`}>
              {isPS
                ? 'خپل بريښناليک ولیکئ او موږ به تاسو ته د بیا تنظیمولو لینک واستوو.'
                : 'Enter your email and we’ll send you a link to set a new password.'}
            </p>
          </div>

          {sent ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 text-sm text-green-700 border border-green-200 bg-green-50 rounded-xl dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
                <FiCheckCircle className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Check your inbox</p>
                  <p className="mt-1">
                    If an account exists for <strong>{email}</strong>, a reset link is on its way.
                    The link is valid for <strong>1 hour</strong>.
                  </p>
                  <p className="mt-2 text-xs text-green-600/80 dark:text-green-400/80">
                    Didn’t get it? Check your spam folder, or wait a minute and try again.
                  </p>
                </div>
              </div>
              <Link
                to="/signin"
                className="flex items-center justify-center w-full gap-2 btn-outline !py-2 text-sm"
              >
                <FiArrowLeft /> Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <div className="flex items-start gap-2 p-3 text-sm text-red-700 border border-red-200 bg-red-50 rounded-xl dark:bg-red-900/20 dark:text-red-300 dark:border-red-800">
                  <FiAlertCircle className="flex-shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <div className="relative">
                  <FiMail size={18} className="absolute text-gray-400 -translate-y-1/2 top-1/2 left-3" />
                  <input
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full py-3 pl-10 pr-4 text-gray-900 transition-all border border-gray-200 rounded-xl dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="justify-center w-full btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? <FiLoader className="animate-spin" /> : null}
                {loading ? 'Sending…' : 'Send reset link'}
              </button>

              <Link
                to="/signin"
                className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-gold-400"
              >
                <FiArrowLeft size={14} /> Back to sign in
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
