import { useId } from "react"

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Textarea } from "@workspace/ui/components/ui/textarea"

import type { CsrGeneratorMessages } from "../client/types"

type CsrSanFieldsProps = Readonly<{
  messages: CsrGeneratorMessages
  sanDns: string
  sanIp: string
  sanEmail: string
  sanUri: string
  onSanDnsChange: (value: string) => void
  onSanIpChange: (value: string) => void
  onSanEmailChange: (value: string) => void
  onSanUriChange: (value: string) => void
}>

function CsrSanFields({
  messages,
  sanDns,
  sanIp,
  sanEmail,
  sanUri,
  onSanDnsChange,
  onSanIpChange,
  onSanEmailChange,
  onSanUriChange,
}: CsrSanFieldsProps) {
  const dnsId = useId()
  const ipId = useId()
  const emailId = useId()
  const uriId = useId()

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor={dnsId}>{messages.sanDnsLabel}</FieldLabel>
        <Textarea
          id={dnsId}
          name="san-dns"
          value={sanDns}
          placeholder={messages.sanDnsPlaceholder}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          rows={2}
          className="font-mono text-xs"
          onChange={(event) => onSanDnsChange(event.target.value)}
        />
        <FieldDescription>{messages.sanDnsPlaceholder}</FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor={ipId}>{messages.sanIpLabel}</FieldLabel>
        <Textarea
          id={ipId}
          name="san-ip"
          value={sanIp}
          placeholder={messages.sanIpPlaceholder}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          rows={2}
          className="font-mono text-xs"
          onChange={(event) => onSanIpChange(event.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor={emailId}>{messages.sanEmailLabel}</FieldLabel>
        <Textarea
          id={emailId}
          name="san-email"
          value={sanEmail}
          placeholder={messages.sanEmailPlaceholder}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          rows={2}
          className="font-mono text-xs"
          onChange={(event) => onSanEmailChange(event.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor={uriId}>{messages.sanUriLabel}</FieldLabel>
        <Textarea
          id={uriId}
          name="san-uri"
          value={sanUri}
          placeholder={messages.sanUriPlaceholder}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          rows={2}
          className="font-mono text-xs"
          onChange={(event) => onSanUriChange(event.target.value)}
        />
      </Field>
    </FieldGroup>
  )
}

export { CsrSanFields }
