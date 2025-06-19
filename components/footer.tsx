import { NylagLogo } from "@/components/ui/nylag-logo"

export function Footer() {
  return (
    <footer className="nylag-footer text-sm sm:text-base" role="contentinfo">
      <div className="nylag-footer-bar" />
      <div className="py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <NylagLogo className="text-lg sm:text-xl lg:text-2xl flex-shrink-0" />
            <span className="font-black text-[var(--nylag-primary-blue)] text-base sm:text-lg lg:text-xl leading-tight">
              New York Legal Assistance Group
            </span>
          </div>
          <address className="not-italic space-y-2 sm:space-y-3 text-sm sm:text-base lg:text-lg">
            <p className="leading-relaxed">
              7 Hanover Square, 18th Floor
              <br />
              New York, NY 10004
            </p>
            <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
              <a
                href="tel:212-613-5000"
                className="text-[var(--nylag-primary-blue)] hover:text-nylag-orange transition-colors duration-200 font-medium"
              >
                (212) 613-5000
              </a>
              <a
                href="mailto:info@nylag.org"
                className="text-[var(--nylag-primary-blue)] hover:text-nylag-orange transition-colors duration-200 font-medium"
              >
                info@nylag.org
              </a>
            </div>
          </address>
        </div>
      </div>
    </footer>
  )
}
