/* v8 ignore file -- type-only module */
type FetchLike = typeof fetch
type IpVersion = "ipv4" | "ipv6"

type IpLookupTarget = Readonly<{
  kind: "ip"
  input: string
  normalized: string
  address: string
  version: IpVersion
}>

type DomainLookupTarget = Readonly<{
  kind: "domain"
  input: string
  normalized: string
}>

type LookupTarget = IpLookupTarget | DomainLookupTarget

type LookupInputState =
  | Readonly<{ status: "empty"; input: string }>
  | Readonly<{ status: "invalid"; input: string }>
  | Readonly<{ status: "valid"; target: LookupTarget }>

type IpInfo = Readonly<{
  hostname: string | null
  isp: string | null
  organization: string | null
  asn: number | null
  asnOrganization: string | null
  country: string | null
  countryCode: string | null
  region: string | null
  city: string | null
  postalCode: string | null
  timezone: string | null
  latitude: number | null
  longitude: number | null
}>

type PartialIpInfo = Partial<{
  [Key in keyof IpInfo]: IpInfo[Key] | undefined
}>

type DomainAddressRecord = Readonly<{
  type: "A" | "AAAA"
  value: string
  ttl: number | null
}>

type AddressResult = Readonly<{
  address: string
  version: IpVersion
  info: IpInfo
}>

type LookupResult = Readonly<{
  target: LookupTarget
  resolverUrl: string
  records: readonly DomainAddressRecord[]
  addresses: readonly AddressResult[]
}>

type DnsJsonAnswer = Readonly<{
  name?: string
  type: number
  TTL?: number
  data: string
}>

type DnsJsonResponse = Readonly<{
  Status: number
  Answer?: readonly DnsJsonAnswer[]
}>

type AddressRecordQuery = Readonly<{
  label: "A" | "AAAA"
  code: 1 | 28
}>

type IpInfoProvider = Readonly<{
  lookup: (fetchImpl: FetchLike, ip: string) => Promise<PartialIpInfo>
}>

export type {
  AddressRecordQuery,
  AddressResult,
  DnsJsonResponse,
  DomainAddressRecord,
  FetchLike,
  IpInfo,
  IpInfoProvider,
  LookupInputState,
  LookupResult,
  PartialIpInfo,
}
