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
import { Field, FieldError } from "@workspace/ui/components/ui/field"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Globe } from "@workspace/ui/icons"

import type { UserAgentParserMessages } from "../client/types"

type UserAgentInputCardProps = Readonly<{
  canUseCurrent: boolean
  messages: UserAgentParserMessages
  showInputError: boolean
  userAgent: string
  onUseCurrent: () => void
  onUserAgentChange: (value: string) => void
}>

function UserAgentInputCard({
  canUseCurrent,
  messages,
  showInputError,
  userAgent,
  onUseCurrent,
  onUserAgentChange,
}: UserAgentInputCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages["input-label"]}</CardTitle>
        <CardDescription>{messages.meta.description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <Field
          className="min-h-0 flex-1"
          data-invalid={showInputError || undefined}
        >
          <Textarea
            aria-invalid={showInputError}
            aria-label={messages["input-label"]}
            className="min-h-80 flex-1 resize-y font-mono text-sm xl:min-h-0"
            placeholder={messages["input-placeholder"]}
            spellCheck={false}
            value={userAgent}
            onChange={(event) => {
              onUserAgentChange(event.target.value)
            }}
          />
          <FieldError>
            {showInputError ? messages["input-error"] : ""}
          </FieldError>
        </Field>
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="justify-start gap-3 border-t">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={!canUseCurrent}
          onClick={onUseCurrent}
        >
          <Globe data-icon="inline-start" />
          {messages["use-current"]}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { UserAgentInputCard }
