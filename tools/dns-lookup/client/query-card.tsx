import { type FormEvent, type Dispatch, type SetStateAction } from "react"

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
import { Checkbox } from "@workspace/ui/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@workspace/ui/components/ui/dropdown-menu"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { ChevronDown, RefreshCcw, Search } from "@workspace/ui/icons"

import {
  DNS_RECORD_TYPE_OPTIONS,
  DOH_SERVERS,
  type DnsRecordType,
} from "../core/dns-lookup"
import type { DnsLookupMessages } from "./types"

type QueryCardProps = Readonly<{
  checkingDisabled: boolean
  dnssec: boolean
  domain: string
  domainInputId: string
  isLoading: boolean
  messages: DnsLookupMessages
  recordTypes: readonly DnsRecordType[]
  serverUrl: string
  onCheckingDisabledChange: Dispatch<SetStateAction<boolean>>
  onDnssecChange: Dispatch<SetStateAction<boolean>>
  onDomainChange: Dispatch<SetStateAction<string>>
  onRecordTypesChange: Dispatch<SetStateAction<readonly DnsRecordType[]>>
  onReset: () => void
  onServerUrlChange: Dispatch<SetStateAction<string>>
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}>

function QueryCard({
  checkingDisabled,
  dnssec,
  domain,
  domainInputId,
  isLoading,
  messages,
  recordTypes,
  serverUrl,
  onCheckingDisabledChange,
  onDnssecChange,
  onDomainChange,
  onRecordTypesChange,
  onReset,
  onServerUrlChange,
  onSubmit,
}: QueryCardProps) {
  return (
    <ToolPanelCard className="gap-0">
      <CardHeader className="border-b">
        <CardTitle>{messages.queryTitle}</CardTitle>
        <CardDescription>{messages.queryDescription}</CardDescription>
      </CardHeader>
      <form className="flex min-h-0 flex-1 flex-col" onSubmit={onSubmit}>
        <ToolPanelCardContent className="pt-3 pb-4">
          <FieldGroup className="grid gap-4 lg:grid-cols-2">
            <Field>
              <FieldLabel htmlFor={domainInputId}>
                {messages.domainLabel}
              </FieldLabel>
              <Input
                id={domainInputId}
                name="domain"
                autoComplete="url"
                spellCheck={false}
                value={domain}
                placeholder={messages.domainPlaceholder}
                onChange={(event) => {
                  onDomainChange(event.target.value)
                }}
              />
            </Field>

            <Field>
              <FieldLabel>{messages.dohServerLabel}</FieldLabel>
              <Select value={serverUrl} onValueChange={onServerUrlChange}>
                <SelectTrigger
                  aria-label={messages.dohServerLabel}
                  className="w-full"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {DOH_SERVERS.map((server) => (
                      <SelectItem key={server.url} value={server.url}>
                        {server.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <FieldSet>
              <FieldLegend>{messages.recordTypesLabel}</FieldLegend>
              <FieldDescription>
                {messages.recordTypesDescription}
              </FieldDescription>
              <RecordTypeMultiSelect
                messages={messages}
                recordTypes={recordTypes}
                onRecordTypesChange={onRecordTypesChange}
              />
            </FieldSet>

            <FieldSet className="gap-3">
              <FieldLegend>{messages.flagsLabel}</FieldLegend>
              <Field orientation="horizontal">
                <Checkbox
                  id="dnssec-ok"
                  checked={dnssec}
                  onCheckedChange={(checked) => {
                    onDnssecChange(checked === true)
                  }}
                />
                <FieldContent>
                  <FieldLabel htmlFor="dnssec-ok">
                    {messages.dnssecLabel}
                  </FieldLabel>
                  <FieldDescription>
                    {messages.dnssecDescription}
                  </FieldDescription>
                </FieldContent>
              </Field>
              <Field orientation="horizontal">
                <Checkbox
                  id="checking-disabled"
                  checked={checkingDisabled}
                  onCheckedChange={(checked) => {
                    onCheckingDisabledChange(checked === true)
                  }}
                />
                <FieldContent>
                  <FieldLabel htmlFor="checking-disabled">
                    {messages.checkingDisabledLabel}
                  </FieldLabel>
                  <FieldDescription>
                    {messages.checkingDisabledDescription}
                  </FieldDescription>
                </FieldContent>
              </Field>
            </FieldSet>
          </FieldGroup>
        </ToolPanelCardContent>
        <ToolPanelCardFooter className="flex flex-wrap gap-3">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <Search data-icon="inline-start" />
            )}
            {isLoading ? messages.lookingUpButton : messages.lookupButton}
          </Button>
          <Button type="button" variant="ghost" onClick={onReset}>
            <RefreshCcw data-icon="inline-start" />
            {messages.resetButton}
          </Button>
        </ToolPanelCardFooter>
      </form>
    </ToolPanelCard>
  )
}

function RecordTypeMultiSelect({
  messages,
  recordTypes,
  onRecordTypesChange,
}: Readonly<{
  messages: DnsLookupMessages
  recordTypes: readonly DnsRecordType[]
  onRecordTypesChange: Dispatch<SetStateAction<readonly DnsRecordType[]>>
}>) {
  const summary = formatRecordTypesSummary(recordTypes, messages)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between font-normal"
          aria-label={`${messages.recordTypesLabel}: ${summary}`}
        >
          <span className="truncate">{summary}</span>
          <ChevronDown data-icon="inline-end" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-80 min-w-64">
        <DropdownMenuGroup>
          {DNS_RECORD_TYPE_OPTIONS.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.type}
              checked={recordTypes.includes(option.type)}
              onCheckedChange={(checked) => {
                onRecordTypesChange((current) => {
                  if (checked) {
                    return current.includes(option.type)
                      ? current
                      : [...current, option.type]
                  }

                  return current.filter((type) => type !== option.type)
                })
              }}
              onSelect={(event) => {
                event.preventDefault()
              }}
            >
              <span className="w-12 font-mono text-muted-foreground tabular-nums">
                {option.code}
              </span>
              <span className="font-mono">{option.type}</span>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function formatRecordTypesSummary(
  recordTypes: readonly DnsRecordType[],
  messages: DnsLookupMessages
) {
  if (recordTypes.length === 0) {
    return messages.recordTypeRequired
  }

  const visibleRecordTypes = recordTypes.slice(0, 4)
  const remainingCount = recordTypes.length - visibleRecordTypes.length

  return remainingCount > 0
    ? `${visibleRecordTypes.join(", ")} +${remainingCount}`
    : visibleRecordTypes.join(", ")
}

export { QueryCard }
