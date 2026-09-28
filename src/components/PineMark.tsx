import { cn } from '@/lib/utils'

/** Geometric single-color pine mark for Glasspine branding */
export function PineMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={cn('size-7 shrink-0 text-primary', className)}
    >
      <path d="M12 2.5 18.5 12h-3.2L19 17.5H5L8.7 12H5.5L12 2.5Z" />
      <rect x="10.5" y="17.5" width="3" height="4" rx="0.5" />
    </svg>
  )
}
