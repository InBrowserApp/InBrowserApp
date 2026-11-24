import { useEffect, useId, useRef, useState, type FormEvent } from "react"

import { DocumentDownload } from "@workspace/ui/components/tool/document-download"
import { Button } from "@workspace/ui/components/ui/button"
import { Card, CardContent } from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@workspace/ui/components/ui/input-group"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { Eye, EyeOff, FileText, Lock, Shield } from "@workspace/ui/icons"

import { PdfDropzone } from "./pdf-dropzone"

import type { ProtectRequest } from "./encrypt.worker"
import type englishMessages from "./messages/en.json"

export type Messages = typeof englishMessages

export default function ProtectPdf({ messages }: { messages: Messages }) {
  const picker = useRef<HTMLInputElement>(null)
  const chooseButton = useRef<HTMLButtonElement>(null)
  const passwordInput = useRef<HTMLInputElement>(null)
  const confirmationInput = useRef<HTMLInputElement>(null)
  const resultHeading = useRef<HTMLHeadingElement>(null)
  const worker = useRef<Worker | null>(null)
  const id = useId()
  const [file, setFile] = useState<File | null>(null)
  const [visible, setVisible] = useState(false)
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<Blob | null>(null)
  const [error, setError] = useState<keyof Messages | null>(null)
  const passwordError =
    error === "passwordTooLong" || error === "passwordInvalid"
  const mismatch = error === "passwordMismatch"
  const filename = file
    ? `${file.name.replace(/\.pdf$/i, "")}-protected.pdf`
    : ""

  useEffect(() => () => worker.current?.terminate(), [])
  useEffect(() => {
    if (result) resultHeading.current?.focus()
    else if (file) passwordInput.current?.focus()
  }, [file, result])

  function selectFile(files: FileList | null) {
    if (!files || worker.current) return
    const next = files[0]
    if (!next) return
    if (files.length > 1) {
      setError("onePdf")
      return
    }
    if (
      !next.size ||
      (next.type !== "application/pdf" && !/\.pdf$/i.test(next.name))
    ) {
      setError("invalidPdf")
      return
    }
    setError(null)
    setFile(next)
  }

  function protect(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!file || worker.current) return
    const password = passwordInput.current!.value
    const confirmation = confirmationInput.current!.value
    if (password.includes("\0")) {
      setError("passwordInvalid")
      passwordInput.current?.focus()
      return
    }
    if (new TextEncoder().encode(password).length > 127) {
      setError("passwordTooLong")
      passwordInput.current?.focus()
      return
    }
    if (password !== confirmation) {
      setError("passwordMismatch")
      confirmationInput.current?.focus()
      return
    }

    setError(null)
    setBusy(true)
    function finish(blob: Blob | null) {
      worker.current?.terminate()
      worker.current = null
      setBusy(false)
      if (blob) {
        setResult(blob)
        setVisible(false)
      } else {
        setError("protectionFailed")
      }
    }

    try {
      const task = new Worker(new URL("./encrypt.worker.ts", import.meta.url), {
        type: "module",
      })
      worker.current = task
      task.onmessage = ({ data }: MessageEvent<Blob | null>) => finish(data)
      task.onerror = task.onmessageerror = () => finish(null)
      task.postMessage({ file, password } satisfies ProtectRequest)
    } catch {
      finish(null)
    }
  }

  const fieldType = visible ? "text" : "password"
  const visibilityLabel = visible
    ? messages.hidePasswords
    : messages.showPasswords

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={picker}
        type="file"
        accept="application/pdf,.pdf"
        aria-label={messages.choosePdf}
        hidden
        onChange={(event) => {
          selectFile(event.currentTarget.files)
          event.currentTarget.value = ""
        }}
      />
      <Card className="py-0">
        <CardContent className="p-4 sm:p-6">
          {result && file ? (
            <div className="flex min-w-0 flex-col items-center gap-4 px-2 py-8 text-center">
              <span className="rounded-xl border bg-muted/50 p-3 text-primary">
                <Lock className="size-6" aria-hidden="true" />
              </span>
              <div className="min-w-0 space-y-1">
                <h2
                  ref={resultHeading}
                  tabIndex={-1}
                  className="text-lg font-semibold outline-none"
                >
                  {messages.protected}
                </h2>
                <p
                  className="text-sm wrap-anywhere text-muted-foreground"
                  dir="auto"
                >
                  {filename}
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <DocumentDownload
                  file={result}
                  filename={filename}
                  label={messages.downloadPdf}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setResult(null)
                    setFile(null)
                    requestAnimationFrame(() => chooseButton.current?.focus())
                  }}
                >
                  {messages.startOver}
                </Button>
              </div>
            </div>
          ) : file ? (
            <form
              onSubmit={protect}
              className="mx-auto flex w-full max-w-xl flex-col gap-5"
            >
              <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-muted/35 p-3">
                <FileText
                  className="size-5 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <span
                  className="min-w-0 flex-1 text-sm font-medium wrap-anywhere"
                  dir="auto"
                >
                  {file.name}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  disabled={busy}
                  onClick={() => picker.current?.click()}
                >
                  {messages.changePdf}
                </Button>
              </div>
              <Field data-invalid={passwordError || undefined}>
                <FieldLabel htmlFor={`${id}-password`}>
                  {messages.password}
                </FieldLabel>
                <InputGroup className="h-10">
                  <InputGroupInput
                    ref={passwordInput}
                    id={`${id}-password`}
                    type={fieldType}
                    dir="auto"
                    required
                    disabled={busy}
                    autoComplete="new-password"
                    spellCheck={false}
                    aria-invalid={passwordError || undefined}
                    aria-describedby={passwordError ? `${id}-error` : undefined}
                    onChange={() => setError(null)}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      size="icon-sm"
                      aria-label={visibilityLabel}
                      title={visibilityLabel}
                      disabled={busy}
                      onClick={() => setVisible(!visible)}
                    >
                      {visible ? (
                        <EyeOff aria-hidden="true" />
                      ) : (
                        <Eye aria-hidden="true" />
                      )}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                {passwordError && (
                  <FieldError id={`${id}-error`}>{messages[error]}</FieldError>
                )}
              </Field>
              <Field data-invalid={mismatch || undefined}>
                <FieldLabel htmlFor={`${id}-confirmation`}>
                  {messages.confirmPassword}
                </FieldLabel>
                <Input
                  ref={confirmationInput}
                  id={`${id}-confirmation`}
                  className="h-10"
                  type={fieldType}
                  dir="auto"
                  required
                  disabled={busy}
                  autoComplete="new-password"
                  spellCheck={false}
                  aria-invalid={mismatch || undefined}
                  aria-describedby={mismatch ? `${id}-error` : undefined}
                  onChange={() => setError(null)}
                />
                {mismatch && (
                  <FieldError id={`${id}-error`}>
                    {messages.passwordMismatch}
                  </FieldError>
                )}
              </Field>
              <Button
                type="submit"
                size="lg"
                disabled={busy}
                className="w-full sm:w-fit"
              >
                {busy ? (
                  <Spinner aria-hidden="true" />
                ) : (
                  <Lock data-icon="inline-start" aria-hidden="true" />
                )}
                {busy ? messages.protecting : messages.protectPdf}
              </Button>
              <span className="sr-only" role="status">
                {busy ? messages.protecting : ""}
              </span>
            </form>
          ) : (
            <PdfDropzone
              buttonRef={chooseButton}
              choosePdf={messages.choosePdf}
              dropPdf={messages.dropPdf}
              onChoose={() => picker.current?.click()}
              onSelect={selectFile}
            />
          )}
          {error && !passwordError && !mismatch && (
            <p
              role="alert"
              className="mx-auto mt-3 max-w-xl text-sm text-destructive"
            >
              {messages[error]}
            </p>
          )}
        </CardContent>
      </Card>
      <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Shield className="size-4 shrink-0" aria-hidden="true" />
        {messages.privacy}
      </p>
    </div>
  )
}
