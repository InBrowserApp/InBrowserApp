import { useId } from "react"

import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Button } from "@workspace/ui/components/ui/button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { LoaderCircle, RefreshCcw } from "@workspace/ui/icons"

import {
  EC_CURVES,
  RSA_HASHES,
  RSA_KEY_SIZES,
  type EcCurve,
  type HashAlgorithm,
  type KeyAlgorithm,
  type KeySource,
  type RsaKeySize,
  type SubjectInput,
} from "../core/csr"
import type { CsrGeneratorMessages } from "../client/types"
import { CsrSubjectFields } from "./csr-subject-fields"
import { CsrSanFields } from "./csr-san-fields"

type CsrOptionsCardProps = Readonly<{
  keySource: KeySource
  algorithm: KeyAlgorithm
  rsaKeySize: RsaKeySize
  rsaHash: HashAlgorithm
  ecCurve: EcCurve
  keyPem: string
  subject: SubjectInput
  sanDns: string
  sanIp: string
  sanEmail: string
  sanUri: string
  generating: boolean
  messages: CsrGeneratorMessages
  onKeySourceChange: (value: KeySource) => void
  onAlgorithmChange: (value: KeyAlgorithm) => void
  onRsaKeySizeChange: (value: RsaKeySize) => void
  onRsaHashChange: (value: HashAlgorithm) => void
  onEcCurveChange: (value: EcCurve) => void
  onKeyPemChange: (value: string) => void
  onSubjectChange: (value: SubjectInput) => void
  onSanDnsChange: (value: string) => void
  onSanIpChange: (value: string) => void
  onSanEmailChange: (value: string) => void
  onSanUriChange: (value: string) => void
  onReset: () => void
}>

