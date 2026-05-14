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
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Camera, Download, Trash2, Video } from "@workspace/ui/icons"

import { formatFileSize } from "../core/recorder"

import type { CameraMessages, CameraOutput } from "../types"

type OutputCardProps = Readonly<{
  messages: CameraMessages
  output: CameraOutput | null
  outputUrl: string
  onClear: () => void
}>

function OutputCard({ messages, output, outputUrl, onClear }: OutputCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{messages.outputTitle}</CardTitle>
        <CardDescription>{messages.outputDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {output && outputUrl ? (
          <>
            <div className="overflow-hidden rounded-xl border border-border/70 bg-background">
              {output.kind === "photo" ? (
                <img
                  src={outputUrl}
                  alt=""
                  className="max-h-96 w-full object-contain"
                />
              ) : (
                // oxlint-disable-next-line jsx-a11y/media-has-caption
                <video
                  src={outputUrl}
                  controls
                  className="max-h-96 w-full bg-black"
                />
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">
                {output.kind === "photo"
                  ? messages.photoOutputLabel
                  : messages.videoOutputLabel}
              </Badge>
              <Badge variant="outline">
                {messages.formatLabel}:{" "}
                {output.mimeType || messages.formatUnknown}
              </Badge>
              <Badge variant="outline">
                {messages.fileSizeLabel}: {formatFileSize(output.blob.size)}
              </Badge>
            </div>
          </>
        ) : (
          <Empty className="border border-dashed border-border/80 bg-muted/20">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Camera />
              </EmptyMedia>
              <EmptyTitle>{messages.emptyOutputTitle}</EmptyTitle>
              <EmptyDescription>
                {messages.emptyOutputDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
      {output && outputUrl ? (
        <CardFooter className="flex flex-wrap justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClear}>
            <Trash2 data-icon="inline-start" />
            {messages.clearLabel}
          </Button>
          <Button asChild>
            <a href={outputUrl} download={output.fileName}>
              {output.kind === "photo" ? (
                <Download data-icon="inline-start" />
              ) : (
                <Video data-icon="inline-start" />
              )}
              {messages.downloadLabel}
            </a>
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  )
}

export { OutputCard }
