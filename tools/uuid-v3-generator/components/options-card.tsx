import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"

import {
  UUID_V3_NAMESPACE_PRESETS,
  type UuidV3NamespacePresetId,
} from "../core/uuid-v3"
import type { UuidV3Messages } from "../types"

type UuidV3OptionsCardProps = Readonly<{
  messages: UuidV3Messages
  namespaceId: string
  nameId: string
  namespace: string
  name: string
  namespaceError: string
  selectedPresetId: UuidV3NamespacePresetId | null
  onNamespaceChange: (value: string) => void
  onNameChange: (value: string) => void
}>

function getPresetLabel(
  presetId: UuidV3NamespacePresetId,
  messages: UuidV3Messages
) {
  switch (presetId) {
    case "dns":
      return messages.namespaceDnsLabel
    case "url":
      return messages.namespaceUrlLabel
    case "oid":
      return messages.namespaceOidLabel
    case "x500":
      return messages.namespaceX500Label
  }
}

function UuidV3OptionsCard({
  messages,
  namespaceId,
  nameId,
  namespace,
  name,
  namespaceError,
  selectedPresetId,
  onNamespaceChange,
  onNameChange,
}: UuidV3OptionsCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.optionsTitle}</CardTitle>
        <CardDescription>{messages.optionsDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field data-invalid={namespaceError ? true : undefined}>
            <FieldLabel htmlFor={namespaceId}>
              {messages.namespaceLabel}
            </FieldLabel>
            <Input
              id={namespaceId}
              name="uuid-v3-namespace"
              autoComplete="off"
              value={namespace}
              onChange={(event) => {
                onNamespaceChange(event.target.value)
              }}
              aria-invalid={namespaceError ? true : undefined}
              spellCheck={false}
              className="font-mono text-sm"
            />
            {namespaceError ? (
              <FieldError>{namespaceError}</FieldError>
            ) : (
              <FieldDescription>
                {messages.namespaceDescription}
              </FieldDescription>
            )}
          </Field>

          <FieldSet>
            <FieldLegend>{messages.namespacePresetLegend}</FieldLegend>
            <ToggleGroup
              type="single"
              value={selectedPresetId ?? ""}
              onValueChange={(value) => {
                const preset = UUID_V3_NAMESPACE_PRESETS.find(
                  (candidate) => candidate.id === value
                )

                if (preset) {
                  onNamespaceChange(preset.value)
                }
              }}
              variant="outline"
              size="sm"
              className="flex-wrap justify-start"
              aria-label={messages.namespacePresetLegend}
            >
              {UUID_V3_NAMESPACE_PRESETS.map((preset) => (
                <ToggleGroupItem key={preset.id} value={preset.id}>
                  {getPresetLabel(preset.id, messages)}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <FieldDescription>
              {messages.namespacePresetDescription}
            </FieldDescription>
          </FieldSet>

          <Field>
            <FieldLabel htmlFor={nameId}>{messages.nameLabel}</FieldLabel>
            <Input
              id={nameId}
              name="uuid-v3-name"
              autoComplete="off"
              value={name}
              onChange={(event) => {
                onNameChange(event.target.value)
              }}
              placeholder={messages.namePlaceholder}
              spellCheck={false}
            />
            <FieldDescription>{messages.nameDescription}</FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export { UuidV3OptionsCard }
