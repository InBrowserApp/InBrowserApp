import { useId, useMemo, useState } from "react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/ui/tabs"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { FileText, Lock } from "@workspace/ui/icons"
import { ENCODINGS, SAMPLE, isUnicode } from "./config"
import type { BomPolicy, Encoding, LineEnding, SourceEncoding } from "./config"
import { OutputPreview } from "./components/output-preview"
import { FilePicker } from "./components/file-picker"
import { SelectField } from "./components/select-field"
import { SourcePreview } from "./components/source-preview"
import { useConversion } from "./use-conversion"
import type { Messages } from "./types"

export default function Client({
  messages: m,
  lang,
}: {
  messages: Messages
  lang: string
}) {
  const id = useId()
  const [mode, setMode] = useState("file")
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState("")
  const [source, setSource] = useState<SourceEncoding>("auto")
  const [target, setTarget] = useState<Encoding>("utf-8")
  const [bom, setBom] = useState<BomPolicy>("remove")
  const [lineEnding, setLineEnding] = useState<LineEnding>("preserve")
  const dir = lang === "ar" || lang === "he" ? "rtl" : "ltr"
  const input = mode === "file" ? file : text || null
  const request = useMemo(
    () =>
      input === null
        ? null
        : {
            input,
            source,
            target,
            bom,
            lineEnding,
          },
    [input, source, target, bom, lineEnding]
  )
  const { result, failed, loading } = useConversion(request)
  const sourceError =
    result?.error && result.error !== "unrepresentable" ? result.error : null

  function clear() {
    setFile(null)
    setText("")
    setSource("auto")
  }

  function chooseFile(next: File) {
    setFile(next)
    setSource("auto")
  }

  function showSample() {
    setText(SAMPLE)
    setMode("text")
  }

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <p className="flex items-start gap-2 text-sm text-muted-foreground">
        <Lock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        {m.privacy}
      </p>
      <div className="grid min-w-0 items-start gap-6 lg:grid-cols-2">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>{m.inputTitle}</CardTitle>
            <CardDescription>{m.sourceHelp}</CardDescription>
          </CardHeader>
          <CardContent className="flex min-w-0 flex-col gap-5">
            <Tabs value={mode} onValueChange={setMode} dir={dir}>
              <TabsList>
                <TabsTrigger value="file">{m.fileTab}</TabsTrigger>
                <TabsTrigger value="text">{m.textTab}</TabsTrigger>
              </TabsList>
              <TabsContent value="file" className="min-w-0">
                <FieldGroup>
                  <FilePicker
                    file={file}
                    onFile={chooseFile}
                    messages={m}
                    id={id}
                    lang={lang}
                  />
                  <SelectField
                    id={`${id}-source`}
                    label={m.sourceLabel}
                    value={source}
                    options={[["auto", m.autoLabel], ...ENCODINGS]}
                    onChange={(value) => setSource(value as SourceEncoding)}
                    disabled={!file}
                    invalid={Boolean(sourceError)}
                    dir={dir}
                  />
                  {result ? (
                    <SourcePreview
                      result={result}
                      messages={m}
                      id={id}
                      lang={lang}
                      onSource={setSource}
                    />
                  ) : null}
                </FieldGroup>
              </TabsContent>
              <TabsContent value="text">
                <Field>
                  <FieldLabel htmlFor={`${id}-text`}>{m.textLabel}</FieldLabel>
                  <Textarea
                    id={`${id}-text`}
                    name="text"
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder={m.textPlaceholder}
                    rows={10}
                    spellCheck={false}
                    autoComplete="off"
                    dir="auto"
                    className="field-sizing-fixed h-56 min-h-44 resize-y font-mono"
                    aria-describedby={`${id}-text-help`}
                  />
                  <FieldDescription id={`${id}-text-help`}>
                    {m.textHelp}
                  </FieldDescription>
                </Field>
              </TabsContent>
            </Tabs>
            {sourceError ? (
              <Alert variant="destructive">
                <AlertTitle>{m.errorTitle}</AlertTitle>
                <AlertDescription>{m[sourceError]}</AlertDescription>
              </Alert>
            ) : null}
            {failed ? (
              <Alert variant="destructive">
                <AlertTitle>{m.errorTitle}</AlertTitle>
                <AlertDescription>{m.processingError}</AlertDescription>
              </Alert>
            ) : null}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={showSample}
              >
                {m.sample}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clear}
                disabled={input === null}
              >
                {loading ? m.cancel : m.clear}
              </Button>
              <span
                role="status"
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                {loading ? (
                  <>
                    <Spinner aria-hidden="true" />
                    {m.processing}
                  </>
                ) : null}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>{m.outputTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <SelectField
                id={`${id}-target`}
                label={m.targetLabel}
                value={target}
                options={ENCODINGS}
                onChange={(value) => setTarget(value as Encoding)}
                invalid={result?.error === "unrepresentable"}
                dir={dir}
              />
              <SelectField
                id={`${id}-bom`}
                label={m.bomLabel}
                value={isUnicode(target) ? bom : "remove"}
                options={[
                  ["remove", m.bomRemove],
                  ["add", m.bomAdd],
                  ["preserve", m.bomPreserve],
                ]}
                onChange={(value) => setBom(value as BomPolicy)}
                disabled={!isUnicode(target)}
                description={isUnicode(target) ? m.bomHelp : m.unicodeOnly}
                dir={dir}
              />
              <SelectField
                id={`${id}-line-ending`}
                label={m.lineEndingsLabel}
                value={lineEnding}
                options={[
                  ["preserve", m.preserve],
                  ["lf", m.lfLabel],
                  ["crlf", m.crlfLabel],
                  ["cr", m.crLabel],
                ]}
                onChange={(value) => setLineEnding(value as LineEnding)}
                dir={dir}
              />
              {result?.error === "unrepresentable" ? (
                <Alert variant="destructive">
                  <AlertTitle>{m.errorTitle}</AlertTitle>
                  <AlertDescription>{m.unrepresentable}</AlertDescription>
                </Alert>
              ) : null}
              {result ? (
                <OutputPreview
                  result={result}
                  target={target}
                  filename={mode === "file" && file ? file.name : "text.txt"}
                  messages={m}
                  id={id}
                  lang={lang}
                />
              ) : null}
              {input === null ? (
                <Empty className="py-6">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <FileText aria-hidden="true" />
                    </EmptyMedia>
                    <EmptyTitle>{m.emptyTitle}</EmptyTitle>
                    <EmptyDescription>{m.emptyDescription}</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : null}
            </FieldGroup>
          </CardContent>
        </Card>
      </div>
      <Alert>
        <AlertTitle>{m.helpTitle}</AlertTitle>
        <AlertDescription>{m.helpText}</AlertDescription>
      </Alert>
    </div>
  )
}
