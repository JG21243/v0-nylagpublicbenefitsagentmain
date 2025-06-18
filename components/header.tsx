import { NylagLogo } from "@/components/ui/nylag-logo"

export function Header() {
  return (
    <header className="relative text-white shadow-lg bg-gradient-to-r from-[var(--nylag-primary-blue)] to-[#33BADB] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-3 sm:py-4 lg:py-6">
          <NylagLogo className="text-xl sm:text-2xl lg:text-3xl" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-3 sm:h-4 lg:h-6 bg-[var(--nylag-primary-blue)] rotate-[-1deg] sm:rotate-[-2deg] origin-bottom-left transform-gpu" />
    </header>
  )
}
