import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  FiArrowLeft, FiSave, FiLoader, FiAlertCircle, FiCheckCircle,
} from 'react-icons/fi'

import PageHeader from '../../components/PageHeader'
import Field from '../../components/Field'
import ChapterEditor from '../../components/ChapterEditor'
import ImageUpload from '../../../components/admin/ImageUpload'
import { useAdminLesson, useUpsertLesson } from '../../../hooks/admin/useAdminLessons'

// ────────────────────────────────────────────────────────────────────────────
// Validation — mirrors backend lessonValidator. Items are intentionally
// loose (Mixed on the backend); ChapterEditor handles per-type shape locally.
// ────────────────────────────────────────────────────────────────────────────
const bilingualReq = (max) => z.object({
  en: z.string().trim().min(1, 'English is required').max(max),
  ps: z.string().trim().min(1, 'Pashto is required').max(max),
})

const bilingualOpt = (max) => z.object({
  en: z.string().trim().max(max).optional().or(z.literal('')),
  ps: z.string().trim().max(max).optional().or(z.literal('')),
}).default({ en: '', ps: '' })

const chapterSchema = z.object({
  title: z.object({
    en: z.string().trim().min(1, 'Chapter English title is required').max(200),
    ps: z.string().trim().max(200).optional().or(z.literal('')),
  }),
  description: bilingualOpt(1000),
  type: z.enum(['alphabet', 'phrases', 'colors', 'names', 'rich']),
  items: z.array(z.any()).default([]),
  body: bilingualOpt(20000),
  order: z.coerce.number().int().min(0).max(9999).optional(),
})

const schema = z.object({
  title:       bilingualReq(200),
  description: bilingualOpt(2000),
  level:       z.enum(['Beginner', 'Intermediate', 'Advanced']),
  levelPs:     z.string().trim().max(60).optional().or(z.literal('')),
  duration:    z.string().trim().max(30).optional().or(z.literal('')),
  color:       z.string().trim().max(100).optional().or(z.literal('')),
  icon:        z.string().trim().max(10).optional().or(z.literal('')),
  order:       z.coerce.number().int().min(0).max(9999).optional(),
  videoUrl:    z.string().optional().or(z.literal('')),
  coverImage:    z.string().optional().or(z.literal('')),
  coverPublicId: z.string().optional().or(z.literal('')),
  chapters:    z.array(chapterSchema).default([]),
})

const EMPTY_DEFAULTS = {
  title: { en: '', ps: '' },
  description: { en: '', ps: '' },
  level: 'Beginner',
  levelPs: '',
  duration: '',
  color: 'from-primary-500 to-primary-700',
  icon: '📚',
  order: '',
  videoUrl: '',
  coverImage: '',
  coverPublicId: '',
  chapters: [],
}

const toPayload = (v) => {
  const out = { ...v }
  if (!out.order && out.order !== 0) delete out.order
  if (!out.coverPublicId) out.coverPublicId = ''
  if (!out.videoUrl)      out.videoUrl      = ''
  // Strip the body subobject for non-rich chapters so it doesn't bloat the
  // doc — backend doesn't need it and keeps the JSON small.
  out.chapters = (out.chapters || []).map((c, i) => {
    const ch = { ...c, order: c.order ?? i }
    if (ch.type !== 'rich') ch.body = { en: '', ps: '' }
    if (ch.type === 'rich') ch.items = []
    return ch
  })
  return out
}

