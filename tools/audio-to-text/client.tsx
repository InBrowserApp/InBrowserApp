import { useEffect, useId, useMemo, useRef, useState } from "react"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import { Card, CardContent } from "@workspace/ui/components/ui/card"
import { Label } from "@workspace/ui/components/ui/label"
import {
  Captions,
  LoaderCircle,
  Lock,
  TriangleAlert,
} from "@workspace/ui/icons"
import { AudioPicker, NativeSelect } from "./input-fields"
import { ModelPicker } from "./model-picker"
import { SENSE_VOICE_LANGUAGES } from "./models"
import { TranscriptResult } from "./transcript-result"
import { useTranscription } from "./use-transcription"
import type { AudioSource } from "./input-fields"
import type { ModelId } from "./models"
import type { Messages } from "./types"

function supportsLanguage(model: ModelId, code: string) {
  return model === "senseVoice"
    ? SENSE_VOICE_LANGUAGES.some((supported) => supported === code)
    : code !== "yue"
}

export default function Client({
  messages: m,
  lang,
  languages,
}: {
  messages: Messages
  lang: string
  languages: { code: string; name: string }[]
}) {
  const transcription = useTranscription()
  const [source, setSource] = useState<AudioSource>()
  const [model, setModel] = useState<ModelId>("base")
  const [language, setLanguage] = useState("")
  const audio = useRef<HTMLAudioElement>(null)
  const id = useId()
  const { status, segments, partialSegments, error, fallback } = transcription

  useEffect(() => {
    return () => {
      if (source) URL.revokeObjectURL(source.url)
    }
  }, [source])

  const modelLanguages = useMemo(
    () => languages.filter(({ code }) => supportsLanguage(model, code)),
    [model, languages]
  )

  function chooseModel(next: ModelId) {
    setModel(next)
    setLanguage((current) => (supportsLanguage(next, current) ? current : ""))
  }

  function chooseFile(file: File) {
    transcription.clear()
    setSource({ file, url: URL.createObjectURL(file) })
  }

  const statusText = status ? m[status.type] : ""
  const progress =
    status && status.type !== "decoding" ? status.progress : undefined
  const percent =
    progress === undefined
      ? undefined
      : new Intl.NumberFormat(lang, {
          style: "percent",
          maximumFractionDigits: 1,
        }).format(Math.floor(progress * 1000) / 1000)
  const showDownloadPercent =
    status?.type === "loading" && percent !== undefined
  const eta = status?.type === "transcribing" ? status.etaSeconds : undefined
  const preview = status?.type === "transcribing" ? status.preview : undefined
  const transcribing = status?.type === "transcribing"
  const remainingTime =
    eta === undefined
      ? undefined
      : new Intl.NumberFormat(lang, {
          style: "unit",
          unit: eta < 60 ? "second" : "minute",
          unitDisplay: "short",
          maximumFractionDigits: 1,
        }).format(eta < 60 ? eta : eta / 60)
  const backend =
    status && status.type !== "decoding"
      ? fallback
        ? m.cpuFallback
        : status.backend === "webgpu"
          ? m.gpu
          : m.cpu
      : ""

  return (
    <div className="grid min-w-0 gap-6">
      <Card>
        <CardContent className="grid min-w-0 gap-5 sm:gap-6">
          <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.7fr)] lg:gap-8">
            <AudioPicker
              source={source}
              messages={m}
              disabled={!!status}
              audioRef={audio}
              onFile={chooseFile}
            />

            <div className="grid content-start gap-4">
              <ModelPicker
                messages={m}
                lang={lang}
                model={model}
                disabled={!!status}
                onChange={chooseModel}
              />

              <div className="grid gap-2">
                <Label htmlFor={`${id}-language`}>{m.language}</Label>
                <NativeSelect
                  id={`${id}-language`}
                  value={language}
                  disabled={!!status}
                  onChange={(event) => setLanguage(event.currentTarget.value)}
                >
                  <option value="">{m.autoLanguage}</option>
                  {modelLanguages.map(({ code, name }) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
                </NativeSelect>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  size="lg"
                  className="h-auto min-h-10 whitespace-normal"
                  disabled={!source || !!status}
                  onClick={() => {
                    if (source)
                      void transcription.start(source.file, model, language)
                  }}
                >
                  <Captions data-icon="inline-start" aria-hidden="true" />
                  {m.start}
                </Button>
                {status && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={transcription.stop}
                  >
                    {m.cancel}
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div role="status" className={status ? "grid gap-2" : "sr-only"}>
            {status && (
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm">
                <p className="inline-flex items-center gap-2">
                  {!transcribing && (
                    <LoaderCircle
                      className="size-4 shrink-0 motion-safe:animate-spin"
                      aria-hidden="true"
                    />
                  )}
                  <span className={showDownloadPercent ? "sr-only" : undefined}>
                    {statusText}
                  </span>
                  {percent !== undefined && (
                    <bdi aria-hidden="true">
                      {showDownloadPercent
                        ? m.loadingPercent.replace("{percent}", percent)
                        : percent}
                    </bdi>
                  )}
                </p>
                {backend && (
                  <p className="text-xs text-muted-foreground">{backend}</p>
                )}
              </div>
            )}
            {progress !== undefined && (
              <progress
                aria-label={statusText}
                max={1}
                value={progress}
                className="h-1.5 w-full accent-primary"
              />
            )}
            {remainingTime && (
              <p className="text-xs text-muted-foreground">
                {m.remainingTime.replace(
                  "{time}",
                  `\u2068${remainingTime}\u2069`
                )}
              </p>
            )}
          </div>

          {error && (
            <Alert
              variant={error === "noSpeech" ? "default" : "destructive"}
              role="alert"
            >
              <TriangleAlert aria-hidden="true" />
              <AlertDescription>{m[error]}</AlertDescription>
            </Alert>
          )}
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="size-3.5 shrink-0" aria-hidden="true" />
            {m.privacy}
          </p>
        </CardContent>
      </Card>

      {source && (transcribing || segments.length > 0) && (
        <TranscriptResult
          key={source.url}
          filename={source.file.name}
          messages={m}
          segments={transcribing ? partialSegments : segments}
          transcribing={transcribing}
          preview={preview}
          audioRef={audio}
          onEdit={(index, text) => {
            transcription.setSegments((previous) =>
              previous.map((segment, i) =>
                i === index ? { ...segment, text } : segment
              )
            )
          }}
        />
      )}
    </div>
  )
}
