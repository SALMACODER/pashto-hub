// import { useState } from 'react'
// import { FiMail, FiPhone, FiMapPin, FiSend, FiMessageCircle } from 'react-icons/fi'
// import { useLanguage } from '../context/LanguageContext'

// const Contact = () => {
//   const { t, language } = useLanguage()
//   const isPS = language === 'ps'

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     subject: '',
//     message: '',
//   })
//   const [submitted, setSubmitted] = useState(false)

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value })

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     console.log('Contact:', formData)
//     setSubmitted(true)
//     setFormData({ name: '', email: '', subject: '', message: '' })
//     setTimeout(() => setSubmitted(false), 4000)
//   }

//   const contactInfo = [
//     { icon: FiMail, label: t('contact.emailLabel'), value: 'hello@pashtohub.com' },
//     { icon: FiPhone, label: t('contact.phoneLabel'), value: '+92 300 1234567' },
//     { icon: FiMapPin, label: t('contact.addressLabel'), value: t('contact.address') },
//   ]

//   return (
//     <div className="min-h-screen px-4 py-16 sm:px-6 lg:px-8">
//       <div className="max-w-6xl mx-auto">
//         <div className="text-center mb-14">
//           <div className="inline-flex items-center justify-center w-16 h-16 mb-4 text-white shadow-lg rounded-2xl bg-gradient-to-br from-primary-500 via-gold-500 to-crimson-500">
//             <FiMessageCircle size={28} />
//           </div>
//           <h1
//             className={`font-display text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 ${
//               isPS ? 'pashto-text' : ''
//             }`}
//           >
//             {t('contact.title')}
//           </h1>
//           <p
//             className={`text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto ${
//               isPS ? 'pashto-text' : ''
//             }`}
//           >
//             {t('contact.subtitle')}
//           </p>
//         </div>

//         <div className="grid gap-8 lg:grid-cols-3">
//           {/* Info */}
//           <div className="space-y-4 lg:col-span-1">
//             {contactInfo.map((item, i) => (
//               <div
//                 key={i}
//                 className="p-6 transition-all bg-white border border-gray-100 shadow-sm dark:bg-gray-800 rounded-2xl dark:border-gray-700 hover:shadow-md"
//               >
//                 <div className="flex items-start gap-4">
//                   <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-gold-400">
//                     <item.icon size={22} />
//                   </div>
//                   <div className="min-w-0">
//                     <h3
//                       className={`text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1 ${
//                         isPS ? 'pashto-text' : ''
//                       }`}
//                     >
//                       {item.label}
//                     </h3>
//                     <p
//                       className={`text-gray-900 dark:text-white font-medium break-all ${
//                         isPS ? 'pashto-text' : ''
//                       }`}
//                     >
//                       {item.value}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Form */}
//           <div className="lg:col-span-2">
//             <div className="p-8 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 rounded-3xl md:p-10 dark:border-gray-700">
//               {submitted && (
//                 <div
//                   className={`mb-6 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 ${
//                     isPS ? 'pashto-text' : ''
//                   }`}
//                 >
//                   ✓{' '}
//                   {language === 'ps'
//                     ? 'ستاسو پیغام بریالۍ توګه ولیږل شو!'
//                     : 'Your message has been sent successfully!'}
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="space-y-5">
//                 <div className="grid gap-5 sm:grid-cols-2">
//                   <div>
//                     <label
//                       className={`block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ${
//                         isPS ? 'pashto-text' : ''
//                       }`}
//                     >
//                       {t('contact.name')}
//                     </label>
//                     <input
//                       type="text"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleChange}
//                       required
//                       className="w-full px-4 py-3 text-gray-900 transition-all border border-gray-200 rounded-xl dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                     />
//                   </div>

//                   <div>
//                     <label
//                       className={`block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ${
//                         isPS ? 'pashto-text' : ''
//                       }`}
//                     >
//                       {t('contact.email')}
//                     </label>
//                     <input
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       required
//                       className="w-full px-4 py-3 text-gray-900 transition-all border border-gray-200 rounded-xl dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label
//                     className={`block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ${
//                       isPS ? 'pashto-text' : ''
//                     }`}
//                   >
//                     {t('contact.subject')}
//                   </label>
//                   <input
//                     type="text"
//                     name="subject"
//                     value={formData.subject}
//                     onChange={handleChange}
//                     required
//                     className="w-full px-4 py-3 text-gray-900 transition-all border border-gray-200 rounded-xl dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div>
//                   <label
//                     className={`block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ${
//                       isPS ? 'pashto-text' : ''
//                     }`}
//                   >
//                     {t('contact.message')}
//                   </label>
//                   <textarea
//                     name="message"
//                     value={formData.message}
//                     onChange={handleChange}
//                     required
//                     rows="5"
//                     className="w-full px-4 py-3 text-gray-900 transition-all border border-gray-200 resize-none rounded-xl dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                   />
//                 </div>

