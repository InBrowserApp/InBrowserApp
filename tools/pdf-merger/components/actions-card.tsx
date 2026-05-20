import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
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
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { FileText } from "@workspace/ui/icons"

import type { PdfMergerMessages } from "../client/types"

type ActionsCardProps = Readonly<{
  canMerge: boolean
  fileCount: number
  inputSizeLabel: string
  isMerging: boolean
  messages: PdfMergerMessages
  onMerge: () => void
  onOutputNameChange: (value: string) => void
  outputName: string
  readyPageCount: number
}>

function ActionsCard({
  canMerge,
  fileCount,
  inputSizeLabel,
  isMerging,
  messages,
  onMerge,
  onOutputNameChange,
  outputName,
  readyPageCount,
}: ActionsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{messages.summaryTitle}</CardTitle>
        <CardDescription>{messages.localOnlyNote}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">
            {messages.fileCountLabel}: {fileCount}
          </Badge>
          <Badge variant="outline">
            {messages.pageCountLabel}: {readyPageCount}
          </Badge>
          <Badge variant="outline">
            {messages.fileSizeLabel}: {inputSizeLabel}
          </Badge>
        </div>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="pdf-merger-output-name">
              {messages.outputFileLabel}
            </FieldLabel>
            <Input
              autoComplete="off"
              id="pdf-merger-output-name"
              name="pdf-merger-output-name"
              onChange={(event) => {
                onOutputNameChange(event.target.value)
              }}
              placeholder={messages.outputFilePlaceholder}
              value={outputName}
            />
            <FieldDescription>
              {messages.outputFileDescription}
            </FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full max-w-full text-center whitespace-normal"
          disabled={!canMerge}
          onClick={onMerge}
          type="button"
        >
          <FileText data-icon="inline-start" />
          {isMerging ? messages.mergingLabel : messages.mergeLabel}
        </Button>
      </CardFooter>
    </Card>
  )
}

export { ActionsCard }
