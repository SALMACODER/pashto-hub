import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  FiArrowLeft, FiSave, FiLoader, FiAlertCircle, FiCheckCircle,
  FiPlus, FiTrash2, FiArrowUp, FiArrowDown,
} from 'react-icons/fi'

import PageHeader from '../../components/PageHeader'
import Field from '../../components/Field'
import StringListEditor from '../../components/StringListEditor'
import ImageUpload from '../../../components/admin/ImageUpload'
import { useAdminLeader, useUpsertLeader } from '../../../hooks/admin/useAdminLeaders'

// ────────────────────────────────────────────────────────────────────────────
// Validation
// ────────────────────────────────────────────────────────────────────────────
const bilingualReq = (max) => z.object({
  en: z.string().trim().min(1, 'English is required').max(max),
  ps: z.string().trim().min(1, 'Pashto is required').max(max),
})

const bilingualOpt = (max) => z.object({
  en: z.string().trim().max(max).optional().or(z.literal('')),
  ps: z.string().trim().max(max).optional().or(z.literal('')),
}).default({ en: '', ps: '' })

const schema = z.object({
  name:        bilingualReq(120),
  role:        bilingualOpt(120),
  era:         z.string().trim().max(60).optional().or(z.literal('')),
  type:        bilingualOpt(60),
  description: bilingualOpt(1000),
  biography:   bilingualOpt(20000),

  achievements: z.object({
    en: z.array(z.string().max(500)).max(50).default([]),
    ps: z.array(z.string().max(500)).max(50).default([]),
  }).default({ en: [], ps: [] }),

  quotes: z.array(z.object({
    en: z.string().trim().max(500).optional().or(z.literal('')),
    ps: z.string().trim().max(500).optional().or(z.literal('')),
  })).max(50).default([]),

  color: z.string().trim().max(100).optional().or(z.literal('')),
  emoji: z.string().trim().max(10).optional().or(z.literal('')),
  order: z.coerce.number().int().min(0).max(9999).optional(),

  photoUrl:      z.string().optional().or(z.literal('')),
  photoPublicId: z.string().optional().or(z.literal('')),
})

const EMPTY_DEFAULTS = {
  name: { en: '', ps: '' },
  role: { en: '', ps: '' },
  era: '',
  type: { en: '', ps: '' },
  description: { en: '', ps: '' },
  biography: { en: '', ps: '' },
  achievements: { en: [], ps: [] },
  quotes: [],
  color: 'from-primary-700 to-primary-900',
  emoji: '🌟',
  order: '',
  photoUrl: '',
  photoPublicId: '',
}

const toPayload = (v) => {
  const out = { ...v }
  if (!out.order && out.order !== 0) delete out.order
  if (!out.photoPublicId) out.photoPublicId = ''
  // Strip empty achievement strings so we don't store visual whitespace.
  out.achievements = {
    en: (out.achievements?.en || []).map((s) => s.trim()).filter(Boolean),
    ps: (out.achievements?.ps || []).map((s) => s.trim()).filter(Boolean),
  }
  // Strip quotes that are empty in BOTH languages.
  out.quotes = (out.quotes || []).filter((q) => (q.en || '').trim() || (q.ps || '').trim())
  return out
}

