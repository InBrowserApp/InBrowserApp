import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Checkbox } from "@workspace/ui/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@workspace/ui/components/ui/field"
import { LoaderCircle, RefreshCcw, Sparkles } from "@workspace/ui/icons"

import { DEFAULT_OPTIONS } from "../core/svg-optimizer"

import type { SvgOptimizerOptions } from "../core/svg-optimizer"
import type { SvgOptimizerMessages } from "./types"

type OptionsCardProps = Readonly<{
  canOptimize: boolean
  isOptimizing: boolean
  messages: SvgOptimizerMessages
  onChange: (options: SvgOptimizerOptions) => void
  onOptimize: () => void
  options: SvgOptimizerOptions
}>

type OptionKey = keyof SvgOptimizerOptions

type OptionDefinition = Readonly<{
  descriptionKey: keyof SvgOptimizerMessages
  key: OptionKey
  labelKey: keyof SvgOptimizerMessages
}>

const OPTION_DEFINITIONS: readonly OptionDefinition[] = [
  {
    descriptionKey: "multipassDescription",
    key: "multipass",
    labelKey: "multipassLabel",
  },
  {
    descriptionKey: "removeCommentsDescription",
    key: "removeComments",
    labelKey: "removeCommentsLabel",
  },
  {
    descriptionKey: "removeMetadataDescription",
    key: "removeMetadata",
    labelKey: "removeMetadataLabel",
  },
  {
    descriptionKey: "cleanupIdsDescription",
    key: "cleanupIds",
    labelKey: "cleanupIdsLabel",
  },
  {
    descriptionKey: "convertColorsDescription",
    key: "convertColors",
    labelKey: "convertColorsLabel",
  },
  {
    descriptionKey: "removeDimensionsDescription",
    key: "removeDimensions",
    labelKey: "removeDimensionsLabel",
  },
  {
    descriptionKey: "inlineStylesDescription",
    key: "inlineStyles",
    labelKey: "inlineStylesLabel",
  },
]

const AGGRESSIVE_OPTIONS: SvgOptimizerOptions = {
  ...DEFAULT_OPTIONS,
  inlineStyles: true,
  removeDimensions: true,
}

function OptionField({
  definition,
  messages,
  onCheckedChange,
  options,
}: Readonly<{
  definition: OptionDefinition
  messages: SvgOptimizerMessages
  onCheckedChange: (key: OptionKey, value: boolean) => void
  options: SvgOptimizerOptions
}>) {
  const fieldId = `svg-optimizer-${definition.key}`
  const descriptionId = `${fieldId}-description`

  return (
    <Field
      className="min-w-0 rounded-md border border-border/70 bg-muted/20 px-2.5 py-2"
      orientation="horizontal"
    >
      <Checkbox
        aria-describedby={descriptionId}
        checked={options[definition.key]}
        id={fieldId}
        onCheckedChange={(value) => {
          onCheckedChange(definition.key, value === true)
        }}
      />
      <FieldContent className="min-w-0">
        <FieldTitle className="w-full">
          <label className="min-w-0 break-words" htmlFor={fieldId}>
            {String(messages[definition.labelKey])}
          </label>
        </FieldTitle>
        <FieldDescription className="sr-only" id={descriptionId}>
          {String(messages[definition.descriptionKey])}
        </FieldDescription>
      </FieldContent>
    </Field>
  )
}

export function OptionsCard({
  canOptimize,
  isOptimizing,
  messages,
  onChange,
  onOptimize,
  options,
}: OptionsCardProps) {
  function updateOption(key: OptionKey, value: boolean) {
    onChange({
      ...options,
      [key]: value,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{messages.optionsTitle}</CardTitle>
        <CardDescription>{messages.optionsDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <Button
            onClick={() => onChange(DEFAULT_OPTIONS)}
            type="button"
            variant="outline"
          >
            {messages.presetSafeLabel}
          </Button>
          <Button
            onClick={() => onChange(AGGRESSIVE_OPTIONS)}
            type="button"
            variant="outline"
          >
            {messages.presetAggressiveLabel}
          </Button>
        </div>

        <FieldSet>
          <FieldLegend>{messages.optimizationOptionsLabel}</FieldLegend>
          <FieldGroup className="grid gap-3 sm:grid-cols-2">
            {OPTION_DEFINITIONS.map((definition) => (
              <OptionField
                definition={definition}
                key={definition.key}
                messages={messages}
                onCheckedChange={updateOption}
                options={options}
              />
            ))}
          </FieldGroup>
        </FieldSet>
      </CardContent>
      <CardFooter className="flex flex-col-reverse items-stretch gap-3 border-t sm:flex-row sm:items-center sm:justify-end">
        <Button
          onClick={() => onChange(DEFAULT_OPTIONS)}
          type="button"
          variant="outline"
        >
          <RefreshCcw data-icon="inline-start" />
          {messages.resetOptionsLabel}
        </Button>
        <Button
          disabled={!canOptimize || isOptimizing}
          onClick={onOptimize}
          type="button"
        >
          {isOptimizing ? (
            <LoaderCircle
              className="animate-spin motion-reduce:animate-none"
              data-icon="inline-start"
            />
          ) : (
            <Sparkles data-icon="inline-start" />
          )}
          {isOptimizing ? messages.optimizingLabel : messages.optimizeLabel}
        </Button>
      </CardFooter>
    </Card>
  )
}
