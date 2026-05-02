/**
 * Standard heading for every admin page.
 * Renders an h1 + optional subtitle on the left, optional actions slot on the right.
 */
const PageHeader = ({ title, subtitle, actions }) => (
  <div className="flex flex-col items-start justify-between gap-3 mb-6 sm:flex-row sm:items-center">
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
      {subtitle && (
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
      )}
    </div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </div>
)

export default PageHeader
