import { useEffect, useId, useState } from "react"

import { loadImageSource } from "@workspace/raster-image/browser-canvas"
import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import { Link2, Unlink2 } from "@workspace/ui/icons"

import type { Messages } from "./messages"
import { pixels } from "./numeric-input"

type Props = {
  widthInput: string
  heightInput: string
  firstFile: File | undefined
  ratio: number | null
  onRatioChange: (ratio: number | null) => void
  onChange: (widthInput: string, heightInput: string) => void
  messages: Messages
}

function useSourceDimensions(file: File | undefined) {
  const [dimensions, setDimensions] = useState<{
    file: File
    width: number
    height: number
  }>()

  useEffect(() => {
    if (!file) return
    let current = true

    void loadImageSource(file).then(
      (source) => {
        source.cleanup?.()
        if (current) {
          setDimensions({ file, width: source.width, height: source.height })
        }
      },
      () => {
        // The fields can still be set manually if the source is unreadable.
      }
    )

    return () => {
      current = false
    }
  }, [file])

  return dimensions?.file === file ? dimensions : undefined
}

function roundedPixels(value: number) {
  return String(Math.max(1, Math.round(value)))
}

export function ExactDimensions({
  widthInput,
  heightInput,
  firstFile,
  ratio,
  onRatioChange,
  onChange,
  messages,
}: Props) {
  const id = useId()
  const width = pixels(widthInput)
  const height = pixels(heightInput)
  const source = useSourceDimensions(firstFile)
  const validWidth = width > 0 || widthInput.trim() === ""
  const validHeight = height > 0 || heightInput.trim() === ""
  const canLock =
    (width > 0 && height > 0) || Boolean(source && validWidth && validHeight)

  function toggleRatio() {
    if (ratio !== null) {
      onRatioChange(null)
      return
    }

    if (width && height) {
      onRatioChange(width / height)
      return
    }

    if (!source || !canLock) return
    const sourceRatio = source.width / source.height
    onRatioChange(sourceRatio)
    if (width) {
      onChange(widthInput, roundedPixels(width / sourceRatio))
    } else if (height) {
      onChange(roundedPixels(height * sourceRatio), heightInput)
    } else {
      onChange(String(source.width), String(source.height))
    }
  }

  function changeWidth(value: string) {
    const nextWidth = pixels(value)
    const nextHeight =
      ratio !== null && nextWidth
        ? roundedPixels(nextWidth / ratio)
        : heightInput
    onChange(value, nextHeight)
  }

  function changeHeight(value: string) {
    const nextHeight = pixels(value)
    const nextWidth =
      ratio !== null && nextHeight
        ? roundedPixels(nextHeight * ratio)
        : widthInput
    onChange(nextWidth, value)
  }

  const RatioIcon = ratio === null ? Unlink2 : Link2

  return (
    <div className="grid gap-1.5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-end gap-2">
        <div className="grid gap-1.5">
          <label htmlFor={`${id}-width`} className="text-sm font-medium">
            {messages.width}
          </label>
          <Input
            id={`${id}-width`}
            inputMode="numeric"
            className="h-10 tabular-nums"
            aria-invalid={!validWidth}
            required
            value={widthInput}
            onChange={(event) => changeWidth(event.target.value)}
          />
        </div>
        <Button
          type="button"
          variant={ratio === null ? "outline" : "secondary"}
          size="icon"
          className="size-10"
          aria-label={messages.lockAspectRatio}
          aria-pressed={ratio !== null}
          aria-describedby={`${id}-hint`}
          title={messages.lockAspectRatio}
          disabled={ratio === null && !canLock}
          onClick={toggleRatio}
        >
          <RatioIcon aria-hidden="true" />
        </Button>
        <div className="grid gap-1.5">
          <label htmlFor={`${id}-height`} className="text-sm font-medium">
            {messages.height}
          </label>
          <Input
            id={`${id}-height`}
            inputMode="numeric"
            className="h-10 tabular-nums"
            aria-invalid={!validHeight}
            required
            value={heightInput}
            onChange={(event) => changeHeight(event.target.value)}
          />
        </div>
      </div>
      <p id={`${id}-hint`} className="text-xs text-muted-foreground">
        {messages.aspectRatioHint}
      </p>
    </div>
  )
}
