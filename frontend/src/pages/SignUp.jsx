// import { useState } from 'react'
// import { Link } from 'react-router-dom'
// import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiUserPlus } from 'react-icons/fi'
// import { useLanguage } from '../context/LanguageContext'

// const SignUp = () => {
//   const { t, language } = useLanguage()
//   const isPS = language === 'ps'

//   const [showPassword, setShowPassword] = useState(false)
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   })

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value })

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     console.log('Sign up:', formData)
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen px-4 py-16 bg-gradient-to-br from-primary-50 via-sand-50 to-gold-50 dark:from-gray-950 dark:to-primary-950">
//       <div className="w-full max-w-md">
//         <div className="p-8 bg-white border border-gray-100 shadow-xl dark:bg-gray-900 rounded-3xl md:p-10 dark:border-gray-800">
//           <div className="mb-8 text-center">
//             <div className="inline-flex items-center justify-center mb-4 text-white shadow-lg w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 via-gold-500 to-crimson-500">
//               <FiUserPlus size={24} />
//             </div>
//             <h1
//               className={`font-display text-3xl font-bold text-gray-900 dark:text-white mb-2 ${
//                 isPS ? 'pashto-text' : ''
//               }`}
//             >
//               {t('auth.signUpTitle')}
//             </h1>
//             <p
//               className={`text-gray-600 dark:text-gray-400 ${
//                 isPS ? 'pashto-text' : ''
//               }`}
//             >
//               {t('auth.signUpSubtitle')}
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div>
//               <label
//                 className={`block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ${
//                   isPS ? 'pashto-text' : ''
//                 }`}
//               >
//                 {t('auth.fullName')}
//               </label>
//               <div className="relative">
//                 <FiUser
//                   size={18}
//                   className="absolute text-gray-400 -translate-y-1/2 top-1/2 left-3"
//                 />
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                   className="w-full py-3 pl-10 pr-4 text-gray-900 transition-all border border-gray-200 rounded-xl dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                 />
//               </div>
//             </div>

//             <div>
//               <label
//                 className={`block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ${
//                   isPS ? 'pashto-text' : ''
//                 }`}
//               >
//                 {t('auth.email')}
//               </label>
//               <div className="relative">
//                 <FiMail
//                   size={18}
//                   className="absolute text-gray-400 -translate-y-1/2 top-1/2 left-3"
//                 />
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                   placeholder="you@example.com"
//                   className="w-full py-3 pl-10 pr-4 text-gray-900 transition-all border border-gray-200 rounded-xl dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                 />
//               </div>
//             </div>

//             <div>
//               <label
//                 className={`block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ${
//                   isPS ? 'pashto-text' : ''
//                 }`}
//               >
//                 {t('auth.password')}
//               </label>
//               <div className="relative">
//                 <FiLock
//                   size={18}
//                   className="absolute text-gray-400 -translate-y-1/2 top-1/2 left-3"
//                 />
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                   minLength={6}
//                   placeholder="••••••••"
//                   className="w-full py-3 pl-10 pr-10 text-gray-900 transition-all border border-gray-200 rounded-xl dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute text-gray-400 -translate-y-1/2 top-1/2 right-3 hover:text-gray-600"
//                 >
//                   {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
//                 </button>
//               </div>
//             </div>

//             <div>
//               <label
//                 className={`block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ${
//                   isPS ? 'pashto-text' : ''
//                 }`}
//               >
//                 {t('auth.confirmPassword')}
//               </label>
//               <div className="relative">
//                 <FiLock
//                   size={18}
//                   className="absolute text-gray-400 -translate-y-1/2 top-1/2 left-3"
//                 />
//                 <input
//                   type="password"
//                   name="confirmPassword"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   required
//                   placeholder="••••••••"
//                   className="w-full py-3 pl-10 pr-4 text-gray-900 transition-all border border-gray-200 rounded-xl dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                 />
//               </div>
//             </div>

//             <button type="submit" className="justify-center w-full btn-primary">
//               {t('auth.signUp')}
//             </button>
//           </form>

