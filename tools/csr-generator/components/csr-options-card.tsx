import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { FieldGroup } from "@workspace/ui/components/ui/field"
import { Button } from "@workspace/ui/components/ui/button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { LoaderCircle, RefreshCcw } from "@workspace/ui/icons"

import type {
  EcCurve,
  HashAlgorithm,
  KeyAlgorithm,
  KeySource,
  RsaKeySize,
  SubjectInput,
} from "../core/csr"
import type { CsrGeneratorMessages } from "../client/types"
import { CsrKeySourceFields } from "./csr-key-source-fields"
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
  const { generating, messages, onReset } = props

  return (
    <ToolPanelCard className="xl:sticky xl:top-6 xl:h-auto xl:self-start">
      <CardHeader className="border-b">
        <CardTitle>{messages.optionsTitle}</CardTitle>
        <CardDescription>{messages.optionsDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-6">
        <FieldGroup>
          <CsrKeySourceFields
            keySource={props.keySource}
            algorithm={props.algorithm}
            rsaKeySize={props.rsaKeySize}
            rsaHash={props.rsaHash}
            ecCurve={props.ecCurve}
            keyPem={props.keyPem}
            messages={messages}
            onKeySourceChange={props.onKeySourceChange}
            onAlgorithmChange={props.onAlgorithmChange}
            onRsaKeySizeChange={props.onRsaKeySizeChange}
            onRsaHashChange={props.onRsaHashChange}
            onEcCurveChange={props.onEcCurveChange}
            onKeyPemChange={props.onKeyPemChange}
          />
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
            subject={props.subject}
            onChange={props.onSubjectChange}
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
            sanDns={props.sanDns}
            sanIp={props.sanIp}
            sanEmail={props.sanEmail}
            sanUri={props.sanUri}
            onSanDnsChange={props.onSanDnsChange}
            onSanIpChange={props.onSanIpChange}
            onSanEmailChange={props.onSanEmailChange}
            onSanUriChange={props.onSanUriChange}
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
