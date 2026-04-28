import { useId } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@workspace/ui/components/ui/input-group"
import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"

import type { UrlParserBuilderMessages } from "../types"

type UrlAuthorityCardProps = Readonly<{
  messages: UrlParserBuilderMessages
  protocol: string
  username: string
  password: string
  hostname: string
  port: string
  onFieldChange: (
    field: "protocol" | "username" | "password" | "hostname" | "port",
    value: string
  ) => void
}>

function UrlAuthorityCard({
  messages,
  protocol,
  username,
  password,
  hostname,
  port,
  onFieldChange,
}: UrlAuthorityCardProps) {
  const protocolId = useId()
  const usernameId = useId()
  const passwordId = useId()
  const hostnameId = useId()
  const portId = useId()

  return (
    <Card className="border-border/70">
      <CardHeader className="border-b">
        <CardTitle>{messages.authorityTitle}</CardTitle>
        <CardDescription>{messages.authorityDescription}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor={protocolId}>{messages.protocolLabel}</Label>
          <InputGroup>
            <InputGroupInput
              id={protocolId}
              value={protocol}
              placeholder={messages.protocolPlaceholder}
              onChange={(event) => {
                onFieldChange("protocol", event.target.value)
              }}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupText>://</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor={usernameId}>{messages.usernameLabel}</Label>
          <Input
            id={usernameId}
            value={username}
            placeholder={messages.usernamePlaceholder}
            onChange={(event) => {
              onFieldChange("username", event.target.value)
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={passwordId}>{messages.passwordLabel}</Label>
          <Input
            id={passwordId}
            value={password}
            placeholder={messages.passwordPlaceholder}
            onChange={(event) => {
              onFieldChange("password", event.target.value)
            }}
          />
        </div>

        <div className="space-y-2 md:col-span-2 xl:col-span-2">
          <Label htmlFor={hostnameId}>{messages.hostnameLabel}</Label>
          <Input
            id={hostnameId}
            value={hostname}
            placeholder={messages.hostnamePlaceholder}
            onChange={(event) => {
              onFieldChange("hostname", event.target.value)
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={portId}>{messages.portLabel}</Label>
          <Input
            id={portId}
            inputMode="numeric"
            value={port}
            placeholder={messages.portPlaceholder}
            onChange={(event) => {
              onFieldChange("port", event.target.value)
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export { UrlAuthorityCard }
