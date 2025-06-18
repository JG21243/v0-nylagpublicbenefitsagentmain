"use client"
import { useChat } from "@ai-sdk/react"
import ReactMarkdown from "react-markdown"
import { Input } from "@/components/ui/input"
import { IconButton } from "@/components/ui/icon-button"

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({ api: "/api/chat" })

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
              <strong className="font-medium">Error:</strong> {error.message || "An error occurred"}
            </div>
          )}

          {messages.length === 0 && !isLoading && (
            <div className="text-center text-gray-500 py-8 sm:py-12">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">💼</div>
              <p className="text-base sm:text-lg font-medium mb-2">Ready to help with legal research</p>
              <p className="text-sm sm:text-base text-gray-400">
                Ask a question about public benefits law to get started
              </p>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] sm:max-w-[80%] lg:max-w-[75%] ${
                  m.role === "user"
                    ? "bg-nylag-primary-blue text-white rounded-2xl rounded-br-md"
                    : "bg-gray-50 text-gray-900 rounded-2xl rounded-bl-md border border-gray-100"
                } p-3 sm:p-4 shadow-sm`}
              >
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
            <div className="flex justify-start">
              <div className="bg-gray-50 rounded-2xl rounded-bl-md p-3 sm:p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center space-x-2 text-gray-500">
                  <div className="flex space-x-1">
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
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Enter your research query..."
            aria-label="Research query"
            disabled={isLoading}
            className="w-full h-12 sm:h-14 text-base sm:text-lg px-4 sm:px-6 rounded-xl border-2 border-gray-200 focus:border-nylag-primary-blue focus:ring-2 focus:ring-nylag-primary-blue/20 transition-all duration-200"
          />
        </div>
        <IconButton
          type="submit"
          disabled={isLoading || !input.trim()}
          icon={isLoading ? "loading" : "send"}
          tooltip={isLoading ? "Processing your legal research query..." : "Send your query"}
          aria-label="Send query"
          className="h-12 sm:h-14 px-6 sm:px-8 rounded-xl text-base sm:text-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="hidden sm:inline">{isLoading ? "Processing..." : "Send Query"}</span>
          <span className="sm:hidden">{isLoading ? "..." : "Send"}</span>
        </IconButton>
      </form>

      {/* Helper Text */}
      <div className="text-center">
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
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
