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
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { RefreshCcw, Sparkles } from "@workspace/ui/icons"

import type { JwtDecoderVerifierMessages } from "../client/types"

type TokenCardProps = Readonly<{
  messages: JwtDecoderVerifierMessages["token"]
  invalid: boolean
  value: string
  onChange: (value: string) => void
  onClear: () => void
  onUseSample: () => void
}>

function TokenCard({
  messages,
  invalid,
  value,
  onChange,
  onClear,
  onUseSample,
}: TokenCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.title}</CardTitle>
        <CardDescription>{messages.description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-5">
        <FieldGroup>
          <Field data-invalid={invalid}>
            <FieldLabel htmlFor="jwt-token-input">{messages.label}</FieldLabel>
            <Textarea
              id="jwt-token-input"
              aria-invalid={invalid}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              dir="ltr"
              name="jwt-token"
              spellCheck={false}
              translate="no"
              value={value}
              onChange={(event) => {
                onChange(event.target.value)
              }}
              placeholder={messages.placeholder}
              className="[field-sizing:fixed] min-h-44 resize-y text-left font-mono text-sm"
            />
          </Field>
        </FieldGroup>
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="flex flex-wrap justify-start gap-3 border-t">
        <Button type="button" variant="ghost" size="sm" onClick={onUseSample}>
          <Sparkles data-icon="inline-start" />
          {messages.useSample}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          <RefreshCcw data-icon="inline-start" />
          {messages.clear}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { TokenCard }
