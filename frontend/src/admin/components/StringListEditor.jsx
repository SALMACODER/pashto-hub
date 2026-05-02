import { Controller } from 'react-hook-form'
import { FiPlus, FiTrash2, FiArrowUp, FiArrowDown } from 'react-icons/fi'

/**
 * Editable list of strings, RHF-controlled.
 *
 *   <StringListEditor
 *     name="achievements.en"
 *     control={control}
 *     placeholder="Wrote over 350 mystical poems"
 *   />
 *
 * Useful for any "bullet list" field — achievements, tags, etc.
 * Pass `dir="rtl"` for the Pashto side; the wrapper flips the input
 * automatically and applies the pashto-text font.
 */

const inputCls =
  'flex-1 px-3 py-2 text-sm bg-white border rounded-md ' +
  'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white ' +
  'focus:outline-none focus:ring-2 focus:ring-primary-500'

const StringListEditor = ({ name, control, placeholder = '', dir, maxLength = 500, addLabel = 'Add item' }) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => {
      const items = Array.isArray(field.value) ? field.value : []

      const set = (i, v) => {
        const next = items.slice()
        next[i] = v
        field.onChange(next)
      }
      const remove = (i) => {
        const next = items.slice()
        next.splice(i, 1)
        field.onChange(next)
      }
      const move = (i, delta) => {
        const j = i + delta
        if (j < 0 || j >= items.length) return
        const next = items.slice()
        ;[next[i], next[j]] = [next[j], next[i]]
        field.onChange(next)
      }
      const add = () => field.onChange([...(items || []), ''])

      return (
        <div>
          {items.length === 0 ? (
            <p className="mb-2 text-xs italic text-gray-500 dark:text-gray-500">No items yet.</p>
          ) : (
            <ul className="space-y-2">
              {items.map((value, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="flex-shrink-0 w-6 text-xs font-mono text-gray-400 text-center">
                    {i + 1}.
                  </span>
                  <input
                    type="text"
                    dir={dir}
                    value={value || ''}
                    onChange={(e) => set(i, e.target.value)}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    className={`${inputCls} ${dir === 'rtl' ? 'pashto-text text-right' : ''}`}
                  />
                  <div className="flex items-center flex-shrink-0 gap-0.5">
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      className="p-1.5 text-gray-500 rounded hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-800"
                      title="Move up"
                      aria-label={`Move item ${i + 1} up`}
                    >
                      <FiArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      disabled={i === items.length - 1}
                      className="p-1.5 text-gray-500 rounded hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-800"
                      title="Move down"
                      aria-label={`Move item ${i + 1} down`}
                    >
                      <FiArrowDown size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(i)}
                      className="p-1.5 text-red-500 rounded hover:bg-red-50 dark:hover:bg-red-950/40"
                      title="Delete"
                      aria-label={`Delete item ${i + 1}`}
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={add}
            className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 text-sm font-medium text-primary-700 rounded-lg hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-950/40"
          >
            <FiPlus size={14} /> {addLabel}
          </button>
        </div>
      )
    }}
  />
)

export default StringListEditor
