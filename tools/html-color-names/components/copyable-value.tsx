import { useEffect, useState } from "react"

import { Check, Copy } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

type CopyableValueProps = Readonly<{
  ariaLabel: string
  value: string
}>

function CopyableValue({ ariaLabel, value }: CopyableValueProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setCopied(false)
    }, 1500)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [copied])

  async function handleClick() {
    await navigator.clipboard.writeText(value)
    setCopied(true)
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      data-state={copied ? "copied" : "idle"}
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-1 font-mono text-xs transition-colors hover:bg-muted sm:text-sm",
        copied ? "text-foreground" : "text-muted-foreground"
      )}
      onClick={() => {
        void handleClick()
      }}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      <span>{value}</span>
    </button>
  )
}

export { CopyableValue }
