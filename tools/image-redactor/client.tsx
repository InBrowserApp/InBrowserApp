import { useId, useRef, useState } from "react"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import { Card } from "@workspace/ui/components/ui/card"
import { ImageUp, LoaderCircle, Lock, TriangleAlert } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import type { Messages } from "./types"
import { ExportCard } from "./client/export-card"
import { Settings } from "./client/settings"
import { Stage } from "./client/stage"
import { Toolbar } from "./client/toolbar"
import { useEditor } from "./client/use-editor"
import { editorKeyDown, useShortcuts } from "./client/use-shortcuts"

export default function ImageRedactor({ messages }: { messages: Messages }) {
  const editor = useEditor(messages)
  const input = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const id = useId()
  useShortcuts(editor)
  return (
    <div
      role="group"
      className="space-y-4"
      onKeyDown={(event) => editorKeyDown(event, editor)}
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
        void editor.load(event.dataTransfer.files[0])
      }}
    >
      <input
        ref={input}
        id={id}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-label={messages.chooseImage}
        onChange={(event) => {
          void editor.load(event.target.files?.[0])
          event.target.value = ""
        }}
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Lock aria-hidden="true" className="size-3.5" />
          {messages.localOnly}
        </p>
        {editor.source && (
          <p className="text-xs text-muted-foreground" role="status">
            {messages.regionCount.replace(
              "{count}",
              String(editor.regions.length)
            )}
          </p>
        )}
      </div>
      {editor.error && (
        <Alert variant="destructive" role="alert">
          <TriangleAlert aria-hidden="true" />
          <AlertDescription>{editor.error}</AlertDescription>
        </Alert>
      )}
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <Card
          className={cn(
            "min-w-0 gap-0 overflow-hidden py-0",
            dragging && "ring-2 ring-ring"
          )}
        >
          {editor.source ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-semibold">
                    {messages.editorTitle}
                  </h2>
                  <p
                    className="truncate text-xs text-muted-foreground"
                    title={editor.source.name}
                  >
                    {editor.source.name} · {editor.source.width} ×{" "}
                    {editor.source.height}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={editor.loading}
                  onClick={() => input.current?.click()}
                >
                  <ImageUp aria-hidden="true" />
                  {messages.changeImage}
                </Button>
              </div>
              <Toolbar editor={editor} messages={messages} />
              <Stage editor={editor} messages={messages} />
              <div className="flex justify-end border-t px-3 py-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={!editor.regions.length}
                  onClick={() => {
                    editor.commit([])
                    editor.setSelectedId(null)
                  }}
                >
                  {messages.clearAll}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex min-h-[28rem] flex-col items-center justify-center gap-5 p-6 text-center">
              <button
                type="button"
                onClick={() => input.current?.click()}
                className="flex w-full flex-1 flex-col items-center justify-center gap-4 rounded-xl border border-dashed bg-muted/20 px-6 py-10 transition-colors hover:bg-muted/40 focus-visible:outline-2 focus-visible:outline-ring"
              >
                <span className="grid size-14 place-items-center rounded-2xl border bg-background">
                  <ImageUp
                    aria-hidden="true"
                    className="size-7 text-muted-foreground"
                  />
                </span>
                <span className="text-lg font-semibold">
                  {messages.uploadTitle}
                </span>
                <span className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                  {messages.uploadHint}
                </span>
                <span className="max-w-sm text-xs leading-relaxed text-muted-foreground">
                  {messages.formatsHint}
                </span>
              </button>
              <Button
                type="button"
                variant="secondary"
                onClick={editor.example}
              >
                {messages.tryExample}
              </Button>
            </div>
          )}
          {editor.loading && (
            <p
              className="flex items-center justify-center gap-2 border-t p-3 text-sm"
              role="status"
            >
              <LoaderCircle
                aria-hidden="true"
                className="size-4 motion-safe:animate-spin"
              />
              {messages.loading}
            </p>
          )}
        </Card>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <Settings editor={editor} messages={messages} />
          <ExportCard editor={editor} messages={messages} />
        </div>
      </div>
      {editor.source && (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {messages.shortcuts}
        </p>
      )}
    </div>
  )
}
