import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldError,
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
import { Textarea } from "@workspace/ui/components/ui/textarea"

import type { JsonpathTesterMessages } from "../client/types"

type ExampleOption = Readonly<{
  label: string
  value: string
}>

type QueryCardProps = Readonly<{
  exampleOptions: readonly ExampleOption[]
  messages: JsonpathTesterMessages
  onExampleSelect: (value: string) => void
  onQueryChange: (value: string) => void
  queryErrorMessage: string
  queryText: string
  selectedExampleValue: string
}>

function QueryCard({
  exampleOptions,
  messages,
  onExampleSelect,
  onQueryChange,
  queryErrorMessage,
  queryText,
  selectedExampleValue,
}: QueryCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.queryLabel}</CardTitle>
        <CardDescription>{messages.queryDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <FieldGroup>
          <Field data-invalid={queryErrorMessage.length > 0 || undefined}>
            <Textarea
              value={queryText}
              aria-label={messages.queryLabel}
              aria-invalid={queryErrorMessage.length > 0}
              spellCheck={false}
              onChange={(event) => {
                onQueryChange(event.target.value)
              }}
              className="min-h-32 resize-y font-mono text-sm"
              placeholder={messages.queryPlaceholder}
            />
            <FieldError>{queryErrorMessage}</FieldError>
          </Field>

          <Field>
            <FieldLabel>{messages.examplesLabel}</FieldLabel>
            <Select
              value={selectedExampleValue}
              onValueChange={onExampleSelect}
            >
              <SelectTrigger
                aria-label={messages.examplesLabel}
                className="w-full"
              >
                <SelectValue placeholder={messages.examplesPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {exampleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter className="justify-start border-t">
        <ToolCopyButton
          value={queryText}
          copyLabel={messages.copyQueryLabel}
          copiedLabel={messages.copiedLabel}
          variant="ghost"
        />
      </CardFooter>
    </Card>
  )
}

export { QueryCard }
