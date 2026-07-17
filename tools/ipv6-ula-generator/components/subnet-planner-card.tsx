import { useId } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { CardDescription, CardHeader } from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { Separator } from "@workspace/ui/components/ui/separator"

import type { Ipv6UlaPrefix, Ipv6UlaSubnet } from "../core/ipv6-ula"
import type { Ipv6UlaMessages } from "../types"

type CopyableOutputProps = Readonly<{
  label: string
  copyLabel: string
  copiedLabel: string
  value: string
  live?: boolean
}>

function CopyableOutput({
  label,
  copyLabel,
  copiedLabel,
  value,
  live = false,
}: CopyableOutputProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border/70 bg-card p-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <output
          aria-label={label}
          aria-live={live ? "polite" : undefined}
          className="mt-1 block min-h-6 text-left font-mono text-sm font-medium break-all text-foreground [unicode-bidi:isolate] sm:text-base"
          dir="ltr"
          translate="no"
        >
          {value || "—"}
        </output>
      </div>
      <ToolCopyButton
        value={value}
        copyLabel={copyLabel}
        copiedLabel={copiedLabel}
        variant="ghost"
        disabled={value.length === 0}
      />
    </div>
  )
}

type SubnetPlannerCardProps = Readonly<{
  messages: Ipv6UlaMessages
  prefix: Ipv6UlaPrefix | null
  subnet: Ipv6UlaSubnet | null
  subnetIdIsValid: boolean
  subnetIdInput: string
  onSubnetIdChange: (value: string) => void
}>

function SubnetPlannerCard({
  messages,
  prefix,
  subnet,
  subnetIdIsValid,
  subnetIdInput,
  onSubnetIdChange,
}: SubnetPlannerCardProps) {
  const inputId = useId()
  const descriptionId = useId()
  const errorId = useId()
  const isInvalid = !subnetIdIsValid

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <h2
          data-slot="card-title"
          className="font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm"
        >
          {messages.plannerTitle}
        </h2>
        <CardDescription>{messages.plannerDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-5">
        <FieldGroup>
          <Field data-invalid={isInvalid || undefined}>
            <FieldContent>
              <FieldLabel htmlFor={inputId}>
                {messages.subnetIdLabel}
              </FieldLabel>
              <Input
                id={inputId}
                name="subnet-id"
                value={subnetIdInput}
                maxLength={4}
                pattern="[0-9A-Fa-f]{1,4}"
                autoCapitalize="none"
                autoComplete="off"
                inputMode="text"
                spellCheck={false}
                aria-describedby={`${descriptionId}${isInvalid ? ` ${errorId}` : ""}`}
                aria-invalid={isInvalid}
                placeholder={messages.subnetIdPlaceholder}
                className="h-11 text-left font-mono text-base [unicode-bidi:isolate]"
                dir="ltr"
                onChange={(event) => {
                  onSubnetIdChange(event.target.value)
                }}
              />
              <FieldDescription id={descriptionId}>
                {messages.subnetIdDescription}
              </FieldDescription>
              {isInvalid ? (
                <FieldError id={errorId}>{messages.subnetIdInvalid}</FieldError>
              ) : null}
            </FieldContent>
          </Field>
        </FieldGroup>

        <CopyableOutput
          label={messages.selectedSubnetLabel}
          copyLabel={messages.copySelectedSubnetLabel}
          copiedLabel={messages.copiedLabel}
          value={subnet?.prefix ?? ""}
          live
        />

        <Separator />

        <section aria-labelledby="ula-boundaries-title" className="grid gap-3">
          <div className="grid gap-1">
            <h3 id="ula-boundaries-title" className="font-heading font-medium">
              {messages.boundariesTitle}
            </h3>
            <p className="text-sm text-muted-foreground">
              {messages.boundariesDescription}
            </p>
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            <CopyableOutput
              label={messages.firstSubnetLabel}
              copyLabel={messages.copyFirstSubnetLabel}
              copiedLabel={messages.copiedLabel}
              value={prefix?.firstSubnet ?? ""}
            />
            <CopyableOutput
              label={messages.lastSubnetLabel}
              copyLabel={messages.copyLastSubnetLabel}
              copiedLabel={messages.copiedLabel}
              value={prefix?.lastSubnet ?? ""}
            />
          </div>
        </section>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { SubnetPlannerCard }
