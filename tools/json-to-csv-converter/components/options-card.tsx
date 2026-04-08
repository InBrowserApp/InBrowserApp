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
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { Switch } from "@workspace/ui/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/ui/tooltip"

import type { JsonToCsvConverterMessages } from "../client/types"
import type { JsonToCsvOptions } from "../core/convert-json-to-csv"

type OptionsCardProps = Readonly<{
  messages: JsonToCsvConverterMessages
  options: JsonToCsvOptions
  setOptions: Dispatch<SetStateAction<JsonToCsvOptions>>
}>

function OptionsCard({ messages, options, setOptions }: OptionsCardProps) {
  const delimiterId = useId()
  const quoteCharId = useId()
  const includeHeaderRowId = useId()
  const escapeFormulaeId = useId()

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.optionsLabel}</CardTitle>
        <CardDescription>{messages.optionsDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <FieldGroup>
          <div className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor={delimiterId}>
                {messages.delimiterLabel}
              </FieldLabel>
              <Input
                id={delimiterId}
                value={options.delimiter}
                placeholder=","
                onChange={(event) => {
                  setOptions((currentOptions) => ({
                    ...currentOptions,
                    delimiter: event.target.value,
                  }))
                }}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor={quoteCharId}>
                {messages.quoteCharLabel}
              </FieldLabel>
              <Input
                id={quoteCharId}
                value={options.quoteChar}
                placeholder={'"'}
                onChange={(event) => {
                  setOptions((currentOptions) => ({
                    ...currentOptions,
                    quoteChar: event.target.value,
                  }))
                }}
              />
            </Field>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldLabel htmlFor={includeHeaderRowId}>
                  {messages.includeHeaderRowLabel}
                </FieldLabel>
              </FieldContent>
              <Switch
                id={includeHeaderRowId}
                checked={options.includeHeaderRow}
                onCheckedChange={(checked) => {
                  setOptions((currentOptions) => ({
                    ...currentOptions,
                    includeHeaderRow: checked,
                  }))
                }}
                aria-label={messages.includeHeaderRowLabel}
              />
            </Field>

            <Field orientation="horizontal">
              <FieldContent>
                <FieldLabel htmlFor={escapeFormulaeId}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="underline decoration-dotted underline-offset-3">
                          {messages.escapeFormulaeLabel}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        {messages.escapeFormulaeTooltip}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FieldLabel>
              </FieldContent>
              <Switch
                id={escapeFormulaeId}
                checked={options.escapeFormulae}
                onCheckedChange={(checked) => {
                  setOptions((currentOptions) => ({
                    ...currentOptions,
                    escapeFormulae: checked,
                  }))
                }}
                aria-label={messages.escapeFormulaeLabel}
              />
            </Field>
          </div>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export { OptionsCard }
