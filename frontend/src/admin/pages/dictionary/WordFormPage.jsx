import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  FiArrowLeft, FiSave, FiLoader, FiAlertCircle, FiCheckCircle, FiStar,
} from 'react-icons/fi'

import PageHeader from '../../components/PageHeader'
import Field from '../../components/Field'
import { useAdminWord, useUpsertWord } from '../../../hooks/admin/useAdminDictionary'

// ────────────────────────────────────────────────────────────────────────────
// Validation — mirrors backend dictionaryValidator.
// ────────────────────────────────────────────────────────────────────────────
const POS_EN = ['Noun', 'Verb', 'Adjective', 'Adverb', 'Pronoun', 'Interjection', 'Other']

const schema = z.object({
  english:         z.string().trim().min(1, 'English word is required').max(80),
  pashto:          z.string().trim().min(1, 'Pashto word is required').max(80),
  transliteration: z.string().trim().max(80).optional().or(z.literal('')),

  partOfSpeech: z.object({
    en: z.enum(POS_EN).optional().or(z.literal('')),
    ps: z.string().trim().max(40).optional().or(z.literal('')),
  }).default({ en: 'Noun', ps: 'نوم' }),

  meaning: z.object({
    en: z.string().trim().max(1000).optional().or(z.literal('')),
    ps: z.string().trim().max(1000).optional().or(z.literal('')),
  }).default({ en: '', ps: '' }),

  example: z.object({
    en: z.string().trim().max(500).optional().or(z.literal('')),
    ps: z.string().trim().max(500).optional().or(z.literal('')),
  }).default({ en: '', ps: '' }),

  audioUrl:      z.string().optional().or(z.literal('')),
  featured:      z.boolean().default(false),
  featuredOrder: z.coerce.number().int().min(0).max(9999).optional(),
})

const EMPTY_DEFAULTS = {
  english: '',
  pashto: '',
  transliteration: '',
  partOfSpeech: { en: 'Noun', ps: 'نوم' },
  meaning: { en: '', ps: '' },
  example: { en: '', ps: '' },
  audioUrl: '',
  featured: false,
  featuredOrder: '',
}

const toPayload = (v) => {
  const out = { ...v }
  if (!out.featuredOrder && out.featuredOrder !== 0) delete out.featuredOrder
  if (!out.audioUrl) delete out.audioUrl
  // Empty enum string would fail backend validation — drop it so partOfSpeech.en defaults.
  if (!out.partOfSpeech?.en) {
    out.partOfSpeech = { ...out.partOfSpeech, en: undefined }
  }
  return out
}

