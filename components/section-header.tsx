import type { ReactNode } from "react"

export interface SectionHeaderProps {
  children: ReactNode
  className?: string
}

export function SectionHeader({ children, className }: SectionHeaderProps) {
  return <h2 className={`section-header text-base sm:text-lg lg:text-xl ${className ?? ""}`}>{children}</h2>
}
