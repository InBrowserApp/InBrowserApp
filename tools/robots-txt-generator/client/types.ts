type RobotsTxtGeneratorMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  securityNoticeTitle: string
  securityNotice: string
  presets: string
  presetAllowAll: string
  presetDisallowAll: string
  presetBlockAdmin: string
  siteSettings: string
  sitemaps: string
  sitemapPlaceholder: string
  addSitemap: string
  advancedSettings: string
  host: string
  hostPlaceholder: string
  groups: string
  groupTitle: string
  removeGroup: string
  addGroup: string
  userAgents: string
  userAgentPlaceholder: string
  userAgentPresets: string
  presetSearchEngines: string
  presetAiCrawlers: string
  userAgentHint: string
  addUserAgent: string
  rules: string
  ruleHint: string
  ruleAllow: string
  ruleDisallow: string
  pathPlaceholder: string
  addRule: string
  crawlDelay: string
  crawlDelayPlaceholder: string
  output: string
  outputDescription: string
  download: string
  emptyOutput: string
  copyLabel: string
  copiedLabel: string
}>

type RobotsTxtGeneratorMessagesCatalog = Omit<
  RobotsTxtGeneratorMessages,
  "meta"
>

export type { RobotsTxtGeneratorMessages, RobotsTxtGeneratorMessagesCatalog }
