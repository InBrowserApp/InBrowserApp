type RuleType = "allow" | "disallow"

type RobotsRule = {
  type: RuleType
  path: string
}

type RobotsGroup = {
  id: string
  userAgents: string[]
  rules: RobotsRule[]
  crawlDelay: number | null
}

type RobotsState = {
  groups: RobotsGroup[]
  sitemaps: string[]
  host: string
  advanced: boolean
}

type RobotsPreset = "allowAll" | "disallowAll" | "blockAdmin"

const SEARCH_ENGINE_USER_AGENTS = [
  "Googlebot",
  "Bingbot",
  "DuckDuckBot",
  "Baiduspider",
  "YandexBot",
  "Applebot",
  "Naverbot",
  "SeznamBot",
  "Sogou web spider",
  "Qwantify",
  "Yahoo! Slurp",
  "Exabot",
]

const AI_CRAWLER_USER_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "PerplexityBot",
  "CCBot",
  "Google-Extended",
  "Applebot-Extended",
]

let nextGroupId = 1

function createGroupId() {
  const id = "group-" + String(nextGroupId)
  nextGroupId += 1
  return id
}

function createGroup(overrides: Partial<RobotsGroup> = {}): RobotsGroup {
  return {
    id: createGroupId(),
    userAgents: ["*"],
    rules: [],
    crawlDelay: null,
    ...overrides,
  }
}

function createDefaultState(): RobotsState {
  return {
    groups: [
      createGroup({
        rules: [{ type: "disallow", path: "/admin/" }],
      }),
    ],
    sitemaps: ["https://example.com/sitemap.xml"],
    host: "",
    advanced: false,
  }
}

function parseLineList(value: string): string[] {
  return value
    .split(/\r?\n/u)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)
}

function serializeLineList(values: string[]): string {
  return values.join("\n")
}

function mergeUniqueEntries(existing: string[], additions: string[]): string[] {
  const merged = existing
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)
  const seen = new Set(merged.map((entry) => entry.toLowerCase()))
  const cleanedAdditions = additions
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)

  for (const entry of cleanedAdditions) {
    const normalized = entry.toLowerCase()

    if (seen.has(normalized)) {
      continue
    }

    merged.push(entry)
    seen.add(normalized)
  }

  return merged
}

function applyUserAgentPreset(
  existing: string[],
  additions: string[]
): string[] {
  const cleanedExisting = existing
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)
  const cleanedAdditions = additions
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)

  if (cleanedAdditions.length === 0) {
    return cleanedExisting
  }

  const hasOnlyWildcard =
    cleanedExisting.length <= 1 &&
    cleanedExisting.every((entry) => entry === "*")

  if (hasOnlyWildcard) {
    return mergeUniqueEntries([], cleanedAdditions)
  }

  return mergeUniqueEntries(cleanedExisting, cleanedAdditions)
}

function getPresetGroups(preset: RobotsPreset): RobotsGroup[] {
  if (preset === "allowAll") {
    return [createGroup({ rules: [] })]
  }

  if (preset === "disallowAll") {
    return [createGroup({ rules: [{ type: "disallow", path: "/" }] })]
  }

  return [createGroup({ rules: [{ type: "disallow", path: "/admin/" }] })]
}

function buildRobotsTxt(input: RobotsState): string {
  const sections: string[] = []

  if (input.advanced) {
    const hostValue = input.host.trim()

    if (hostValue.length > 0) {
      sections.push("Host: " + hostValue)
    }
  }

  const groupSections = input.groups
    .map((group) => {
      const lines: string[] = []
      const userAgents = group.userAgents
        .map((agent) => agent.trim())
        .filter(Boolean)
      const normalizedAgents = userAgents.length > 0 ? userAgents : ["*"]

      for (const agent of normalizedAgents) {
        lines.push("User-agent: " + agent)
      }

      for (const rule of group.rules) {
        const path = rule.path.trim()

        if (path.length === 0) {
          continue
        }

        const directive = rule.type === "allow" ? "Allow" : "Disallow"
        lines.push(directive + ": " + path)
      }

      if (
        input.advanced &&
        typeof group.crawlDelay === "number" &&
        Number.isFinite(group.crawlDelay) &&
        group.crawlDelay >= 0
      ) {
        lines.push("Crawl-delay: " + String(group.crawlDelay))
      }

      return lines.join("\n")
    })
    .filter((section) => section.trim().length > 0)

  if (groupSections.length > 0) {
    sections.push(groupSections.join("\n\n"))
  }

  const sitemapLines = input.sitemaps
    .map((sitemap) => sitemap.trim())
    .filter(Boolean)
    .map((sitemap) => "Sitemap: " + sitemap)

  if (sitemapLines.length > 0) {
    sections.push(sitemapLines.join("\n"))
  }

  return sections.join("\n\n")
}

export {
  AI_CRAWLER_USER_AGENTS,
  SEARCH_ENGINE_USER_AGENTS,
  applyUserAgentPreset,
  buildRobotsTxt,
  createDefaultState,
  createGroup,
  getPresetGroups,
  mergeUniqueEntries,
  parseLineList,
  serializeLineList,
}

export type { RobotsGroup, RobotsPreset, RobotsRule, RobotsState, RuleType }
