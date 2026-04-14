import { useId, type Dispatch, type SetStateAction } from "react"

import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Switch } from "@workspace/ui/components/ui/switch"

import { DRAFT_OPTIONS } from "../client/constants"
import type {
  JsonSchemaGeneratorMessages,
  JsonSchemaGeneratorOptions,
} from "../client/types"

type OptionsCardProps = Readonly<{
  messages: JsonSchemaGeneratorMessages
  options: JsonSchemaGeneratorOptions
  setOptions: Dispatch<SetStateAction<JsonSchemaGeneratorOptions>>
}>

function OptionsCard({ messages, options, setOptions }: OptionsCardProps) {
  const idPrefix = useId()

  return (
    <FieldGroup className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(14rem,18rem)_repeat(3,minmax(0,1fr))] xl:items-start">
      <Field className="xl:min-w-0">
        <FieldLabel htmlFor={`${idPrefix}-draft`}>
          {messages.optionDraft}
        </FieldLabel>
        <Select
          value={options.draft}
          onValueChange={(value) => {
            setOptions((currentOptions) => ({
              ...currentOptions,
              draft: value as JsonSchemaGeneratorOptions["draft"],
            }))
          }}
        >
          <SelectTrigger
            id={`${idPrefix}-draft`}
            aria-label={messages.optionDraft}
            className="w-full"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {DRAFT_OPTIONS.map((draftOption) => (
                <SelectItem key={draftOption.value} value={draftOption.value}>
                  {draftOption.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <Field className="rounded-lg border border-input p-3">
        <FieldContent className="min-h-11">
          <FieldLabel htmlFor={`${idPrefix}-infer-required`}>
            {messages.optionInferRequired}
          </FieldLabel>
        </FieldContent>
        <div className="flex items-center">
          <Switch
            id={`${idPrefix}-infer-required`}
            aria-label={messages.optionInferRequired}
            checked={options.inferRequired}
            onCheckedChange={(checked) => {
              setOptions((currentOptions) => ({
                ...currentOptions,
                inferRequired: checked,
              }))
            }}
          />
        </div>
      </Field>

      <Field className="rounded-lg border border-input p-3">
        <FieldContent className="min-h-11">
          <FieldLabel htmlFor={`${idPrefix}-allow-additional-properties`}>
            {messages.optionAllowAdditionalProperties}
          </FieldLabel>
        </FieldContent>
        <div className="flex items-center">
          <Switch
            id={`${idPrefix}-allow-additional-properties`}
            aria-label={messages.optionAllowAdditionalProperties}
            checked={options.allowAdditionalProperties}
            onCheckedChange={(checked) => {
              setOptions((currentOptions) => ({
                ...currentOptions,
                allowAdditionalProperties: checked,
              }))
            }}
          />
        </div>
      </Field>

      <Field className="rounded-lg border border-input p-3">
        <FieldContent className="min-h-11">
          <FieldLabel htmlFor={`${idPrefix}-detect-format`}>
            {messages.optionDetectFormat}
          </FieldLabel>
        </FieldContent>
        <div className="flex items-center">
          <Switch
            id={`${idPrefix}-detect-format`}
            aria-label={messages.optionDetectFormat}
            checked={options.detectFormat}
            onCheckedChange={(checked) => {
              setOptions((currentOptions) => ({
                ...currentOptions,
                detectFormat: checked,
              }))
            }}
          />
        </div>
      </Field>
    </FieldGroup>
  )
}

export { OptionsCard }
