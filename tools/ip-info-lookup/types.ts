import type { LookupResult } from "./core/ip-info-lookup"

type IpInfoLookupMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  inputTitle: string
  inputDescription: string
  targetLabel: string
  targetPlaceholder: string
  targetDescription: string
  invalidTargetTitle: string
  invalidTargetDescription: string
  resolverLabel: string
  resolverDescription: string
  resolverGroupLabel: string
  lookupButton: string
  loadingButton: string
  resultTitle: string
  resultDescription: string
  idleTitle: string
  idleDescription: string
  loadingTitle: string
  loadingDescription: string
  lookupFailedTitle: string
  lookupFailedDescription: string
  noAddressesTitle: string
  noAddressesDescription: string
  target: string
  normalizedTarget: string
  resolver: string
  addressCount: string
  address: string
  addressFamily: string
  domainRecords: string
  domainRecordsDescription: string
  recordType: string
  ttl: string
  hostname: string
  isp: string
  organization: string
  asn: string
  asnOrganization: string
  location: string
  country: string
  region: string
  city: string
  postalCode: string
  timezone: string
  coordinates: string
  unavailable: string
  copyAddress: string
  copyAllAddresses: string
  openMap: string
  copied: string
  ipTarget: string
  domainTarget: string
  ipv4: string
  ipv6: string
  secondsAbbreviation: string
}>

type LookupState =
  | Readonly<{ status: "idle" }>
  | Readonly<{ status: "loading" }>
  | Readonly<{ status: "success"; result: LookupResult }>
  | Readonly<{ status: "error" }>

export type { IpInfoLookupMessages, LookupState }
