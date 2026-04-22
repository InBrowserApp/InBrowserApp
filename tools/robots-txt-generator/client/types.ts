import type { ToolMeta } from "@workspace/tool-sdk"

import type { RobotsRule } from "../core/robots"

type RobotsTxtMessageCatalog = Readonly<{
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
  removeRule: string
  crawlDelay: string
  crawlDelayPlaceholder: string
  output: string
  download: string
  emptyOutput: string
}>

type RobotsTxtGeneratorPageMessages = Readonly<{
  meta: ToolMeta
}> &
  RobotsTxtMessageCatalog

type RobotsGroupDraft = {
  id: string
  userAgentsText: string
  rules: RobotsRule[]
  crawlDelayInput: string
}

type RobotsDraftState = {
  groups: RobotsGroupDraft[]
  sitemapsText: string
  host: string
  advanced: boolean
}

export type {
  RobotsDraftState,
  RobotsGroupDraft,
  RobotsTxtGeneratorPageMessages,
}
