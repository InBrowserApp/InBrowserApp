import { type ChangeEvent, type ReactNode, type RefObject } from "react"

import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { FileText, RefreshCcw, Sparkles } from "@workspace/ui/icons"

type InputCardProps = Readonly<{
  accept: string
  ariaLabel: string
  clearLabel: string
  description: string
  fileInputRef: RefObject<HTMLInputElement | null>
  importFromFileLabel: string
  invalid: boolean
  placeholder: string
  title: string
  useSampleLabel: string
  value: string
  onChange: (value: string) => void
  onClear: () => void
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  onUseSample: () => void
  children?: ReactNode
}>

function InputCard({
  accept,
  ariaLabel,
  children,
  clearLabel,
  description,
  fileInputRef,
  importFromFileLabel,
  invalid,
  placeholder,
  title,
  useSampleLabel,
  value,
  onChange,
  onClear,
  onFileChange,
  onUseSample,
}: InputCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-5">
        <Textarea
          aria-label={ariaLabel}
          aria-invalid={invalid}
          autoCapitalize="off"
          autoCorrect="off"
          dir="ltr"
          spellCheck={false}
          translate="no"
          value={value}
          onChange={(event) => {
            onChange(event.target.value)
          }}
          placeholder={placeholder}
          className="[field-sizing:fixed] min-h-72 resize-y text-left font-mono text-sm"
        />

        {children}
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="flex flex-wrap justify-start gap-3 border-t">
        <Button type="button" variant="ghost" size="sm" onClick={onUseSample}>
          <Sparkles data-icon="inline-start" />
          {useSampleLabel}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          <RefreshCcw data-icon="inline-start" />
          {clearLabel}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            fileInputRef.current?.click()
          }}
        >
          <FileText data-icon="inline-start" />
          {importFromFileLabel}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          aria-hidden="true"
          className="sr-only"
          tabIndex={-1}
          onChange={onFileChange}
        />
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { InputCard }
