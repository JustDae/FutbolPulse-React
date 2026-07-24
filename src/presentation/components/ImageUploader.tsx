import { useRef, useState } from 'react'
import { Upload, ImageIcon, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/presentation/utils/cn'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

interface ImageUploaderProps {
  currentImageUrl?: string | null
  onImageSelected: (file: File) => Promise<void>
  maxSizeMB?: number
  className?: string
  circular?: boolean
}

export function ImageUploader({
  currentImageUrl,
  onImageSelected,
  maxSizeMB = 2,
  className,
  circular = false,
}: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl ?? null)
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const maxSizeBytes = maxSizeMB * 1024 * 1024

  function handleClickArea() {
    inputRef.current?.click()
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error('Formato no permitido', {
        description: 'Solo se aceptan imágenes JPEG, PNG o WebP.',
      })
      event.target.value = ''
      return
    }

    if (file.size > maxSizeBytes) {
      toast.error('Archivo demasiado grande', {
        description: `El archivo supera el límite de ${maxSizeMB} MB.`,
      })
      event.target.value = ''
      return
    }

    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(URL.createObjectURL(file))

    setIsUploading(true)
    try {
      await onImageSelected(file)
      toast.success('Escudo actualizado', { description: 'La imagen se subió correctamente.' })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al subir la imagen.'
      toast.error('Error', { description: message })
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(currentImageUrl ?? null)
    } finally {
      setIsUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <button
        type="button"
        onClick={handleClickArea}
        disabled={isUploading}
        className={cn(
          'relative overflow-hidden border-2 border-dashed border-muted-foreground/30 bg-muted',
          'cursor-pointer transition-colors hover:border-primary/50',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          circular ? 'h-28 w-28 rounded-full' : 'aspect-square w-full max-w-xs rounded-lg',
          isUploading && 'opacity-50 cursor-not-allowed'
        )}
        aria-label="Seleccionar imagen"
      >
        {previewUrl ? (
          <>
            <img src={previewUrl} alt="Vista previa" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
              <Upload className="h-6 w-6 text-white" />
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-4">
            <ImageIcon className="h-10 w-10 text-muted-foreground" />
            <span className="text-center text-xs text-muted-foreground">Haz clic para seleccionar</span>
          </div>
        )}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />

      <p className="text-xs text-muted-foreground">Máximo {maxSizeMB} MB · JPG, PNG, WebP</p>
    </div>
  )
}
