import { useEffect, useRef } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { cn } from "@workspace/ui/lib/utils"

type JsonOutputCardProps = Readonly<{
  title: string
  description: string
  value: string
  copyLabel: string
  copiedLabel: string
  textareaClassName?: string
}>

function JsonOutputCard({
  title,
  description,
  value,
  copyLabel,
  copiedLabel,
  textareaClassName,
}: JsonOutputCardProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const textarea = textareaRef.current

    if (!textarea) {
      return
    }

    textarea.style.height = "auto"
    textarea.style.height = `${textarea.scrollHeight + 2}px`
  }, [value])

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent>
        <Textarea
          ref={textareaRef}
          aria-label={title}
          dir="ltr"
          readOnly
          translate="no"
          value={value}
          className={cn(
            "[field-sizing:fixed] resize-none overflow-hidden text-left font-mono text-sm",
            textareaClassName
          )}
        />
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="justify-end border-t">
        <ToolCopyButton
          value={value}
          copyLabel={copyLabel}
          copiedLabel={copiedLabel}
        />
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { JsonOutputCard }
