"use client"

import { useEffect, useState } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import { Check, Copy } from "@workspace/ui/icons"

type ToolCopyButtonProps = Readonly<{
  value: string
  copyLabel: string
  copiedLabel: string
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
  disabled = false,
  size = "sm",
  variant = "outline",
}: ToolCopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const statusLabel = copied ? copiedLabel : copyLabel

  useEffect(() => {
    if (!copied) {
      return
    }

    const timeout = window.setTimeout(() => {
      setCopied(false)
    }, 1200)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [copied])

  async function handleCopy() {
    if (disabled || value.length === 0) {
      return
    }

    await navigator.clipboard.writeText(value)
    setCopied(true)
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      aria-label={
        ariaLabel
          ? copied
            ? `${copiedLabel}: ${ariaLabel}`
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
      {size === "icon-sm" ? (
        <span className="sr-only">{statusLabel}</span>
      ) : (
        statusLabel
      )}
    </Button>
  )
}

export { ToolCopyButton }
