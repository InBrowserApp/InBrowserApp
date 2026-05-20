"use client"

import { useId, useState } from "react"

import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
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
import { cn } from "@workspace/ui/lib/utils"
import { ImageUp, Sparkles, Trash2 } from "@workspace/ui/icons"

import { formatFileSize } from "./constants"
import type { FaviconMessages, ImageSource } from "./types"

type UploadCardProps = Readonly<{
  messages: FaviconMessages
  source: ImageSource | null
  onFileChange: (file: File | null) => void | Promise<void>
  onUseDemo: () => void | Promise<void>
}>

function UploadCard({
  messages,
  source,
  onFileChange,
  onUseDemo,
}: UploadCardProps) {
  const inputId = useId()
  const [isDragOver, setIsDragOver] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{messages.uploadCardTitle}</CardTitle>
        <CardDescription>{messages.uploadCardDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        {source ? (
          <div className="flex flex-col gap-3">
            <div className="rounded-xl border border-border/70 bg-[conic-gradient(at_top_left,_var(--muted)_25%,_transparent_25%,_transparent_75%,_var(--muted)_75%),conic-gradient(at_top_left,_var(--muted)_25%,_transparent_25%,_transparent_75%,_var(--muted)_75%)] bg-[length:16px_16px] bg-[position:0_0,8px_8px]">
              <img
                src={source.objectUrl}
                alt={messages.filePreviewAlt}
                className="mx-auto h-56 w-full object-contain p-4"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="truncate text-sm font-medium text-foreground">
                {source.file.name}
              </span>
              <Badge variant="outline" className="font-mono">
                {source.width} × {source.height}
              </Badge>
              <Badge variant="secondary">
                {formatFileSize(source.file.size)}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label
                htmlFor={inputId}
                className="inline-flex cursor-pointer text-sm font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                {messages.changeImageLabel}
              </label>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  void onFileChange(null)
                }}
              >
                <Trash2 data-icon="inline-start" />
                {messages.removeImageLabel}
              </Button>
            </div>
          </div>
        ) : (
          <label
            htmlFor={inputId}
            aria-label={messages.chooseImageLabel}
            className="block cursor-pointer"
            onDragOver={(event) => {
              event.preventDefault()
              setIsDragOver(true)
            }}
            onDragLeave={() => {
              setIsDragOver(false)
            }}
            onDrop={(event) => {
              event.preventDefault()
              setIsDragOver(false)
              const file = event.dataTransfer.files?.[0] ?? null
              if (file) {
                void onFileChange(file)
              }
            }}
          >
            <Empty
              className={cn(
                "border border-dashed border-border/80 bg-muted/30 transition-colors hover:border-foreground/20 hover:bg-muted/45",
                isDragOver && "border-foreground/40 bg-muted/60"
              )}
            >
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ImageUp />
                </EmptyMedia>
                <EmptyTitle>{messages.chooseImageLabel}</EmptyTitle>
                <EmptyDescription>{messages.uploadHint}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          </label>
        )}
        <input
          id={inputId}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif,image/x-icon,image/*"
          className="sr-only"
          onChange={(event) => {
            void onFileChange(event.target.files?.[0] ?? null)
            event.target.value = ""
          }}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              void onUseDemo()
            }}
          >
            <Sparkles data-icon="inline-start" />
            {messages.useDemoLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export { UploadCard }
