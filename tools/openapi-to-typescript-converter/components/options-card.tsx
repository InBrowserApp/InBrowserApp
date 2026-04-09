import { useId, type Dispatch, type SetStateAction } from "react"

import { Checkbox } from "@workspace/ui/components/ui/checkbox"
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
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"

import type { OpenApiToTypescriptConverterMessages } from "../client/types"
import type { OpenApiTypegenOptions } from "../core/openapi-typescript"

type OptionsCardProps = Readonly<{
  messages: OpenApiToTypescriptConverterMessages
  options: OpenApiTypegenOptions
  setOptions: Dispatch<SetStateAction<OpenApiTypegenOptions>>
}>

type ToggleOption = Readonly<{
  key: keyof OpenApiTypegenOptions
  label: string
}>

function OptionsCard({ messages, options, setOptions }: OptionsCardProps) {
  const optionIdPrefix = useId()

  const toggleOptions: readonly ToggleOption[] = [
    {
      key: "additionalProperties",
      label: messages.allowAdditionalPropertiesLabel,
    },
    {
      key: "defaultNonNullable",
      label: messages.defaultNonNullableLabel,
    },
    {
      key: "propertiesRequiredByDefault",
      label: messages.propertiesRequiredByDefaultLabel,
    },
    {
      key: "exportType",
      label: messages.useTypeAliasesLabel,
    },
    {
      key: "enum",
      label: messages.generateEnumsLabel,
    },
    {
      key: "pathParamsAsTypes",
      label: messages.pathParamsAsTypesLabel,
    },
    {
      key: "rootTypes",
      label: messages.generateRootTypesLabel,
    },
    {
      key: "makePathsEnum",
      label: messages.generatePathsEnumLabel,
    },
    {
      key: "generatePathParams",
      label: messages.generatePathParamHelpersLabel,
    },
    {
      key: "immutable",
      label: messages.immutableTypesLabel,
    },
    {
      key: "excludeDeprecated",
      label: messages.excludeDeprecatedLabel,
    },
    {
      key: "includeHeader",
      label: messages.includeHeaderCommentLabel,
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
          <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
            {toggleOptions.map((toggleOption) => {
              const optionId = `${optionIdPrefix}-${toggleOption.key}`

              return (
                <Field key={toggleOption.key} orientation="horizontal">
                  <Checkbox
                    id={optionId}
                    checked={options[toggleOption.key]}
                    onCheckedChange={(checked) => {
                      setOptions((currentOptions) => ({
                        ...currentOptions,
                        [toggleOption.key]: Boolean(checked),
                      }))
                    }}
                  />
                  <FieldContent>
                    <FieldLabel htmlFor={optionId}>
                      {toggleOption.label}
                    </FieldLabel>
                  </FieldContent>
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
