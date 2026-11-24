import { useId, useMemo, useState } from "react"

import {
  ToolOpenTextFile,
  useTextFileImport,
} from "@workspace/ui/components/tool/tool-open-text-file"
import { Button } from "@workspace/ui/components/ui/button"
import { Card, CardContent } from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import { Textarea } from "@workspace/ui/components/ui/textarea"

import { readZone } from "./core/zone"
import { ZoneResults } from "./zone-results"
import type english from "./messages/en.json"

export type Messages = typeof english

const EXAMPLE = `$ORIGIN example.com.
$TTL 1h
@ IN SOA ns1.example.com. hostmaster.example.com. (
  2026112401 ; serial
  3600 1800 1209600 300
)
@ IN NS ns1.example.com.
ns1 IN A 192.0.2.53
www IN A 192.0.2.80
    IN AAAA 2001:db8::80
@ 15m IN MX 10 mail
mail IN A 192.0.2.25
@ IN TXT "hello; world"
`

export default function Client({
  messages,
  language,
}: {
  messages: Messages
  language: string
}) {
  const id = useId()
  const importer = useTextFileImport()
  const [source, setSource] = useState("")
  const [origin, setOrigin] = useState("")
  const [filename, setFilename] = useState("")
  const [error, setError] = useState(false)
  const [query, setQuery] = useState("")
  const parsed = useMemo(() => readZone(source, origin), [source, origin])

  function editSource(text: string, name = "") {
    importer.cancel()
    setSource(text)
    setFilename(name)
    setError(false)
    if (name) setQuery("")
  }

  function openFile(file: File) {
    setError(false)
    void importer.read(
      file,
      (text) => editSource(text, file.name),
      () => setError(true)
    )
  }

  return (
    <div className="grid min-w-0 gap-5">
      <Card>
        <CardContent className="grid gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label htmlFor={`${id}-source`} className="text-sm font-medium">
              {messages.source}
            </label>
            <div className="flex flex-wrap gap-2">
              <ToolOpenTextFile
                accept=""
                label={messages.open}
                onFile={openFile}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  editSource(EXAMPLE)
                  setOrigin("")
                  setQuery("")
                }}
              >
                {messages.example}
              </Button>
            </div>
          </div>
          {filename && (
            <p className="text-sm break-all text-muted-foreground">
              <bdi>{filename}</bdi>
            </p>
          )}
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {messages.readError}
            </p>
          )}
          <Textarea
            id={`${id}-source`}
            dir="ltr"
            rows={10}
            className="font-mono"
            placeholder={messages.placeholder}
            value={source}
            spellCheck={false}
            autoCapitalize="none"
            onChange={(event) => editSource(event.target.value)}
          />
          <div className="grid gap-1.5">
            <label htmlFor={`${id}-origin`} className="text-sm font-medium">
              {messages.origin}
            </label>
            <Input
              id={`${id}-origin`}
              dir="ltr"
              placeholder="example.com."
              className="max-w-sm font-mono"
              value={origin}
              spellCheck={false}
              autoCapitalize="none"
              aria-describedby={`${id}-origin-help`}
              onChange={(event) => setOrigin(event.target.value)}
            />
            <p
              id={`${id}-origin-help`}
              className="text-sm text-muted-foreground"
            >
              {messages.originHelp}
            </p>
          </div>
        </CardContent>
      </Card>
      {(source.trim() || filename) && (
        <ZoneResults
          {...parsed}
          language={language}
          messages={messages}
          query={query}
          onQueryChange={setQuery}
        />
      )}
    </div>
  )
}
