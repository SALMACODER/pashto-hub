import { forwardRef } from 'react'

/**
 * RHF-friendly text/textarea field. Spread `...register('name')` onto it.
 *
 * <Field label="Title (EN)" {...register('title.en')} error={errors.title?.en} />
 *
 * Also accepts `dir="rtl"` for the Pashto-side inputs (Noto Nastaliq Urdu
 * already loaded site-wide).
 */
const baseInput =
  'w-full px-3.5 py-2 text-sm border rounded-lg bg-white dark:bg-gray-900 ' +
  'text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 ' +
  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ' +
  'placeholder-gray-400 dark:placeholder-gray-600 transition-all'

const Field = forwardRef(function Field(
  { label, error, hint, type = 'text', as, rows = 4, className = '', dir, required, ...rest },
  ref,
) {
  const Tag = as === 'textarea' ? 'textarea' : 'input'
  const isRtl = dir === 'rtl'

  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="flex items-center justify-between mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
          <span>
            {label}
            {required && <span className="ml-1 text-red-500" aria-hidden="true">*</span>}
          </span>
          {error && (
            <span className="text-xs font-normal text-red-600 dark:text-red-400">{error.message || error}</span>
          )}
        </span>
      )}
      <Tag
        ref={ref}
        type={Tag === 'input' ? type : undefined}
        rows={Tag === 'textarea' ? rows : undefined}
        dir={dir}
        className={[
          baseInput,
          isRtl ? 'pashto-text text-right' : '',
          error ? 'border-red-400 focus:ring-red-500' : '',
        ].join(' ')}
        aria-invalid={Boolean(error)}
        {...rest}
      />
      {hint && !error && (
        <span className="block mt-1 text-xs text-gray-500 dark:text-gray-500">{hint}</span>
      )}
    </label>
  )
})

export default Field
