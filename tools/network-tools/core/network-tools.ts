import type {
  LocalizedNetworkTool,
  NetworkToolDefinition,
  NetworkToolGroupId,
  NetworkToolSlug,
  NetworkToolsMessages,
} from "../types"

const ALL_GROUPS = "all"

const NETWORK_TOOL_GROUPS = [
  "ip",
  "dns",
  "reference",
  "security",
] as const satisfies readonly NetworkToolGroupId[]

const NETWORK_TOOL_DEFINITIONS = [
  {
    slug: "my-ip-address",
    group: "ip",
    priority: 10,
    keywords: ["public ip", "ipv4", "ipv6", "webrtc", "isp", "location"],
  },
  {
    slug: "ip-info-lookup",
    group: "ip",
    priority: 20,
    keywords: ["ip lookup", "geoip", "asn", "isp", "whois", "domain"],
  },
  {
    slug: "cidr-parser",
    group: "ip",
    priority: 30,
    keywords: ["cidr", "subnet", "netmask", "broadcast", "range"],
  },
  {
    slug: "cidrs-merger-excluder",
    group: "ip",
    priority: 40,
    keywords: ["cidr", "merge", "exclude", "summarize", "collapse"],
  },
  {
    slug: "ip-range-to-cidr-converter",
    group: "ip",
    priority: 50,
    keywords: ["range", "cidr", "subnet", "start", "end"],
  },
  {
    slug: "ip-cidr-normalizer",
    group: "ip",
    priority: 60,
    keywords: ["normalize", "canonical", "cidr", "ipv4", "ipv6"],
  },
  {
    slug: "mac-address-to-ipv6-link-local-address-converter",
    group: "ip",
    priority: 70,
    keywords: ["mac", "ipv6", "link local", "eui-64", "converter"],
  },
  {
    slug: "ipv6-address-to-mac-address-converter",
    group: "ip",
    priority: 80,
    keywords: ["ipv6", "mac", "link local", "eui-64", "converter"],
  },
  {
    slug: "dns-lookup",
    group: "dns",
    priority: 10,
    keywords: ["dns", "doh", "record", "a", "aaaa", "mx", "txt"],
  },
  {
    slug: "reverse-ip-lookup",
    group: "dns",
    priority: 20,
    keywords: ["reverse dns", "ptr", "hostname", "ip"],
  },
  {
    slug: "unicode-punycode-converter",
    group: "dns",
    priority: 30,
    keywords: ["punycode", "idn", "domain", "unicode", "ascii"],
  },
  {
    slug: "http-status-code-lookup",
    group: "reference",
    priority: 10,
    keywords: ["http", "status", "code", "response", "api"],
  },
  {
    slug: "port-number-lookup",
    group: "reference",
    priority: 20,
    keywords: ["port", "tcp", "udp", "iana", "service"],
  },
  {
    slug: "mime-type-lookup",
    group: "reference",
    priority: 30,
    keywords: ["mime", "content type", "extension", "media type"],
  },
  {
    slug: "current-network-time",
    group: "reference",
    priority: 40,
    keywords: ["time", "clock", "ntp", "drift", "network"],
  },
  {
    slug: "certificate-public-key-parser",
    group: "security",
    priority: 10,
    keywords: ["x509", "certificate", "tls", "ssl", "pem", "der", "public key"],
  },
  {
    slug: "ssh-public-key-fingerprint",
    group: "security",
    priority: 20,
    keywords: ["ssh", "fingerprint", "sha256", "md5", "authorized keys"],
  },
] as const satisfies readonly NetworkToolDefinition[]

type NetworkToolsFilter = Readonly<{
  group: NetworkToolGroupId | typeof ALL_GROUPS
  query: string
}>

function normalizeSearchValue(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase()
}

function buildLocalizedToolHref(slug: NetworkToolSlug, language: string) {
  return language === "en" ? `/tools/${slug}` : `/${language}/tools/${slug}`
}

function createLocalizedNetworkTools(
  messages: NetworkToolsMessages,
  language: string
): readonly LocalizedNetworkTool[] {
  return NETWORK_TOOL_DEFINITIONS.map((definition) => ({
    ...definition,
    ...messages.tools[definition.slug],
    href: buildLocalizedToolHref(definition.slug, language),
  }))
}

function getToolSearchScore(tool: LocalizedNetworkTool, query: string) {
  const normalizedQuery = normalizeSearchValue(query)

  if (!normalizedQuery) {
    return 0
  }

  const tokens = normalizedQuery.split(" ")
  const searchableText = [
    tool.slug,
    tool.name,
    tool.description,
    ...tool.keywords,
  ]
    .join(" ")
    .toLowerCase()

  if (!tokens.every((token) => searchableText.includes(token))) {
    return -1
  }

  let score = 0
  const name = tool.name.toLowerCase()
  const slug = tool.slug.toLowerCase()
  const keywords = tool.keywords.join(" ").toLowerCase()

  if (name === normalizedQuery) {
    score += 120
  }

  if (name.startsWith(normalizedQuery)) {
    score += 70
  }

  if (slug.includes(normalizedQuery)) {
    score += 45
  }

  if (keywords.includes(normalizedQuery)) {
    score += 30
  }

  if (tool.description.toLowerCase().includes(normalizedQuery)) {
    score += 15
  }

  return score
}

function filterNetworkTools(
  tools: readonly LocalizedNetworkTool[],
  filter: NetworkToolsFilter
) {
  const query = normalizeSearchValue(filter.query)

  return tools
    .map((tool) => ({
      score: getToolSearchScore(tool, query),
      tool,
    }))
    .filter(({ score, tool }) => {
      const matchesGroup =
        filter.group === ALL_GROUPS || tool.group === filter.group
      const matchesQuery = !query || score >= 0

      return matchesGroup && matchesQuery
    })
    .sort((left, right) => {
      if (query && left.score !== right.score) {
        return right.score - left.score
      }

      return left.tool.priority - right.tool.priority
    })
    .map(({ tool }) => tool)
}

function countNetworkToolsByGroup(tools: readonly LocalizedNetworkTool[]) {
  const counts = Object.fromEntries(
    NETWORK_TOOL_GROUPS.map((group) => [group, 0])
  ) as Record<NetworkToolGroupId, number>

  for (const tool of tools) {
    counts[tool.group] += 1
  }

  return counts
}

function formatCount(template: string, count: number, language: string) {
  return template.replace(
    "{count}",
    new Intl.NumberFormat(language).format(count)
  )
}

export {
  ALL_GROUPS,
  NETWORK_TOOL_GROUPS,
  buildLocalizedToolHref,
  countNetworkToolsByGroup,
  createLocalizedNetworkTools,
  filterNetworkTools,
  formatCount,
}
