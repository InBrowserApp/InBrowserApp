import { useEffect, useRef, useState } from "react"
import { musicXmlExample } from "@workspace/score-export/musicxml-example"
import { scorePagePreviewBlob } from "@workspace/score-export/pages"
import { FileDropPicker } from "@workspace/ui/components/tool/file-drop-picker"
import { MidiListen } from "@workspace/ui/components/tool/midi-listen"
import { ScoreConverterLayout } from "@workspace/ui/components/tool/score-converter-layout"
import { ScorePagePreview } from "@workspace/ui/components/tool/score-page-preview"
import { Button } from "@workspace/ui/components/ui/button"
import { Download, FileMusic, LoaderCircle } from "@workspace/ui/icons"
import { useScoreDownload } from "@workspace/ui/lib/use-score-download"
import { useMidiFile } from "./use-midi-file"
import type english from "./messages/en.json"

type Copy = { messages: typeof english; language: string }

function ScoreConversion({
  input,
  messages: m,
  language,
}: Copy & { input: File }) {
  const [pages, setPages] = useState<SVGSVGElement[] | null>()
  const downloadButton = useRef<HTMLButtonElement>(null)
  const readMidi = useMidiFile(input)
  const { status: download, save } = useScoreDownload()

  useEffect(() => {
    let cancelled = false
    async function preview() {
      try {
        const { renderMusicXmlPages } =
          await import("@workspace/score-export/musicxml")
        if (cancelled) return
        const result = await renderMusicXmlPages(input)
        if (!cancelled) setPages(result)
      } catch {
        if (!cancelled) setPages(null)
      }
    }
    void preview()
    return () => {
      cancelled = true
    }
  }, [input])

  useEffect(() => {
    if (document.activeElement === document.body) {
      downloadButton.current?.focus({ preventScroll: true })
    }
  }, [])

  function downloadMidi() {
    void save(async () => {
      const file = await readMidi()
      return { blob: file, filename: file.name }
    })
  }

  return (
    <ScoreConverterLayout
      settings={
        <>
          <MidiListen readMidi={readMidi} messages={m} />
          <Button
            ref={downloadButton}
            type="button"
            className="h-auto min-h-11 w-full whitespace-normal"
            disabled={download === "busy"}
            onClick={downloadMidi}
          >
            {download === "busy" ? (
              <LoaderCircle
                aria-hidden="true"
                className="motion-safe:animate-spin"
              />
            ) : (
              <Download aria-hidden="true" />
            )}
            {download === "busy" ? m.downloadBusy : m.download}
          </Button>
          {download === "error" && (
            <p role="alert" className="text-sm text-destructive">
              {m.downloadError}
            </p>
          )}
        </>
      }
    >
      {pages ? (
        <ScorePagePreview
          pages={pages}
          makePreview={scorePagePreviewBlob}
          language={language}
          messages={m}
        />
      ) : pages === null ? (
        <p
          role="alert"
          className="rounded-xl border p-4 text-sm text-destructive"
        >
          {m.invalidScore}
        </p>
      ) : (
        <p
          role="status"
          className="rounded-xl border p-4 text-sm text-muted-foreground"
        >
          {m.loading}
        </p>
      )}
    </ScoreConverterLayout>
  )
}

export default function MusicXmlToMidi({ messages: m, language }: Copy) {
  const [source, setSource] = useState<{ file: File; version: number }>()
  function chooseFile(file: File) {
    setSource((previous) => ({ file, version: (previous?.version ?? 0) + 1 }))
  }

  return (
    <div className="space-y-4">
      <FileDropPicker
        name={source?.file.name ?? ""}
        accept=".musicxml,.xml,.mxl,application/vnd.recordare.musicxml,application/vnd.recordare.musicxml+xml"
        formats=".musicxml · .mxl · .xml"
        labels={m}
        icon={FileMusic}
        onFile={chooseFile}
        example={{
          label: m.example,
          onClick: () => chooseFile(musicXmlExample()),
        }}
      />
      {source && (
        <ScoreConversion
          key={source.version}
          input={source.file}
          messages={m}
          language={language}
        />
      )}
    </div>
  )
}
