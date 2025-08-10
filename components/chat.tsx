"use client"
import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import ReactMarkdown from "react-markdown"
import { Input } from "@/components/ui/input"
import { IconButton } from "@/components/ui/icon-button"

export function Chat() {
  const [inputValue, setInputValue] = useState("")
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({ 
    api: "/api/chat"
  })

  // Use local state if useChat doesn't provide input properly
  const effectiveInput = input !== undefined ? input : inputValue
  const effectiveHandleInputChange = handleInputChange || ((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  })

  const effectiveHandleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (handleSubmit && input !== undefined) {
      handleSubmit(e)
    } else {
      // Fallback submission logic
      if (inputValue.trim()) {
        console.log("Would submit:", inputValue)
        // TODO: Implement fallback API call
      }
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 sm:space-y-6">
      {/* Chat Header with Actions */}
      {messages.length > 0 && (
        <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <span className="text-sm text-gray-600 font-medium">
            {messages.length} message{messages.length !== 1 ? 's' : ''} in conversation
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                navigator.clipboard?.writeText(
                  messages.map(m => `${m.role === 'user' ? 'Q: ' : 'A: '}${m.content}`).join('\n\n')
                )
                // TODO: Add toast notification
              }}
              className="px-3 py-1 text-xs bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200 focus:ring-2 focus:ring-nylag-primary-blue focus:ring-offset-1"
              aria-label="Copy conversation to clipboard"
            >
              Copy
            </button>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear this conversation?')) {
                  // TODO: Implement clear functionality
                  window.location.reload()
                }
              }}
              className="px-3 py-1 text-xs bg-white border border-gray-300 rounded-md hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors duration-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
              aria-label="Clear conversation"
            >
              Clear
            </button>
          </div>
        </div>
      )}
      {/* Chat Messages Container */}
      <div
        className="w-full h-[50vh] sm:h-[60vh] lg:h-[65vh] mobile-chat overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
        role="log"
        aria-live="polite"
        aria-busy={isLoading}
        aria-label="Legal research conversation"
        aria-describedby="chat-description"
      >
        <div className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4">
          {error && (
            <div 
              className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-md text-sm sm:text-base"
              role="alert"
              aria-live="assertive"
            >
              <strong className="font-medium">Error:</strong> {error.message || "An error occurred"}
            </div>
          )}

          {messages.length === 0 && !isLoading && (
            <div className="text-center text-gray-500 py-8 sm:py-12 fade-in" role="status">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 pulse-subtle" aria-hidden="true">💼</div>
              <p className="text-base sm:text-lg font-medium mb-2 text-gray-700">Ready to help with legal research</p>
              <p className="text-sm sm:text-base text-gray-400 mb-6" id="chat-description">
                Ask a question about public benefits law to get started
              </p>
              
              {/* Sample Questions for better UX */}
              <div className="mt-6 space-y-3 slide-up">
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-3">Try asking about:</p>
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                  {["SNAP income limits", "Medicaid eligibility", "Housing assistance", "SSI/SSDI benefits"].map((sample, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInputValue(sample + " - what are the requirements?")
                      }}
                      className="px-4 py-3 text-xs sm:text-sm bg-gradient-to-r from-gray-100 to-gray-50 hover:from-nylag-primary-blue hover:to-blue-500 hover:text-white rounded-full transition-all duration-300 border border-gray-200 hover:border-nylag-primary-blue shadow-sm hover:shadow-md transform hover:scale-105 button-hover-lift touch-target"
                      aria-label={`Ask about ${sample}`}
                    >
                      {sample}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} group`}>
              <div
                className={`relative max-w-[85%] sm:max-w-[80%] lg:max-w-[75%] ${
                  m.role === "user"
                    ? "bg-nylag-primary-blue text-white rounded-2xl rounded-br-md"
                    : "bg-gray-50 text-gray-900 rounded-2xl rounded-bl-md border border-gray-100"
                } p-3 sm:p-4 shadow-sm transition-all duration-200 hover:shadow-md message-enter`}
                role={m.role === "assistant" ? "article" : undefined}
                aria-label={m.role === "user" ? "Your question" : "AI response"}
              >
                {/* Copy button for messages */}
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(m.content)
                    // TODO: Add toast notification
                  }}
                  className={`absolute top-2 right-2 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100 ${
                    m.role === "user" 
                      ? "bg-white/20 hover:bg-white/30 text-white" 
                      : "bg-gray-200 hover:bg-gray-300 text-gray-600"
                  }`}
                  aria-label="Copy message"
                  title="Copy message"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                {m.role === "user" ? (
                  <p className="text-sm sm:text-base break-words leading-relaxed">{m.content}</p>
                ) : (
                  <div className="prose prose-sm sm:prose-base max-w-none break-words">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-lg sm:text-xl font-bold text-nylag-primary-blue mb-2">{children}</h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 mt-4">{children}</h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-1 mt-3">{children}</h3>
                        ),
                        p: ({ children }) => <p className="text-sm sm:text-base leading-relaxed mb-2">{children}</p>,
                        ul: ({ children }) => (
                          <ul className="list-disc list-inside space-y-1 mb-2 text-sm sm:text-base">{children}</ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal list-inside space-y-1 mb-2 text-sm sm:text-base">{children}</ol>
                        ),
                        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                        strong: ({ children }) => (
                          <strong className="font-semibold text-nylag-primary-blue">{children}</strong>
                        ),
                        code: ({ children }) => (
                          <code className="bg-gray-100 px-1 py-0.5 rounded text-xs sm:text-sm font-mono">
                            {children}
                          </code>
                        ),
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start" role="status" aria-live="polite">
              <div className="bg-gray-50 rounded-2xl rounded-bl-md p-3 sm:p-4 border border-gray-100 shadow-sm transition-all duration-200">
                <div className="flex items-center space-x-2 text-gray-500">
                  <div className="flex space-x-1" aria-hidden="true">
                    <div className="w-2 h-2 bg-nylag-primary-blue rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-nylag-primary-blue rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-nylag-primary-blue rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-sm sm:text-base">Processing your legal research query...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={effectiveHandleSubmit} className="flex flex-col sm:flex-row gap-4 sm:gap-4 mobile-form fade-in" role="search" aria-label="Legal research query form">
        <div className="flex-1 form-field">
          <label htmlFor="research-input" className="sr-only">Enter your legal research query</label>
          <Input
            id="research-input"
            value={effectiveInput}
            onChange={effectiveHandleInputChange}
            placeholder="Enter your research query..."
            aria-label="Research query"
            aria-describedby="helper-text"
            disabled={isLoading}
            className="w-full h-14 sm:h-14 text-base mobile-friendly-text px-4 sm:px-6 rounded-xl border-2 border-gray-200 focus:border-nylag-primary-blue focus:ring-2 focus:ring-nylag-primary-blue/20 transition-all duration-300 shadow-sm hover:shadow-md"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                if (effectiveInput?.trim()) {
                  effectiveHandleSubmit(e as any)
                }
              }
            }}
          />
        </div>
        <IconButton
          type="submit"
          disabled={isLoading || !effectiveInput?.trim()}
          icon={isLoading ? "loading" : "send"}
          tooltip={isLoading ? "Processing your legal research query..." : "Send your query"}
          aria-label="Send query"
          className="h-14 w-full sm:w-auto sm:h-14 px-6 sm:px-8 rounded-xl text-base sm:text-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-nylag-primary-blue focus:ring-offset-2 button-hover-lift touch-target"
        >
          <span className="hidden sm:inline">{isLoading ? "Processing..." : "Send Query"}</span>
          <span className="sm:hidden">{isLoading ? "..." : "Send"}</span>
        </IconButton>
      </form>

      {/* Helper Text */}
      <div className="text-center">
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed" id="helper-text">
          Ask about SNAP, Medicaid, housing assistance, SSI/SSDI, or other public benefits programs.
          <br className="hidden sm:inline" />
          <span className="block sm:inline mt-1 sm:mt-0 sm:ml-1">
            The AI will search legal sources and provide research summaries.
          </span>
        </p>
      </div>
    </div>
  )
}
