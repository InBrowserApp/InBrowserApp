import { useState } from "react"
import { Settings } from "./components/settings"
import { SubtitleInput } from "./components/input"
import { SubtitleOutput } from "./components/output"
import { FORMATS, type Options } from "./core/formats"
import { convertBatch, type Conversion } from "./batch"
import type { Messages } from "./types"

const EXAMPLE =
  "1\n00:00:01,250 --> 00:00:03,500\nHello, world!\n你好，世界！\n\n2\n00:00:04,000 --> 00:00:06,000\n<i>Subtitles, in your browser.</i>\n"

export default function Client({ messages: m }: { messages: Messages }) {
  const [input, setInput] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [options, setOptions] = useState<Options>({
    source: "auto",
    target: "vtt",
    fps: 25,
    offset: 0,
  })
  const [encoding, setEncoding] = useState("auto")
  const [results, setResults] = useState<Conversion[]>([])
  const [busy, setBusy] = useState(false)
  function reset() {
    setResults([])
  }
  async function convert() {
    setBusy(true)
    const converted = await convertBatch(files, input, encoding, options)
    setResults(converted)
    setBusy(false)
  }
  return (
    <div className="grid gap-6">
      <p className="text-sm text-muted-foreground">{m.privacy}</p>
      <fieldset disabled={busy} className="min-w-0">
        <Settings
          options={options}
          encoding={encoding}
          messages={m}
          onChange={(value) => {
            setOptions(value)
            reset()
          }}
          onEncoding={(value) => {
            setEncoding(value)
            reset()
          }}
        />
      </fieldset>
      <div className="grid gap-6 xl:grid-cols-2">
        <SubtitleInput
          input={input}
          files={files}
          busy={busy}
          messages={m}
          onInput={(value) => {
            setInput(value)
            reset()
          }}
          onFiles={(value) => {
            setFiles(value)
            setInput("")
            reset()
          }}
          onExample={() => {
            setFiles([])
            setInput(EXAMPLE)
            setOptions({ ...options, source: "auto" })
            reset()
          }}
          onClear={() => {
            setFiles([])
            setInput("")
            reset()
          }}
          onConvert={() => {
            void convert()
          }}
        />
        <SubtitleOutput results={results} messages={m} />
      </div>
      <p className="text-xs text-muted-foreground">{m.fidelity}</p>
      <details className="text-sm text-muted-foreground">
        <summary className="cursor-pointer font-medium">{m.formats}</summary>
        <div className="mt-3 grid gap-3">
          <p>{m.formatsHint}</p>
          <p>{FORMATS.map((format) => format.label).join(" · ")}</p>
          <p>{m.jsonHint}</p>
          <p>{m.bitmapHint}</p>
        </div>
      </details>
    </div>
  )
}
