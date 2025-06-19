"use client"

import { useState, useEffect, useRef } from "react"
import { Search, FileText, Brain, CheckCircle, Clock, Database, Scale, AlertCircle, Zap } from "lucide-react"

interface ResearchProgressAdvancedProps {
  isVisible: boolean
  currentPhase?: string
  searchCount?: number
  totalSearches?: number
  qualityScore?: number
  timeElapsed?: number
}

export function ResearchProgressAdvanced({
  isVisible,
  currentPhase,
  searchCount = 0,
  totalSearches = 0,
  qualityScore,
  timeElapsed = 0,
}: ResearchProgressAdvancedProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [animatedSearchCount, setAnimatedSearchCount] = useState(0)
  const [showMetrics, setShowMetrics] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout>()

  const steps = [
    {
      id: "planning",
      icon: Search,
      title: "Research Planning",
      description: "Analyzing query and mapping legal concepts",
      color: "blue",
      duration: 3000,
      details: ["Identifying key legal terms", "Mapping relevant jurisdictions", "Planning search strategy"],
    },
    {
      id: "searching",
      icon: Database,
      title: "Legal Database Search",
      description: "Querying authoritative legal sources",
      color: "purple",
      duration: 15000,
      details: ["Federal statutes & regulations", "State laws & policies", "Case law & precedents", "Agency guidance"],
    },
    {
      id: "analyzing",
      icon: Brain,
      title: "Legal Analysis",
      description: "Processing and synthesizing findings",
      color: "green",
      duration: 10000,
      details: ["Analyzing legal authorities", "Identifying conflicts", "Assessing precedents", "Evaluating currency"],
    },
    {
      id: "generating",
      icon: FileText,
      title: "Report Generation",
      description: "Creating comprehensive legal memo",
      color: "orange",
      duration: 8000,
      details: ["Structuring analysis", "Citing authorities", "Quality review", "Final formatting"],
    },
  ]

  // Animate search count
  useEffect(() => {
    if (searchCount > animatedSearchCount) {
      const increment = Math.ceil((searchCount - animatedSearchCount) / 10)
      intervalRef.current = setInterval(() => {
        setAnimatedSearchCount((prev) => {
          const next = prev + increment
          if (next >= searchCount) {
            clearInterval(intervalRef.current)
            return searchCount
          }
          return next
        })
      }, 50)
    }
    return () => clearInterval(intervalRef.current)
  }, [searchCount, animatedSearchCount])

  // Show metrics after a delay
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShowMetrics(true), 2000)
      return () => clearTimeout(timer)
    } else {
      setShowMetrics(false)
    }
  }, [isVisible])

  // Update current step based on phase
  useEffect(() => {
    if (currentPhase) {
      const stepIndex = steps.findIndex((step) => currentPhase.toLowerCase().includes(step.id))
      if (stepIndex !== -1) {
        setCurrentStep(stepIndex)
      }
    }
  }, [currentPhase])

  // Auto-progress simulation when no real progress data
  useEffect(() => {
    if (!isVisible || currentPhase) return

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
          return prev + 2
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
  }, [isVisible, currentPhase])

  if (!isVisible) return null

  const currentStepData = steps[currentStep]
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl rounded-bl-md p-6 border border-gray-200 shadow-lg max-w-[90%] sm:max-w-[85%]">
      {/* Header with live metrics */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-3 h-3 bg-nylag-primary-blue rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-3 h-3 bg-nylag-primary-blue rounded-full animate-ping opacity-75"></div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Legal Research in Progress</h3>
            <p className="text-sm text-gray-500">Comprehensive analysis underway</p>
          </div>
        </div>

        {showMetrics && (
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1 text-blue-600">
              <Clock className="w-3 h-3" />
              <span>{formatTime(timeElapsed)}</span>
            </div>
            {totalSearches > 0 && (
              <div className="flex items-center space-x-1 text-purple-600">
                <Database className="w-3 h-3" />
                <span>
                  {animatedSearchCount}/{totalSearches}
                </span>
              </div>
            )}
            {qualityScore && (
              <div className="flex items-center space-x-1 text-green-600">
                <Scale className="w-3 h-3" />
                <span>{qualityScore}/10</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Current step highlight */}
      <div className="mb-6 p-4 bg-gradient-to-r from-nylag-primary-blue/5 to-transparent rounded-lg border-l-4 border-nylag-primary-blue">
        <div className="flex items-center space-x-3 mb-2">
          <currentStepData.icon className="w-5 h-5 text-nylag-primary-blue animate-pulse" />
          <div>
            <h4 className="font-semibold text-gray-800">{currentStepData.title}</h4>
            <p className="text-sm text-gray-600">{currentStepData.description}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-nylag-primary-blue to-blue-400 h-2 rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Current step details */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          {currentStepData.details.map((detail, index) => (
            <div
              key={index}
              className={`text-xs p-2 rounded ${
                index <= (progress / 25)
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-gray-50 text-gray-500"
              } transition-all duration-500`}
            >
              <div className="flex items-center space-x-1">
                {index <= progress / 25 ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <div className="w-3 h-3 border border-current rounded-full opacity-50"></div>
                )}
                <span>{detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All steps overview */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isActive = index === currentStep
          const isCompleted = index < currentStep
          const isPending = index > currentStep

          return (
            <div
              key={index}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-500 ${
                isActive
                  ? "bg-blue-50 border border-blue-200 shadow-sm"
                  : isCompleted
                    ? "bg-green-50 border border-green-200"
                    : "bg-gray-50 border border-gray-200 opacity-60"
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? "bg-nylag-primary-blue text-white shadow-lg scale-110"
                    : isCompleted
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-500"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Icon className={`w-4 h-4 ${isActive ? "animate-pulse" : ""}`} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div
                  className={`text-sm font-medium ${isActive ? "text-blue-700" : isCompleted ? "text-green-700" : "text-gray-500"}`}
                >
                  {step.title}
                </div>
                <div className="text-xs text-gray-500">{step.description}</div>
              </div>

              {isActive && (
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-yellow-500 animate-bounce" />
                  <span className="text-xs font-medium text-blue-600">Active</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer with tips and estimated time */}
      <div className="mt-6 space-y-3">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-700">
              <div className="font-medium mb-1">💡 Research Quality Assurance</div>
              <div className="space-y-1">
                <p>• Searching 50+ authoritative legal databases</p>
                <p>• Cross-referencing federal and state authorities</p>
                <p>• Automated quality review and fact-checking</p>
                <p>• Citation verification and currency checking</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span>⏱️ Est. Time: 30-90 seconds</span>
            <span>🎯 Accuracy: 95%+</span>
            <span>📚 Sources: Legal databases</span>
          </div>
          <div className="text-right">
            <div>Powered by AI + Legal Expertise</div>
          </div>
        </div>
      </div>
    </div>
  )
}