function CsrOptionsCard(props: CsrOptionsCardProps) {
  const {
    keySource,
    algorithm,
    rsaKeySize,
    rsaHash,
    ecCurve,
    keyPem,
    subject,
    sanDns,
    sanIp,
    sanEmail,
    sanUri,
    generating,
    messages,
    onKeySourceChange,
    onAlgorithmChange,
    onRsaKeySizeChange,
    onRsaHashChange,
    onEcCurveChange,
    onKeyPemChange,
    onSubjectChange,
    onSanDnsChange,
    onSanIpChange,
    onSanEmailChange,
    onSanUriChange,
    onReset,
  } = props

  const keySourceId = useId()
  const algorithmId = useId()
  const rsaKeySizeId = useId()
  const rsaHashId = useId()
  const ecCurveId = useId()
  const keyPemId = useId()

  return (
    <ToolPanelCard className="xl:sticky xl:top-6 xl:h-auto xl:self-start">
      <CardHeader className="border-b">
        <CardTitle>{messages.optionsTitle}</CardTitle>
        <CardDescription>{messages.optionsDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-6">
        <FieldGroup>
          <Field>
            <FieldLabel id={keySourceId}>{messages.keySourceLabel}</FieldLabel>
            <ToggleGroup
              type="single"
              value={keySource}
              aria-labelledby={keySourceId}
              variant="outline"
              className="grid w-full grid-cols-2"
              onValueChange={(value) => {
                if (value === "generate" || value === "import") {
                  onKeySourceChange(value)
                }
              }}
            >
              <ToggleGroupItem value="generate" className="w-full">
                {messages.keySourceGenerate}
              </ToggleGroupItem>
              <ToggleGroupItem value="import" className="w-full">
                {messages.keySourceImport}
              </ToggleGroupItem>
            </ToggleGroup>
          </Field>

          {keySource === "generate" ? (
            <Field>
              <FieldLabel id={algorithmId}>
                {messages.algorithmLabel}
              </FieldLabel>
              <ToggleGroup
                type="single"
                value={algorithm}
                aria-labelledby={algorithmId}
                variant="outline"
                className="grid w-full grid-cols-2"
                onValueChange={(value) => {
                  if (value === "rsa" || value === "ecdsa") {
                    onAlgorithmChange(value)
                  }
                }}
              >
                <ToggleGroupItem value="rsa" className="w-full">
                  {messages.algorithmRsa}
                </ToggleGroupItem>
                <ToggleGroupItem value="ecdsa" className="w-full">
                  {messages.algorithmEcdsa}
                </ToggleGroupItem>
              </ToggleGroup>
            </Field>
          ) : null}

          {keySource === "generate" && algorithm === "rsa" ? (
            <>
              <Field>
                <FieldLabel id={rsaKeySizeId}>
                  {messages.rsaKeySizeLabel}
                </FieldLabel>
                <ToggleGroup
                  type="single"
                  value={String(rsaKeySize)}
                  aria-labelledby={rsaKeySizeId}
                  variant="outline"
                  className="grid w-full grid-cols-3"
                  onValueChange={(value) => {
                    const next = Number(value) as RsaKeySize
                    if (RSA_KEY_SIZES.includes(next)) {
                      onRsaKeySizeChange(next)
                    }
                  }}
                >
                  {RSA_KEY_SIZES.map((size) => (
                    <ToggleGroupItem
                      key={size}
                      value={String(size)}
                      className="w-full"
                    >
                      {size}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </Field>
              <Field>
                <FieldLabel id={rsaHashId}>{messages.rsaHashLabel}</FieldLabel>
                <ToggleGroup
                  type="single"
                  value={rsaHash}
                  aria-labelledby={rsaHashId}
                  variant="outline"
                  className="grid w-full grid-cols-3"
                  onValueChange={(value) => {
                    if (RSA_HASHES.includes(value as HashAlgorithm)) {
                      onRsaHashChange(value as HashAlgorithm)
                    }
                  }}
                >
                  {RSA_HASHES.map((hash) => (
                    <ToggleGroupItem
                      key={hash}
                      value={hash}
                      className="w-full"
                    >
                      {hash}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </Field>
            </>
          ) : null}

          {keySource === "generate" && algorithm === "ecdsa" ? (
            <Field>
              <FieldLabel id={ecCurveId}>{messages.ecCurveLabel}</FieldLabel>
              <ToggleGroup
                type="single"
                value={ecCurve}
                aria-labelledby={ecCurveId}
                variant="outline"
                className="grid w-full grid-cols-3"
                onValueChange={(value) => {
                  if (EC_CURVES.includes(value as EcCurve)) {
                    onEcCurveChange(value as EcCurve)
                  }
                }}
              >
                {EC_CURVES.map((curve) => (
                  <ToggleGroupItem
                    key={curve}
                    value={curve}
                    className="w-full"
                  >
                    {curve}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </Field>
          ) : null}

          {keySource === "import" ? (
            <>
              <Field>
                <FieldLabel htmlFor={keyPemId}>
                  {messages.importLabel}
                </FieldLabel>
                <Textarea
                  id={keyPemId}
                  name="private-key-pem"
                  value={keyPem}
                  placeholder={messages.importPlaceholder}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoCorrect="off"
                  rows={8}
                  className="font-mono text-xs"
                  onChange={(event) => onKeyPemChange(event.target.value)}
                />
                <FieldDescription>{messages.importDescription}</FieldDescription>
              </Field>
              <Field>
                <FieldLabel id={rsaHashId}>{messages.rsaHashLabel}</FieldLabel>
                <ToggleGroup
                  type="single"
                  value={rsaHash}
                  aria-labelledby={rsaHashId}
                  variant="outline"
                  className="grid w-full grid-cols-3"
                  onValueChange={(value) => {
                    if (RSA_HASHES.includes(value as HashAlgorithm)) {
                      onRsaHashChange(value as HashAlgorithm)
                    }
                  }}
                >
                  {RSA_HASHES.map((hash) => (
                    <ToggleGroupItem
                      key={hash}
                      value={hash}
                      className="w-full"
                    >
                      {hash}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </Field>
            </>
          ) : null}
        </FieldGroup>

        <section className="grid gap-3">
          <div className="grid gap-1">
            <h3 className="text-sm font-medium">{messages.subjectTitle}</h3>
            <p className="text-xs text-muted-foreground">
              {messages.subjectDescription}
            </p>
          </div>
          <CsrSubjectFields
            messages={messages}
            subject={subject}
            onChange={onSubjectChange}
          />
        </section>

        <section className="grid gap-3">
          <div className="grid gap-1">
            <h3 className="text-sm font-medium">{messages.sanTitle}</h3>
            <p className="text-xs text-muted-foreground">
              {messages.sanDescription}
            </p>
          </div>
          <CsrSanFields
            messages={messages}
            sanDns={sanDns}
            sanIp={sanIp}
            sanEmail={sanEmail}
            sanUri={sanUri}
            onSanDnsChange={onSanDnsChange}
            onSanIpChange={onSanIpChange}
            onSanEmailChange={onSanEmailChange}
            onSanUriChange={onSanUriChange}
          />
        </section>
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="justify-between border-t">
        <Button type="button" variant="ghost" size="sm" onClick={onReset}>
          <RefreshCcw data-icon="inline-start" />
          {messages.resetLabel}
        </Button>
        <Button type="submit" size="sm" disabled={generating}>
          {generating ? (
            <LoaderCircle data-icon="inline-start" className="animate-spin" />
          ) : null}
          {generating ? messages.generatingLabel : messages.generateLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { CsrOptionsCard }
