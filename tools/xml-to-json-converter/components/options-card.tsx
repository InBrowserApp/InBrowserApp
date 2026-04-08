import { useId, type Dispatch, type SetStateAction } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { Switch } from "@workspace/ui/components/ui/switch"

import type { XmlToJsonConverterMessages } from "../client/types"
import {
  clampIndentSize,
  type XmlToJsonOptions,
} from "../core/convert-xml-to-json"

type OptionsCardProps = Readonly<{
  messages: XmlToJsonConverterMessages
  options: XmlToJsonOptions
  setOptions: Dispatch<SetStateAction<XmlToJsonOptions>>
}>

type ToggleOption = Readonly<{
  key: Exclude<keyof XmlToJsonOptions, "indentSize">
  label: string
}>

function OptionsCard({ messages, options, setOptions }: OptionsCardProps) {
  const indentSizeId = useId()
  const optionIdPrefix = useId()

  const toggleOptions: readonly ToggleOption[] = [
    {
      key: "compact",
      label: messages.compactLabel,
    },
    {
      key: "ignoreDeclaration",
      label: messages.ignoreDeclarationLabel,
    },
    {
      key: "ignoreInstruction",
      label: messages.ignoreInstructionLabel,
    },
    {
      key: "ignoreAttributes",
      label: messages.ignoreAttributesLabel,
    },
    {
      key: "ignoreText",
      label: messages.ignoreTextLabel,
    },
    {
      key: "ignoreCdata",
      label: messages.ignoreCdataLabel,
    },
    {
      key: "ignoreDoctype",
      label: messages.ignoreDoctypeLabel,
    },
    {
      key: "ignoreComment",
      label: messages.ignoreCommentLabel,
    },
    {
      key: "trim",
      label: messages.trimLabel,
    },
    {
      key: "nativeType",
      label: messages.nativeTypeLabel,
    },
    {
      key: "alwaysArray",
      label: messages.alwaysArrayLabel,
    },
    {
      key: "alwaysChildren",
      label: messages.alwaysChildrenLabel,
    },
  ]

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.optionsLabel}</CardTitle>
        <CardDescription>{messages.optionsDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <FieldGroup>
          <div className="grid gap-4 lg:grid-cols-3">
            <Field>
              <FieldLabel htmlFor={indentSizeId}>
                {messages.indentSizeLabel}
              </FieldLabel>
              <Input
                id={indentSizeId}
                type="number"
                min={0}
                max={8}
                value={options.indentSize}
                onChange={(event) => {
                  setOptions((currentOptions) => ({
                    ...currentOptions,
                    indentSize: clampIndentSize(
                      Number(event.target.value || 0)
                    ),
                  }))
                }}
              />
              <FieldDescription>
                {messages.indentSizeDescription}
              </FieldDescription>
            </Field>
          </div>

          <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
            {toggleOptions.map((toggleOption) => {
              const optionId = `${optionIdPrefix}-${toggleOption.key}`
              const isDisabled =
                (toggleOption.key === "alwaysArray" && !options.compact) ||
                (toggleOption.key === "alwaysChildren" && options.compact)

              return (
                <Field
                  key={toggleOption.key}
                  orientation="horizontal"
                  data-disabled={isDisabled || undefined}
                >
                  <FieldContent>
                    <FieldLabel htmlFor={optionId}>
                      {toggleOption.label}
                    </FieldLabel>
                  </FieldContent>
                  <Switch
                    id={optionId}
                    checked={options[toggleOption.key]}
                    disabled={isDisabled}
                    onCheckedChange={(checked) => {
                      setOptions((currentOptions) => ({
                        ...currentOptions,
                        [toggleOption.key]: checked,
                      }))
                    }}
                    aria-label={toggleOption.label}
                  />
                </Field>
              )
            })}
          </div>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export { OptionsCard }