//                 <button type="submit" className="btn-primary">
//                   <FiSend size={18} />
//                   {t('contact.send')}
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Contact  

import { useState } from 'react'
import { FiMail, FiPhone, FiMapPin, FiSend, FiMessageCircle } from 'react-icons/fi'
import SEO from '../seo/SEO'
import { useLanguage } from '../context/LanguageContext'
import api from '../api/axios'

const Contact = () => {
  const { t, language } = useLanguage()
  const isPS = language === 'ps'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)

    try {
      await api.post('/contact', formData)
      setSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSubmitted(false), 4000)
    } catch (error) {
      const apiMsg =
        error.response?.data?.errors?.[0]?.message ||
        error.response?.data?.message ||
        'Could not send your message. Please try again.'
      setErrorMsg(apiMsg)
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    { icon: FiMail, label: t('contact.emailLabel'), value: 'hello@pashtohub.com' },
    { icon: FiPhone, label: t('contact.phoneLabel'), value: '+92 300 1234567' },
    { icon: FiMapPin, label: t('contact.addressLabel'), value: t('contact.address') },
  ]

  return (
    <div className="min-h-screen px-4 py-16 sm:px-6 lg:px-8">
      <SEO
        title={isPS ? 'اړيکې ونيسئ' : 'Contact Us'}
        description={isPS
          ? 'مونږ سره اړيکې ونيسئ — د پوښتنو، نظرونو يا همکاري لپاره خپل پيغام واستوئ.'
          : 'Get in touch with the PashtoHub team — send us your questions, feedback or collaboration ideas.'}
        path="/contact"
        lang={language}
      />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 text-white shadow-lg rounded-2xl bg-gradient-to-br from-primary-500 via-gold-500 to-crimson-500">
            <FiMessageCircle size={28} />
          </div>
          <h1
            className={`font-display text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 ${
              isPS ? 'pashto-text' : ''
            }`}
          >
            {t('contact.title')}
          </h1>
          <p
            className={`text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto ${
              isPS ? 'pashto-text' : ''
            }`}
          >
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Info */}
          <div className="space-y-4 lg:col-span-1">
            {contactInfo.map((item, i) => (
              <div
                key={i}
                className="p-6 transition-all bg-white border border-gray-100 shadow-sm dark:bg-gray-800 rounded-2xl dark:border-gray-700 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-gold-400">
                    <item.icon size={22} />
                  </div>
                  <div className="min-w-0">
                    <h3
                      className={`text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1 ${
                        isPS ? 'pashto-text' : ''
                      }`}
                    >
                      {item.label}
                    </h3>
                    <p
                      className={`text-gray-900 dark:text-white font-medium break-all ${
                        isPS ? 'pashto-text' : ''
                      }`}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="p-8 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 rounded-3xl md:p-10 dark:border-gray-700">
              {submitted && (
                <div
                  className={`mb-6 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 ${
                    isPS ? 'pashto-text' : ''
                  }`}
                >
                  ✓{' '}
                  {language === 'ps'
                    ? 'ستاسو پیغام بریالۍ توګه ولیږل شو!'
                    : 'Your message has been sent successfully!'}
                </div>
              )}

              {errorMsg && (
                <div className="p-4 mb-6 text-sm text-red-700 border border-red-200 bg-red-50 rounded-xl dark:bg-red-900/30 dark:text-red-300 dark:border-red-800">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      className={`block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ${
                        isPS ? 'pashto-text' : ''
                      }`}
                    >
                      {t('contact.name')}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 text-gray-900 transition-all border border-gray-200 rounded-xl dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ${
                        isPS ? 'pashto-text' : ''
                      }`}
                    >
                      {t('contact.email')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 text-gray-900 transition-all border border-gray-200 rounded-xl dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ${
                      isPS ? 'pashto-text' : ''
                    }`}
                  >
                    {t('contact.subject')}
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 text-gray-900 transition-all border border-gray-200 rounded-xl dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ${
                      isPS ? 'pashto-text' : ''
                    }`}
                  >
                    {t('contact.message')}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 text-gray-900 transition-all border border-gray-200 resize-none rounded-xl dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <button type="submit" disabled={loading} className="btn-primary">
                  <FiSend size={18} />
                  {loading ? 'Sending...' : t('contact.send')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact