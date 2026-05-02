import { useState } from 'react'
import { FiPlus, FiX, FiLoader } from 'react-icons/fi'
import { Controller } from 'react-hook-form'
import { useCategories, useCreateCategory } from '../../hooks/admin/useAdminCategories'

/**
 * Category dropdown with an inline "Create new" form.
 *
 *   <CategoryCombobox name="category" control={control} required />
 *
 * Stores the category SLUG on the form (matches Book.category on the backend).
 * After creating a new one, the new slug is auto-selected on the form.
 */
const CategoryCombobox = ({ name, control, label = 'Category', required, error }) => {
  const { data, isLoading } = useCategories()
  const create = useCreateCategory()
  const items = data?.items || data?.data?.items || []

  const [showCreate, setShowCreate] = useState(false)
  const [draft, setDraft] = useState({ en: '', ps: '' })
  const [createErr, setCreateErr] = useState('')

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const handleCreate = async () => {
          setCreateErr('')
          if (!draft.en.trim() || !draft.ps.trim()) {
            setCreateErr('Both English and Pashto names are required.')
            return
          }
          try {
            const res = await create.mutateAsync({ name: { en: draft.en.trim(), ps: draft.ps.trim() } })
            const cat = res?.data?.category || res?.category
            if (cat?.slug) field.onChange(cat.slug)
            setDraft({ en: '', ps: '' })
            setShowCreate(false)
          } catch (e) {
            setCreateErr(e.response?.data?.error?.message || e.response?.data?.message || 'Create failed')
          }
        }

        return (
          <div>
            <span className="flex items-center justify-between mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
              <span>
                {label}
                {required && <span className="ml-1 text-red-500" aria-hidden="true">*</span>}
              </span>
              {error && (
                <span className="text-xs font-normal text-red-600 dark:text-red-400">{error.message || error}</span>
              )}
            </span>

            <div className="flex gap-2">
              <select
                value={field.value || ''}
                onChange={(e) => {
                  if (e.target.value === '__new__') { setShowCreate(true); return }
                  field.onChange(e.target.value)
                }}
                onBlur={field.onBlur}
                disabled={isLoading}
                className={[
                  'flex-1 px-3.5 py-2 text-sm border rounded-lg bg-white dark:bg-gray-900',
                  'text-gray-900 dark:text-white border-gray-300 dark:border-gray-700',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                  error ? 'border-red-400 focus:ring-red-500' : '',
                ].join(' ')}
                aria-invalid={Boolean(error)}
              >
                <option value="">{isLoading ? 'Loading…' : 'Select a category…'}</option>
                {items.map((c) => (
                  <option key={c._id || c.slug} value={c.slug}>
                    {c.name?.en} {c.name?.ps ? `— ${c.name.ps}` : ''}
                  </option>
                ))}
                <option value="__new__">＋ Create new category…</option>
              </select>
              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center justify-center w-10 h-10 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                title="Create new category"
                aria-label="Create new category"
              >
                <FiPlus />
              </button>
            </div>

            {showCreate && (
              <div className="p-3 mt-2 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-900/50 dark:border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">New category</span>
                  <button
                    type="button"
                    onClick={() => { setShowCreate(false); setCreateErr('') }}
                    className="p-1 text-gray-500 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
                    aria-label="Cancel"
                  >
                    <FiX size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <input
                    type="text"
                    value={draft.en}
                    onChange={(e) => setDraft({ ...draft, en: e.target.value })}
                    placeholder="English name (e.g. Biography)"
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    maxLength={60}
                  />
                  <input
                    type="text"
                    value={draft.ps}
                    onChange={(e) => setDraft({ ...draft, ps: e.target.value })}
                    placeholder="پښتو نوم"
                    dir="rtl"
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg pashto-text dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    maxLength={60}
                  />
                </div>
                {createErr && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{createErr}</p>}
                <div className="flex justify-end gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => { setShowCreate(false); setCreateErr('') }}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreate}
                    disabled={create.isPending}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-white rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-60"
                  >
                    {create.isPending ? <FiLoader className="animate-spin" /> : <FiPlus />}
                    Create
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      }}
    />
  )
}

export default CategoryCombobox
