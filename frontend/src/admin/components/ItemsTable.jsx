import { FiPlus, FiTrash2, FiArrowUp, FiArrowDown } from 'react-icons/fi'

/**
 * Inline editable table for chapter items. The column schema is dictated by
 * the chapter `type` so the row shape always matches what the LessonDetail
 * renderer expects.
 *
 * Pure controlled component:
 *   <ItemsTable type="phrases" items={items} onChange={setItems} />
 */

const COLUMNS = {
  alphabet: [
    { key: 'letter', label: 'Letter',  dir: 'rtl', placeholder: 'ا',     widthClass: 'w-16'  },
    { key: 'name',   label: 'Name',                placeholder: 'Alef',  widthClass: 'w-32'  },
    { key: 'sound',  label: 'Sound',               placeholder: 'a',     widthClass: 'w-20'  },
  ],
  phrases: [
    { key: 'ps',    label: 'Pashto',  dir: 'rtl', placeholder: 'سلام'   },
    { key: 'roman', label: 'Roman',               placeholder: 'Salaam' },
    { key: 'en',    label: 'English',             placeholder: 'Hello'  },
  ],
  colors: [
    { key: 'ps',    label: 'Pashto',  dir: 'rtl', placeholder: 'سور'    },
    { key: 'roman', label: 'Roman',               placeholder: 'Sor'    },
    { key: 'en',    label: 'English',             placeholder: 'Red'    },
    { key: 'hex',   label: 'Hex',                 placeholder: '#e53e3e', kind: 'color', widthClass: 'w-28' },
  ],
  names: [
    { key: 'ps',    label: 'Pashto',  dir: 'rtl', placeholder: 'احمد'        },
    { key: 'roman', label: 'Roman',               placeholder: 'Ahmad'       },
    { key: 'en',    label: 'Meaning',             placeholder: 'Most praised'},
  ],
}

const blankRow = (type) => {
  const cols = COLUMNS[type] || COLUMNS.phrases
  return Object.fromEntries(cols.map((c) => [c.key, c.kind === 'color' ? '#000000' : '']))
}

const inputCls =
  'w-full px-2.5 py-1.5 text-sm bg-white border rounded-md ' +
  'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white ' +
  'focus:outline-none focus:ring-2 focus:ring-primary-500'

const ItemsTable = ({ type, items = [], onChange }) => {
  const cols = COLUMNS[type]

  // 'rich' has no item table; the parent renders a body editor instead.
  if (!cols) return null

  const setRow = (i, key, value) => {
    const next = items.slice()
    next[i] = { ...(next[i] || {}), [key]: value }
    onChange(next)
  }

  const removeRow = (i) => {
    const next = items.slice()
    next.splice(i, 1)
    onChange(next)
  }

  const move = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const next = items.slice()
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  const addRow = () => onChange([...(items || []), blankRow(type)])

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left text-gray-600 dark:text-gray-400">
            {cols.map((c) => (
              <th key={c.key} className={`px-2 pb-2 font-medium ${c.widthClass || ''}`}>{c.label}</th>
            ))}
            <th className="w-20 px-2 pb-2 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((row, i) => (
            <tr key={i} className="align-top">
              {cols.map((c) => (
                <td key={c.key} className="py-1 pr-2">
                  {c.kind === 'color' ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="color"
                        value={row?.[c.key] || '#000000'}
                        onChange={(e) => setRow(i, c.key, e.target.value)}
                        className="flex-shrink-0 w-8 h-8 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 cursor-pointer"
                        aria-label={c.label}
                      />
                      <input
                        type="text"
                        value={row?.[c.key] || ''}
                        onChange={(e) => setRow(i, c.key, e.target.value)}
                        placeholder={c.placeholder}
                        className={inputCls}
                      />
                    </div>
                  ) : (
                    <input
                      type="text"
                      dir={c.dir}
                      value={row?.[c.key] ?? ''}
                      onChange={(e) => setRow(i, c.key, e.target.value)}
                      placeholder={c.placeholder}
                      className={`${inputCls} ${c.dir === 'rtl' ? 'pashto-text text-right' : ''}`}
                      maxLength={200}
                    />
                  )}
                </td>
              ))}
              <td className="py-1">
                <div className="flex items-center justify-end gap-0.5">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="p-1.5 text-gray-500 rounded hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-800"
                    title="Move up"
                    aria-label={`Move row ${i + 1} up`}
                  >
                    <FiArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === items.length - 1}
                    className="p-1.5 text-gray-500 rounded hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-800"
                    title="Move down"
                    aria-label={`Move row ${i + 1} down`}
                  >
                    <FiArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeRow(i)}
                    className="p-1.5 text-red-500 rounded hover:bg-red-50 dark:hover:bg-red-950/40"
                    title="Delete"
                    aria-label={`Delete row ${i + 1}`}
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        type="button"
        onClick={addRow}
        className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 text-sm font-medium text-primary-700 rounded-lg hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-950/40"
      >
        <FiPlus size={14} /> Add row
      </button>
    </div>
  )
}

export default ItemsTable
