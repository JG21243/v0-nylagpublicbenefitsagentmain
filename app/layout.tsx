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
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
