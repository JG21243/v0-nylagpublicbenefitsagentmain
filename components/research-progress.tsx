"use client"

import { useState, useEffect } from "react"
import { Search, FileText, Brain, CheckCircle } from "lucide-react"

interface ResearchProgressProps {
  isVisible: boolean
}

export function ResearchProgress({ isVisible }: ResearchProgressProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const steps = [
    {
      icon: Search,
      title: "Planning Research Strategy",
      description: "Analyzing query and identifying key legal concepts",
      duration: 3000,
    },
    {
      icon: FileText,
      title: "Searching Legal Sources",
      description: "Querying federal and state legal databases",
      duration: 15000,
    },
    {
      icon: Brain,
      title: "Analyzing Legal Authorities",
      description: "Synthesizing statutes, regulations, and case law",
      duration: 10000,
    },
    {
      icon: CheckCircle,
      title: "Generating Research Memo",
      description: "Creating comprehensive legal analysis",
      duration: 8000,
    },
  ]

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0)
      setProgress(0)
      return
    }

    let stepTimer: NodeJS.Timeout
    let progressTimer: NodeJS.Timeout

    const startStep = (stepIndex: number) => {
      if (stepIndex >= steps.length) return

      setCurrentStep(stepIndex)
      setProgress(0)

      const stepDuration = steps[stepIndex].duration
      const progressInterval = stepDuration / 100

      progressTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressTimer)
            return 100
          }
          return prev + 1
        })
      }, progressInterval)

      stepTimer = setTimeout(() => {
        if (stepIndex < steps.length - 1) {
          startStep(stepIndex + 1)
        }
      }, stepDuration)
    }

    startStep(0)

    return () => {
      clearTimeout(stepTimer)
      clearInterval(progressTimer)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="bg-gray-50 rounded-2xl rounded-bl-md p-4 border border-gray-100 shadow-sm max-w-[85%] sm:max-w-[80%]">
      <div className="space-y-4">
        {/* Current step indicator */}
        <div className="flex items-center space-x-3">
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
          <span className="text-sm font-medium text-gray-700">Legal Research in Progress</span>
        </div>

        {/* Steps list */}
        <div className="space-y-3">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = index === currentStep
            const isCompleted = index < currentStep
            const isPending = index > currentStep

            return (
              <div
                key={index}
                className={`flex items-center space-x-3 transition-all duration-300 ${
                  isActive ? "text-nylag-primary-blue" : isCompleted ? "text-green-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                    isActive
                      ? "bg-nylag-primary-blue/10 border-2 border-nylag-primary-blue"
                      : isCompleted
                        ? "bg-green-100 border-2 border-green-500"
                        : "bg-gray-100 border-2 border-gray-300"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${isActive ? "animate-pulse" : ""}`}>{step.title}</div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                  {isActive && (
                    <div className="mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div
                          className="bg-nylag-primary-blue h-1 rounded-full transition-all duration-100"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                {isCompleted && <CheckCircle className="w-4 h-4 text-green-500" />}
              </div>
            )
          })}
        </div>

        {/* Estimated time */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <div className="text-xs text-blue-700">
            <div className="font-medium mb-1">⏱️ Estimated Time: 30-60 seconds</div>
            <div>
              The agent searches comprehensive legal databases including federal and state statutes, regulations, case
              law, and agency guidance documents.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
