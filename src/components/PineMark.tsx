import { cn } from '@/lib/utils'

/** Pine logo mark — uses public/pine-logo.svg (masked to currentColor / primary). */
export function PineMark({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Glasspine"
      className={cn('inline-block size-7 shrink-0 bg-primary', className)}
      style={{
        maskImage: 'url(/pine-logo.svg)',
        WebkitMaskImage: 'url(/pine-logo.svg)',
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
      }}
    />
  )
}
