import { createEmptyPolicy } from './constants'
import { collapseWhitespace, normalizeDirectiveName, parseTokenValue } from './normalize'
import type { CSPDiagnostic, CSPDirective, CSPParseResult, CSPPolicy } from './types'

const headerPattern = /^content-security-policy(?:-report-only)?\s*:/i

function createDiagnostic(
  code: string,
  severity: CSPDiagnostic['severity'],
  message: string,
  directive?: string,
  token?: string,
): CSPDiagnostic {
  return { code, severity, message, directive, token }
}

function readAttribute(tag: string, attributeName: string): string | null {
  const pattern = new RegExp(`${attributeName}\\s*=\\s*(['"])([\\s\\S]*?)\\1`, 'i')
  const match = tag.match(pattern)
  return match?.[2] ?? null
}

function detectInputKind(value: string): Pick<CSPParseResult, 'inputKind' | 'delivery' | 'mode'> {
  const trimmed = value.trim()

  if (/^<meta\b/i.test(trimmed)) {
    return { inputKind: 'meta', delivery: 'meta', mode: 'enforce' }
  }

  if (/^content-security-policy-report-only\s*:/i.test(trimmed)) {
    return { inputKind: 'header', delivery: 'header', mode: 'report-only' }
  }

  if (headerPattern.test(trimmed)) {
    return { inputKind: 'header', delivery: 'header', mode: 'enforce' }
  }

  return { inputKind: 'policy', delivery: 'header', mode: 'enforce' }
}

function extractPolicyText(
  input: string,
  diagnostics: CSPDiagnostic[],
): Omit<CSPParseResult, 'policy' | 'diagnostics'> & {
  policyText: string
} {
  const detected = detectInputKind(input)
  const trimmed = input.trim()

  if (detected.inputKind === 'meta') {
    const httpEquiv = readAttribute(trimmed, 'http-equiv')
    const content = readAttribute(trimmed, 'content')
    if (!httpEquiv || httpEquiv.toLowerCase() !== 'content-security-policy' || content === null) {
      diagnostics.push(
        createDiagnostic(
          'parse.invalid-meta-format',
          'error',
          'Could not extract a valid Content-Security-Policy meta tag.',
        ),
      )
      return { ...detected, policyText: '' }
    }

    return { ...detected, policyText: content }
  }

  if (detected.inputKind === 'header') {
    const policyText = trimmed.replace(headerPattern, '').trim()
    if (!policyText) {
      diagnostics.push(
        createDiagnostic(
          'parse.invalid-header-format',
          'error',
          'Could not extract a Content-Security-Policy header value.',
        ),
      )
    }
    return { ...detected, policyText }
  }

  return { ...detected, policyText: trimmed }
}

function appendDirective(
  directives: CSPDirective[],
  diagnostics: CSPDiagnostic[],
  name: string,
  rawTokens: string[],
): void {
  const existing = directives.find((directive) => directive.name === name)
  const parsedTokens = rawTokens.map(parseTokenValue)

  if (existing) {
    existing.tokens.push(...parsedTokens)
    diagnostics.push(
      createDiagnostic(
        'parse.duplicate-directive',
        'warning',
        `Found duplicate directive "${name}". Tokens were merged into a single entry.`,
        name,
      ),
    )
    return
  }

  directives.push({
    name,
    tokens: parsedTokens,
  })
}

function parsePolicyText(policyText: string, diagnostics: CSPDiagnostic[]): CSPPolicy {
  if (!policyText.trim()) return createEmptyPolicy()

  const directives: CSPDirective[] = []

  for (const segment of policyText.split(';')) {
    const collapsed = collapseWhitespace(segment)
    if (!collapsed) continue

    const parts = collapsed.split(' ')
    const rawName = parts.shift()
    const name = normalizeDirectiveName(rawName ?? '')

    if (!name) {
      diagnostics.push(
        createDiagnostic('parse.empty-directive', 'warning', 'Skipped an empty directive segment.'),
      )
      continue
    }

    appendDirective(directives, diagnostics, name, parts)
  }

  return { directives }
}

export function parseContentSecurityPolicy(input: string): CSPParseResult {
  const diagnostics: CSPDiagnostic[] = []
  const extracted = extractPolicyText(input, diagnostics)
  const policy = parsePolicyText(extracted.policyText, diagnostics)

  return {
    inputKind: extracted.inputKind,
    delivery: extracted.delivery,
    mode: extracted.mode,
    policy,
    diagnostics,
  }
}
