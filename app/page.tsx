import { Chat } from "@/components/chat"
import { SectionHeader } from "@/components/section-header"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white gradient-mesh">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Hero Section */}
        <header className="text-center mb-8 sm:mb-12 fade-in">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black font-sans text-nylag-primary-blue mb-4 sm:mb-6 leading-tight hover:scale-105 transition-transform duration-200">
            NYLAG Public Benefits Research Agent
          </h1>
          <div className="max-w-4xl mx-auto slide-up">
            <div className="content-box text-left text-sm sm:text-base lg:text-lg leading-relaxed shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-nylag-primary-blue rounded-full flex items-center justify-center text-white text-sm font-bold">
                  i
                </div>
                <div>
                  This assistant searches statutes, regulations, case law and policy guidance to generate short research
                  summaries. Ask questions about <strong className="text-nylag-primary-blue">SNAP</strong>, <strong className="text-nylag-primary-blue">Medicaid</strong>, <strong className="text-nylag-primary-blue">housing assistance</strong>, <strong className="text-nylag-primary-blue">SSI/SSDI</strong> and other public benefits
                  programs.
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Chat Section */}
        <section className="max-w-5xl mx-auto slide-up">
          <SectionHeader className="no-print mb-6 sm:mb-8">Ask a Question</SectionHeader>
          <Chat />
        </section>
      </div>
    </div>
  )
}
