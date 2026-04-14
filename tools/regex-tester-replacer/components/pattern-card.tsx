import { Checkbox } from "@workspace/ui/components/ui/checkbox"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"

import type { RegexFlag } from "../core/regex-tester-replacer"
import type {
  RegexFlagOption,
  RegexTesterReplacerLocalizedCatalog,
} from "../types"

type PatternCardProps = Readonly<{
  flagOptions: readonly RegexFlagOption[]
  messages: RegexTesterReplacerLocalizedCatalog
  pattern: string
  patternError: string | null
  patternId: string
  replacement: string
  replacementId: string
  selectedFlags: readonly RegexFlag[]
  onPatternChange: (value: string) => void
  onReplacementChange: (value: string) => void
  onToggleFlag: (flag: RegexFlag, checked: boolean) => void
}>

function PatternCard({
  flagOptions,
  messages,
  pattern,
  patternError,
  patternId,
  replacement,
  replacementId,
  selectedFlags,
  onPatternChange,
  onReplacementChange,
  onToggleFlag,
}: PatternCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.patternTitle}</CardTitle>
        <CardDescription>{messages.patternDescription}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="grid gap-2">
          <label htmlFor={patternId} className="text-sm font-medium">
            {messages.patternLabel}
          </label>
          <Input
            id={patternId}
            aria-invalid={patternError ? true : undefined}
            value={pattern}
            placeholder={messages.patternPlaceholder}
            onChange={(event) => {
              onPatternChange(event.target.value)
            }}
            className="font-mono text-sm"
          />
          {patternError ? (
            <p className="text-sm text-destructive">
              {messages.invalidPatternLabel.replace("{message}", patternError)}
            </p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <label htmlFor={replacementId} className="text-sm font-medium">
            {messages.replacementLabel}
          </label>
          <Input
            id={replacementId}
            value={replacement}
            placeholder={messages.replacementPlaceholder}
            onChange={(event) => {
              onReplacementChange(event.target.value)
            }}
            className="font-mono text-sm"
          />
          <p className="text-sm text-muted-foreground">
            {messages.replacementHint}
          </p>
        </div>

        <div className="grid gap-3">
          <div className="grid gap-1">
            <div className="text-sm font-medium">{messages.flagsLabel}</div>
            <p className="text-sm text-muted-foreground">
              {messages.flagsHint}
            </p>
          </div>

          <div className="grid gap-3">
            {flagOptions.map((option) => (
              <label
                key={option.key}
                className="flex items-center gap-3 text-sm font-medium"
              >
                <Checkbox
                  checked={selectedFlags.includes(option.key)}
                  onCheckedChange={(value) => {
                    onToggleFlag(option.key, value === true)
                  }}
                />
                <span className="font-mono text-xs text-muted-foreground uppercase">
                  {option.key}
                </span>
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { PatternCard }
