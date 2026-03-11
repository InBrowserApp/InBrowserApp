import type {
  ParseWarning,
  ParsedGroup,
  ParsedMetadataDirective,
  ParsedMetadataEntry,
  ParsedRobotsTxt,
  ParsedRule,
  ParsedRuleDirective,
} from './types'

const supportedMetadataDirectives: ParsedMetadataDirective[] = ['sitemap', 'host', 'crawl-delay']

export function parseRobotsTxt(input: string): ParsedRobotsTxt {
  const groups: ParsedGroup[] = []
  const metadata: ParsedMetadataEntry[] = []
  const warnings: ParseWarning[] = []
  const lines = input.split(/\r?\n/)
  let currentGroup: ParsedGroup | null = null

  for (const [index, rawLine] of lines.entries()) {
    const line = index + 1
    const withoutComment = (rawLine.split('#', 1)[0] ?? '').trim()
    if (!withoutComment) {
      continue
    }

    const separatorIndex = withoutComment.indexOf(':')
    if (separatorIndex === -1) {
      warnings.push({
        code: 'invalid-line',
        line,
        message: `Ignored line without ":" at line ${line}.`,
      })
      continue
    }

    const directive = withoutComment.slice(0, separatorIndex).trim().toLowerCase()
    const value = withoutComment.slice(separatorIndex + 1).trim()

    if (directive === 'user-agent') {
      if (!value) {
        warnings.push({
          code: 'empty-user-agent',
          line,
          message: `Ignored empty user-agent at line ${line}.`,
        })
        continue
      }

      if (currentGroup === null || currentGroup.rules.length > 0) {
        currentGroup = createGroup(groups.length + 1, line)
        groups.push(currentGroup)
      }

      currentGroup.userAgents.push(value)
      continue
    }

    if (directive === 'allow' || directive === 'disallow') {
      if (currentGroup === null || currentGroup.userAgents.length === 0) {
        warnings.push({
          code: 'rule-before-user-agent',
          line,
          message: `Ignored ${directive} before any user-agent at line ${line}.`,
        })
        continue
      }

      currentGroup.rules.push(
        createRule(currentGroup.id, currentGroup.rules.length + 1, line, directive, value),
      )
      continue
    }

    if (isSupportedMetadataDirective(directive)) {
      metadata.push({
        directive,
        line,
        value,
        groupId: directive === 'crawl-delay' ? currentGroup?.id : undefined,
      })
      continue
    }

    warnings.push({
      code: 'unsupported-directive',
      line,
      message: `Ignored unsupported directive "${directive}" at line ${line}.`,
    })
  }

  return { groups, metadata, warnings }
}

function createGroup(index: number, line: number): ParsedGroup {
  return {
    id: `group-${index}`,
    startLine: line,
    userAgents: [],
    rules: [],
  }
}

function createRule(
  groupId: string,
  index: number,
  line: number,
  directive: ParsedRuleDirective,
  pattern: string,
): ParsedRule {
  return {
    id: `${groupId}-rule-${index}`,
    line,
    directive,
    pattern,
  }
}

function isSupportedMetadataDirective(value: string): value is ParsedMetadataDirective {
  return supportedMetadataDirectives.includes(value as ParsedMetadataDirective)
}
