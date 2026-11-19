import { useEffect, useId, useRef, useState } from "react"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { Film, LoaderCircle } from "@workspace/ui/icons"

import { Frames } from "./animation-maker/frames"
import { Preview } from "./animation-maker/preview"
import { Upload } from "./animation-maker/upload"
import { animationSize, MAX_EDGE } from "@workspace/raster-image/animation-size"
import {
  DEFAULT_DURATION,
  readFrame,
  requestAnimation,
} from "./animation-maker/files"
import type { AnimationResult } from "@workspace/raster-image/animation-worker"
import type { Frame, Messages } from "./animation-maker/types"

export type AnimationMakerProps = {
  language: string
  messages: Messages
}

export function AnimationMaker({
  messages,
  language,
  createWorker,
  downloadName,
  maxPlays,
}: AnimationMakerProps & {
  createWorker: () => Worker
  downloadName: string
  maxPlays: number
}) {
  const [frames, setFrames] = useState<Frame[]>([])
  const [duration, setDuration] = useState(DEFAULT_DURATION)
  const [plays, setPlays] = useState("0")
  const [busy, setBusy] = useState<"reading" | "creating" | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [result, setResult] = useState<AnimationResult | null>(null)
  const workerRef = useRef<Worker | null>(null)
  const uploadButton = useRef<HTMLButtonElement>(null)
  const formId = useId()
  const loopId = useId()
  const size = animationSize(frames)
  const number = new Intl.NumberFormat(language, { useGrouping: false })

  useEffect(() => () => workerRef.current?.terminate(), [])

  async function addFiles(files: File[]) {
    if (!files.length || busy !== null) return
    setBusy("reading")
    const accepted: Frame[] = []
    const failed: string[] = []
    // Read one bitmap at a time to keep decoded image memory bounded.
    for (const file of files) {
      try {
        accepted.push(await readFrame(file, duration))
      } catch {
        failed.push(
          messages.imageError.replace(
            "{name}",
            () => `\u2068${file.name}\u2069`
          )
        )
      }
    }
    if (accepted.length) {
      setFrames((current) => [...current, ...accepted])
      setResult(null)
    }
    setErrors(failed)
    setBusy(null)
  }

  function editFrames(update: (current: Frame[]) => Frame[]) {
    setFrames(update)
    setResult(null)
  }

  async function createAnimation() {
    if (frames.length < 2 || busy !== null) return
    setErrors([])
    setResult(null)
    setBusy("creating")
    try {
      const worker = createWorker()
      workerRef.current = worker
      setResult(
        await requestAnimation(worker, {
          ...size,
          plays: Number(plays),
          frames: frames.map((frame) => ({
            file: frame.file,
            duration: Number(frame.duration),
          })),
        })
      )
    } catch {
      setErrors([messages.encodeError])
    } finally {
      workerRef.current?.terminate()
      workerRef.current = null
      setBusy(null)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Upload
        buttonRef={uploadButton}
        compact={frames.length > 0}
        disabled={busy !== null}
        reading={busy === "reading"}
        messages={messages}
        onFiles={(files) => void addFiles(files)}
      />
      {errors.length > 0 && (
        <Alert variant="destructive" className="wrap-anywhere">
          <AlertDescription>
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </AlertDescription>
        </Alert>
      )}
      <span role="status" className="sr-only">
        {busy === "reading" && messages.readingImages}
        {busy === "creating" && messages.creatingAnimation}
        {result && messages.preview}
      </span>
      {frames.length > 0 && (
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(18rem,2fr)]">
          <Frames
            images={frames}
            messages={messages}
            language={language}
            disabled={busy !== null}
            formId={formId}
            defaultDuration={duration}
            onDuration={(frame, value) =>
              editFrames((current) =>
                current.map((item) =>
                  item.id === frame.id ? { ...item, duration: value } : item
                )
              )
            }
            onApplyDuration={(value) => {
              setDuration(value)
              editFrames((current) =>
                current.map((frame) => ({ ...frame, duration: value }))
              )
            }}
            onMove={(frame, index) =>
              editFrames((current) => {
                const ordered = current.filter((item) => item.id !== frame.id)
                ordered.splice(index, 0, frame)
                return ordered
              })
            }
            onRemove={(frame) => {
              if (frames.length === 1) uploadButton.current?.focus()
              editFrames((current) =>
                current.filter((item) => item.id !== frame.id)
              )
            }}
          />
          <div className="flex min-w-0 flex-col gap-4">
            <form
              id={formId}
              onSubmit={(event) => {
                event.preventDefault()
                void createAnimation()
              }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>
                    <h2>{messages.settings}</h2>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <Field>
                    <FieldLabel htmlFor={loopId}>
                      {messages.loopCount}
                    </FieldLabel>
                    <Input
                      id={loopId}
                      name="loop-count"
                      aria-describedby={`${loopId}-hint`}
                      type="number"
                      dir="ltr"
                      className="max-w-28 tabular-nums"
                      min={0}
                      max={maxPlays}
                      required
                      disabled={busy !== null}
                      value={plays}
                      onChange={(event) => {
                        setPlays(event.target.value)
                        setResult(null)
                      }}
                    />
                    <FieldDescription
                      id={`${loopId}-hint`}
                      className="text-start"
                    >
                      {messages.loopHint}
                    </FieldDescription>
                  </Field>
                  <p className="text-sm text-muted-foreground">
                    {messages.canvasHint.replace("{size}", () =>
                      number.format(MAX_EDGE)
                    )}
                  </p>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2">
                  <Button
                    type="submit"
                    disabled={frames.length < 2 || busy !== null}
                    className="h-auto min-h-9 whitespace-normal"
                  >
                    {busy === "creating" ? (
                      <LoaderCircle
                        aria-hidden="true"
                        data-icon="inline-start"
                        className="motion-safe:animate-spin"
                      />
                    ) : (
                      <Film aria-hidden="true" data-icon="inline-start" />
                    )}
                    {busy === "creating"
                      ? messages.creatingAnimation
                      : messages.createAnimation}
                  </Button>
                  {frames.length < 2 && (
                    <p className="text-sm text-muted-foreground">
                      {messages.minimumFrames}
                    </p>
                  )}
                </CardFooter>
              </Card>
            </form>
            {result && (
              <Preview
                result={result}
                downloadName={downloadName}
                width={size.width}
                height={size.height}
                language={language}
                messages={messages}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
