import { useQuery } from '@tanstack/react-query'
import { FiCloud, FiHardDrive } from 'react-icons/fi'
import { fetchUploadConfig } from '../../api/uploads'

/**
 * Cloudinary / Local pill toggle. Reusable by ImageUpload + PdfUpload.
 *
 * Disables the Cloudinary pill when the backend reports CLOUDINARY_* env vars
 * aren't set, so users don't pick a mode that will 503.
 */
const PILL =
  'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border transition-colors'

const UploadModeToggle = ({ mode, onChange, disabled }) => {
  const { data } = useQuery({
    queryKey: ['upload-config'],
    queryFn: fetchUploadConfig,
    staleTime: 10 * 60 * 1000,         // config rarely changes
    retry: false,
  })

  const cloudinaryAvailable = data?.cloudinary !== false   // assume yes until we know otherwise
  const localAvailable      = data?.local !== false

  return (
    <div
      role="radiogroup"
      aria-label="Upload destination"
      className="inline-flex overflow-hidden border rounded-md shadow-sm border-gray-300 dark:border-gray-700"
    >
      <button
        type="button"
        role="radio"
        aria-checked={mode === 'cloudinary'}
        disabled={disabled || !cloudinaryAvailable}
        onClick={() => onChange?.('cloudinary')}
        title={cloudinaryAvailable ? 'Upload to Cloudinary' : 'Cloudinary credentials not configured on the server'}
        className={[
          PILL, 'border-0 border-r border-gray-300 dark:border-gray-700',
          mode === 'cloudinary'
            ? 'bg-primary-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800',
          (disabled || !cloudinaryAvailable) ? 'opacity-50 cursor-not-allowed' : '',
        ].join(' ')}
      >
        <FiCloud size={12} />
        Cloudinary
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={mode === 'local'}
        disabled={disabled || !localAvailable}
        onClick={() => onChange?.('local')}
        title="Save to backend disk"
        className={[
          PILL, 'border-0',
          mode === 'local'
            ? 'bg-primary-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800',
          (disabled || !localAvailable) ? 'opacity-50 cursor-not-allowed' : '',
        ].join(' ')}
      >
        <FiHardDrive size={12} />
        Local
      </button>
    </div>
  )
}

export default UploadModeToggle
