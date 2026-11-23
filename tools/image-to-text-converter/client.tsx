import { useCallback, useEffect, useId, useRef, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import { CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import { Checkbox } from "@workspace/ui/components/ui/checkbox"
import { Label } from "@workspace/ui/components/ui/label"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Download, ScanText } from "@workspace/ui/icons"

import { SourcePanel } from "./source-panel"
import { LanguagePicker } from "./language-picker"
import { defaultLanguage, isChinese, type Language } from "./languages"
import type { Messages } from "./messages"

type Status =
  | "loading"
  | "recognizing"
  | "ready"
  | "emptyResult"
  | "recognitionFailed"

function downloadText(text: string, imageName: string) {
  const file = new Blob([text], { type: "text/plain;charset=utf-8" })
  const url = URL.createObjectURL(file)
  const link = document.createElement("a")
  link.href = url
  link.download = `${imageName.replace(/\.[^.]+$/, "")}.txt`
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export default function Client({
  lang,
  messages: m,
}: {
  lang: string
  messages: Messages
}) {
  const [image, setImage] = useState<File | null>(null)
  const [language, setLanguage] = useState<Language>(() =>
    defaultLanguage(lang)
  )
  const [includeEnglish, setIncludeEnglish] = useState(() =>
    isChinese(defaultLanguage(lang))
  )
  const [text, setText] = useState("")
  const [status, setStatus] = useState<Status | null>(null)
  const [progress, setProgress] = useState(0)
  const job = useRef<AbortController | null>(null)
  const englishId = useId()
  const resultId = useId()
  const busy = status === "loading" || status === "recognizing"

  useEffect(() => () => job.current?.abort(), [])

  const changeImage = useCallback((file: File) => {
    job.current?.abort()
    setImage(file)
    setText("")
    setStatus(null)
  }, [])

  async function recognize() {
    if (!image || busy) return

    const run = new AbortController()
    job.current = run
    setStatus("loading")
    try {
      const { recognizeImage } = await import("./recognize")
      const result = await recognizeImage(
        image,
        language,
        includeEnglish,
        run.signal,
        (value) => {
          if (run.signal.aborted) return
          setProgress(value)
          setStatus("recognizing")
        }
      )
      if (run.signal.aborted) return
      setText(result)
      setStatus(result ? "ready" : "emptyResult")
    } catch {
      if (!run.signal.aborted) setStatus("recognitionFailed")
    } finally {
      if (job.current === run) job.current = null
    }
  }

  return (
    <div className="grid items-stretch gap-4 lg:grid-cols-2">
      <SourcePanel image={image} messages={m} onImage={changeImage}>
        <div className="flex flex-wrap items-end gap-3">
          <LanguagePicker
            lang={lang}
            language={language}
            disabled={busy}
            messages={m}
            onChange={(next) => {
              if (next !== language) {
                setLanguage(next)
                setIncludeEnglish(isChinese(next))
              }
            }}
          />
          <Button
            type="button"
            disabled={!image || busy}
            onClick={() => void recognize()}
          >
            <ScanText data-icon="inline-start" aria-hidden="true" />
            {m.recognize}
          </Button>
        </div>
        {language !== "eng" ? (
          <div className="flex items-center gap-2">
            <Checkbox
              id={englishId}
              checked={includeEnglish}
              disabled={busy}
              onCheckedChange={(checked) => setIncludeEnglish(checked === true)}
            />
            <Label htmlFor={englishId} className="font-normal">
              {m.includeEnglish}
            </Label>
          </div>
        ) : null}
        <div role="status" className="text-sm text-muted-foreground">
          {status && m[status]}
        </div>
        {status === "recognizing" ? (
          <progress
            className="h-1.5 w-full accent-primary"
            max={1}
            value={progress}
            aria-label={m.recognizing}
          />
        ) : null}
      </SourcePanel>
      <ToolPanelCard className="min-w-0">
        <CardHeader>
          <CardTitle>
            <label htmlFor={resultId}>{m.result}</label>
          </CardTitle>
        </CardHeader>
        <ToolPanelCardContent className="gap-3">
          <Textarea
            id={resultId}
            dir="auto"
            className="min-h-48 flex-1 resize-y lg:min-h-56"
            value={text}
            readOnly={busy || (!text && status !== "ready")}
            onChange={(event) => setText(event.currentTarget.value)}
          />
          <div className="flex flex-wrap gap-2">
            <ToolCopyButton
              value={text}
              copyLabel={m.copy}
              copiedLabel={m.copied}
              failedLabel={m.copyFailed}
              size="default"
              disabled={busy}
            />
            <Button
              type="button"
              variant="outline"
              disabled={busy || !text}
              onClick={() => {
                if (image) downloadText(text, image.name)
              }}
            >
              <Download data-icon="inline-start" aria-hidden="true" />
              {m.download}
            </Button>
          </div>
        </ToolPanelCardContent>
      </ToolPanelCard>
    </div>
  )
}
