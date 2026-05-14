type IpVersion = "ipv4" | "ipv6"
type FetchLike = typeof fetch

type DohServer = Readonly<{
  label: string
  url: string
}>

type DnsJsonQuestion = Readonly<{
  name: string
  type: number
}>

type DnsJsonAnswer = Readonly<{
  name: string
  type: number
  TTL: number
  data: string
}>

type DnsJsonResponse = Readonly<{
  Status: number
  TC?: boolean
  RD?: boolean
  RA?: boolean
  AD?: boolean
  CD?: boolean
  Question?: readonly DnsJsonQuestion[]
  Answer?: readonly DnsJsonAnswer[]
  Comment?: string
}>

type ReverseLookupTarget = Readonly<{
  input: string
  ip: string
  version: IpVersion
  reverseDomain: string
}>

type ReverseInputState =
  | Readonly<{
      status: "empty"
      input: string
    }>
  | Readonly<{
      status: "invalid"
      input: string
    }>
  | Readonly<{
      status: "valid"
      target: ReverseLookupTarget
    }>

type ReversePtrAnswer = Readonly<{
  hostname: string
  rawHostname: string
  ttl: number
}>

type ReverseLookupResult = Readonly<{
  target: ReverseLookupTarget
  resolverUrl: string
  response: DnsJsonResponse
  rcode: string
  answers: readonly ReversePtrAnswer[]
}>

export type {
  DnsJsonResponse,
  DohServer,
  FetchLike,
  ReverseInputState,
  ReverseLookupResult,
  ReverseLookupTarget,
  ReversePtrAnswer,
}
