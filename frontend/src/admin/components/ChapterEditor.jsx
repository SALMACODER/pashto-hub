import { useState } from 'react'
import { Controller, useFieldArray } from 'react-hook-form'
import {
  FiPlus, FiTrash2, FiArrowUp, FiArrowDown,
  FiChevronDown, FiChevronRight,
} from 'react-icons/fi'
import Field from './Field'
import ItemsTable from './ItemsTable'

/**
 * Edits the `chapters` field-array of a Lesson form.
 *
 *   <ChapterEditor control={form.control} register={form.register} />
 *
 * Each chapter has:
 *   - title.en / title.ps
 *   - description.en / description.ps
 *   - type ∈ alphabet | phrases | colors | names | rich
 *   - items[] (table editor; empty for type='rich')
 *   - body.en / body.ps  (only used when type='rich')
 *   - order
 */

const TYPES = [
  { value: 'phrases',  label: 'Phrases (Pashto + Roman + English)' },
  { value: 'alphabet', label: 'Alphabet (letter + name + sound)' },
  { value: 'colors',   label: 'Colors (with swatches)' },
  { value: 'names',    label: 'Names (Pashto names + meaning)' },
  { value: 'rich',     label: 'Rich text (HTML body)' },
]

const blankChapter = () => ({
  title: { en: '', ps: '' },
  description: { en: '', ps: '' },
  type: 'phrases',
  items: [],
  body: { en: '', ps: '' },
  order: 0,
})

const ChapterEditor = ({ control, register, errors }) => {
  const { fields, append, remove, move } = useFieldArray({ control, name: 'chapters' })

  // Track which chapters are expanded — collapse them by default so a long
  // lesson form stays scannable.
  const [openIdx, setOpenIdx] = useState(() => new Set([0]))
  const toggle = (i) =>
    setOpenIdx((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })

  const handleAdd = () => {
    const idx = fields.length
    append(blankChapter())
    setOpenIdx((prev) => new Set(prev).add(idx))
  }

  return (
    <div>
      {fields.length === 0 ? (
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
          No chapters yet. Add the first one to start structuring this lesson.
        </p>
      ) : (
        <ul className="space-y-3">
          {fields.map((f, i) => (
            <li
              key={f.id}
              className="overflow-hidden border border-gray-200 rounded-xl dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50"
            >
              <ChapterRow
                index={i}
                isOpen={openIdx.has(i)}
                onToggle={() => toggle(i)}
                onMoveUp={() => move(i, i - 1)}
                onMoveDown={() => move(i, i + 1)}
                onRemove={() => remove(i)}
                disableUp={i === 0}
                disableDown={i === fields.length - 1}
                control={control}
                register={register}
                errors={errors?.chapters?.[i]}
              />
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={handleAdd}
        className="inline-flex items-center gap-1.5 mt-4 px-3 py-2 text-sm font-semibold text-white rounded-lg bg-primary-600 hover:bg-primary-700"
      >
        <FiPlus size={14} /> Add chapter
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// One chapter row: collapsed → header only; expanded → full editor.
// ─────────────────────────────────────────────────────────────────────────────
const ChapterRow = ({
  index, isOpen, onToggle, onMoveUp, onMoveDown, onRemove, disableUp, disableDown,
  control, register, errors,
}) => (
  <>
    <div className="flex items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-gray-900">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center flex-1 min-w-0 gap-2 text-left"
        aria-expanded={isOpen}
      >
        {isOpen ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
        <span className="text-xs font-mono text-gray-500 dark:text-gray-500">#{index + 1}</span>
        <Controller
          control={control}
          name={`chapters.${index}.title.en`}
          render={({ field }) => (
            <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
              {field.value || <span className="italic text-gray-400">Untitled chapter</span>}
            </span>
          )}
        />
      </button>

      <div className="flex items-center flex-shrink-0 gap-0.5">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={disableUp}
          className="p-1.5 text-gray-500 rounded hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-800"
          title="Move up"
          aria-label="Move chapter up"
        >
          <FiArrowUp size={14} />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={disableDown}
          className="p-1.5 text-gray-500 rounded hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-800"
          title="Move down"
          aria-label="Move chapter down"
        >
          <FiArrowDown size={14} />
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Delete this chapter? Its items will be lost.')) onRemove()
          }}
          className="p-1.5 text-red-500 rounded hover:bg-red-50 dark:hover:bg-red-950/40"
          title="Delete chapter"
          aria-label="Delete chapter"
        >
          <FiTrash2 size={14} />
        </button>
      </div>
    </div>

    {isOpen && (
      <div className="p-4 space-y-4 border-t border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field
            label="Title (English)"
            required
            {...register(`chapters.${index}.title.en`)}
            error={errors?.title?.en}
          />
          <Field
            label="Title (Pashto)"
            dir="rtl"
            {...register(`chapters.${index}.title.ps`)}
            error={errors?.title?.ps}
          />
        </div>

        <div>
          <span className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">Type</span>
          <Controller
            control={control}
            name={`chapters.${index}.type`}
            render={({ field }) => (
              <select
                {...field}
                className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            )}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
            Determines how this chapter is rendered to learners. Items will reset if you change type after adding rows.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field
            label="Description (English)"
            as="textarea"
            rows={2}
            {...register(`chapters.${index}.description.en`)}
            error={errors?.description?.en}
          />
          <Field
            label="Description (Pashto)"
            as="textarea"
            rows={2}
            dir="rtl"
            {...register(`chapters.${index}.description.ps`)}
            error={errors?.description?.ps}
          />
        </div>

        {/* Type-conditional editor: items table OR rich-text body */}
        <Controller
          control={control}
          name={`chapters.${index}.type`}
          render={({ field: typeField }) => (
            typeField.value === 'rich' ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field
                  label="Body (English)"
                  as="textarea"
                  rows={8}
                  hint="Plain text or HTML. Rendered to learners as-is."
                  {...register(`chapters.${index}.body.en`)}
                />
                <Field
                  label="Body (Pashto)"
                  as="textarea"
                  rows={8}
                  dir="rtl"
                  {...register(`chapters.${index}.body.ps`)}
                />
              </div>
            ) : (
              <div>
                <span className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">Items</span>
                <Controller
                  control={control}
                  name={`chapters.${index}.items`}
                  render={({ field }) => (
                    <ItemsTable
                      type={typeField.value}
                      items={field.value || []}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            )
          )}
        />
      </div>
    )}
  </>
)

export default ChapterEditor
