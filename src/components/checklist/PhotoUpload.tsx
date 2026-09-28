import { useState } from 'react'
import { Camera, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useChecklist } from '@/lib/checklist-state'
import { cn } from '@/lib/utils'

function formatStamp(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

function RoomPhotoThumb({
  src,
  label,
  takenAt,
  onRemove,
}: {
  src: string
  label: string
  takenAt: string
  onRemove?: () => void
}) {
  const [failed, setFailed] = useState(false)

  return (
    <div className="relative aspect-square overflow-hidden rounded-lg border border-border/80 bg-muted/60">
      {!failed ? (
        <img
          src={src}
          alt={label}
          className="size-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex size-full flex-col items-center justify-center gap-1 bg-muted/80 px-1 text-center">
          <Camera className="size-4 text-muted-foreground/70" />
          <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
        </div>
      )}
      <div
        className={cn(
          'absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-1.5 pb-1 pt-4',
          failed && 'from-transparent',
        )}
      >
        {!failed && (
          <>
            <p className="truncate text-[10px] font-medium text-white">{label}</p>
            <p className="truncate text-[9px] text-white/80">{formatStamp(takenAt)}</p>
          </>
        )}
        {failed && (
          <p className="truncate text-center text-[9px] text-muted-foreground">
            {formatStamp(takenAt)}
          </p>
        )}
      </div>
      {onRemove && (
        <button
          type="button"
          className="absolute right-1 top-1 rounded-full bg-background/90 p-0.5 text-foreground shadow"
          onClick={onRemove}
          aria-label={`Remove ${label} photo`}
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  )
}

export function PhotoUpload() {
  const { photos, photosDone, addRoomPhotos, removePhoto, completePhotos } = useChecklist()

  return (
    <div className="space-y-3">
      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {photos.map((photo) => (
            <RoomPhotoThumb
              key={photo.id}
              src={photo.src}
              label={photo.label}
              takenAt={photo.takenAt}
              onRemove={photosDone ? undefined : () => removePhoto(photo.id)}
            />
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addRoomPhotos}
          disabled={photosDone}
        >
          <Camera className="size-4" />
          {photos.length ? 'Refresh photos' : 'Add photos'}
        </Button>
        {!photosDone && (
          <Button type="button" size="sm" disabled={photos.length === 0} onClick={completePhotos}>
            Mark photos complete
          </Button>
        )}
        {photosDone && (
          <p className="flex items-center text-sm text-primary">Move-in record photos saved</p>
        )}
      </div>
    </div>
  )
}
