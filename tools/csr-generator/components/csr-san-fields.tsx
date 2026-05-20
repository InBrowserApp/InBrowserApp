import { useId } from "react"

import { Field, FieldLabel } from "@workspace/ui/components/ui/field"
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
    <div className="grid gap-3 sm:grid-cols-2">
      <SanFieldEntry
        id={dnsId}
        name="san-dns"
        label={messages.sanDnsLabel}
        placeholder={messages.sanDnsPlaceholder}
        value={sanDns}
        onChange={onSanDnsChange}
      />
      <SanFieldEntry
        id={ipId}
        name="san-ip"
        label={messages.sanIpLabel}
        placeholder={messages.sanIpPlaceholder}
        value={sanIp}
        onChange={onSanIpChange}
      />
      <SanFieldEntry
        id={emailId}
        name="san-email"
        label={messages.sanEmailLabel}
        placeholder={messages.sanEmailPlaceholder}
        value={sanEmail}
        onChange={onSanEmailChange}
      />
      <SanFieldEntry
        id={uriId}
        name="san-uri"
        label={messages.sanUriLabel}
        placeholder={messages.sanUriPlaceholder}
        value={sanUri}
        onChange={onSanUriChange}
      />
    </div>
  )
}

function SanFieldEntry({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
}: Readonly<{
  id: string
  name: string
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
}>) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Textarea
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        rows={2}
        className="font-mono text-xs"
        onChange={(event) => onChange(event.target.value)}
      />
    </Field>
  )
}

export { CsrSanFields }
