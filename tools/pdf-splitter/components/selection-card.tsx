import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
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
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
} from "@workspace/ui/components/ui/field"
import {
  InputGroup,
  InputGroupInput,
} from "@workspace/ui/components/ui/input-group"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { TriangleAlert } from "@workspace/ui/icons"

import { formatTemplate } from "./page-grid"

import type { PdfSplitterMessages } from "../client/types"
import type { SplitMultipleMode, SplitOutputMode } from "../core/pdf-document"

type SelectionCardProps = Readonly<{
  canGenerate: boolean
  isGenerating: boolean
  messages: PdfSplitterMessages
  multipleMode: SplitMultipleMode
  onClearSelection: () => void
  onGenerate: () => void
  onMultipleModeChange: (mode: SplitMultipleMode) => void
  onOutputModeChange: (mode: SplitOutputMode) => void
  onRangeInputChange: (value: string) => void
  onSelectAll: () => void
  onSelectEven: () => void
  onSelectOdd: () => void
  outputMode: SplitOutputMode
  pageCount: number
  rangeError: string
  rangeInput: string
  selectedCount: number
}>

function SelectionCard({
  canGenerate,
  isGenerating,
  messages,
  multipleMode,
  onClearSelection,
  onGenerate,
  onMultipleModeChange,
  onOutputModeChange,
  onRangeInputChange,
  onSelectAll,
  onSelectEven,
  onSelectOdd,
  outputMode,
  pageCount,
  rangeError,
  rangeInput,
  selectedCount,
}: SelectionCardProps) {
  const rangeErrorId = "pdf-splitter-ranges-error"

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b py-4">
        <CardTitle>{messages.selectionTitle}</CardTitle>
        <CardDescription>{messages.selectionDescription}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-5 p-4">
        <FieldGroup>
          <Field data-invalid={Boolean(rangeError)}>
            <FieldLabel htmlFor="pdf-splitter-ranges">
              {messages.rangeLabel}
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                aria-describedby={rangeError ? rangeErrorId : undefined}
                aria-invalid={Boolean(rangeError)}
                autoComplete="off"
                id="pdf-splitter-ranges"
                name="pdf-ranges"
                onChange={(event) => onRangeInputChange(event.target.value)}
                placeholder={messages.rangePlaceholder}
                value={rangeInput}
              />
            </InputGroup>
            {rangeError ? (
              <FieldDescription id={rangeErrorId}>
                {rangeError}
              </FieldDescription>
            ) : null}
          </Field>

          <div className="flex flex-wrap gap-2">
            <Button onClick={onSelectAll} type="button" variant="outline">
              {messages.selectAll}
            </Button>
            <Button onClick={onSelectOdd} type="button" variant="outline">
              {messages.selectOdd}
            </Button>
            <Button onClick={onSelectEven} type="button" variant="outline">
              {messages.selectEven}
            </Button>
            <Button onClick={onClearSelection} type="button" variant="outline">
              {messages.clearSelection}
            </Button>
          </div>

          <div
            aria-live="polite"
            className="rounded-md bg-muted/35 px-3 py-2 text-sm text-muted-foreground"
            role="status"
          >
            {formatTemplate(messages.selectedSummary, {
              pageCount,
              selectedCount,
            })}
          </div>

          <FieldSet>
            <FieldLegend>{messages.outputMode}</FieldLegend>
            <ToggleGroup
              className="grid w-full grid-cols-2"
              onValueChange={(value) => {
                if (value) {
                  onOutputModeChange(value as SplitOutputMode)
                }
              }}
              type="single"
              value={outputMode}
              variant="outline"
            >
              <ToggleGroupItem value="single">
                {messages.modeSingle}
              </ToggleGroupItem>
              <ToggleGroupItem value="multiple">
                {messages.modeMultiple}
              </ToggleGroupItem>
            </ToggleGroup>
          </FieldSet>

          {outputMode === "multiple" ? (
            <FieldSet>
              <FieldLegend>{messages.splitStrategy}</FieldLegend>
              <ToggleGroup
                className="grid w-full grid-cols-1 sm:grid-cols-2"
                onValueChange={(value) => {
                  if (value) {
                    onMultipleModeChange(value as SplitMultipleMode)
                  }
                }}
                type="single"
                value={multipleMode}
                variant="outline"
              >
                <ToggleGroupItem value="ranges">
                  {messages.strategyRanges}
                </ToggleGroupItem>
                <ToggleGroupItem value="pages">
                  {messages.strategyPages}
                </ToggleGroupItem>
              </ToggleGroup>
            </FieldSet>
          ) : null}
        </FieldGroup>

        {!selectedCount ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertDescription>
              {messages.emptySelectionDescription}
            </AlertDescription>
          </Alert>
        ) : null}

        <Button
          className="w-full"
          disabled={!canGenerate}
          onClick={onGenerate}
          type="button"
        >
          {isGenerating ? messages.generating : messages.generate}
        </Button>
      </CardContent>
    </Card>
  )
}

export { SelectionCard }
