"use client"

import { useEffect, useState } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import { Check, Copy } from "@workspace/ui/icons"

type ToolCopyButtonProps = Readonly<{
  value: string
  copyLabel: string
  copiedLabel: string
  failedLabel?: string
  ariaLabel?: string
  className?: string
  disabled?: boolean
  size?: "sm" | "icon-sm"
  variant?: "default" | "outline" | "secondary" | "ghost"
}>

function ToolCopyButton({
  ariaLabel,
  className,
  value,
  copyLabel,
  copiedLabel,
  failedLabel = copyLabel,
  disabled = false,
  size = "sm",
  variant = "outline",
}: ToolCopyButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle")
  const copied = status === "copied"
  const statusLabel = copied
    ? copiedLabel
    : status === "failed"
      ? failedLabel
      : copyLabel

  useEffect(() => {
    if (status === "idle") {
      return
    }

    const timeout = window.setTimeout(() => {
      setStatus("idle")
    }, 1200)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [status])

  async function handleCopy() {
    if (disabled || value.length === 0) {
      return
    }

    try {
      await navigator.clipboard.writeText(value)
      setStatus("copied")
    } catch {
      setStatus("failed")
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      aria-label={
        ariaLabel
          ? status !== "idle"
            ? `${statusLabel}: ${ariaLabel}`
            : ariaLabel
          : undefined
      }
      className={className}
      disabled={disabled || value.length === 0}
      onClick={() => {
        void handleCopy()
      }}
    >
      {copied ? (
        <Check data-icon="inline-start" />
      ) : (
        <Copy data-icon="inline-start" />
      )}
      <span
        aria-atomic="true"
        aria-live="polite"
        className={size === "icon-sm" ? "sr-only" : undefined}
      >
        {statusLabel}
      </span>
    </Button>
  )
}

export { ToolCopyButton }
