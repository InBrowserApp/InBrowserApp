import { useId, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import { RefreshCcw } from "@workspace/ui/icons"

import {
  decodePunycodeDomain,
  encodeDomainToPunycode,
  isValidAsciiDomain,
  isValidUnicodeDomain,
} from "./core/punycode"

type UnicodePunycodeMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  asciiDomainLabel: string
  unicodeDomainLabel: string
  whatIsPunycodeTitle: string
  whatIsPunycodeDescription: string
  copyLabel: string
  copiedLabel: string
  resetLabel: string
}>

type UnicodePunycodeConverterClientProps = Readonly<{
  messages: UnicodePunycodeMessages
}>

const DEFAULT_ASCII_DOMAIN = "xn--v86c4184b.com"
const DEFAULT_UNICODE_DOMAIN = "🕸️.com"

function UnicodePunycodeConverterClient({
  messages,
}: UnicodePunycodeConverterClientProps) {
  const asciiDomainId = useId()
  const unicodeDomainId = useId()
  const [asciiDomain, setAsciiDomain] = useState(DEFAULT_ASCII_DOMAIN)
  const [unicodeDomain, setUnicodeDomain] = useState(DEFAULT_UNICODE_DOMAIN)
  const [asciiInvalid, setAsciiInvalid] = useState(false)
  const [unicodeInvalid, setUnicodeInvalid] = useState(false)

  function handleAsciiDomainChange(nextValue: string) {
    setAsciiDomain(nextValue)

    if (!isValidAsciiDomain(nextValue)) {
      setAsciiInvalid(true)
      return
    }

    setUnicodeDomain(decodePunycodeDomain(nextValue))
    setAsciiInvalid(false)
  }

  function handleUnicodeDomainChange(nextValue: string) {
    setUnicodeDomain(nextValue)

    if (!isValidUnicodeDomain(nextValue)) {
      setUnicodeInvalid(true)
      return
    }

    setAsciiDomain(encodeDomainToPunycode(nextValue))
    setUnicodeInvalid(false)
  }

  function handleReset() {
    setAsciiDomain(DEFAULT_ASCII_DOMAIN)
    setUnicodeDomain(DEFAULT_UNICODE_DOMAIN)
    setAsciiInvalid(false)
    setUnicodeInvalid(false)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>{messages.asciiDomainLabel}</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            id={asciiDomainId}
            name="ascii-domain"
            autoComplete="off"
            spellCheck={false}
            aria-label={messages.asciiDomainLabel}
            aria-invalid={asciiInvalid}
            value={asciiDomain}
            onChange={(event) => {
              handleAsciiDomainChange(event.target.value)
            }}
            className="h-12 font-mono text-sm"
          />
        </CardContent>
        <CardFooter className="justify-between gap-3 border-t">
          <ToolCopyButton
            value={asciiDomain}
            copyLabel={messages.copyLabel}
            copiedLabel={messages.copiedLabel}
            variant="ghost"
          />
          <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
            <RefreshCcw data-icon="inline-start" />
            {messages.resetLabel}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>{messages.unicodeDomainLabel}</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            id={unicodeDomainId}
            name="unicode-domain"
            autoComplete="off"
            spellCheck={false}
            aria-label={messages.unicodeDomainLabel}
            aria-invalid={unicodeInvalid}
            value={unicodeDomain}
            onChange={(event) => {
              handleUnicodeDomainChange(event.target.value)
            }}
            className="h-12 font-mono text-sm"
          />
        </CardContent>
        <CardFooter className="justify-end border-t">
          <ToolCopyButton
            value={unicodeDomain}
            copyLabel={messages.copyLabel}
            copiedLabel={messages.copiedLabel}
            variant="ghost"
          />
        </CardFooter>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader className="border-b">
          <CardTitle>{messages.whatIsPunycodeTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
            {messages.whatIsPunycodeDescription}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default UnicodePunycodeConverterClient
