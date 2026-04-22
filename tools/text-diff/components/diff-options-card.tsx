"use client"

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
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { FileText, LayoutGrid } from "@workspace/ui/icons"

import type { TextDiffCompareOptions } from "../core/text-diff"
import type { TextDiffMessages, TextDiffViewMode } from "../types"

type DiffOptionsCardProps = Readonly<{
  messages: TextDiffMessages
  compareOptions: TextDiffCompareOptions
  viewMode: TextDiffViewMode
  hideUnchanged: boolean
  onCompareOptionsChange: (
    nextOptions:
      | TextDiffCompareOptions
      | ((current: TextDiffCompareOptions) => TextDiffCompareOptions)
  ) => void
  onViewModeChange: (viewMode: TextDiffViewMode) => void
  onHideUnchangedChange: (nextValue: boolean) => void
}>

function DiffOptionsCard({
  messages,
  compareOptions,
  viewMode,
  hideUnchanged,
  onCompareOptionsChange,
  onViewModeChange,
  onHideUnchangedChange,
}: DiffOptionsCardProps) {
  const toggleOptions = [
    {
      key: "ignoreCase",
      label: messages.ignoreCaseLabel,
      checked: compareOptions.ignoreCase,
    },
    {
      key: "ignoreWhitespace",
      label: messages.ignoreWhitespaceLabel,
      checked: compareOptions.ignoreWhitespace,
    },
  ] as const
  const viewModeOptions = [
    {
      value: "side-by-side",
      label: messages.sideBySideLabel,
      icon: LayoutGrid,
    },
    {
      value: "unified",
      label: messages.unifiedLabel,
      icon: FileText,
    },
  ] as const

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.optionsTitle}</CardTitle>
        <CardDescription>{messages.optionsDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <FieldGroup>
          <div className="space-y-2">
            <FieldLabel>{messages.viewModeLabel}</FieldLabel>
            <ToggleGroup
              type="single"
              value={viewMode}
              variant="default"
              onValueChange={(value) => {
                if (value === "side-by-side" || value === "unified") {
                  onViewModeChange(value)
                }
              }}
              className="w-full rounded-xl border border-border/70 bg-muted/20 p-1"
            >
              {viewModeOptions.map((option) => (
                <ToggleGroupItem
                  key={option.value}
                  value={option.value}
                  className="flex-1 justify-start gap-2 rounded-lg border border-transparent px-3 py-2 data-[state=on]:border-border data-[state=on]:bg-background data-[state=on]:shadow-sm [&_svg]:text-muted-foreground data-[state=on]:[&_svg]:text-foreground"
                >
                  <option.icon data-icon="inline-start" />
                  {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </FieldGroup>

        <FieldGroup>
          <Field orientation="horizontal">
            <Checkbox
              id="text-diff-hide-unchanged"
              checked={hideUnchanged}
              onCheckedChange={(checked) => {
                onHideUnchangedChange(Boolean(checked))
              }}
            />
            <FieldContent>
              <FieldLabel htmlFor="text-diff-hide-unchanged">
                {messages.hideUnchangedLabel}
              </FieldLabel>
            </FieldContent>
          </Field>

          {toggleOptions.map((toggleOption) => (
            <Field key={toggleOption.key} orientation="horizontal">
              <Checkbox
                id={`text-diff-${toggleOption.key}`}
                checked={toggleOption.checked}
                onCheckedChange={(checked) => {
                  onCompareOptionsChange((currentOptions) => ({
                    ...currentOptions,
                    [toggleOption.key]: Boolean(checked),
                  }))
                }}
              />
              <FieldContent>
                <FieldLabel htmlFor={`text-diff-${toggleOption.key}`}>
                  {toggleOption.label}
                </FieldLabel>
              </FieldContent>
            </Field>
          ))}
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export { DiffOptionsCard }
