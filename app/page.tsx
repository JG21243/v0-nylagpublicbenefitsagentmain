import { Chat } from "@/components/chat"
import { SectionHeader } from "@/components/section-header"

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black font-sans text-nylag-primary-blue mb-4 sm:mb-6 leading-tight">
            NYLAG Public Benefits Research Agent
          </h1>
          <div className="max-w-4xl mx-auto">
            <div className="content-box text-left text-sm sm:text-base lg:text-lg leading-relaxed">
              This assistant searches statutes, regulations, case law and policy guidance to generate short research
              summaries. Ask questions about SNAP, Medicaid, housing assistance, SSI/SSDI and other public benefits
              programs.
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <div className="max-w-5xl mx-auto">
          <SectionHeader className="no-print mb-6 sm:mb-8">Ask a Question</SectionHeader>
          <Chat />
        </div>
      </div>
    </main>
  )
}
