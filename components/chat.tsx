"use client"
import { useChat } from "@ai-sdk/react"
import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import ReactMarkdown from "react-markdown"
import { Input } from "@/components/ui/input"
import { IconButton } from "@/components/ui/icon-button"
import { Button } from "@/components/ui/button"
import { useChatSessions } from "@/lib/hooks/use-chat-sessions"
import { ResearchProgressAdvanced } from "@/components/research-progress-advanced"
import { Copy, Share, Bookmark, RefreshCw } from "lucide-react"

interface ChatProps {
  sessionId?: string | null
  onSessionCreated?: (sessionId: string) => void
}

export function Chat({ sessionId, onSessionCreated }: ChatProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, reload } = useChat({
    api: "/api/chat",
    body: { sessionId },
  })

  const { createSession } = useChatSessions()
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(sessionId || null)
  const [researchMetrics, setResearchMetrics] = useState({
    currentPhase: "",
    searchCount: 0,
    totalSearches: 0,
    qualityScore: 0,
    timeElapsed: 0,
  })
  const [startTime, setStartTime] = useState<number | null>(null)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout>()

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Timer for elapsed time
  useEffect(() => {
    if (isLoading && !startTime) {
      setStartTime(Date.now())
      timerRef.current = setInterval(() => {
        setResearchMetrics((prev) => ({
          ...prev,
          timeElapsed: Math.floor((Date.now() - Date.now()) / 1000),
        }))
      }, 1000)
    } else if (!isLoading && timerRef.current) {
      clearInterval(timerRef.current)
      setStartTime(null)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isLoading, startTime])

  // Parse research progress from streaming messages
  useEffect(() => {
    if (isLoading && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === "assistant") {
        const content = lastMessage.content.toLowerCase()

        // Extract current phase
        if (content.includes("phase 1") || content.includes("planning")) {
          setResearchMetrics((prev) => ({ ...prev, currentPhase: "planning" }))
        } else if (content.includes("phase 2") || content.includes("search")) {
          setResearchMetrics((prev) => ({ ...prev, currentPhase: "searching" }))
        } else if (content.includes("phase 3") || content.includes("analysis")) {
          setResearchMetrics((prev) => ({ ...prev, currentPhase: "analyzing" }))
        } else if (content.includes("phase 4") || content.includes("report")) {
          setResearchMetrics((prev) => ({ ...prev, currentPhase: "generating" }))
        }

        // Extract search progress
        const searchMatch = content.match(/search (\d+)\/(\d+)/i)
        if (searchMatch) {
          setResearchMetrics((prev) => ({
            ...prev,
            searchCount: Number.parseInt(searchMatch[1]),
            totalSearches: Number.parseInt(searchMatch[2]),
          }))
        }

        // Extract quality score
        const qualityMatch = content.match(/quality score[:\s]*(\d+)/i)
        if (qualityMatch) {
          setResearchMetrics((prev) => ({ ...prev, qualityScore: Number.parseInt(qualityMatch[1]) }))
        }
      }
    }
  }, [messages, isLoading])

  // Listen for query insertion from sidebar
  useEffect(() => {
    const handleInsertQuery = (event: CustomEvent) => {
      const { query } = event.detail
      handleInputChange({ target: { value: query } } as React.ChangeEvent<HTMLInputElement>)
    }

    window.addEventListener("insertQuery", handleInsertQuery as EventListener)
    return () => window.removeEventListener("insertQuery", handleInsertQuery as EventListener)
  }, [handleInputChange])

  // Create a new session when the first message is sent
  const handleFormSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!input?.trim()) return

      // Reset metrics
      setResearchMetrics({
        currentPhase: "",
        searchCount: 0,
        totalSearches: 0,
        qualityScore: 0,
        timeElapsed: 0,
      })

      // If no current session, create one
      if (!currentSessionId && input?.trim()) {
        try {
          const title = input.length > 50 ? `${input.substring(0, 50)}...` : input
          const newSession = await createSession(title)
          setCurrentSessionId(newSession.id)
          onSessionCreated?.(newSession.id)
        } catch (error) {
          console.error("Failed to create session:", error)
        }
      }

      handleSubmit(e)
    },
    [input, currentSessionId, createSession, handleSubmit, onSessionCreated],
  )

  // Copy message to clipboard
  const copyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  // Update session ID when prop changes
  useEffect(() => {
    setCurrentSessionId(sessionId || null)
  }, [sessionId])

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 sm:space-y-6">
      {/* Chat Messages Container */}
      <div
        className="w-full h-[50vh] sm:h-[60vh] lg:h-[65vh] overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-sm"
        role="log"
        aria-live="polite"
        aria-busy={isLoading}
      >
        <div className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-md text-sm sm:text-base">
              <div className="flex items-center justify-between">
                <div>
                  <strong className="font-medium">Research Error:</strong> {error.message || "An error occurred"}
                </div>
                <Button variant="ghost" size="sm" onClick={() => reload()} className="text-red-600 hover:text-red-700">
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Retry
                </Button>
              </div>
            </div>
          )}

          {messages.length === 0 && !isLoading && (
            <div className="text-center text-gray-500 py-8 sm:py-12">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">⚖️</div>
              <p className="text-base sm:text-lg font-medium mb-2">NYLAG Legal Research Assistant</p>
              <p className="text-sm sm:text-base text-gray-400 mb-4">
                Ask questions about public benefits law to get comprehensive research memos
              </p>
              {currentSessionId && (
                <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                  Session: {currentSessionId.substring(0, 8)}...
                </div>
              )}
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] sm:max-w-[80%] lg:max-w-[75%] ${
                  m.role === "user"
                    ? "bg-nylag-primary-blue text-white rounded-2xl rounded-br-md"
                    : "bg-gray-50 text-gray-900 rounded-2xl rounded-bl-md border border-gray-100"
                } p-3 sm:p-4 shadow-sm group relative`}
              >
                {m.role === "user" ? (
                  <p className="text-sm sm:text-base break-words leading-relaxed">{m.content}</p>
                ) : (
                  <>
                    <div className="prose prose-sm sm:prose-base max-w-none break-words">
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => (
                            <h1 className="text-lg sm:text-xl font-bold text-nylag-primary-blue mb-3 border-b border-gray-200 pb-2">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 mt-4">{children}</h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-1 mt-3">{children}</h3>
                          ),
                          p: ({ children }) => <p className="text-sm sm:text-base leading-relaxed mb-2">{children}</p>,
                          ul: ({ children }) => (
                            <ul className="list-disc list-inside space-y-1 mb-2 text-sm sm:text-base pl-4">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal list-inside space-y-1 mb-2 text-sm sm:text-base pl-4">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                          strong: ({ children }) => (
                            <strong className="font-semibold text-nylag-primary-blue">{children}</strong>
                          ),
                          code: ({ children }) => (
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm font-mono border">
                              {children}
                            </code>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-nylag-primary-blue pl-4 italic text-gray-700 my-2">
                              {children}
                            </blockquote>
                          ),
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>

                    {/* Message actions */}
                    <div className="flex items-center justify-end space-x-2 mt-3 pt-2 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyMessage(m.content, `msg-${i}`)}
                        className="h-6 px-2 text-xs"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        {copiedMessageId === `msg-${i}` ? "Copied!" : "Copy"}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        <Bookmark className="w-3 h-3 mr-1" />
                        Save
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        <Share className="w-3 h-3 mr-1" />
                        Share
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <ResearchProgressAdvanced
              isVisible={isLoading}
              currentPhase={researchMetrics.currentPhase}
              searchCount={researchMetrics.searchCount}
              totalSearches={researchMetrics.totalSearches}
              qualityScore={researchMetrics.qualityScore}
              timeElapsed={researchMetrics.timeElapsed}
            />
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Enhanced Input Form */}
      <form onSubmit={handleFormSubmit} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Enter your legal research query (e.g., 'SNAP work requirements for students')"
              aria-label="Research query"
              disabled={isLoading}
              className="w-full h-12 sm:h-14 text-base sm:text-lg px-4 sm:px-6 rounded-xl border-2 border-gray-200 focus:border-nylag-primary-blue focus:ring-2 focus:ring-nylag-primary-blue/20 transition-all duration-200"
            />
          </div>
          <IconButton
            type="submit"
            disabled={isLoading || !input?.trim()}
            icon={isLoading ? "loading" : "send"}
            tooltip={isLoading ? "Processing your legal research query..." : "Send your query"}
            aria-label="Send query"
            className="h-12 sm:h-14 px-6 sm:px-8 rounded-xl text-base sm:text-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="hidden sm:inline">{isLoading ? "Researching..." : "Send Query"}</span>
            <span className="sm:hidden">{isLoading ? "..." : "Send"}</span>
          </IconButton>
        </div>

        {/* Quick action buttons */}
        {!isLoading && messages.length === 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              "SNAP eligibility requirements",
              "Medicaid coverage rules",
              "Housing assistance programs",
              "SSI application process",
            ].map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => handleInputChange({ target: { value: suggestion } } as any)}
                className="text-xs hover:bg-nylag-primary-blue hover:text-white transition-colors"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        )}
      </form>

      {/* Enhanced Helper Text */}
      <div className="text-center space-y-2">
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          🎯 <strong>Specialized in:</strong> SNAP, Medicaid, TANF, Housing, SSI/SSDI, and other public benefits
          <br className="hidden sm:inline" />
          <span className="block sm:inline mt-1 sm:mt-0 sm:ml-1">
            📚 <strong>Sources:</strong> Federal/State statutes, regulations, case law, and agency guidance
          </span>
        </p>
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
          <span>⚡ AI-Powered</span>
          <span>•</span>
          <span>🔒 Secure</span>
          <span>•</span>
          <span>⚖️ Legal-Grade</span>
        </div>
      </div>
    </div>
  )
}