const WordFormPage = () => {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const { data, isLoading: loadingWord, error: loadError } = useAdminWord(id)
  const upsert = useUpsertWord()

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_DEFAULTS,
  })

  useEffect(() => {
    if (!isEdit) return
    const word = data?.data?.word || data?.word
    if (!word) return
    form.reset({
      english: word.english || '',
      pashto: word.pashto || '',
      transliteration: word.transliteration || '',
      partOfSpeech: {
        en: word.partOfSpeech?.en || 'Noun',
        ps: word.partOfSpeech?.ps || 'نوم',
      },
      meaning: {
        en: word.meaning?.en || '',
        ps: word.meaning?.ps || '',
      },
      example: {
        en: word.example?.en || '',
        ps: word.example?.ps || '',
      },
      audioUrl: word.audioUrl || '',
      featured: Boolean(word.featured),
      featuredOrder: word.featuredOrder ?? '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isEdit])

  const onSubmit = async (values) => {
    try {
      const res = await upsert.mutateAsync({ id, body: toPayload(values) })
      const saved = res?.data?.word || res?.word
      if (!isEdit && saved?._id) {
        navigate(`../${saved._id}`, { replace: true })
      }
    } catch {
      // Surface via upsert.error below
    }
  }

  const errs = form.formState.errors
  const apiErr = upsert.error?.response?.data?.error?.message
    || upsert.error?.response?.data?.message
    || upsert.error?.message
  const success = upsert.isSuccess && !form.formState.isDirty
  const isFeatured = form.watch('featured')

  if (isEdit && loadingWord) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <FiLoader className="mr-2 animate-spin" /> Loading word…
      </div>
    )
  }
  if (isEdit && loadError) {
    return (
      <div className="flex items-center justify-center gap-2 h-64 text-red-600">
        <FiAlertCircle /> {loadError.response?.data?.error?.message || loadError.message}
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Edit word' : 'New word'}
        actions={(
          <>
            <Link to=".." className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
              <FiArrowLeft /> Back
            </Link>
            <button
              type="submit"
              form="word-form"
              disabled={upsert.isPending}
              className="btn-primary !py-2 text-sm"
            >
              {upsert.isPending ? <FiLoader className="animate-spin" /> : <FiSave />}
              {isEdit ? 'Save changes' : 'Create word'}
            </button>
          </>
        )}
      />

      {apiErr && (
        <div className="flex items-start gap-2 p-3 mb-4 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950/40 dark:border-red-900 dark:text-red-300">
          <FiAlertCircle className="mt-0.5 flex-shrink-0" />
          <div>{apiErr}</div>
        </div>
      )}
      {success && (
        <div className="flex items-start gap-2 p-3 mb-4 text-sm text-green-700 border border-green-200 rounded-lg bg-green-50 dark:bg-green-950/40 dark:border-green-900 dark:text-green-300">
          <FiCheckCircle className="mt-0.5 flex-shrink-0" />
          <div>Saved successfully.</div>
        </div>
      )}

      <form id="word-form" onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-5 lg:col-span-2">
          <Card title="Headwords">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="English"
                required
                placeholder="hello"
                {...form.register('english')}
                error={errs.english}
              />
              <Field
                label="Pashto"
                required
                dir="rtl"
                placeholder="سلام"
                {...form.register('pashto')}
                error={errs.pashto}
              />
              <Field
                label="Transliteration (Roman)"
                placeholder="Salaam"
                hint="Helpful for English-speaking learners."
                {...form.register('transliteration')}
                error={errs.transliteration}
                className="sm:col-span-2"
              />
            </div>
          </Card>

          <Card title="Part of speech">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <span className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">English</span>
                <select
                  {...form.register('partOfSpeech.en')}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {POS_EN.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <Field
                label="Pashto"
                dir="rtl"
                placeholder="نوم"
                {...form.register('partOfSpeech.ps')}
                hint="e.g. نوم / فعل / صفت"
              />
            </div>
          </Card>

          <Card title="Meaning">
            <Field
              label="English"
              as="textarea"
              rows={3}
              placeholder="A greeting said when meeting someone."
              {...form.register('meaning.en')}
              error={errs.meaning?.en}
            />
            <div className="mt-4">
              <Field
                label="Pashto"
                as="textarea"
                rows={3}
                dir="rtl"
                placeholder="د یو چا سره د مخامخ کیدو په وخت کې ویل کیږي."
                {...form.register('meaning.ps')}
                error={errs.meaning?.ps}
              />
            </div>
          </Card>

          <Card title="Example sentence">
            <Field
              label="English"
              placeholder="Hello, how are you?"
              {...form.register('example.en')}
              error={errs.example?.en}
            />
            <div className="mt-4">
              <Field
                label="Pashto"
                dir="rtl"
                placeholder="سلام، څنګه یې؟"
                {...form.register('example.ps')}
                error={errs.example?.ps}
              />
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <Card title="Featured">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...form.register('featured')}
                className="w-5 h-5 mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900 dark:text-white">
                  <FiStar size={14} className={isFeatured ? 'fill-yellow-400 text-yellow-500' : ''} />
                  Show in “Popular searches”
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  Featured words appear as pills on the public dictionary page.
                </p>
              </div>
            </label>

            <div className="mt-4">
              <Field
                label="Order"
                type="number"
                min="0"
                hint="Lower numbers appear first. Optional."
                {...form.register('featuredOrder')}
                error={errs.featuredOrder}
                disabled={!isFeatured}
              />
            </div>
          </Card>

          <Card title="Audio (optional)">
            <Field
              label="Audio URL"
              placeholder="https://… or /uploads/dictionary/…"
              hint="Pronunciation clip. Cloudinary URL or local /uploads/ path."
              {...form.register('audioUrl')}
              error={errs.audioUrl}
            />
          </Card>

          <Card title="Tips">
            <ul className="ml-4 space-y-2 text-sm text-gray-600 list-disc dark:text-gray-400">
              <li>The dictionary search filters by the active language — keep both columns clean.</li>
              <li>Lookups counter increments automatically when learners view the word.</li>
              <li>Use short, learner-friendly meanings; example sentences are where the colour goes.</li>
            </ul>
          </Card>
        </div>
      </form>
    </div>
  )
}

const Card = ({ title, children }) => (
  <section className="p-5 bg-white border border-gray-200 rounded-xl dark:bg-gray-900 dark:border-gray-800">
    {title && (
      <h2 className="mb-4 text-sm font-semibold tracking-wide uppercase text-gray-700 dark:text-gray-300">
        {title}
      </h2>
    )}
    {children}
  </section>
)

export default WordFormPage
