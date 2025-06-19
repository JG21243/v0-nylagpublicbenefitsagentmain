"use client"

import { useState } from "react"
import { Chat } from "@/components/chat"
import { SectionHeader } from "@/components/section-header"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

export default function Page() {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)

  const handleSessionCreated = (sessionId: string) => {
    setCurrentSessionId(sessionId)
  }

  const handleSessionSelected = (sessionId: string) => {
    setCurrentSessionId(sessionId)
  }

  return (
    <SidebarInset>
      <main className="flex-1 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center gap-4 mb-4 sm:mb-6">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black font-sans text-nylag-primary-blue leading-tight">
                NYLAG Public Benefits Research Agent
              </h1>
            </div>
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
            <SectionHeader className="no-print mb-6 sm:mb-8">
              {currentSessionId ? `Research Session: ${currentSessionId.substring(0, 8)}...` : "Ask a Question"}
            </SectionHeader>
            <Chat sessionId={currentSessionId} onSessionCreated={handleSessionCreated} />
          </div>
        </div>
      </main>
    </SidebarInset>
  )
}
