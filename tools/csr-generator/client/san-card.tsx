import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Textarea } from "@workspace/ui/components/ui/textarea"

import type { CsrGeneratorMessages } from "./types"

type SanTextFields = Readonly<{
  dns: string
  ip: string
  email: string
  uri: string
}>

type SanCardProps = Readonly<{
  ids: Record<keyof SanTextFields, string>
  messages: CsrGeneratorMessages
  san: SanTextFields
  onSanChange: (field: keyof SanTextFields, value: string) => void
}>

function SanCard({ ids, messages, san, onSanChange }: SanCardProps) {
  const fields: Array<{
    key: keyof SanTextFields
    label: string
    placeholder: string
  }> = [
    {
      key: "dns",
      label: messages.sanDnsLabel,
      placeholder: messages.sanDnsPlaceholder,
    },
    {
      key: "ip",
      label: messages.sanIpLabel,
      placeholder: messages.sanIpPlaceholder,
    },
    {
      key: "email",
      label: messages.sanEmailLabel,
      placeholder: messages.sanEmailPlaceholder,
    },
    {
      key: "uri",
      label: messages.sanUriLabel,
      placeholder: messages.sanUriPlaceholder,
    },
  ]

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.sanTitle}</CardTitle>
        <CardDescription>{messages.sanDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent>
        <FieldGroup className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <Field key={field.key}>
              <FieldLabel htmlFor={ids[field.key]}>{field.label}</FieldLabel>
              <Textarea
                id={ids[field.key]}
                value={san[field.key]}
                className="min-h-24 resize-y font-mono text-xs"
                placeholder={field.placeholder}
                spellCheck={false}
                onChange={(event) => {
                  onSanChange(field.key, event.target.value)
                }}
              />
            </Field>
          ))}
        </FieldGroup>
        <FieldDescription className="mt-4">{messages.sanHint}</FieldDescription>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { SanCard }
export type { SanTextFields }
