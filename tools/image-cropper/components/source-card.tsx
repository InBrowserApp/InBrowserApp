import { useRef, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { Badge } from "@workspace/ui/components/ui/badge"
import {
  Card,
  CardAction,
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
import { ImageUp, LoaderCircle, X } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import type { Cropper } from "../client/use-image-cropper"
import type { Messages } from "../client/types"
import { CropPreview } from "./crop-preview"

export function SourceCard({ state, m }: { state: Cropper; m: Messages }) {
  const picker = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  return (
    <Card
      className={cn("min-w-0", dragging && "ring-2 ring-primary")}
      onDragOver={(event) => {
        event.preventDefault()
        setDragging(true)
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setDragging(false)
      }}
      onDrop={(event) => {
        event.preventDefault()
        setDragging(false)
        const file = event.dataTransfer.files[0]
        if (file) state.changeFile(file)
      }}
    >
      <CardHeader className="max-sm:flex max-sm:flex-col">
        <CardTitle>{m.sourceTitle}</CardTitle>
        <CardDescription>{m.sourceDescription}</CardDescription>
        {state.file ? (
          <CardAction className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => picker.current?.click()}
            >
              {m.changeImage}
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={m.clearImage}
              title={m.clearImage}
              onClick={() => state.changeFile(null)}
            >
              <X aria-hidden="true" />
            </Button>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <input
          ref={picker}
          type="file"
          hidden
          accept="image/png,image/jpeg,image/webp,image/avif,image/gif,image/bmp"
          aria-label={m.chooseImage}
          className="sr-only"
          tabIndex={-1}
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) state.changeFile(file)
            event.target.value = ""
          }}
        />
        {state.loading ? (
          <div
            role="status"
            className="flex min-h-64 items-center justify-center gap-2 sm:min-h-96"
          >
            <LoaderCircle
              className="size-5 motion-safe:animate-spin"
              aria-hidden="true"
            />
            {m.loading}
          </div>
        ) : state.source ? (
          <>
            <CropPreview state={state} m={m} />
            <p className="text-sm text-muted-foreground">{m.cropHint}</p>
          </>
        ) : (
          <Empty className="min-h-64 border border-dashed sm:min-h-96">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ImageUp aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>{dragging ? m.dropImage : m.chooseImage}</EmptyTitle>
              <EmptyDescription>{m.uploadHint}</EmptyDescription>
            </EmptyHeader>
            <Button onClick={() => picker.current?.click()}>
              <ImageUp data-icon="inline-start" aria-hidden="true" />
              {m.chooseImage}
            </Button>
          </Empty>
        )}
      </CardContent>
      {state.file && state.source ? (
        <CardFooter className="flex-wrap justify-between gap-2">
          <span
            dir="auto"
            className="min-w-0 truncate text-sm"
            title={state.file.name}
          >
            {state.file.name}
          </span>
          <Badge variant="secondary" className="shrink-0 font-mono" dir="ltr">
            {state.source.width} × {state.source.height}
          </Badge>
        </CardFooter>
      ) : null}
    </Card>
  )
}
