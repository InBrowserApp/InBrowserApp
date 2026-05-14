import { useEffect, useId, useRef, useState, type FormEvent } from "react"

import {
  DEFAULT_RECORD_TYPES,
  DNS_RECORD_TYPES,
  DOH_SERVERS,
  lookupDnsRecords,
  normalizeDnsName,
  type DnsRecordType,
} from "./core/dns-lookup"
import { QueryCard } from "./client/query-card"
import { ResultsCard } from "./client/results-card"
import type { DnsLookupMessages, LookupState } from "./client/types"

type DnsLookupClientProps = Readonly<{
  language: string
  messages: DnsLookupMessages
}>

const DOMAIN_STORAGE_KEY = "tools:dns-lookup:domain"
const RECORD_TYPES_STORAGE_KEY = "tools:dns-lookup:record-types"
const SERVER_STORAGE_KEY = "tools:dns-lookup:server"
const DNSSEC_STORAGE_KEY = "tools:dns-lookup:dnssec"
const CHECKING_DISABLED_STORAGE_KEY = "tools:dns-lookup:checking-disabled"

function DnsLookupClient({ language, messages }: DnsLookupClientProps) {
  const domainInputId = useId()
  const abortControllerRef = useRef<AbortController | null>(null)
  const [domain, setDomain] = useState("example.com")
  const [recordTypes, setRecordTypes] =
    useState<readonly DnsRecordType[]>(DEFAULT_RECORD_TYPES)
  const [serverUrl, setServerUrl] = useState<string>(DOH_SERVERS[0]!.url)
  const [dnssec, setDnssec] = useState(false)
  const [checkingDisabled, setCheckingDisabled] = useState(false)
  const [hasHydratedState, setHasHydratedState] = useState(false)
  const [lookupState, setLookupState] = useState<LookupState>({
    status: "idle",
  })

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedDomain = window.localStorage.getItem(DOMAIN_STORAGE_KEY)
    const storedRecordTypes = parseStoredRecordTypes(
      window.localStorage.getItem(RECORD_TYPES_STORAGE_KEY)
    )
    const storedServer = window.localStorage.getItem(SERVER_STORAGE_KEY)

    if (storedDomain !== null) {
      setDomain(storedDomain)
    }

    if (storedRecordTypes.length > 0) {
      setRecordTypes(storedRecordTypes)
    }

    if (DOH_SERVERS.some((server) => server.url === storedServer)) {
      setServerUrl(storedServer!)
    }

    setDnssec(window.localStorage.getItem(DNSSEC_STORAGE_KEY) === "true")
    setCheckingDisabled(
      window.localStorage.getItem(CHECKING_DISABLED_STORAGE_KEY) === "true"
    )
    setHasHydratedState(true)
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined" || !hasHydratedState) return

    window.localStorage.setItem(DOMAIN_STORAGE_KEY, domain)
    window.localStorage.setItem(
      RECORD_TYPES_STORAGE_KEY,
      JSON.stringify(recordTypes)
    )
    window.localStorage.setItem(SERVER_STORAGE_KEY, serverUrl)
    window.localStorage.setItem(DNSSEC_STORAGE_KEY, String(dnssec))
    window.localStorage.setItem(
      CHECKING_DISABLED_STORAGE_KEY,
      String(checkingDisabled)
    )
  }, [
    checkingDisabled,
    dnssec,
    domain,
    hasHydratedState,
    recordTypes,
    serverUrl,
  ])

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  function resetQuery() {
    abortControllerRef.current?.abort()
    setDomain("example.com")
    setRecordTypes(DEFAULT_RECORD_TYPES)
    setServerUrl(DOH_SERVERS[0]!.url)
    setDnssec(false)
    setCheckingDisabled(false)
    setLookupState({ status: "idle" })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validationMessage = getValidationMessage(
      domain,
      recordTypes,
      messages
    )

    if (validationMessage) {
      setLookupState({ status: "error", message: validationMessage })
      return
    }

    const normalizedDomain = normalizeDnsName(domain)
    const server = DOH_SERVERS.find((candidate) => candidate.url === serverUrl)!
    const abortController = new AbortController()

    abortControllerRef.current?.abort()
    abortControllerRef.current = abortController
    setLookupState({ status: "loading" })

    try {
      const results = await lookupDnsRecords(
        server.url,
        normalizedDomain,
        recordTypes,
        {
          checkingDisabled,
          dnssec,
          signal: abortController.signal,
        }
      )

      if (abortController.signal.aborted) {
        return
      }

      setLookupState({
        status: "ready",
        domain: normalizedDomain,
        serverLabel: server.label,
        results,
      })
    } catch (error) {
      if (abortController.signal.aborted) {
        return
      }

      setLookupState({
        status: "error",
        message: `${messages.lookupFailed} ${getErrorMessage(error)}`,
      })
    }
  }

  return (
    <div className="grid gap-6">
      <QueryCard
        checkingDisabled={checkingDisabled}
        dnssec={dnssec}
        domain={domain}
        domainInputId={domainInputId}
        isLoading={lookupState.status === "loading"}
        messages={messages}
        recordTypes={recordTypes}
        serverUrl={serverUrl}
        onCheckingDisabledChange={setCheckingDisabled}
        onDnssecChange={setDnssec}
        onDomainChange={setDomain}
        onRecordTypesChange={setRecordTypes}
        onReset={resetQuery}
        onServerUrlChange={setServerUrl}
        onSubmit={(event) => {
          void handleSubmit(event)
        }}
      />
      <ResultsCard
        language={language}
        messages={messages}
        state={lookupState}
      />
    </div>
  )
}

function parseStoredRecordTypes(value: string | null) {
  if (value === null) {
    return []
  }

  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.filter(isDnsRecordType) : []
  } catch {
    return []
  }
}

function isDnsRecordType(value: unknown): value is DnsRecordType {
  return DNS_RECORD_TYPES.includes(value as DnsRecordType)
}

function getValidationMessage(
  domain: string,
  recordTypes: readonly DnsRecordType[],
  messages: DnsLookupMessages
) {
  if (domain.trim().length === 0) {
    return messages.domainRequired
  }

  try {
    normalizeDnsName(domain)
  } catch {
    return messages.invalidDomain
  }

  if (recordTypes.length === 0) {
    return messages.recordTypeRequired
  }

  return ""
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

export default DnsLookupClient
