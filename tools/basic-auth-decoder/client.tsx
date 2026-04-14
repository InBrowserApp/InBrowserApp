import { useEffect, useId, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Alert, AlertTitle } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Label } from "@workspace/ui/components/ui/label"
import { Separator } from "@workspace/ui/components/ui/separator"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { RefreshCcw, TriangleAlert } from "@workspace/ui/icons"

import { decodeBasicAuthHeader } from "./core/basic-auth"
import { ReadOnlyOutput } from "./components/read-only-output"

type BasicAuthDecoderMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  authorizationHeaderLabel: string
  authorizationHeaderDescription: string
  authorizationHeaderPlaceholder: string
  decodedCredentialsLabel: string
  decodedCredentialsDescription: string
  usernameLabel: string
  passwordLabel: string
  copyResultLabel: string
  copiedLabel: string
  resetLabel: string
  invalidHeaderTitle: string
  invalidBase64Title: string
}>

type BasicAuthDecoderClientProps = Readonly<{
  messages: BasicAuthDecoderMessages
}>

const STORAGE_KEY = "tools:basic-auth-decoder:authorization-header"
const DEFAULT_AUTHORIZATION_HEADER = "Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ=="

function CredentialField({
  copiedLabel,
  copyLabel,
  label,
  value,
}: Readonly<{
  copiedLabel: string
  copyLabel: string
  label: string
  value: string
}>) {
  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-medium">{label}</div>
        <ToolCopyButton
          value={value}
          copyLabel={copyLabel}
          copiedLabel={copiedLabel}
          variant="ghost"
        />
      </div>
      <ReadOnlyOutput ariaLabel={label} value={value} className="min-h-20" />
    </div>
  )
}

function BasicAuthDecoderClient({ messages }: BasicAuthDecoderClientProps) {
  const authorizationHeaderId = useId()
  const [authorizationHeader, setAuthorizationHeader] = useState(
    DEFAULT_AUTHORIZATION_HEADER
  )

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedAuthorizationHeader = window.localStorage.getItem(STORAGE_KEY)
    setAuthorizationHeader(
      storedAuthorizationHeader ?? DEFAULT_AUTHORIZATION_HEADER
    )
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEY, authorizationHeader)
  }, [authorizationHeader])

  function handleReset() {
    setAuthorizationHeader(DEFAULT_AUTHORIZATION_HEADER)
  }

  const decodeResult = decodeBasicAuthHeader(authorizationHeader)
  const hasInput = authorizationHeader.trim() !== ""
  const hasDecodedCredentials = decodeResult.ok
  const alertTitle =
    !decodeResult.ok && decodeResult.code === "invalid-header"
      ? messages.invalidHeaderTitle
      : !decodeResult.ok && decodeResult.code === "invalid-base64"
        ? messages.invalidBase64Title
        : null

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
      <ToolPanelCard>
        <CardHeader className="border-b">
          <CardTitle>{messages.authorizationHeaderLabel}</CardTitle>
          <CardDescription>
            {messages.authorizationHeaderDescription}
          </CardDescription>
        </CardHeader>
        <ToolPanelCardContent className="gap-4">
          <div className="grid gap-2">
            <Label htmlFor={authorizationHeaderId}>
              {messages.authorizationHeaderLabel}
            </Label>
            <Textarea
              id={authorizationHeaderId}
              name="authorization-header"
              autoComplete="off"
              spellCheck={false}
              rows={6}
              aria-label={messages.authorizationHeaderLabel}
              aria-invalid={!decodeResult.ok && decodeResult.code !== "empty"}
              value={authorizationHeader}
              onChange={(event) => {
                setAuthorizationHeader(event.target.value)
              }}
              placeholder={messages.authorizationHeaderPlaceholder}
              className="min-h-40 resize-y font-mono text-sm"
            />
          </div>
        </ToolPanelCardContent>
        <ToolPanelCardFooter className="justify-end border-t">
          <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
            <RefreshCcw data-icon="inline-start" />
            {messages.resetLabel}
          </Button>
        </ToolPanelCardFooter>
      </ToolPanelCard>

      <ToolPanelCard>
        <CardHeader className="border-b">
          <CardTitle>{messages.decodedCredentialsLabel}</CardTitle>
          <CardDescription>
            {messages.decodedCredentialsDescription}
          </CardDescription>
        </CardHeader>
        <ToolPanelCardContent className="gap-4">
          {!hasInput ? (
            <div className="rounded-lg border border-dashed px-4 py-3 text-sm text-muted-foreground">
              {messages.authorizationHeaderPlaceholder}
            </div>
          ) : alertTitle ? (
            <div aria-live="polite">
              <Alert variant="destructive">
                <TriangleAlert />
                <AlertTitle>{alertTitle}</AlertTitle>
              </Alert>
            </div>
          ) : hasDecodedCredentials ? (
            <>
              <CredentialField
                label={messages.usernameLabel}
                value={decodeResult.username}
                copyLabel={messages.copyResultLabel}
                copiedLabel={messages.copiedLabel}
              />
              <Separator />
              <CredentialField
                label={messages.passwordLabel}
                value={decodeResult.password}
                copyLabel={messages.copyResultLabel}
                copiedLabel={messages.copiedLabel}
              />
            </>
          ) : null}
        </ToolPanelCardContent>
      </ToolPanelCard>
    </div>
  )
}

export default BasicAuthDecoderClient
