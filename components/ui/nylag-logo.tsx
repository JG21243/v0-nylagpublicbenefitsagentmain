import { cn } from '@/lib/utils'

export interface NylagLogoProps {
  className?: string
}

export function NylagLogo({ className }: NylagLogoProps) {
  return (
    <span
      className={cn('relative inline-flex font-black text-[var(--nylag-primary-blue)]', className)}
      style={{ padding: '18px 18px 12px' }}
    >
      NY
      <span className="relative inline-block">
        L
        <span className="absolute left-0 bottom-0 h-[6px] w-12 bg-white"></span>
      </span>
      AG
    </span>
  )
}
