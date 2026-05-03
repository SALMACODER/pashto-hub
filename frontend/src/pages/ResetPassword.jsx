import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FiLock, FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle, FiLoader, FiArrowLeft } from 'react-icons/fi'
import SEO from '../seo/SEO'
import { useLanguage } from '../context/LanguageContext'
import { resetPassword } from '../api/auth'

/**
 * Reset-password screen — landed on via the email link /reset-password/:token.
 *
 * Validates the two passwords match client-side, then posts to the backend.
 * On success we DON'T auto-login — we redirect to /signin so the user
 * consciously enters their new password (defence in depth: the email link
 * could have been intercepted).
 */
const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const { language } = useLanguage()
  const isPS = language === 'ps'

  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [show,     setShow]     = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [done,     setDone]     = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const validate = () => {
    if (password.length < 8) return 'Password must be at least 8 characters.'
    if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter.'
    if (!/[a-z]/.test(password)) return 'Password must contain a lowercase letter.'
    if (!/[0-9]/.test(password)) return 'Password must contain a number.'
    if (password !== confirm)    return 'Passwords do not match.'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v = validate()
    if (v) { setErrorMsg(v); return }

    setLoading(true)
    setErrorMsg('')
    try {
      await resetPassword(token, password)
      setDone(true)
      // Auto-redirect to sign-in after a short delay so the user sees the
      // success message before the page changes.
      setTimeout(() => navigate('/signin', { replace: true }), 2200)
    } catch (err) {
      setErrorMsg(
        err.response?.data?.error?.message
          || err.response?.data?.message
          || 'Could not reset your password. The link may be expired — request a fresh one.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-16 bg-gradient-to-br from-primary-50 via-sand-50 to-gold-50 dark:from-gray-950 dark:to-primary-950">
      <SEO
        title={isPS ? 'نوی پټنوم' : 'Reset password'}
        description="Choose a new password for your PashtoHub account."
        path="/reset-password"
        lang={language}
        noindex
      />

      <div className="w-full max-w-md">
        <div className="p-8 bg-white border border-gray-100 shadow-xl dark:bg-gray-900 rounded-3xl md:p-10 dark:border-gray-800">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center mb-4 text-white shadow-lg w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 via-gold-500 to-crimson-500">
              <FiLock size={24} />
            </div>
            <h1 className={`font-display text-2xl font-bold text-gray-900 dark:text-white ${isPS ? 'pashto-text' : ''}`}>
              {isPS ? 'نوی پټنوم وټاکئ' : 'Choose a new password'}
            </h1>
            <p className={`mt-2 text-sm text-gray-600 dark:text-gray-400 ${isPS ? 'pashto-text' : ''}`}>
              {isPS
                ? 'پټنوم باید لږ تر لږه ۸ توري وي او یو لوی توری، یو کوچنی او یوه شمیره ولري.'
                : 'Use at least 8 characters with one uppercase letter, one lowercase, and one number.'}
            </p>
          </div>

          {done ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 text-sm text-green-700 border border-green-200 bg-green-50 rounded-xl dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
                <FiCheckCircle className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Password updated</p>
                  <p className="mt-1">
                    You can now sign in with your new password. Redirecting…
                  </p>
                </div>
              </div>
              <Link to="/signin" className="flex items-center justify-center w-full gap-2 btn-primary !py-2 text-sm">
                Sign in now
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
                  New password
                </label>
                <div className="relative">
                  <FiLock size={18} className="absolute text-gray-400 -translate-y-1/2 top-1/2 left-3" />
                  <input
                    type={show ? 'text' : 'password'}
                    name="new-password"
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full py-3 pl-10 pr-10 text-gray-900 transition-all border border-gray-200 rounded-xl dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute text-gray-400 -translate-y-1/2 top-1/2 right-3 hover:text-gray-600"
                    aria-label={show ? 'Hide password' : 'Show password'}
                  >
                    {show ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Confirm new password
                </label>
                <div className="relative">
                  <FiLock size={18} className="absolute text-gray-400 -translate-y-1/2 top-1/2 left-3" />
                  <input
                    type={show ? 'text' : 'password'}
                    name="confirm-password"
                    required
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="w-full py-3 pl-10 pr-4 text-gray-900 transition-all border border-gray-200 rounded-xl dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !password || !confirm}
                className="justify-center w-full btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? <FiLoader className="animate-spin" /> : null}
                {loading ? 'Updating…' : 'Update password'}
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

export default ResetPassword
