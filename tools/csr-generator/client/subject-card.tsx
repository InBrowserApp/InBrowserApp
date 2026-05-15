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
import { Input } from "@workspace/ui/components/ui/input"

import type { SubjectInput } from "../core/csr"
import type { CsrGeneratorMessages } from "./types"

type SubjectCardProps = Readonly<{
  ids: Record<keyof SubjectInput, string>
  messages: CsrGeneratorMessages
  subject: SubjectInput
  onSubjectChange: (field: keyof SubjectInput, value: string) => void
}>

function SubjectCard({
  ids,
  messages,
  subject,
  onSubjectChange,
}: SubjectCardProps) {
  const fields: Array<{
    key: keyof SubjectInput
    label: string
    placeholder?: string
  }> = [
    {
      key: "commonName",
      label: messages.commonNameLabel,
      placeholder: messages.commonNamePlaceholder,
    },
    { key: "organization", label: messages.organizationLabel },
    { key: "organizationalUnit", label: messages.organizationalUnitLabel },
    { key: "country", label: messages.countryLabel },
    { key: "state", label: messages.stateLabel },
    { key: "locality", label: messages.localityLabel },
    { key: "emailAddress", label: messages.emailAddressLabel },
  ]

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.subjectTitle}</CardTitle>
        <CardDescription>{messages.subjectDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent>
        <FieldGroup className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <Field key={field.key}>
              <FieldLabel htmlFor={ids[field.key]}>{field.label}</FieldLabel>
              <Input
                id={ids[field.key]}
                value={subject[field.key]}
                placeholder={field.placeholder}
                autoComplete="off"
                onChange={(event) => {
                  onSubjectChange(field.key, event.target.value)
                }}
              />
            </Field>
          ))}
        </FieldGroup>
        <FieldDescription className="mt-4">
          {messages.subjectHint}
        </FieldDescription>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { SubjectCard }