const LeaderFormPage = () => {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const { data, isLoading: loadingLeader, error: loadError } = useAdminLeader(id)
  const upsert = useUpsertLeader()

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_DEFAULTS,
  })

  // Hydrate
  useEffect(() => {
    if (!isEdit) return
    const leader = data?.data?.leader || data?.leader
    if (!leader) return
    form.reset({
      ...EMPTY_DEFAULTS,
      ...leader,
      role:        { en: leader.role?.en || '',        ps: leader.role?.ps || '' },
      type:        { en: leader.type?.en || '',        ps: leader.type?.ps || '' },
      description: { en: leader.description?.en || '', ps: leader.description?.ps || '' },
      biography:   { en: leader.biography?.en || '',   ps: leader.biography?.ps || '' },
      achievements: {
        en: Array.isArray(leader.achievements?.en) ? leader.achievements.en : [],
        ps: Array.isArray(leader.achievements?.ps) ? leader.achievements.ps : [],
      },
      quotes: Array.isArray(leader.quotes) ? leader.quotes.map((q) => ({ en: q.en || '', ps: q.ps || '' })) : [],
      order: leader.order ?? '',
      photoUrl: leader.photoUrl || '',
      photoPublicId: leader.photoPublicId || '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isEdit])

  const { fields: quoteFields, append: appendQuote, remove: removeQuote, move: moveQuote } =
    useFieldArray({ control: form.control, name: 'quotes' })

  const onSubmit = async (values) => {
    try {
      const res = await upsert.mutateAsync({ id, body: toPayload(values) })
      const saved = res?.data?.leader || res?.leader
      if (!isEdit && saved?._id) {
        navigate(`../${saved._id}`, { replace: true })
      }
    } catch {
      // Surface via upsert.error below
    }
  }

  // Photo bridge for ImageUpload
  const photo = {
    url: form.watch('photoUrl'),
    publicId: form.watch('photoPublicId'),
  }
  const onPhotoChange = (next) => {
    form.setValue('photoUrl',      next?.url      || '', { shouldDirty: true })
    form.setValue('photoPublicId', next?.publicId || '', { shouldDirty: true })
  }

  const errs = form.formState.errors
  const apiErr = upsert.error?.response?.data?.error?.message
    || upsert.error?.response?.data?.message
    || upsert.error?.message
  const success = upsert.isSuccess && !form.formState.isDirty

  if (isEdit && loadingLeader) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <FiLoader className="mr-2 animate-spin" /> Loading leader…
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
        title={isEdit ? 'Edit leader' : 'New leader'}
        actions={(
          <>
            <Link to=".." className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
              <FiArrowLeft /> Back
            </Link>
            <button
              type="submit"
              form="leader-form"
              disabled={upsert.isPending}
              className="btn-primary !py-2 text-sm"
            >
              {upsert.isPending ? <FiLoader className="animate-spin" /> : <FiSave />}
              {isEdit ? 'Save changes' : 'Create leader'}
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

      <form id="leader-form" onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-5 lg:col-span-2">
          <Card title="Basic info">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Name (English)" required {...form.register('name.en')} error={errs.name?.en} />
              <Field label="Name (Pashto)"  required dir="rtl" {...form.register('name.ps')} error={errs.name?.ps} />
              <Field label="Role (English)" {...form.register('role.en')} error={errs.role?.en} hint="e.g. Sufi Poet, Prime Minister" />
              <Field label="Role (Pashto)"  dir="rtl" {...form.register('role.ps')} error={errs.role?.ps} />
              <Field label="Type (English)" {...form.register('type.en')} hint="Short tag — Poet, Activist, etc." />
              <Field label="Type (Pashto)"  dir="rtl" {...form.register('type.ps')} />
              <Field label="Era" {...form.register('era')} hint='e.g. "1653 – 1711" or "1997 – present"' />
              <Field label="Sort order" type="number" {...form.register('order')} />
              <Field label="Emoji" {...form.register('emoji')} maxLength={10} hint="Used as fallback when there's no photo" />
              <Field label="Color (Tailwind gradient)" {...form.register('color')} hint="e.g. from-green-700 to-green-900" />
            </div>
          </Card>

          <Card title="Description (short — used on cards)">
            <Field label="English" as="textarea" rows={3} {...form.register('description.en')} error={errs.description?.en} />
            <div className="mt-4">
              <Field label="Pashto" as="textarea" rows={3} dir="rtl" {...form.register('description.ps')} error={errs.description?.ps} />
            </div>
          </Card>

          <Card title="Biography (long — detail page)">
            <Field label="English" as="textarea" rows={8} {...form.register('biography.en')} error={errs.biography?.en} />
            <div className="mt-4">
              <Field label="Pashto" as="textarea" rows={8} dir="rtl" {...form.register('biography.ps')} error={errs.biography?.ps} />
            </div>
          </Card>

          <Card title="Achievements">
            <p className="mb-3 text-xs text-gray-500 dark:text-gray-500">
              Bullet list shown in the sidebar of the detail page. Maintained per language —
              you don’t need 1:1 line correspondence between EN and PS.
            </p>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div>
                <span className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">English</span>
                <StringListEditor
                  name="achievements.en"
                  control={form.control}
                  placeholder="e.g. Wrote over 350 mystical poems"
                />
              </div>
              <div>
                <span className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Pashto</span>
                <StringListEditor
                  name="achievements.ps"
                  control={form.control}
                  dir="rtl"
                  placeholder="مثلاً، له ۳۵۰ زیات شعرونه ولیکل"
                />
              </div>
            </div>
          </Card>

          <Card title="Famous quotes">
            <p className="mb-3 text-xs text-gray-500 dark:text-gray-500">
              Each quote is a paired translation. Order is preserved across both languages.
            </p>
            {quoteFields.length === 0 ? (
              <p className="mb-3 text-sm italic text-gray-500 dark:text-gray-500">No quotes yet.</p>
            ) : (
              <ul className="space-y-3">
                {quoteFields.map((f, i) => (
                  <li key={f.id} className="p-3 border border-gray-200 rounded-lg dark:border-gray-800 bg-white dark:bg-gray-900">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-gray-500">Quote #{i + 1}</span>
                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => moveQuote(i, i - 1)}
                          disabled={i === 0}
                          className="p-1.5 text-gray-500 rounded hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-800"
                          aria-label="Move up"
                        >
                          <FiArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveQuote(i, i + 1)}
                          disabled={i === quoteFields.length - 1}
                          className="p-1.5 text-gray-500 rounded hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-800"
                          aria-label="Move down"
                        >
                          <FiArrowDown size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeQuote(i)}
                          className="p-1.5 text-red-500 rounded hover:bg-red-50 dark:hover:bg-red-950/40"
                          aria-label="Delete"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <Field
                        label="English"
                        as="textarea"
                        rows={2}
                        {...form.register(`quotes.${i}.en`)}
                      />
                      <Field
                        label="Pashto"
                        as="textarea"
                        rows={2}
                        dir="rtl"
                        {...form.register(`quotes.${i}.ps`)}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              onClick={() => appendQuote({ en: '', ps: '' })}
              className="inline-flex items-center gap-1.5 mt-3 px-3 py-2 text-sm font-semibold text-white rounded-lg bg-primary-600 hover:bg-primary-700"
            >
              <FiPlus size={14} /> Add quote
            </button>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <Card title="Portrait photo">
            <ImageUpload
              value={photo}
              onChange={onPhotoChange}
              bucket="leaders"
              label={null}
              aspect="1/1"
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
              Optional — when set, replaces the emoji on the detail page hero.
            </p>
          </Card>

          <Card title="Tips">
            <ul className="ml-4 space-y-2 text-sm text-gray-600 list-disc dark:text-gray-400">
              <li>The slug is auto-generated from the English name.</li>
              <li>Use a 1:1 square portrait (~600×600) for best results.</li>
              <li>Achievements are independent per language — don’t pad with empty rows.</li>
              <li>Sort order: lower numbers come first.</li>
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

export default LeaderFormPage