const LessonFormPage = () => {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const { data, isLoading: loadingLesson, error: loadError } = useAdminLesson(id)
  const upsert = useUpsertLesson()

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_DEFAULTS,
  })

  // Hydrate the form once the lesson is fetched
  useEffect(() => {
    if (!isEdit) return
    const lesson = data?.data?.lesson || data?.lesson
    if (!lesson) return
    form.reset({
      ...EMPTY_DEFAULTS,
      ...lesson,
      description: { en: lesson.description?.en || '', ps: lesson.description?.ps || '' },
      levelPs: lesson.levelPs || '',
      duration: lesson.duration || '',
      color: lesson.color || EMPTY_DEFAULTS.color,
      icon: lesson.icon || EMPTY_DEFAULTS.icon,
      order: lesson.order ?? '',
      videoUrl: lesson.videoUrl || '',
      coverImage: lesson.coverImage || '',
      coverPublicId: lesson.coverPublicId || '',
      chapters: Array.isArray(lesson.chapters)
        ? lesson.chapters.map((c) => ({
            title: { en: c.title?.en || '', ps: c.title?.ps || '' },
            description: { en: c.description?.en || '', ps: c.description?.ps || '' },
            type: c.type || 'phrases',
            items: Array.isArray(c.items) ? c.items : [],
            body: { en: c.body?.en || '', ps: c.body?.ps || '' },
            order: c.order ?? 0,
          }))
        : [],
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isEdit])

  const onSubmit = async (values) => {
    try {
      const res = await upsert.mutateAsync({ id, body: toPayload(values) })
      const saved = res?.data?.lesson || res?.lesson
      if (!isEdit && saved?._id) {
        navigate(`../${saved._id}`, { replace: true })
      }
    } catch {
      // Surface via upsert.error below
    }
  }

  // ImageUpload bridge for the cover field.
  const cover = {
    url: form.watch('coverImage'),
    publicId: form.watch('coverPublicId'),
  }
  const onCoverChange = (next) => {
    form.setValue('coverImage',    next?.url      || '', { shouldDirty: true })
    form.setValue('coverPublicId', next?.publicId || '', { shouldDirty: true })
  }

  const errs = form.formState.errors
  const apiErr = upsert.error?.response?.data?.error?.message
    || upsert.error?.response?.data?.message
    || upsert.error?.message
  const success = upsert.isSuccess && !form.formState.isDirty

  if (isEdit && loadingLesson) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <FiLoader className="mr-2 animate-spin" /> Loading lesson…
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
        title={isEdit ? 'Edit lesson' : 'New lesson'}
        actions={(
          <>
            <Link to=".." className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
              <FiArrowLeft /> Back
            </Link>
            <button
              type="submit"
              form="lesson-form"
              disabled={upsert.isPending}
              className="btn-primary !py-2 text-sm"
            >
              {upsert.isPending ? <FiLoader className="animate-spin" /> : <FiSave />}
              {isEdit ? 'Save changes' : 'Create lesson'}
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

      <form id="lesson-form" onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ── Left column ──────────────────────────────────────────────── */}
        <div className="space-y-5 lg:col-span-2">
          <Card title="Basic info">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Title (English)" required {...form.register('title.en')} error={errs.title?.en} />
              <Field label="Title (Pashto)"  required dir="rtl" {...form.register('title.ps')} error={errs.title?.ps} />
            </div>

            <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <span className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">Level *</span>
                <select
                  {...form.register('level')}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <Field
                label="Level (Pashto label)"
                dir="rtl"
                {...form.register('levelPs')}
                hint="e.g. پیل کوونکی / منځنی / پرمختللی"
              />
              <Field label="Duration" hint="e.g. 1h 30m" {...form.register('duration')} />
            </div>

            <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-3">
              <Field label="Icon (emoji)" {...form.register('icon')} maxLength={10} />
              <Field label="Color (Tailwind gradient)" {...form.register('color')} hint="e.g. from-primary-400 to-primary-600" />
              <Field label="Sort order" type="number" {...form.register('order')} />
            </div>
          </Card>

          <Card title="Description">
            <Field label="English" as="textarea" rows={3} {...form.register('description.en')} error={errs.description?.en} />
            <div className="mt-4">
              <Field label="Pashto" as="textarea" rows={3} dir="rtl" {...form.register('description.ps')} error={errs.description?.ps} />
            </div>
          </Card>

          <Card title="Chapters">
            <ChapterEditor control={form.control} register={form.register} errors={errs} />
          </Card>
        </div>

        {/* ── Right column ─────────────────────────────────────────────── */}
        <div className="space-y-5">
          <Card title="Cover image">
            <ImageUpload
              value={cover}
              onChange={onCoverChange}
              bucket="lessons"
              label={null}
              aspect="3/2"
            />
          </Card>

          <Card title="Tips">
            <ul className="ml-4 space-y-2 text-sm text-gray-600 list-disc dark:text-gray-400">
              <li>The slug is auto-generated from the English title — you don’t need to set it.</li>
              <li>Reorder chapters with the up/down arrows; their order is what learners see.</li>
              <li>Picking a different chapter type after adding rows will keep the rows; verify shapes match before saving.</li>
              <li>Use “Rich text” for free-form HTML content (notes, paragraphs).</li>
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

export default LessonFormPage
