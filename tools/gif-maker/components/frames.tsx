import { useId, useRef, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { FieldLabel } from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { ArrowDown, ArrowUp, GripVertical, Trash2 } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { DURATION_RANGE } from "../files"
import type { Frame, Messages } from "../types"

type FramesProps = {
  images: Frame[]
  messages: Messages
  language: string
  disabled: boolean
  formId: string
  defaultDuration: string
  onDuration: (frame: Frame, value: string) => void
  onApplyDuration: (value: string) => void
  onMove: (frame: Frame, index: number) => void
  onRemove: (frame: Frame) => void
}

export function Frames({
  images,
  messages,
  language,
  disabled,
  formId,
  defaultDuration,
  onDuration,
  onApplyDuration,
  onMove,
  onRemove,
}: FramesProps) {
  const durationId = useId()
  const dragging = useRef<Frame | null>(null)
  const [dropTarget, setDropTarget] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState("")
  const numbers = new Intl.NumberFormat(language)

  function move(frame: Frame, index: number) {
    onMove(frame, index)
    setAnnouncement(
      `${messages.frameLabel.replace("{number}", () => numbers.format(index + 1))} · ${frame.file.name}`
    )
  }

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>
          <h2>{messages.frames}</h2>
        </CardTitle>
        <CardDescription className="hidden pointer-fine:sm:block">
          {messages.orderHint}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(event) => {
            event.preventDefault()
            const value = new FormData(event.currentTarget).get("duration")
            onApplyDuration(String(value))
          }}
        >
          <div className="flex min-w-0 flex-col gap-1.5">
            <FieldLabel htmlFor={durationId}>{messages.duration}</FieldLabel>
            <Input
              id={durationId}
              name="duration"
              dir="ltr"
              type="number"
              className="w-24 tabular-nums"
              defaultValue={defaultDuration}
              disabled={disabled}
              required
              {...DURATION_RANGE}
            />
          </div>
          <Button
            type="submit"
            variant="outline"
            disabled={disabled}
            className="h-auto min-h-9 whitespace-normal"
          >
            {messages.applyDuration}
          </Button>
        </form>
        <span role="status" className="sr-only">
          {announcement}
        </span>
        <ol className="-m-1 flex max-h-[min(56dvh,34rem)] flex-col gap-2 overflow-y-auto p-1">
          {images.map((frame, index) => {
            const { file, thumbnail } = frame
            const name = file.name
            const frameLabel = messages.frameLabel.replace("{number}", () =>
              numbers.format(index + 1)
            )
            const moveUp = messages.moveUp.replace("{name}", () => name)
            const moveDown = messages.moveDown.replace("{name}", () => name)
            const remove = messages.remove.replace("{name}", () => name)
            const canMoveUp = index > 0
            const canMoveDown = index < images.length - 1
            return (
              <li
                key={frame.id}
                className={cn(
                  "grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-2 rounded-lg border bg-card p-2.5",
                  "sm:grid-cols-[auto_minmax(0,1fr)_auto]",
                  dropTarget === frame.id && "border-primary bg-primary/5"
                )}
                onDragOver={(event) => {
                  if (!dragging.current || disabled) return
                  event.preventDefault()
                  event.dataTransfer.dropEffect = "move"
                  setDropTarget(
                    dragging.current.id === frame.id ? null : frame.id
                  )
                }}
                onDrop={(event) => {
                  const source = dragging.current
                  if (!source || disabled) return
                  event.preventDefault()
                  if (source.id !== frame.id) move(source, index)
                  setDropTarget(null)
                }}
              >
                <div className="flex items-center gap-1">
                  <span
                    aria-hidden="true"
                    draggable={!disabled}
                    className="hidden cursor-grab p-1 text-muted-foreground active:cursor-grabbing pointer-fine:sm:inline-flex"
                    onDragStart={(event) => {
                      dragging.current = frame
                      event.dataTransfer.effectAllowed = "move"
                      event.dataTransfer.setData("text/plain", frame.id)
                      const row = event.currentTarget.closest("li")
                      if (row) event.dataTransfer.setDragImage(row, 18, 18)
                    }}
                    onDragEnd={() => {
                      dragging.current = null
                      setDropTarget(null)
                    }}
                  >
                    <GripVertical className="size-4" />
                  </span>
                  <img
                    alt=""
                    src={thumbnail}
                    width={48}
                    height={48}
                    draggable={false}
                    loading="lazy"
                    className="size-12 rounded-md bg-muted object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground tabular-nums">
                    {frameLabel}
                  </div>
                  <div className="truncate text-sm font-medium" title={name}>
                    <bdi>{name}</bdi>
                  </div>
                </div>
                <div className="col-span-2 flex items-center justify-between gap-2 sm:col-span-1">
                  <div className="flex items-center gap-1">
                    <Input
                      aria-label={messages.durationFor.replace(
                        "{name}",
                        () => name
                      )}
                      className="h-9 w-[5.25rem] tabular-nums"
                      name="frame-duration"
                      form={formId}
                      type="number"
                      dir="ltr"
                      disabled={disabled}
                      required
                      {...DURATION_RANGE}
                      value={frame.duration}
                      onChange={(event) =>
                        onDuration(frame, event.target.value)
                      }
                    />
                    <span
                      aria-hidden="true"
                      className="text-xs text-muted-foreground"
                    >
                      ms
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      aria-disabled={!canMoveUp}
                      disabled={disabled}
                      aria-label={moveUp}
                      title={moveUp}
                      size="icon"
                      type="button"
                      variant="ghost"
                      className="aria-disabled:opacity-40"
                      onClick={() => canMoveUp && move(frame, index - 1)}
                    >
                      <ArrowUp aria-hidden="true" />
                    </Button>
                    <Button
                      aria-disabled={!canMoveDown}
                      disabled={disabled}
                      aria-label={moveDown}
                      title={moveDown}
                      size="icon"
                      type="button"
                      variant="ghost"
                      className="aria-disabled:opacity-40"
                      onClick={() => canMoveDown && move(frame, index + 1)}
                    >
                      <ArrowDown aria-hidden="true" />
                    </Button>
                    <Button
                      disabled={disabled}
                      aria-label={remove}
                      title={remove}
                      size="icon"
                      type="button"
                      variant="ghost"
                      data-remove-frame
                      onClick={(event) => {
                        const row = event.currentTarget.closest("li")
                        const neighbor =
                          row?.nextElementSibling ?? row?.previousElementSibling
                        neighbor
                          ?.querySelector<HTMLButtonElement>(
                            "[data-remove-frame]"
                          )
                          ?.focus()
                        onRemove(frame)
                      }}
                    >
                      <Trash2 aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </CardContent>
    </Card>
  )
}
