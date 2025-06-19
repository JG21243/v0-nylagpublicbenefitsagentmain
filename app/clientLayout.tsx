"use client"

import React from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useState } from "react"

export default function ClientLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)

  const handleSessionSelect = (sessionId: string) => {
    setCurrentSessionId(sessionId)
    // You could also use URL routing here
    // router.push(`/chat/${sessionId}`)
  }

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="font-serif">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <SidebarProvider>
            <AppSidebar currentSessionId={currentSessionId} onSessionSelect={handleSessionSelect} />
            <div className="flex-1 flex flex-col min-h-screen">
              <Header />
              {React.cloneElement(children as React.ReactElement, {
                currentSessionId,
                onSessionSelect: handleSessionSelect,
              })}
              <Footer />
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
