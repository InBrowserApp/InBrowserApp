import { useState } from "react"
import { DocumentDownload } from "@workspace/ui/components/tool/document-download"
import {
  ToolOpenTextFile,
  useTextFileImport,
} from "@workspace/ui/components/tool/tool-open-text-file"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Binary, Check } from "@workspace/ui/icons"
import { exampleJson, jsonToPlist } from "./codec"
import type { Messages } from "./client"

export function JsonInput({ messages: m }: { messages: Messages }) {
  const [input, setInput] = useState({ text: "", name: "converted.plist" })
  const [output, setOutput] = useState<Blob | null>(null)
  const [error, setError] = useState<
    "invalidJson" | "invalidValue" | "readError" | null
  >(null)
  const fileImport = useTextFileImport()
  function replace(text: string, name: string) {
    setInput({ text, name })
    setOutput(null)
    setError(null)
  }
  function convert() {
    fileImport.cancel()
    try {
      const bytes = jsonToPlist(input.text)
      setOutput(
        new Blob([new Uint8Array(bytes)], { type: "application/x-plist" })
      )
      setError(null)
    } catch (reason) {
      setOutput(null)
      setError(reason instanceof SyntaxError ? "invalidJson" : "invalidValue")
    }
  }
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        convert()
      }}
    >
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>{m.jsonInput}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            dir="ltr"
            aria-label={m.jsonInput}
            aria-invalid={error === "invalidJson" || error === "invalidValue"}
            className="field-sizing-fixed h-56 resize-y font-mono text-sm sm:h-80"
            placeholder={m.jsonPlaceholder}
            spellCheck={false}
            value={input.text}
            onChange={(event) => {
              fileImport.cancel()
              replace(event.target.value, input.name)
            }}
          />
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{m[error]}</AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          <Button type="submit" disabled={!input.text.trim()}>
            <Binary data-icon="inline-start" aria-hidden="true" />
            {m.convert}
          </Button>
          <ToolOpenTextFile
            accept=".json,application/json"
            label={m.openJson}
            onFile={(file) => {
              void fileImport.read(
                file,
                (text) =>
                  replace(text, file.name.replace(/(?:\.json)?$/i, ".plist")),
                () => {
                  setError("readError")
                }
              )
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              fileImport.cancel()
              replace(exampleJson, "notebook.plist")
            }}
          >
            {m.example}
          </Button>
        </CardFooter>
      </Card>
      {output ? (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3">
          <p role="status" className="flex items-center gap-2 text-sm">
            <Check aria-hidden="true" className="size-4" />
            {m.ready}
          </p>
          <DocumentDownload
            file={output}
            filename={input.name}
            label={m.downloadPlist}
          />
        </div>
      ) : null}
    </form>
  )
}
