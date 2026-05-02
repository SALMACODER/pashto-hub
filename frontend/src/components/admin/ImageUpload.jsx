import { useCallback, useEffect, useRef, useState } from 'react'
import { FiUploadCloud, FiX, FiImage, FiLoader, FiCloud, FiHardDrive } from 'react-icons/fi'
import { uploadImage, deleteAsset } from '../../api/uploads'
import { cloudImg } from '../../utils/cloudinaryUrl'
import UploadModeToggle from './UploadModeToggle'

/**
 * ImageUpload — drop-in admin form field for a single Cloudinary image.
 *
 * Controlled component. Pass:
 *   value          { url, publicId } | null
 *   onChange(next) called with the new { url, publicId } or null on remove
 *   bucket         'books' | 'leaders' | 'lessons' | 'dictionary'
 *   label          field label (string)
 *   aspect         optional CSS aspect for the preview frame, e.g. "3/4"
 *   maxSizeMb      client-side hint (server still enforces; default 5)
 *
 * Behavior:
 *   - On pick: previews instantly via object URL, uploads in background.
 *   - On replace: uploads new first, then deletes old (atomic UX).
 *   - On remove: clears and deletes the Cloudinary asset.
 */
const ACCEPTED = 'image/jpeg,image/png,image/webp,image/avif,image/gif'

const ImageUpload = ({
  value,
  onChange,
  bucket = 'misc',
  label = 'Image',
  aspect = '3/4',
  maxSizeMb = 5,
  className = '',
  defaultMode = 'cloudinary',     // 'cloudinary' | 'local'
  showModeToggle = true,
}) => {
  const [preview, setPreview]   = useState(null)   // local object URL during upload
  const [progress, setProgress] = useState(0)
  const [busy, setBusy]         = useState(false)
  const [error, setError]       = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [mode, setMode]         = useState(defaultMode)
  const inputRef = useRef(null)
  const previewUrlRef = useRef(null)

  // After an upload completes, remember which storage backed it so the badge
  // and follow-up actions can reflect it (Cloudinary URL → 'cloudinary',
  // /uploads/ path → 'local').
  const usedStorage = value?.url
    ? (value.url.startsWith('/uploads/') ? 'local' : 'cloudinary')
    : null

  // Always revoke the object URL to avoid memory leaks
  useEffect(() => () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
  }, [])

  const handleFile = useCallback(async (file) => {
    if (!file) return
    setError('')

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.')
      return
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`Image must be under ${maxSizeMb} MB.`)
      return
    }

    // Local preview while upload runs
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    const localUrl = URL.createObjectURL(file)
    previewUrlRef.current = localUrl
    setPreview(localUrl)
    setBusy(true)
    setProgress(0)

    const oldPublicId = value?.publicId
    try {
      const result = await uploadImage(file, bucket, (loaded, total) => {
        setProgress(Math.round((loaded / total) * 100))
      }, { mode })
      onChange?.({ url: result.url, publicId: result.publicId })
      // Replace succeeded — clean up old asset (fire & forget). The backend
      // dispatches local vs Cloudinary deletes based on the publicId prefix.
      if (oldPublicId && oldPublicId !== result.publicId) {
        deleteAsset(oldPublicId, 'image')
      }
    } catch (err) {
      const msg = err.response?.data?.error?.message
        || err.response?.data?.message
        || err.message
        || 'Upload failed'
      setError(msg)
      setPreview(null)
    } finally {
      setBusy(false)
      setProgress(0)
    }
  }, [bucket, maxSizeMb, mode, onChange, value])

  const handleRemove = useCallback(async () => {
    if (busy) return
    const publicId = value?.publicId
    onChange?.(null)
    setPreview(null)
    if (publicId) deleteAsset(publicId, 'image')
  }, [busy, onChange, value])

  // Drag & drop
  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files?.[0])
  }, [handleFile])

  const displayUrl = preview || (value?.url ? cloudImg(value.url, { width: 600, height: 800 }) : null)

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
        onClick={() => !busy && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click() }}
        className={[
          'relative overflow-hidden rounded-xl border-2 border-dashed transition-colors cursor-pointer',
          'flex items-center justify-center bg-gray-50 dark:bg-gray-900/50',
          dragOver ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30' : 'border-gray-300 dark:border-gray-700 hover:border-primary-400',
          busy ? 'pointer-events-none opacity-90' : '',
        ].join(' ')}
        style={{ aspectRatio: aspect }}
      >
        {displayUrl ? (
          <img
            src={displayUrl}
            alt="Preview"
            className="object-cover w-full h-full"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="px-4 text-center text-gray-500 dark:text-gray-400">
            <FiUploadCloud className="mx-auto mb-2" size={28} />
            <div className="text-sm font-medium">Click or drop an image here</div>
            <div className="mt-1 text-xs">JPG / PNG / WebP — up to {maxSizeMb} MB</div>
          </div>
        )}

        {busy && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white">
            <FiLoader className="mb-2 animate-spin" size={26} />
            <div className="text-sm font-semibold">Uploading… {progress}%</div>
          </div>
        )}

        {value?.url && !busy && (
          <>
            <span
              className="absolute z-10 inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium uppercase rounded shadow top-2 left-2 bg-black/60 text-white"
              title={`Stored on ${usedStorage}`}
            >
              {usedStorage === 'local' ? <FiHardDrive size={10} /> : <FiCloud size={10} />}
              {usedStorage}
            </span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleRemove() }}
              className="absolute z-10 p-1.5 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow top-2 right-2"
              aria-label="Remove image"
            >
              <FiX size={16} />
            </button>
          </>
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

export default ImageUpload
