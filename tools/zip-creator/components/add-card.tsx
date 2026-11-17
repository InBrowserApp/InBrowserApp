import { useId, useRef } from "react"

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

import { readFolder, selectFiles } from "../core/selection"

import type { FolderHandle } from "../core/selection"
import type { Messages } from "../types"
import type { Creator } from "../use-zip-creator"
import type { ZipDrag } from "../use-zip-drag"
import type { ChangeEvent } from "react"

export function AddCard({
  creator: c,
  messages: m,
  drag,
}: {
  creator: Creator
  messages: Messages
  drag: ZipDrag
}) {
  const filesRef = useRef<HTMLInputElement>(null)
  const folderRef = useRef<HTMLInputElement>(null)
  const id = useId()
  const disabled = c.status !== null
  const drop = drag.dropTarget(c.directory, "add")

  function selected(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ""
    if (files.length) void c.add(async () => selectFiles(files))
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
          {...drop.props}
          className={cn(
            "rounded-lg border border-dashed border-input bg-muted/20 motion-safe:transition-colors",
            drop.isOver && "border-primary bg-primary/5"
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
                className="min-h-11"
                disabled={disabled}
                onClick={() => filesRef.current?.click()}
              >
                <Plus aria-hidden="true" data-icon="inline-start" />
                {m.addFiles}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="min-h-11"
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
          onChange={selected}
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
          onChange={selected}
        />
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-sm text-muted-foreground">
        <p className="flex max-w-full min-w-0 gap-1">
          <span className="shrink-0">{m.addingTo}:</span>
          <bdi className="truncate" title={c.directory || m.root}>
            {c.directory || m.root}
          </bdi>
        </p>
        <p>{m.localNote}</p>
        <p>{m.folderNote}</p>
      </CardFooter>
    </Card>
  )
}
