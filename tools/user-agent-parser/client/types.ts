import type { ParsedDetailsSection } from "../core/user-agent"

type UserAgentParserMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  "use-current": string
  "input-label": string
  "input-placeholder": string
  "input-error": string
  "json-output": string
  "empty-state": string
  "parsed-details": string
  unknown: string
  browser: string
  os: string
  engine: string
  device: string
  cpu: string
  name: string
  version: string
  major: string
  type: string
  vendor: string
  model: string
  architecture: string
  copyLabel: string
  copiedLabel: string
}>

type UserAgentParserMessagesCatalog = Omit<UserAgentParserMessages, "meta">
type UserAgentParserSection = ParsedDetailsSection

export type {
  UserAgentParserMessages,
  UserAgentParserMessagesCatalog,
  UserAgentParserSection,
}
