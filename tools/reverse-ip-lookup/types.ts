import type { ReverseLookupResult } from "./core/types"

type ReverseIpLookupMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  inputTitle: string
  inputDescription: string
  ipLabel: string
  ipPlaceholder: string
  ipDescription: string
  resolverLabel: string
  resolverDescription: string
  resolverGroupLabel: string
  lookupButton: string
  loadingButton: string
  invalidIpTitle: string
  invalidIpDescription: string
  resultTitle: string
  resultDescription: string
  idleTitle: string
  idleDescription: string
  loadingTitle: string
  loadingDescription: string
  lookupFailedTitle: string
  lookupFailedDescription: string
  reverseDomain: string
  dnsStatus: string
  resolver: string
  addressFamily: string
  ptrRecordsTitle: string
  ptrRecordsDescription: string
  hostname: string
  ttl: string
  rawValue: string
  noRecordsTitle: string
  noRecordsDescription: string
  copyReverseDomain: string
  copyHostnames: string
  copied: string
  ipv4: string
  ipv6: string
  secondsAbbreviation: string
}>

type LookupState =
  | Readonly<{ status: "idle" }>
  | Readonly<{ status: "loading" }>
  | Readonly<{ status: "success"; result: ReverseLookupResult }>
  | Readonly<{ status: "error" }>

export type { LookupState, ReverseIpLookupMessages }
