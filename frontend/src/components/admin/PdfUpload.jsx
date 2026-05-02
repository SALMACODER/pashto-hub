import { useCallback, useRef, useState } from 'react'
import { FiUploadCloud, FiX, FiFileText, FiLoader, FiExternalLink, FiCloud, FiHardDrive } from 'react-icons/fi'
import { uploadPdf, deleteAsset } from '../../api/uploads'
import UploadModeToggle from './UploadModeToggle'

/**
 * PdfUpload — admin form field for a single PDF stored on Cloudinary (raw).
 *
 * Controlled component. Pass:
 *   value         { url, publicId, bytes? } | null
 *   onChange(next) called with the new { url, publicId, bytes } or null
 *   bucket        'books' | 'lessons' | …
 *   label         field label
 *   maxSizeMb     client-side hint (default 50; server enforces)
 */
const ACCEPTED = 'application/pdf'

const formatBytes = (n) => {
  if (!n || n < 0) return ''
  const u = ['B','KB','MB','GB']; let i = 0; let v = n
  while (v >= 1024 && i < u.length - 1) { v /= 1024; i++ }
  return `${v.toFixed(v >= 10 || i === 0 ? 0 : 1)} ${u[i]}`
}

const PdfUpload = ({
  value,
  onChange,
  bucket = 'misc',
  label = 'PDF file',
  maxSizeMb = 50,
  className = '',
  defaultMode = 'cloudinary',     // 'cloudinary' | 'local'
  showModeToggle = true,
}) => {
  const [progress, setProgress] = useState(0)
  const [busy, setBusy]         = useState(false)
  const [error, setError]       = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [filename, setFilename] = useState('')
  const [mode, setMode]         = useState(defaultMode)
  const inputRef = useRef(null)

  const usedStorage = value?.url
    ? (value.url.startsWith('/uploads/') ? 'local' : 'cloudinary')
    : null

  const handleFile = useCallback(async (file) => {
    if (!file) return
    setError('')

    if (file.type !== 'application/pdf') {
      setError('Please choose a PDF file.')
      return
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`PDF must be under ${maxSizeMb} MB.`)
      return
    }

    setFilename(file.name)
    setBusy(true)
    setProgress(0)

    const oldPublicId = value?.publicId
    try {
      const result = await uploadPdf(file, bucket, (loaded, total) => {
        setProgress(Math.round((loaded / total) * 100))
      }, { mode })
      onChange?.({ url: result.url, publicId: result.publicId, bytes: result.bytes })
      if (oldPublicId && oldPublicId !== result.publicId) {
        deleteAsset(oldPublicId, 'raw')
      }
    } catch (err) {
      const msg = err.response?.data?.error?.message
        || err.response?.data?.message
        || err.message
        || 'Upload failed'
      setError(msg)
    } finally {
      setBusy(false)
      setProgress(0)
    }
  }, [bucket, maxSizeMb, mode, onChange, value])

  const handleRemove = useCallback(() => {
    if (busy) return
    const publicId = value?.publicId
    onChange?.(null)
    setFilename('')
    if (publicId) deleteAsset(publicId, 'raw')
  }, [busy, onChange, value])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files?.[0])
  }, [handleFile])

  const hasFile = Boolean(value?.url)

  return (
    <div className={className}>
      {(label || showModeToggle) && (
        <div className="flex items-center justify-between gap-3 mb-2">
          {label
            ? <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
            : <span />}
          {showModeToggle && (
            <UploadModeToggle mode={mode} onChange={setMode} disabled={busy} />
          )}
        </div>
      )}

      <div
        onClick={() => !busy && !hasFile && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        role={hasFile ? undefined : 'button'}
        tabIndex={hasFile ? -1 : 0}
        onKeyDown={(e) => { if (!hasFile && (e.key === 'Enter' || e.key === ' ')) inputRef.current?.click() }}
        className={[
          'relative rounded-xl border-2 border-dashed transition-colors',
          'flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50',
          hasFile ? 'cursor-default' : 'cursor-pointer hover:border-primary-400',
          dragOver ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30' : 'border-gray-300 dark:border-gray-700',
          busy ? 'pointer-events-none opacity-90' : '',
        ].join(' ')}
      >
        <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-white rounded-lg bg-crimson-500">
          {busy ? <FiLoader className="animate-spin" size={20} /> : <FiFileText size={20} />}
        </div>

        <div className="flex-1 min-w-0">
          {busy ? (
            <>
              <div className="text-sm font-medium text-gray-900 truncate dark:text-white">{filename || 'Uploading…'}</div>
              <div className="w-full h-1.5 mt-2 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
                <div
                  className="h-full transition-all bg-primary-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{progress}%</div>
            </>
          ) : hasFile ? (
            <>
              <div className="text-sm font-medium text-gray-900 truncate dark:text-white">
                {filename || value.url.split('/').pop()}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                {value.bytes ? <span>{formatBytes(value.bytes)}</span> : null}
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  {usedStorage === 'local' ? <FiHardDrive size={11} /> : <FiCloud size={11} />}
                  {usedStorage === 'local' ? 'Local' : 'Cloudinary'}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                <FiUploadCloud className="inline mr-1.5 -mt-0.5" /> Click or drop a PDF
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">PDF only — up to {maxSizeMb} MB</div>
            </>
          )}
        </div>

        {hasFile && !busy && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={value.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-600 rounded-lg hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800"
              title="Open PDF"
              aria-label="Open PDF in new tab"
            >
              <FiExternalLink size={16} />
            </a>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40"
              title="Remove PDF"
              aria-label="Remove PDF"
            >
              <FiX size={16} />
            </button>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>
      )}
    </div>
  )
}

export default PdfUpload
