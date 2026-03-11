import type {
  MatchCandidate,
  MatchResult,
  MatchedGroup,
  NormalizedTarget,
  ParsedRobotsTxt,
} from './types'

const directivePriority = {
  allow: 0,
  disallow: 1,
} as const

export function normalizeRobotsTarget(input: string): NormalizedTarget {
  const trimmed = input.trim()
  if (!trimmed) {
    return { ok: false, message: 'Enter a URL or path.' }
  }

  if (looksLikeAbsoluteUrl(trimmed)) {
    try {
      const url = new URL(trimmed)
      return { ok: true, normalizedPath: `${url.pathname}${url.search}` }
    } catch {
      return { ok: false, message: 'Enter a valid URL or path.' }
    }
  }

  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  const url = new URL(withLeadingSlash, 'https://example.com')
  return { ok: true, normalizedPath: `${url.pathname}${url.search}` }
}

export function matchRobotsTxt(
  parsed: ParsedRobotsTxt,
  userAgentInput: string,
  normalizedPath: string,
): MatchResult {
  const normalizedUserAgent = normalizeUserAgent(userAgentInput)
  const matchedGroups = selectMatchedGroups(parsed, normalizedUserAgent)
  const matchedGroupIds = new Set(matchedGroups.map((group) => group.id))
  const candidates = parsed.groups.flatMap((group) => {
    if (!matchedGroupIds.has(group.id)) {
      return []
    }

    return group.rules
      .map((rule) =>
        buildCandidate(rule.pattern, rule.directive, rule.line, group.id, normalizedPath),
      )
      .filter((candidate): candidate is MatchCandidate => candidate !== null)
  })

  const winner = pickWinner(candidates)

  return {
    outcome: toOutcome(winner),
    normalizedPath,
    matchedGroups,
    candidates: candidates.sort(
      (left, right) => right.matchedLength - left.matchedLength || left.line - right.line,
    ),
    winner,
  }
}

function selectMatchedGroups(parsed: ParsedRobotsTxt, normalizedUserAgent: string): MatchedGroup[] {
  const matches = parsed.groups
    .map((group) => {
      const matchedUserAgents = group.userAgents.filter((value) =>
        userAgentMatches(normalizedUserAgent, value),
      )
      const specificity = matchedUserAgents.reduce((max, value) => {
        const normalized = normalizeRuleUserAgent(value)
        if (normalized === '*') return Math.max(max, 1)
        return Math.max(max, normalized.length + 1)
      }, 0)

      return {
        id: group.id,
        startLine: group.startLine,
        matchedUserAgents,
        userAgents: group.userAgents,
        specificity,
      }
    })
    .filter((group) => group.specificity > 0)

  const specificity = matches.reduce((max, group) => Math.max(max, group.specificity), 0)

  return matches
    .filter((group) => group.specificity === specificity)
    .map((group) => ({
      id: group.id,
      startLine: group.startLine,
      matchedUserAgents: group.matchedUserAgents,
      userAgents: group.userAgents,
    }))
}

function buildCandidate(
  pattern: string,
  directive: 'allow' | 'disallow',
  line: number,
  groupId: string,
  normalizedPath: string,
): MatchCandidate | null {
  if (!ruleMatches(pattern, normalizedPath)) {
    return null
  }

  return {
    groupId,
    line,
    directive,
    pattern,
    matchedLength: getSpecificity(pattern),
  }
}

function pickWinner(candidates: MatchCandidate[]): MatchCandidate | null {
  return (
    [...candidates].sort((left, right) => {
      if (right.matchedLength !== left.matchedLength) {
        return right.matchedLength - left.matchedLength
      }
      if (left.directive !== right.directive) {
        return directivePriority[left.directive] - directivePriority[right.directive]
      }
      return left.line - right.line
    })[0] ?? null
  )
}

function toOutcome(winner: MatchCandidate | null): MatchResult['outcome'] {
  if (winner === null) return 'allowed-by-default'
  return winner.directive === 'allow' ? 'allowed' : 'blocked'
}

function ruleMatches(pattern: string, normalizedPath: string): boolean {
  if (pattern.length === 0) {
    return true
  }

  const hasEndAnchor = pattern.endsWith('$')
  const body = hasEndAnchor ? pattern.slice(0, -1) : pattern
  const expression = `^${escapeRegex(body).replace(/\*/g, '.*')}${hasEndAnchor ? '$' : ''}`
  return new RegExp(expression).test(normalizedPath)
}

function getSpecificity(pattern: string): number {
  const body = pattern.endsWith('$') ? pattern.slice(0, -1) : pattern
  return body.replaceAll('*', '').length
}

function userAgentMatches(normalizedUserAgent: string, ruleUserAgent: string): boolean {
  const normalizedRule = normalizeRuleUserAgent(ruleUserAgent)
  if (!normalizedRule) return false
  if (normalizedRule === '*') return true
  return normalizedUserAgent.startsWith(normalizedRule)
}

function normalizeUserAgent(input: string): string {
  const trimmed = input.trim().toLowerCase()
  if (!trimmed) return ''
  const firstToken = trimmed.split(/\s+/, 1)[0]
  return firstToken.split('/', 1)[0]
}

function normalizeRuleUserAgent(input: string): string {
  return input.trim().toLowerCase()
}

function escapeRegex(input: string): string {
  return input.replace(/[.+?^${}()|[\]\\]/g, '\\$&')
}

function looksLikeAbsoluteUrl(input: string): boolean {
  return /^[a-z][a-z\d+\-.]*:\/\//i.test(input)
}
