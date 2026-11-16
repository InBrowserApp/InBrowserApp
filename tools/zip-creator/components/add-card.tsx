import { useId, useRef, useState } from "react"

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
import { FileArchive, Folder, Plus } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import {
  captureDrop,
  readDrop,
  readFolder,
  selectFiles,
} from "../core/selection"

import type { FolderHandle } from "../core/selection"
import type { Messages } from "../types"
import type { Creator } from "../use-zip-creator"
import type { DragEvent } from "react"

export function AddCard({
  creator: c,
  messages: m,
}: {
  creator: Creator
  messages: Messages
}) {
  const filesRef = useRef<HTMLInputElement>(null)
  const folderRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const depth = useRef(0)
  const id = useId()
  const disabled = c.status !== null

  function drop(event: DragEvent) {
    event.preventDefault()
    depth.current = 0
    setDragging(false)
    if (disabled) return
    const sources = captureDrop(event.dataTransfer)
    void c.add((signal) => readDrop(sources, signal))
  }

  function pickFolder() {
    const picker = (
      window as Window & { showDirectoryPicker?: () => Promise<FolderHandle> }
    ).showDirectoryPicker
    if (picker) {
      // Invoke the native picker in the user gesture, before any await.
      const selected = picker.call(window)
      void c.add(async (signal) => readFolder(await selected, signal))
    } else {
      folderRef.current?.click()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{m.addTitle}</CardTitle>
        <CardDescription>{m.addDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          onDragEnter={(event) => {
            event.preventDefault()
            if (!disabled && event.dataTransfer.types.includes("Files")) {
              depth.current++
              setDragging(true)
            }
          }}
          onDragLeave={() => {
            depth.current = Math.max(0, depth.current - 1)
            if (!depth.current) setDragging(false)
          }}
          onDragOver={(event) => {
            event.preventDefault()
            event.dataTransfer.dropEffect = disabled ? "none" : "copy"
          }}
          onDrop={drop}
          className={cn(
            "rounded-lg border border-dashed border-input bg-muted/20 motion-safe:transition-colors",
            dragging && "border-primary bg-primary/5"
          )}
        >
          <Empty className="min-h-44">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileArchive aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>
                {c.status === "reading" ? m.reading : m.dropTitle}
              </EmptyTitle>
              <EmptyDescription>{m.dropDescription}</EmptyDescription>
            </EmptyHeader>
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                type="button"
                disabled={disabled}
                onClick={() => filesRef.current?.click()}
              >
                <Plus aria-hidden="true" data-icon="inline-start" />
                {m.addFiles}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={disabled}
                onClick={pickFolder}
              >
                <Folder aria-hidden="true" data-icon="inline-start" />
                {m.addFolder}
              </Button>
            </div>
          </Empty>
        </div>
        <input
          ref={filesRef}
          id={`${id}-files`}
          type="file"
          name="zip-files"
          multiple
          hidden
          aria-label={m.addFiles}
          disabled={disabled}
          onChange={(event) => {
            const files = Array.from(event.target.files ?? [])
            event.target.value = ""
            if (files.length) void c.add(async () => selectFiles(files))
          }}
        />
        <input
          ref={folderRef}
          id={`${id}-folders`}
          type="file"
          name="zip-folders"
          multiple
          {...{ webkitdirectory: "" }}
          hidden
          aria-label={m.addFolder}
          disabled={disabled}
          onChange={(event) => {
            const files = Array.from(event.target.files ?? [])
            event.target.value = ""
            if (files.length) void c.add(async () => selectFiles(files))
          }}
        />
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-sm text-muted-foreground">
        <p>{m.localNote}</p>
        <p>{m.folderNote}</p>
      </CardFooter>
    </Card>
  )
}
