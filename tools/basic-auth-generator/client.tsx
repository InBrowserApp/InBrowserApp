import { useEffect, useId, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"
import { RefreshCcw } from "@workspace/ui/icons"

import {
  createBasicAuthCurlCommand,
  createBasicAuthHeader,
} from "./core/basic-auth"
import { ReadOnlyOutput } from "./components/read-only-output"

type BasicAuthGeneratorMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  credentialsLabel: string
  usernameLabel: string
  passwordLabel: string
  authorizationHeaderLabel: string
  curlExampleLabel: string
  copyResultLabel: string
  copiedLabel: string
  resetLabel: string
}>

type BasicAuthGeneratorClientProps = Readonly<{
  messages: BasicAuthGeneratorMessages
}>

const STORAGE_KEYS = {
  username: "tools:basic-auth-generator:username",
  password: "tools:basic-auth-generator:password",
} as const

const DEFAULT_USERNAME = "Aladdin"
const DEFAULT_PASSWORD = "open sesame"
const DEFAULT_URL = "https://api.example.com/protected"

function BasicAuthGeneratorClient({ messages }: BasicAuthGeneratorClientProps) {
  const usernameId = useId()
  const passwordId = useId()
  const [username, setUsername] = useState(DEFAULT_USERNAME)
  const [password, setPassword] = useState(DEFAULT_PASSWORD)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedUsername = window.localStorage.getItem(STORAGE_KEYS.username)
    const storedPassword = window.localStorage.getItem(STORAGE_KEYS.password)

    setUsername(storedUsername ?? DEFAULT_USERNAME)
    setPassword(storedPassword ?? DEFAULT_PASSWORD)
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.username, username)
  }, [username])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.password, password)
  }, [password])

  function handleReset() {
    setUsername(DEFAULT_USERNAME)
    setPassword(DEFAULT_PASSWORD)
  }

  const authHeader = createBasicAuthHeader(username, password)
  const curlCommand = createBasicAuthCurlCommand(
    DEFAULT_URL,
    username,
    password
  )

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
      <ToolPanelCard>
        <CardHeader className="border-b">
          <CardTitle>{messages.credentialsLabel}</CardTitle>
          <CardDescription>{messages.meta.description}</CardDescription>
        </CardHeader>
        <ToolPanelCardContent className="gap-4">
          <div className="grid gap-2">
            <Label htmlFor={usernameId}>{messages.usernameLabel}</Label>
            <Input
              id={usernameId}
              name="username"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              value={username}
              onChange={(event) => {
                setUsername(event.target.value)
              }}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor={passwordId}>{messages.passwordLabel}</Label>
            <Input
              id={passwordId}
              name="password"
              type="password"
              autoComplete="current-password"
              spellCheck={false}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
              }}
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

      <div className="grid gap-6">
        <ToolPanelCard>
          <CardHeader className="border-b">
            <CardTitle>{messages.authorizationHeaderLabel}</CardTitle>
          </CardHeader>
          <ToolPanelCardContent>
            <ReadOnlyOutput
              ariaLabel={messages.authorizationHeaderLabel}
              value={authHeader}
              className="min-h-24"
            />
          </ToolPanelCardContent>
          <ToolPanelCardFooter className="justify-end border-t">
            <ToolCopyButton
              value={authHeader}
              copyLabel={messages.copyResultLabel}
              copiedLabel={messages.copiedLabel}
              variant="ghost"
            />
          </ToolPanelCardFooter>
        </ToolPanelCard>

        <ToolPanelCard>
          <CardHeader className="border-b">
            <CardTitle>{messages.curlExampleLabel}</CardTitle>
          </CardHeader>
          <ToolPanelCardContent>
            <ReadOnlyOutput
              ariaLabel={messages.curlExampleLabel}
              value={curlCommand}
              className="min-h-28"
            />
          </ToolPanelCardContent>
          <ToolPanelCardFooter className="justify-end border-t">
            <ToolCopyButton
              value={curlCommand}
              copyLabel={messages.copyResultLabel}
              copiedLabel={messages.copiedLabel}
              variant="ghost"
            />
          </ToolPanelCardFooter>
        </ToolPanelCard>
      </div>
    </div>
  )
}

export default BasicAuthGeneratorClient
