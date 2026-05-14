import type { DnsLookupResult } from "../core/dns-lookup"

type DnsLookupLocaleMessages = Readonly<{
  queryTitle: string
  queryDescription: string
  domainLabel: string
  domainPlaceholder: string
  recordTypesLabel: string
  recordTypesDescription: string
  dohServerLabel: string
  dnssecLabel: string
  dnssecDescription: string
  checkingDisabledLabel: string
  checkingDisabledDescription: string
  lookupButton: string
  lookingUpButton: string
  resetButton: string
  resultsTitle: string
  resultsDescription: string
  idleTitle: string
  idleDescription: string
  emptyAnswersTitle: string
  emptyAnswersDescription: string
  errorTitle: string
  answerName: string
  answerType: string
  answerTtl: string
  answerData: string
  statusLabel: string
  flagsLabel: string
  rawJson: string
  copyRawJson: string
  copied: string
  responseComment: string
  domainRequired: string
  invalidDomain: string
  recordTypeRequired: string
  lookupFailed: string
  on: string
  off: string
  flagDescriptions: {
    TC: string
    RD: string
    RA: string
    AD: string
    CD: string
  }
}>

type DnsLookupMessages = DnsLookupLocaleMessages &
  Readonly<{
    meta: {
      name: string
      description: string
    }
  }>

type LookupState =
  | Readonly<{
      status: "idle"
    }>
  | Readonly<{
      status: "loading"
    }>
  | Readonly<{
      status: "error"
      message: string
    }>
  | Readonly<{
      status: "ready"
      domain: string
      serverLabel: string
      results: readonly DnsLookupResult[]
    }>

export type { DnsLookupLocaleMessages, DnsLookupMessages, LookupState }
