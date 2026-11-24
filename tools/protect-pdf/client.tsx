import { useEffect, useId, useRef, useState, type FormEvent } from "react"

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

import { encodePdfPassword } from "./core/password"
import { PdfDropzone } from "./pdf-dropzone"
import { ProtectedPdf } from "./protected-pdf"

import type { ProtectRequest } from "./encrypt.worker"
import type englishMessages from "./messages/en.json"

export type Messages = typeof englishMessages

type SelectedPdf = {
  file: File
  result?: Blob
}

export default function ProtectPdf({ messages }: { messages: Messages }) {
  const picker = useRef<HTMLInputElement>(null)
  const chooseButton = useRef<HTMLButtonElement>(null)
  const passwordInput = useRef<HTMLInputElement>(null)
  const confirmationInput = useRef<HTMLInputElement>(null)
  const protectButton = useRef<HTMLButtonElement>(null)
  const resultHeading = useRef<HTMLHeadingElement>(null)
  const worker = useRef<Worker | null>(null)
  const id = useId()
  const [selectedPdf, setSelectedPdf] = useState<SelectedPdf | null>(null)
  const [visible, setVisible] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<keyof Messages | null>(null)
  const passwordError =
    error === "passwordTooLong" || error === "passwordInvalid"
  const mismatch = error === "passwordMismatch"
  const filename = selectedPdf
    ? `${selectedPdf.file.name.replace(/\.pdf$/i, "")}-protected.pdf`
    : ""

  useEffect(() => () => worker.current?.terminate(), [])
  useEffect(() => {
    if (selectedPdf?.result) resultHeading.current?.focus()
    else if (selectedPdf) passwordInput.current?.focus()
  }, [selectedPdf])

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
    setSelectedPdf({ file: next })
  }

  function protect(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedPdf || worker.current) return
    const { file } = selectedPdf
    const password = passwordInput.current!.value
    const confirmation = confirmationInput.current!.value
    const passwordBytes = encodePdfPassword(password)
    if (typeof passwordBytes === "string") {
      setError(passwordBytes)
      passwordInput.current?.focus()
      return
    }
    if (password !== confirmation) {
      setError("passwordMismatch")
      confirmationInput.current?.focus()
      return
    }

    setError(null)
    protectButton.current?.focus()
    setBusy(true)
    function finish(blob: Blob | null) {
      worker.current?.terminate()
      worker.current = null
      setBusy(false)
      if (blob) {
        setSelectedPdf({ file, result: blob })
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
          {selectedPdf?.result ? (
            <ProtectedPdf
              file={selectedPdf.result}
              filename={filename}
              headingRef={resultHeading}
              messages={messages}
              onStartOver={() => {
                setSelectedPdf(null)
                requestAnimationFrame(() => chooseButton.current?.focus())
              }}
            />
          ) : selectedPdf ? (
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
                  className="line-clamp-2 min-w-0 flex-1 text-sm font-medium wrap-anywhere"
                  dir="auto"
                  title={selectedPdf.file.name}
                >
                  {selectedPdf.file.name}
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
                    autoCapitalize="none"
                    autoCorrect="off"
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
                  autoCapitalize="none"
                  autoCorrect="off"
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
                ref={protectButton}
                type="submit"
                size="lg"
                aria-disabled={busy}
                className="h-11 w-full aria-disabled:cursor-wait aria-disabled:opacity-50 sm:w-fit"
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
