/* v8 ignore file */
export type ParsedRuleDirective = 'allow' | 'disallow'
export type ParsedMetadataDirective = 'sitemap' | 'host' | 'crawl-delay'

export type ParseWarningCode =
  | 'invalid-line'
  | 'empty-user-agent'
  | 'rule-before-user-agent'
  | 'unsupported-directive'

export type ParseWarning = {
  code: ParseWarningCode
  line: number
  message: string
}

export type ParsedRule = {
  id: string
  line: number
  directive: ParsedRuleDirective
  pattern: string
}

export type ParsedGroup = {
  id: string
  startLine: number
  userAgents: string[]
  rules: ParsedRule[]
}

export type ParsedMetadataEntry = {
  directive: ParsedMetadataDirective
  line: number
  value: string
  groupId?: string
}

export type ParsedRobotsTxt = {
  groups: ParsedGroup[]
  metadata: ParsedMetadataEntry[]
  warnings: ParseWarning[]
}

export type NormalizedTarget = { ok: true; normalizedPath: string } | { ok: false; message: string }

export type MatchedGroup = {
  id: string
  startLine: number
  matchedUserAgents: string[]
  userAgents: string[]
}

export type MatchCandidate = {
  groupId: string
  line: number
  directive: ParsedRuleDirective
  pattern: string
  matchedLength: number
}

export type MatchResult = {
  outcome: 'allowed' | 'blocked' | 'allowed-by-default'
  normalizedPath: string
  matchedGroups: MatchedGroup[]
  candidates: MatchCandidate[]
  winner: MatchCandidate | null
}
