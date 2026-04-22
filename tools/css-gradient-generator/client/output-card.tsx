import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { Download } from "@workspace/ui/icons"

import type { ColorFormat } from "../core/gradient"
import type { CssGradientGeneratorMessages } from "../types"

type OutputCardProps = Readonly<{
  backgroundBlendDeclaration: string
  backgroundDeclaration: string
  backgroundImageDeclaration: string
  cssDownloadUrl: string | null
  cssOutput: string
  hasBlendModes: boolean
  messages: CssGradientGeneratorMessages
  onOutputFormatChange: (format: ColorFormat) => void
  outputFormat: ColorFormat
}>

function OutputCard({
  backgroundBlendDeclaration,
  backgroundDeclaration,
  backgroundImageDeclaration,
  cssDownloadUrl,
  cssOutput,
  hasBlendModes,
  messages,
  onOutputFormatChange,
  outputFormat,
}: OutputCardProps) {
  return (
    <Card>
      <CardHeader className="gap-4 border-b">
        <div className="space-y-1">
          <CardTitle>{messages.outputTitle}</CardTitle>
          <CardDescription>{messages.outputSubtitle}</CardDescription>
        </div>

        <div className="grid gap-2">
          <div className="text-sm font-medium">{messages.outputFormat}</div>
          <ToggleGroup
            onValueChange={(value) => {
              if (value) {
                onOutputFormatChange(value as ColorFormat)
              }
            }}
            size="sm"
            type="single"
            value={outputFormat}
            variant="outline"
          >
            <ToggleGroupItem value="hex">{messages.format.hex}</ToggleGroupItem>
            <ToggleGroupItem value="rgba">
              {messages.format.rgba}
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>

      <CardContent className="grid gap-4">
        <Textarea
          aria-label={messages.outputTitle}
          readOnly
          rows={8}
          value={cssOutput}
        />

        <div className="flex flex-wrap gap-2">
          <ToolCopyButton
            copiedLabel={messages.copiedLabel}
            copyLabel={messages.copyCss}
            value={cssOutput}
          />
          <ToolCopyButton
            copiedLabel={messages.copiedLabel}
            copyLabel={messages.copyBackgroundImage}
            value={backgroundImageDeclaration}
          />
          <ToolCopyButton
            copiedLabel={messages.copiedLabel}
            copyLabel={messages.copyBackground}
            value={backgroundDeclaration}
          />
          {hasBlendModes ? (
            <ToolCopyButton
              copiedLabel={messages.copiedLabel}
              copyLabel={messages.copyBlendMode}
              value={backgroundBlendDeclaration}
            />
          ) : null}
          {cssDownloadUrl ? (
            <Button asChild size="sm" variant="outline">
              <a download="css-gradient.css" href={cssDownloadUrl}>
                <Download data-icon="inline-start" />
                {messages.downloadCss}
              </a>
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

export { OutputCard }
