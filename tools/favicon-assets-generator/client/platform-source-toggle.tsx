"use client"

import { useId } from "react"

import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Switch } from "@workspace/ui/components/ui/switch"
import { Trash2 } from "@workspace/ui/icons"

import { formatFileSize } from "./constants"
import type { FaviconMessages, ImageSource } from "./types"

type PlatformSourceToggleProps = Readonly<{
  messages: FaviconMessages
  enabled: boolean
  onToggle: (next: boolean) => void
  source: ImageSource | null
  onFileChange: (file: File | null) => void | Promise<void>
}>

function PlatformSourceToggle({
  messages,
  enabled,
  onToggle,
  source,
  onFileChange,
}: PlatformSourceToggleProps) {
  const inputId = useId()

  return (
    <div className="flex flex-col gap-3">
      <Field orientation="horizontal">
        <FieldLabel htmlFor={`${inputId}-toggle`} className="flex-1">
          {messages.useDifferentImageLabel}
          <FieldDescription className="font-normal">
            {messages.useDifferentImageDescription}
          </FieldDescription>
        </FieldLabel>
        <Switch
          id={`${inputId}-toggle`}
          checked={enabled}
          onCheckedChange={onToggle}
        />
      </Field>

      {enabled ? (
        <div className="flex flex-col gap-3 rounded-lg border border-dashed border-border/70 bg-muted/30 p-3">
          {source ? (
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-border/70 bg-[conic-gradient(at_top_left,_var(--muted)_25%,_transparent_25%,_transparent_75%,_var(--muted)_75%),conic-gradient(at_top_left,_var(--muted)_25%,_transparent_25%,_transparent_75%,_var(--muted)_75%)] bg-[length:8px_8px] bg-[position:0_0,4px_4px]">
                <img
                  src={source.objectUrl}
                  alt={messages.filePreviewAlt}
                  className="h-full w-full object-contain p-1"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="truncate text-sm font-medium text-foreground">
                  {source.file.name}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="font-mono">
                    {source.width} × {source.height}
                  </Badge>
                  <Badge variant="secondary">
                    {formatFileSize(source.file.size)}
                  </Badge>
                </div>
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  void onFileChange(null)
                }}
              >
                <Trash2 data-icon="inline-start" />
                {messages.removeDedicatedImageLabel}
              </Button>
            </div>
          ) : (
            <label
              htmlFor={inputId}
              className="cursor-pointer text-sm font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              {messages.uploadDedicatedImageLabel}
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
        </div>
      ) : null}
    </div>
  )
}

export { PlatformSourceToggle }
