type RuleType = "allow" | "disallow"
type RobotsRule = Readonly<{
  type: RuleType
  path: string
}>
type RobotsGroup = Readonly<{
  id: string
  userAgents: readonly string[]
  rules: readonly RobotsRule[]
  crawlDelay: number | null
}>
type RobotsState = Readonly<{
  groups: readonly RobotsGroup[]
  sitemaps: readonly string[]
  host: string
  advanced: boolean
}>
type RobotsPresetKey = "allowAll" | "disallowAll" | "blockAdmin"

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
] as const

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
] as const

function createId() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(16).slice(2)}`
  )
}

function createRule(overrides: Partial<RobotsRule> = {}): RobotsRule {
  return {
    type: "disallow",
    path: "",
    ...overrides,
  }
}

function createGroup(overrides: Partial<RobotsGroup> = {}): RobotsGroup {
  return {
    id: createId(),
    userAgents: ["*"],
    rules: [],
    crawlDelay: null,
    ...overrides,
  }
}

function createDefaultState(): RobotsState {
  return {
    groups: [createGroup({ rules: [createRule({ path: "/admin/" })] })],
    sitemaps: ["https://example.com/sitemap.xml"],
    host: "",
    advanced: false,
  }
}

function appendUniqueUserAgents(
  currentUserAgents: readonly string[],
  nextUserAgents: readonly string[]
) {
  const cleanedNextUserAgents = nextUserAgents
    .map((agent) => agent.trim())
    .filter(Boolean)

  if (cleanedNextUserAgents.length === 0) {
    return [...currentUserAgents]
  }

  const existingUserAgents = currentUserAgents
    .map((agent) => agent.trim())
    .filter(Boolean)
  const hasOnlyWildcard =
    existingUserAgents.length <= 1 &&
    existingUserAgents.every((agent) => agent === "*" || agent.length === 0)

  if (hasOnlyWildcard) {
    return [...cleanedNextUserAgents]
  }

  const seenAgents = new Set(
    existingUserAgents.map((agent) => agent.toLowerCase())
  )
  const mergedUserAgents = [...existingUserAgents]

  for (const agent of cleanedNextUserAgents) {
    const normalizedAgent = agent.toLowerCase()

    if (seenAgents.has(normalizedAgent)) {
      continue
    }

    mergedUserAgents.push(agent)
    seenAgents.add(normalizedAgent)
  }

  return mergedUserAgents
}

function buildRobotsTxt(input: RobotsState) {
  const sections: string[] = []

  if (input.advanced) {
    const hostValue = input.host.trim()

    if (hostValue) {
      sections.push(`Host: ${hostValue}`)
    }
  }

  const groupSections = input.groups
    .map((group) => {
      const lines: string[] = []
      const normalizedUserAgents = group.userAgents
        .map((agent) => agent.trim())
        .filter(Boolean)

      for (const agent of normalizedUserAgents.length > 0
        ? normalizedUserAgents
        : ["*"]) {
        lines.push(`User-agent: ${agent}`)
      }

      for (const rule of group.rules) {
        const path = rule.path.trim()

        if (!path) {
          continue
        }

        lines.push(`${rule.type === "allow" ? "Allow" : "Disallow"}: ${path}`)
      }

      if (
        input.advanced &&
        typeof group.crawlDelay === "number" &&
        !Number.isNaN(group.crawlDelay)
      ) {
        lines.push(`Crawl-delay: ${group.crawlDelay}`)
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
    .map((sitemap) => `Sitemap: ${sitemap}`)

  if (sitemapLines.length > 0) {
    sections.push(sitemapLines.join("\n"))
  }

  return sections.join("\n\n")
}

function applyPreset(state: RobotsState, preset: RobotsPresetKey): RobotsState {
  switch (preset) {
    case "allowAll":
      return {
        ...state,
        groups: [createGroup({ rules: [] })],
      }
    case "disallowAll":
      return {
        ...state,
        groups: [createGroup({ rules: [createRule({ path: "/" })] })],
      }
    case "blockAdmin":
      return {
        ...state,
        groups: [createGroup({ rules: [createRule({ path: "/admin/" })] })],
      }
  }
}

export {
  AI_CRAWLER_USER_AGENTS,
  SEARCH_ENGINE_USER_AGENTS,
  appendUniqueUserAgents,
  applyPreset,
  buildRobotsTxt,
  createDefaultState,
  createGroup,
  createRule,
  type RobotsGroup,
  type RobotsPresetKey,
  type RobotsState,
  type RuleType,
}
