import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Checkbox } from "@workspace/ui/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Input } from "@workspace/ui/components/ui/input"

import type { ListComparerOptions } from "../core/compare-lists"
import type { ListComparerLocalizedCatalog } from "../types"

type OptionsCardProps = Readonly<{
  messages: ListComparerLocalizedCatalog
  options: ListComparerOptions
  onOptionsChange: (options: ListComparerOptions) => void
}>

function OptionsCard({ messages, options, onOptionsChange }: OptionsCardProps) {
  function updateOption<Key extends keyof ListComparerOptions>(
    key: Key,
    value: ListComparerOptions[Key]
  ) {
    onOptionsChange({
      ...options,
      [key]: value,
    })
  }

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.optionsTitle}</CardTitle>
        <CardDescription>{messages.optionsDescription}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="grid gap-2">
          <label className="text-sm font-medium">
            {messages.delimiterLabel}
          </label>
          <Select
            value={options.delimiterMode}
            onValueChange={(value) => {
              if (
                value === "newline" ||
                value === "comma" ||
                value === "tab" ||
                value === "custom"
              ) {
                updateOption("delimiterMode", value)
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newline">
                {messages.delimiterNewlineLabel}
              </SelectItem>
              <SelectItem value="comma">
                {messages.delimiterCommaLabel}
              </SelectItem>
              <SelectItem value="tab">{messages.delimiterTabLabel}</SelectItem>
              <SelectItem value="custom">
                {messages.delimiterCustomLabel}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {options.delimiterMode === "custom" ? (
          <div className="grid gap-2">
            <label className="text-sm font-medium">
              {messages.customDelimiterLabel}
            </label>
            <Input
              value={options.customDelimiter}
              placeholder="|"
              onChange={(event) => {
                updateOption("customDelimiter", event.target.value)
              }}
            />
          </div>
        ) : null}

        <div className="grid gap-3">
          <CheckboxField
            label={messages.trimItemsLabel}
            checked={options.trimItems}
            onCheckedChange={(checked) => {
              updateOption("trimItems", checked)
            }}
          />
          <CheckboxField
            label={messages.ignoreCaseLabel}
            checked={options.ignoreCase}
            onCheckedChange={(checked) => {
              updateOption("ignoreCase", checked)
            }}
          />
          <CheckboxField
            label={messages.omitEmptyItemsLabel}
            checked={options.omitEmptyItems}
            onCheckedChange={(checked) => {
              updateOption("omitEmptyItems", checked)
            }}
          />
          <CheckboxField
            label={messages.sortResultsLabel}
            checked={options.sortResults}
            onCheckedChange={(checked) => {
              updateOption("sortResults", checked)
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}

type CheckboxFieldProps = Readonly<{
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}>

function CheckboxField({
  label,
  checked,
  onCheckedChange,
}: CheckboxFieldProps) {
  return (
    <label className="flex items-center gap-3 text-sm font-medium">
      <Checkbox
        checked={checked}
        onCheckedChange={(value) => {
          onCheckedChange(value === true)
        }}
      />
      <span>{label}</span>
    </label>
  )
}

export { OptionsCard }
