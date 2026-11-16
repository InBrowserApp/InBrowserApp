import { useState } from "react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { download } from "./browser"
import { validFiles } from "./core/files"
import { ExportPanel } from "./components/export-panel"
import { Preview } from "./components/preview"
import { Settings } from "./components/settings"
import { Upload } from "./components/upload"
import { defaultOptions, type Messages, type Options } from "./types"
import { useImage } from "./use-image"

export default function Client({ messages: m }: { messages: Messages }) {
  const [files, setFiles] = useState<File[]>([])
  const [selected, setSelected] = useState<File | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [options, setOptions] = useState(() => defaultOptions(m.defaultText))
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState("")
  const file =
    selected && files.includes(selected) ? selected : (files[0] ?? null)
  const source = useImage(file)
  const logo = useImage(logoFile)
  const imageError = source?.error || (options.kind === "image" && logo?.error)
  const ready = Boolean(
    source?.source &&
    (options.kind === "text" ? options.text.trim() : logo?.source)
  )

  function updateOptions(next: Options) {
    setOptions(next)
    setStatus("")
  }

  function addFiles(added: File[]) {
    if (!validFiles([...files, ...added])) {
      setError(m.invalidFile)
      return
    }
    setFiles([...files, ...added])
    setError("")
    setStatus("")
  }
  async function runExport(zip: boolean) {
    if (!ready || busy) return
    setBusy(true)
    setError("")
    const batch = zip ? files : [file!]
    try {
      const { exportImages } = await import("./export")
      const result = await exportImages(
        batch,
        logoFile,
        options,
        zip,
        (current) =>
          setStatus(
            m.processing
              .replace("{current}", String(current))
              .replace("{total}", String(batch.length))
          )
      )
      download(result.blob, result.name)
      setStatus(m.exportSuccess)
    } catch {
      setError(m.exportError)
      setStatus("")
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="flex flex-col gap-6" aria-busy={busy}>
      <fieldset
        disabled={busy}
        className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_23rem]"
      >
        <div className="flex min-w-0 flex-col gap-6">
          <Upload
            messages={m}
            files={files}
            selected={file}
            onSelect={setSelected}
            onAdd={addFiles}
            onClear={() => {
              setFiles([])
              setSelected(null)
              setError("")
              setStatus("")
            }}
            onRemove={(removed) => {
              setFiles(files.filter((item) => item !== removed))
              if (selected === removed) setSelected(null)
            }}
          />
          <Preview
            messages={m}
            source={source?.source ?? null}
            logo={logo?.source ?? null}
            options={options}
            file={file}
            error={Boolean(source?.error)}
          />
        </div>
        <div className="flex min-w-0 flex-col gap-6">
          <Settings
            messages={m}
            logoName={logoFile?.name}
            options={options}
            onChange={updateOptions}
            onLogo={(next) => {
              if (next && !validFiles([next])) {
                setError(m.invalidFile)
                return
              }
              setLogoFile(next)
              setError("")
              setStatus("")
            }}
            onReset={() => updateOptions(defaultOptions(m.defaultText))}
          />
          <ExportPanel
            messages={m}
            options={options}
            onChange={updateOptions}
            ready={ready}
            busy={busy}
            onExport={(zip) => {
              void runExport(zip)
            }}
          />
        </div>
      </fieldset>
      <p role="status" className="text-sm text-muted-foreground">
        {status}
      </p>
      {error || imageError ? (
        <Alert variant="destructive">
          <AlertTitle>{m.errorTitle}</AlertTitle>
          <AlertDescription>{error || m.imageError}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  )
}
