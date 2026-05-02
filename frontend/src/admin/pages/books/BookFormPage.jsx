import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  FiArrowLeft, FiSave, FiLoader, FiAlertCircle, FiCheckCircle, FiPlus, FiX,
} from 'react-icons/fi'

import PageHeader from '../../components/PageHeader'
import Field from '../../components/Field'
import CategoryCombobox from '../../components/CategoryCombobox'
import ImageUpload from '../../../components/admin/ImageUpload'
import PdfUpload from '../../../components/admin/PdfUpload'
import { useAdminBook, useUpsertBook } from '../../../hooks/admin/useAdminBooks'
import { deleteAsset } from '../../../api/uploads'

// ────────────────────────────────────────────────────────────────────────────
// Validation — mirrors backend bookValidator. Keeping them aligned manually
// since the backend is JS, not TS. Update both when fields change.
// ────────────────────────────────────────────────────────────────────────────
const bilingual = (max, msg) => z.object({
  en: z.string().trim().min(1, `English ${msg} is required`).max(max),
  ps: z.string().trim().min(1, `Pashto ${msg} is required`).max(max),
})

const bilingualOptional = (max) => z.object({
  en: z.string().trim().max(max).optional().or(z.literal('')),
  ps: z.string().trim().max(max).optional().or(z.literal('')),
}).default({ en: '', ps: '' })

const schema = z.object({
  title:       bilingual(200, 'title'),
  author:      bilingual(120, 'author'),
  description: bilingualOptional(2000),
  category:    z.string().min(1, 'Category is required').regex(/^[a-z0-9-]+$/, 'Invalid category'),
  language:    z.enum(['ps', 'en']).default('ps'),
  pages:       z.coerce.number().int().min(0).max(10000).optional(),
  publishedYear: z.coerce.number().int().min(600).max(new Date().getFullYear() + 1).optional(),

  coverImage:    z.string().url().or(z.literal('')).optional(),
  coverPublicId: z.string().optional().or(z.literal('')),

  fileUrl:       z.string().url().or(z.literal('')).optional(),
  filePublicId:  z.string().optional().or(z.literal('')),
  fileSize:      z.coerce.number().int().min(0).optional(),

  images: z.array(z.object({
    url:      z.string().url(),
    publicId: z.string(),
    caption:  z.string().max(200).optional().or(z.literal('')),
  })).max(20).default([]),
})

const EMPTY_DEFAULTS = {
  title: { en: '', ps: '' },
  author: { en: '', ps: '' },
  description: { en: '', ps: '' },
  category: '',
  language: 'ps',
  pages: '',
  publishedYear: '',
  coverImage: '',
  coverPublicId: '',
  fileUrl: '',
  filePublicId: '',
  fileSize: 0,
  images: [],
}

// Strip empty strings + numeric coercions before sending to backend
const toPayload = (v) => {
  const out = { ...v }
  if (!out.pages && out.pages !== 0)         delete out.pages
  if (!out.publishedYear)                    delete out.publishedYear
  if (!out.coverPublicId) out.coverPublicId = ''
  if (!out.filePublicId)  out.filePublicId  = ''
  return out
}

