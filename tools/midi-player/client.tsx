import { useEffect, useState } from "react"
import { FileDropPicker } from "@workspace/ui/components/tool/file-drop-picker"
import { FileMusic } from "@workspace/ui/icons"
import {
  midiExample,
  MidiSourceError,
  readMidiSource,
  type MidiSource,
} from "./midi-source"
import { MidiTransport } from "./transport"
import type english from "./messages/en.json"

type Copy = { messages: typeof english; language: string }
type ReadResult = { source: MidiSource } | { error: MidiSourceError["key"] }

function PlaybackFile({
  input,
  messages: m,
  language,
}: Copy & { input: File }) {
  const [result, setResult] = useState<ReadResult>()

  useEffect(() => {
    let cancelled = false
    async function read() {
      try {
        const source = readMidiSource(await input.arrayBuffer())
        if (!cancelled) setResult({ source })
      } catch (error) {
        if (!cancelled)
          setResult({
            error: error instanceof MidiSourceError ? error.key : "invalidMidi",
          })
      }
    }
    void read()
    return () => {
      cancelled = true
    }
  }, [input])

  if (!result)
    return (
      <p
        role="status"
        className="rounded-xl border p-4 text-sm text-muted-foreground"
      >
        {m.reading}
      </p>
    )
  if ("error" in result)
    return (
      <p
        role="alert"
        className="rounded-xl border p-4 text-sm text-destructive"
      >
        {m[result.error]}
      </p>
    )
  return (
    <MidiTransport source={result.source} messages={m} language={language} />
  )
}

export default function MidiPlayer({ messages: m, language }: Copy) {
  const [source, setSource] = useState<{ file: File; version: number }>()
  function chooseFile(file: File) {
    setSource((previous) => ({ file, version: (previous?.version ?? 0) + 1 }))
  }

  return (
    <div className="space-y-4">
      <FileDropPicker
        labels={m}
        name={source?.file.name ?? ""}
        accept=".mid,.midi,audio/midi,audio/x-midi"
        formats=".mid · .midi"
        icon={FileMusic}
        onFile={chooseFile}
        example={{ label: m.example, onClick: () => chooseFile(midiExample()) }}
      />
      {source && (
        <PlaybackFile
          key={source.version}
          input={source.file}
          messages={m}
          language={language}
        />
      )}
    </div>
  )
}
