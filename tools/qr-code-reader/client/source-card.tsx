import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { Camera, ImageIcon } from "@workspace/ui/icons"

import type { QRCodeReaderMessages, ScanMode } from "./types"

type SourceCardProps = Readonly<{
  messages: QRCodeReaderMessages
  mode: ScanMode
  onModeChange: (mode: ScanMode) => void
}>

function SourceCard({ messages, mode, onModeChange }: SourceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{messages.sourceTitle}</CardTitle>
        <CardDescription>{messages.sourceDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <ToggleGroup
          aria-label={messages.sourceTitle}
          className="w-full flex-wrap"
          onValueChange={(value) => {
            if (value === "upload" || value === "camera") {
              onModeChange(value)
            }
          }}
          type="single"
          value={mode}
          variant="outline"
        >
          <ToggleGroupItem className="flex-1" value="upload">
            <ImageIcon data-icon="inline-start" />
            {messages.uploadModeLabel}
          </ToggleGroupItem>
          <ToggleGroupItem className="flex-1" value="camera">
            <Camera data-icon="inline-start" />
            {messages.cameraModeLabel}
          </ToggleGroupItem>
        </ToggleGroup>
      </CardContent>
    </Card>
  )
}

export { SourceCard }
