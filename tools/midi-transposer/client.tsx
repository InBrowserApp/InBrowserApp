import { useId, useState } from "react"
import { FileDropPicker } from "@workspace/ui/components/tool/file-drop-picker"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import { Checkbox } from "@workspace/ui/components/ui/checkbox"
import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"
import { Download, Piano } from "@workspace/ui/icons"
import { downloadBlob } from "@workspace/ui/lib/download-blob"
import { transposeMidi } from "./core/transpose"

import type { SubmitEvent } from "react"
import type english from "./messages/en.json"
import type { MidiEditError } from "./core/transpose"

export default function MidiTransposer({
  messages,
}: {
  messages: typeof english
}) {
  const fieldId = useId()
  const [file, setFile] = useState<File>()
  const [error, setError] = useState<MidiEditError>()
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!file || busy) return
    const data = new FormData(event.currentTarget)
    setError(undefined)
    setBusy(true)
    try {
      const result = transposeMidi(new Uint8Array(await file.arrayBuffer()), {
        semitones: Number(data.get("semitones")),
        speed: Number(data.get("tempo")),
        keepDrums: data.has("drums"),
      })
      if ("error" in result) {
        setError(result.error)
        return
      }
      const name = file.name.replace(/\.(mid|midi)$/i, "")
      downloadBlob(
        new Blob([result.bytes], { type: "audio/midi" }),
        `${name}-edited.mid`
      )
    } catch {
      setError("invalidFile")
    } finally {
      setBusy(false)
    }
  }

  return (
    <fieldset className="space-y-4" aria-busy={busy} disabled={busy}>
      <FileDropPicker
        name={file?.name ?? ""}
        accept=".mid,.midi,audio/midi,audio/x-midi"
        formats=".mid · .midi"
        icon={Piano}
        labels={messages}
        onFile={(next) => {
          if (busy) return
          setFile(next)
          setError(undefined)
        }}
      />
      <ToolPanelCard>
        <ToolPanelCardContent>
          <form
            className="space-y-5"
            onChange={() => setError(undefined)}
            onSubmit={handleSubmit}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`${fieldId}-pitch`}>{messages.pitch}</Label>
                <Input
                  id={`${fieldId}-pitch`}
                  name="semitones"
                  type="number"
                  dir="ltr"
                  defaultValue={0}
                  min={-24}
                  max={24}
                  required
                  aria-describedby={`${fieldId}-pitch-hint`}
                />
                <p
                  id={`${fieldId}-pitch-hint`}
                  className="text-sm text-muted-foreground"
                >
                  {messages.pitchHint}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${fieldId}-tempo`}>{messages.speed}</Label>
                <Input
                  id={`${fieldId}-tempo`}
                  name="tempo"
                  type="number"
                  dir="ltr"
                  defaultValue={100}
                  min={25}
                  max={400}
                  required
                  aria-describedby={`${fieldId}-tempo-hint`}
                />
                <p
                  id={`${fieldId}-tempo-hint`}
                  className="text-sm text-muted-foreground"
                >
                  {messages.speedHint}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id={`${fieldId}-drums`} name="drums" defaultChecked />
              <Label htmlFor={`${fieldId}-drums`}>{messages.keepDrums}</Label>
            </div>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {messages[error]}
              </p>
            )}
            <Button
              type="submit"
              disabled={!file || busy}
              className="min-h-11 w-full sm:w-auto"
            >
              <Download data-icon="inline-start" aria-hidden="true" />
              {messages.download}
            </Button>
          </form>
        </ToolPanelCardContent>
      </ToolPanelCard>
    </fieldset>
  )
}
