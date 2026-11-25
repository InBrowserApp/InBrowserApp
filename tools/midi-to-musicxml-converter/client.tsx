import { useId, useState } from "react"
import { FileDropPicker } from "@workspace/ui/components/tool/file-drop-picker"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import { Label } from "@workspace/ui/components/ui/label"
import { Download, Piano } from "@workspace/ui/icons"
import { downloadBlob } from "@workspace/ui/lib/download-blob"
import { midiToMusicXml, type Grid } from "@workspace/midi-notation"

import type { SubmitEvent } from "react"
import type english from "./messages/en.json"

type ErrorResult = Extract<ReturnType<typeof midiToMusicXml>, { error: string }>

export default function MidiToMusicXml({
  messages: m,
}: {
  messages: typeof english
}) {
  const id = useId()
  const [file, setFile] = useState<File>()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<ErrorResult["error"]>()

  async function convert(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy || !file) return
    const grid = Number(new FormData(event.currentTarget).get("grid")) as Grid
    setBusy(true)
    setError(undefined)
    try {
      const title = file.name.replace(/\.(mid|midi)$/i, "")
      const result = midiToMusicXml(
        new Uint8Array(await file.arrayBuffer()),
        grid,
        title,
        m.part
      )
      if ("error" in result) {
        setError(result.error)
        return
      }
      downloadBlob(
        new Blob([result.xml], {
          type: "application/vnd.recordare.musicxml+xml",
        }),
        `${title}.musicxml`
      )
    } catch {
      setError("invalidMidi")
    } finally {
      setBusy(false)
    }
  }

  return (
    <fieldset className="space-y-4" disabled={busy} aria-busy={busy}>
      <FileDropPicker
        name={file?.name ?? ""}
        accept=".mid,.midi,audio/midi,audio/x-midi"
        formats=".mid · .midi"
        icon={Piano}
        labels={m}
        onFile={(next) => {
          if (busy) return
          setFile(next)
          setError(undefined)
        }}
      />
      <ToolPanelCard>
        <ToolPanelCardContent>
          <form
            className="space-y-4"
            onSubmit={convert}
            onChange={() => setError(undefined)}
          >
            <div className="space-y-2">
              <Label htmlFor={id}>{m.quantization}</Label>
              <select
                id={id}
                name="grid"
                defaultValue="16"
                aria-describedby={`${id}-hint`}
                className="min-h-11 w-full max-w-sm rounded-lg border border-input bg-background px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring sm:min-h-9"
              >
                <option value="8">{m.eighth}</option>
                <option value="16">{m.sixteenth}</option>
                <option value="32">{m.thirtySecond}</option>
              </select>
              <p id={`${id}-hint`} className="text-sm text-muted-foreground">
                {m.quantizationHint}
              </p>
            </div>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {m[error]}
              </p>
            )}
            <Button
              type="submit"
              className="min-h-11 w-full sm:w-auto"
              disabled={!file || busy}
            >
              <Download data-icon="inline-start" aria-hidden="true" />
              {m.download}
            </Button>
          </form>
        </ToolPanelCardContent>
      </ToolPanelCard>
    </fieldset>
  )
}
