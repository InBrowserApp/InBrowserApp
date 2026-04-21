import { useId, useMemo, useState } from "react"

import { FileToDataUriInputCard } from "./components/file-to-data-uri-input-card"
import { FileToDataUriResultCard } from "./components/file-to-data-uri-result-card"
import { analyzeFileToDataUri, readFileAsDataUri } from "./core/data-uri"
import type { FileToDataUriConverterMessages } from "./client/types"

function FileToDataUriConverterClient({
  messages,
}: Readonly<{ messages: FileToDataUriConverterMessages }>) {
  const inputId = useId()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dataUri, setDataUri] = useState("")
  const [error, setError] = useState<string | null>(null)

  const analysis = useMemo(
    () =>
      selectedFile && dataUri
        ? analyzeFileToDataUri(selectedFile, dataUri)
        : null,
    [dataUri, selectedFile]
  )

  async function handleFilesSelected(files: readonly File[]) {
    if (files.length === 0) {
      return
    }

    if (files.length > 1) {
      setError(messages.onlyOneFile)
      return
    }

    const file = files[0]!
    setSelectedFile(file)
    setDataUri("")
    setError(null)

    try {
      const nextDataUri = await readFileAsDataUri(file)
      setDataUri(nextDataUri)
    } catch {
      setError(messages.readFailed)
    }
  }

  function clearFile() {
    setSelectedFile(null)
    setDataUri("")
    setError(null)
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <FileToDataUriInputCard
        inputId={inputId}
        messages={messages}
        selectedFile={selectedFile}
        error={error}
        onFilesSelected={handleFilesSelected}
        onClearFile={clearFile}
      />

      <FileToDataUriResultCard analysis={analysis} messages={messages} />
    </div>
  )
}

export default FileToDataUriConverterClient