//           <p
//             className={`text-center text-sm text-gray-600 dark:text-gray-400 mt-6 ${
//               isPS ? 'pashto-text' : ''
//             }`}
//           >
//             {t('auth.haveAccount')}{' '}
//             <Link
//               to="/signin"
//               className="font-semibold text-primary-600 dark:text-gold-400 hover:underline"
//             >
//               {t('auth.signIn')}
//             </Link>
//           </p>
//         </div><object data="" type=""></object>
//       </div>
//     </div>
//   )
// }

// export default SignUp

import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiUserPlus } from 'react-icons/fi'
import SEO from '../seo/SEO'
import { useLanguage } from '../context/LanguageContext'
import api from '../api/axios'

const SignUp = () => {
  const { t, language } = useLanguage()
  const isPS = language === 'ps'
  const navigate = useNavigate()
  const location = useLocation()
  const qc = useQueryClient()
  const from = location.state?.from || '/'

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    // Client-side: check passwords match before hitting the server
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })

      // Auth tokens live in httpOnly cookies. Mirror the user into the ['me']
      // query cache so guards immediately see them as logged in (no race
      // against the background refetch).
      const user = res.data?.data?.user || res.data?.user
      if (user) {
        qc.setQueryData(['me'], { success: true, data: { user } })
        localStorage.setItem('pashtohub-user', JSON.stringify(user))
      }

      alert('Account created successfully! 🎉')
      navigate(from, { replace: true })
    } catch (error) {
      // express-validator returns errors as an array; controller errors return a single message
      const apiMsg =
        error.response?.data?.errors?.[0]?.message ||
        error.response?.data?.message ||
        'Sign up failed. Please try again.'
      setErrorMsg(apiMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-16 bg-gradient-to-br from-primary-50 via-sand-50 to-gold-50 dark:from-gray-950 dark:to-primary-950">
      <SEO
        title={isPS ? 'نوی حساب' : 'Create Account'}
        description="Create a free PashtoHub account to read books, save lessons and track your Pashto learning progress."
        path="/signup"
        lang={language}
        noindex
      />
      <div className="w-full max-w-md">
        <div className="p-8 bg-white border border-gray-100 shadow-xl dark:bg-gray-900 rounded-3xl md:p-10 dark:border-gray-800">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center mb-4 text-white shadow-lg w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 via-gold-500 to-crimson-500">
              <FiUserPlus size={24} />
            </div>
            <h1
              className={`font-display text-3xl font-bold text-gray-900 dark:text-white mb-2 ${
                isPS ? 'pashto-text' : ''
              }`}
            >
              {t('auth.signUpTitle')}
            </h1>
            <p
              className={`text-gray-600 dark:text-gray-400 ${
                isPS ? 'pashto-text' : ''
              }`}
            >
              {t('auth.signUpSubtitle')}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 mb-4 text-sm text-red-700 border border-red-200 bg-red-50 rounded-xl dark:bg-red-900/30 dark:text-red-300 dark:border-red-800">
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
                {t('auth.fullName')}
              </label>
              <div className="relative">
                <FiUser
                  size={18}
                  className="absolute text-gray-400 -translate-y-1/2 top-1/2 left-3"
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
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
                  minLength={6}
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

            <div>
              <label
                className={`block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ${
                  isPS ? 'pashto-text' : ''
                }`}
              >
                {t('auth.confirmPassword')}
              </label>
              <div className="relative">
                <FiLock
                  size={18}
                  className="absolute text-gray-400 -translate-y-1/2 top-1/2 left-3"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full py-3 pl-10 pr-4 text-gray-900 transition-all border border-gray-200 rounded-xl dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="justify-center w-full btn-primary"
            >
              {loading ? 'Creating account...' : t('auth.signUp')}
            </button>
          </form>

          <p
            className={`text-center text-sm text-gray-600 dark:text-gray-400 mt-6 ${
              isPS ? 'pashto-text' : ''
            }`}
          >
            {t('auth.haveAccount')}{' '}
            <Link
              to="/signin"
              className="font-semibold text-primary-600 dark:text-gold-400 hover:underline"
            >
              {t('auth.signIn')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp