import type React from 'react'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export const metadata = {
  title: {
    default: 'NYLAG Public Benefits Research Agent',
    template: '%s | NYLAG Research Agent',
  },
  description: 'AI-powered legal research tool for public benefits law - NYLAG',
  keywords: ['legal research', 'public benefits', 'NYLAG', 'AI assistant'],
  authors: [{ name: 'NYLAG' }],
  creator: 'New York Legal Assistance Group',
  publisher: 'NYLAG',
  robots: {
    index: false, // Internal tool
    follow: false,
  },
    generator: 'v0.dev'
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="font-serif">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {/* Skip Navigation Link */}
          <a 
            href="#main-content" 
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-nylag-primary-blue text-white px-4 py-2 rounded-md text-sm font-medium z-50 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-nylag-primary-blue"
          >
            Skip to main content
          </a>
          <Header />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