const BookFormPage = () => {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const { data, isLoading: loadingBook, error: loadError } = useAdminBook(id)
  const upsert = useUpsertBook()

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_DEFAULTS,
  })

  // Hydrate form once the book is fetched
  useEffect(() => {
    if (!isEdit) return
    const book = data?.data?.book || data?.book
    if (!book) return
    form.reset({
      ...EMPTY_DEFAULTS,
      ...book,
      description: { en: book.description?.en || '', ps: book.description?.ps || '' },
      pages: book.pages ?? '',
      publishedYear: book.publishedYear ?? '',
      images: Array.isArray(book.images) ? book.images : [],
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isEdit])

  const { fields: galleryFields, append: appendImage, remove: removeImage } = useFieldArray({
    control: form.control,
    name: 'images',
  })

  const onSubmit = async (values) => {
    try {
      const res = await upsert.mutateAsync({ id, body: toPayload(values) })
      const saved = res?.data?.book || res?.book
      if (!isEdit && saved?._id) {
        navigate(`../${saved._id}`, { replace: true })
      }
    } catch (e) {
      // Error is surfaced via upsert.error below
    }
  }

  // Bridge ImageUpload (which gives us {url, publicId}) into RHF fields
  const cover = {
    url: form.watch('coverImage'),
    publicId: form.watch('coverPublicId'),
  }
  const onCoverChange = (next) => {
    form.setValue('coverImage',    next?.url      || '', { shouldDirty: true })
    form.setValue('coverPublicId', next?.publicId || '', { shouldDirty: true })
  }

  const pdf = {
    url: form.watch('fileUrl'),
    publicId: form.watch('filePublicId'),
    bytes: form.watch('fileSize'),
  }
  const onPdfChange = (next) => {
    form.setValue('fileUrl',      next?.url      || '', { shouldDirty: true })
    form.setValue('filePublicId', next?.publicId || '', { shouldDirty: true })
    form.setValue('fileSize',     next?.bytes    || 0,  { shouldDirty: true })
  }

  const errs = form.formState.errors
  const apiErr = upsert.error?.response?.data?.error?.message
    || upsert.error?.response?.data?.message
    || upsert.error?.message
  const success = upsert.isSuccess && !form.formState.isDirty

  if (isEdit && loadingBook) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <FiLoader className="mr-2 animate-spin" /> Loading book…
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
        title={isEdit ? 'Edit book' : 'New book'}
        actions={(
          <>
            <Link to=".." className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
              <FiArrowLeft /> Back
            </Link>
            <button
              type="submit"
              form="book-form"
              disabled={upsert.isPending}
              className="btn-primary !py-2 text-sm"
            >
              {upsert.isPending ? <FiLoader className="animate-spin" /> : <FiSave />}
              {isEdit ? 'Save changes' : 'Create book'}
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

      <form id="book-form" onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ── Left column: text fields ─────────────────────────────────── */}
        <div className="space-y-5 lg:col-span-2">
          <Card title="Basic info">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Title (English)" required {...form.register('title.en')} error={errs.title?.en} />
              <Field label="Title (Pashto)"  required dir="rtl" {...form.register('title.ps')} error={errs.title?.ps} />
              <Field label="Author (English)" required {...form.register('author.en')} error={errs.author?.en} />
              <Field label="Author (Pashto)"  required dir="rtl" {...form.register('author.ps')} error={errs.author?.ps} />
            </div>

            <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2">
              <CategoryCombobox name="category" control={form.control} required error={errs.category} />
              <div>
                <span className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">Language</span>
                <select
                  {...form.register('language')}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="ps">Pashto</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2">
              <Field label="Pages" type="number" min="0" {...form.register('pages')} error={errs.pages} />
              <Field label="Published year" type="number" min="600" {...form.register('publishedYear')} error={errs.publishedYear} />
            </div>
          </Card>

          <Card title="Description">
            <Field label="English" as="textarea" rows={4} {...form.register('description.en')} error={errs.description?.en} hint="Up to 2000 characters." />
            <div className="mt-4">
              <Field label="Pashto" as="textarea" rows={4} dir="rtl" {...form.register('description.ps')} error={errs.description?.ps} />
            </div>
          </Card>

          <Card title="Gallery (additional images)">
            {galleryFields.length === 0 ? (
              <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">No additional images yet.</p>
            ) : (
              <ul className="grid grid-cols-2 gap-3 mb-3 sm:grid-cols-3 lg:grid-cols-4">
                {galleryFields.map((f, idx) => (
                  <li key={f.id} className="relative overflow-hidden border border-gray-200 rounded-lg group dark:border-gray-800">
                    <img src={f.url} alt={f.caption || ''} className="object-cover w-full h-32" loading="lazy" />
                    <button
                      type="button"
                      onClick={async () => {
                        const removed = galleryFields[idx]
                        removeImage(idx)
                        if (removed?.publicId) deleteAsset(removed.publicId, 'image')
                      }}
                      className="absolute p-1.5 transition-opacity rounded-full opacity-0 bg-white/90 text-gray-800 top-2 right-2 group-hover:opacity-100 hover:bg-white"
                      aria-label="Remove"
                    >
                      <FiX size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <GalleryAdder onAdd={(asset) => appendImage(asset)} />
          </Card>
        </div>

        {/* ── Right column: media uploads ──────────────────────────────── */}
        <div className="space-y-5">
          <Card title="Cover image">
            <ImageUpload
              value={cover}
              onChange={onCoverChange}
              bucket="books"
              label={null}
              aspect="3/4"
            />
          </Card>

          <Card title="Book PDF (optional)">
            <PdfUpload
              value={pdf}
              onChange={onPdfChange}
              bucket="books"
              label={null}
            />
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

/**
 * Inline uploader that appends to the gallery field array on success.
 * Remounts itself via `key` after each successful upload so its internal
 * preview state clears and the user can immediately add another image.
 */
const GalleryAdder = ({ onAdd }) => {
  const [resetKey, setResetKey] = useState(0)
  return (
    <ImageUpload
      key={resetKey}
      value={null}
      onChange={(asset) => {
        if (asset?.url && asset?.publicId) {
          onAdd({ url: asset.url, publicId: asset.publicId, caption: '' })
          setResetKey((k) => k + 1)
        }
      }}
      bucket="books"
      label={(
        <span className="inline-flex items-center gap-1.5">
          <FiPlus size={14} /> Add image
        </span>
      )}
      aspect="16/9"
    />
  )
}

export default BookFormPage
