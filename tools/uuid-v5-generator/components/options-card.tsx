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
  UUID_V5_NAMESPACE_PRESETS,
  type UuidV5NamespacePresetId,
} from "../core/uuid-v5"

import type { UuidV5Messages } from "../types"

type UuidV5OptionsCardProps = Readonly<{
  messages: UuidV5Messages
  namespaceId: string
  nameId: string
  namespace: string
  name: string
  namespaceError: string
  selectedPresetId: UuidV5NamespacePresetId | null
  onNamespaceChange: (value: string) => void
  onNameChange: (value: string) => void
}>

function getPresetLabel(
  presetId: UuidV5NamespacePresetId,
  messages: UuidV5Messages
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

function UuidV5OptionsCard({
  messages,
  namespaceId,
  nameId,
  namespace,
  name,
  namespaceError,
  selectedPresetId,
  onNamespaceChange,
  onNameChange,
}: UuidV5OptionsCardProps) {
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
              name="uuid-v5-namespace"
              value={namespace}
              autoComplete="off"
              spellCheck={false}
              aria-invalid={namespaceError ? true : undefined}
              dir="ltr"
              className="font-mono text-sm"
              onChange={(event) => {
                onNamespaceChange(event.target.value)
              }}
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
                const preset = UUID_V5_NAMESPACE_PRESETS.find(
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
              {UUID_V5_NAMESPACE_PRESETS.map((preset) => (
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
              name="uuid-v5-name"
              value={name}
              autoComplete="off"
              spellCheck={false}
              placeholder={messages.namePlaceholder}
              onChange={(event) => {
                onNameChange(event.target.value)
              }}
            />
            <FieldDescription>{messages.nameDescription}</FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export { UuidV5OptionsCard }
