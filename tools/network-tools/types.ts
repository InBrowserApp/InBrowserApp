type NetworkToolGroupId = "ip" | "dns" | "reference" | "security"

type NetworkToolSlug =
  | "certificate-public-key-parser"
  | "cidr-parser"
  | "cidrs-merger-excluder"
  | "current-network-time"
  | "dns-lookup"
  | "http-status-code-lookup"
  | "ip-cidr-normalizer"
  | "ip-info-lookup"
  | "ip-range-to-cidr-converter"
  | "ipv6-address-to-mac-address-converter"
  | "mac-address-to-ipv6-link-local-address-converter"
  | "mime-type-lookup"
  | "my-ip-address"
  | "port-number-lookup"
  | "reverse-ip-lookup"
  | "ssh-public-key-fingerprint"
  | "unicode-punycode-converter"

type NetworkToolGroupCopy = Readonly<{
  label: string
  description: string
}>

type NetworkToolCopy = Readonly<{
  name: string
  description: string
}>

type NetworkToolsMessages = Readonly<{
  searchLabel: string
  searchPlaceholder: string
  clearSearchLabel: string
  allGroupsLabel: string
  resultCountTemplate: string
  emptyTitle: string
  emptyDescription: string
  openToolLabel: string
  groups: Readonly<Record<NetworkToolGroupId, NetworkToolGroupCopy>>
  tools: Readonly<Record<NetworkToolSlug, NetworkToolCopy>>
}>

type NetworkToolDefinition = Readonly<{
  slug: NetworkToolSlug
  group: NetworkToolGroupId
  keywords: readonly string[]
  priority: number
}>

type LocalizedNetworkTool = NetworkToolDefinition &
  NetworkToolCopy &
  Readonly<{
    href: string
  }>

export type {
  LocalizedNetworkTool,
  NetworkToolDefinition,
  NetworkToolGroupId,
  NetworkToolSlug,
  NetworkToolsMessages,
}
