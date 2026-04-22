import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@workspace/ui/components/ui/field"
import { Switch } from "@workspace/ui/components/ui/switch"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { Eye, FileText, Moon, Sun } from "@workspace/ui/icons"

import type { MarkdownPreviewerMessages, OutputMode, ThemeMode } from "../types"

type PreviewControlsCardProps = Readonly<{
  messages: MarkdownPreviewerMessages
  onOutputModeChange: (value: OutputMode) => void
  onSanitizeChange: (checked: boolean) => void
  onShowTocChange: (checked: boolean) => void
  onThemeChange: (value: ThemeMode) => void
  outputMode: OutputMode
  sanitize: boolean
  showToc: boolean
  theme: ThemeMode
}>

function PreviewControlsCard({
  messages,
  onOutputModeChange,
  onSanitizeChange,
  onShowTocChange,
  onThemeChange,
  outputMode,
  sanitize,
  showToc,
  theme,
}: PreviewControlsCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.previewLabel}</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <FieldGroup>
          <Field>
            <FieldLabel>{messages.viewModeLabel}</FieldLabel>
            <ToggleGroup
              type="single"
              value={outputMode}
              spacing={0}
              variant="outline"
              className="w-full"
              onValueChange={(value) => {
                if (value === "preview" || value === "html") {
                  onOutputModeChange(value)
                }
              }}
            >
              <ToggleGroupItem value="preview" className="flex-1">
                <Eye data-icon="inline-start" />
                {messages.previewLabel}
              </ToggleGroupItem>
              <ToggleGroupItem value="html" className="flex-1">
                <FileText data-icon="inline-start" />
                {messages.htmlSourceLabel}
              </ToggleGroupItem>
            </ToggleGroup>
          </Field>

          <Field>
            <FieldLabel>{messages.themeLabel}</FieldLabel>
            <ToggleGroup
              type="single"
              value={theme}
              spacing={0}
              variant="outline"
              className="w-full"
              onValueChange={(value) => {
                if (value === "light" || value === "dark") {
                  onThemeChange(value)
                }
              }}
            >
              <ToggleGroupItem value="light" className="flex-1">
                <Sun data-icon="inline-start" />
                {messages.themeLightLabel}
              </ToggleGroupItem>
              <ToggleGroupItem value="dark" className="flex-1">
                <Moon data-icon="inline-start" />
                {messages.themeDarkLabel}
              </ToggleGroupItem>
            </ToggleGroup>
          </Field>
        </FieldGroup>

        <FieldGroup>
          <Field
            orientation="horizontal"
            className="items-center justify-between rounded-xl border p-3"
          >
            <FieldContent>
              <FieldTitle>{messages.sanitizeHtmlLabel}</FieldTitle>
            </FieldContent>
            <Switch
              checked={sanitize}
              aria-label={messages.sanitizeHtmlLabel}
              onCheckedChange={onSanitizeChange}
            />
          </Field>

          <Field
            orientation="horizontal"
            className="items-center justify-between rounded-xl border p-3"
          >
            <FieldContent>
              <FieldTitle>{messages.showTocLabel}</FieldTitle>
            </FieldContent>
            <Switch
              checked={showToc}
              aria-label={messages.showTocLabel}
              onCheckedChange={onShowTocChange}
            />
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export { PreviewControlsCard }
