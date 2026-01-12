import * as React from "react"
import { Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

export type Priority = "P0" | "P1" | "P2" | "P3"

export interface FeatureInfoProps {
  title: string
  priority: Priority
  description: string
  dataSource: string
  importance: string
  className?: string
}

const priorityConfig: Record<Priority, { label: string; color: string; bgColor: string }> = {
  P0: { label: "P0 - Critical", color: "text-red-700 dark:text-red-300", bgColor: "bg-red-100 dark:bg-red-900/50" },
  P1: { label: "P1 - High", color: "text-orange-700 dark:text-orange-300", bgColor: "bg-orange-100 dark:bg-orange-900/50" },
  P2: { label: "P2 - Medium", color: "text-yellow-700 dark:text-yellow-300", bgColor: "bg-yellow-100 dark:bg-yellow-900/50" },
  P3: { label: "P3 - Low", color: "text-green-700 dark:text-green-300", bgColor: "bg-green-100 dark:bg-green-900/50" },
}

export function FeatureInfo({
  title,
  priority,
  description,
  dataSource,
  importance,
  className,
}: FeatureInfoProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const popoverRef = React.useRef<HTMLDivElement>(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  // Close on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Close on Escape key
  React.useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  const priorityStyle = priorityConfig[priority]

  return (
    <div className={cn("relative inline-flex", className)}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 dark:hover:bg-blue-800/50 transition-colors"
        aria-label={`Info about ${title}`}
      >
        <Info className="h-3 w-3 text-blue-600 dark:text-blue-400" />
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute z-50 top-full left-0 mt-2 w-80 rounded-lg border bg-background shadow-lg animate-in fade-in-0 zoom-in-95"
        >
          {/* Header */}
          <div className="flex items-start justify-between p-3 border-b">
            <div className="flex-1">
              <h4 className="font-semibold text-sm">{title}</h4>
              <span
                className={cn(
                  "inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium",
                  priorityStyle.bgColor,
                  priorityStyle.color
                )}
              >
                {priorityStyle.label}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-sm opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-3 space-y-3 text-sm">
            <div>
              <h5 className="font-medium text-xs text-muted-foreground uppercase tracking-wide mb-1">
                What it does
              </h5>
              <p className="text-foreground">{description}</p>
            </div>

            <div>
              <h5 className="font-medium text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Data Source
              </h5>
              <p className="text-foreground font-mono text-xs bg-muted px-2 py-1 rounded">
                {dataSource}
              </p>
            </div>

            <div>
              <h5 className="font-medium text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Why it's important
              </h5>
              <p className="text-foreground">{importance}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Compact version for inline use
export function FeatureInfoInline({
  title,
  priority,
  description,
  dataSource,
  importance,
  className,
}: FeatureInfoProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const popoverRef = React.useRef<HTMLDivElement>(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  React.useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  const priorityStyle = priorityConfig[priority]

  return (
    <span className={cn("relative inline-flex align-middle", className)}>
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 dark:hover:bg-blue-800/50 transition-colors ml-1"
        aria-label={`Info about ${title}`}
      >
        <Info className="h-2.5 w-2.5 text-blue-600 dark:text-blue-400" />
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute z-50 top-full left-0 mt-1 w-72 rounded-lg border bg-background shadow-lg animate-in fade-in-0 zoom-in-95"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between p-2 border-b">
            <div className="flex-1">
              <h4 className="font-semibold text-xs">{title}</h4>
              <span
                className={cn(
                  "inline-block mt-0.5 px-1.5 py-0.5 rounded text-xs font-medium",
                  priorityStyle.bgColor,
                  priorityStyle.color
                )}
              >
                {priorityStyle.label}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-sm opacity-70 hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
          </div>

          <div className="p-2 space-y-2 text-xs">
            <div>
              <h5 className="font-medium text-muted-foreground uppercase tracking-wide mb-0.5" style={{ fontSize: '10px' }}>
                What it does
              </h5>
              <p>{description}</p>
            </div>

            <div>
              <h5 className="font-medium text-muted-foreground uppercase tracking-wide mb-0.5" style={{ fontSize: '10px' }}>
                Data Source
              </h5>
              <p className="font-mono bg-muted px-1.5 py-0.5 rounded" style={{ fontSize: '10px' }}>
                {dataSource}
              </p>
            </div>

            <div>
              <h5 className="font-medium text-muted-foreground uppercase tracking-wide mb-0.5" style={{ fontSize: '10px' }}>
                Why important
              </h5>
              <p>{importance}</p>
            </div>
          </div>
        </div>
      )}
    </span>
  )
}
