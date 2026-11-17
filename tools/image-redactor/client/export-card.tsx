import { useId } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Label } from "@workspace/ui/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Copy, Download, LoaderCircle } from "@workspace/ui/icons"
import type { Messages } from "../types"
import type { Editor } from "./use-editor"
import { Range } from "./settings"

export function ExportCard({
  editor,
  messages,
}: {
  editor: Editor
  messages: Messages
}) {
  const id = useId()
  return (
    <Card>
      <CardHeader>
        <CardTitle>{messages.exportTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={id}>{messages.format}</Label>
          <Select value={editor.format} onValueChange={editor.setFormat}>
            <SelectTrigger id={id} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["png", "jpeg", "webp"].map((format) => (
                <SelectItem key={format} value={format}>
                  {format.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {editor.format !== "png" && (
          <Range
            label={messages.quality}
            value={editor.quality}
            min={1}
            max={100}
            unit="%"
            onChange={editor.setQuality}
            onCommit={() => {}}
          />
        )}
        <p className="text-xs leading-relaxed text-muted-foreground">
          {messages.exportHint}
        </p>
        <Button
          type="button"
          className="w-full"
          disabled={!editor.source || editor.busy || editor.loading}
          onClick={() => void editor.save()}
        >
          {editor.busy ? (
            <LoaderCircle
              aria-hidden="true"
              className="motion-safe:animate-spin"
            />
          ) : (
            <Download aria-hidden="true" />
          )}
          {editor.busy ? messages.exporting : messages.download}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={!editor.source || editor.busy || editor.loading}
          onClick={() => void editor.save(true)}
        >
          <Copy aria-hidden="true" />
          {editor.copied ? messages.copied : messages.copy}
        </Button>
        <span className="sr-only" role="status">
          {editor.copied ? messages.copied : ""}
        </span>
      </CardContent>
    </Card>
  )
}
