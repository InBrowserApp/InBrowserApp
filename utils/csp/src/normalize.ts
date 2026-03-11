import type { CSPDirective, CSPToken } from './types'
import { flagDirectiveNames, knownDirectiveNames } from './constants'

const keywordTokens = new Set([
  "'self'",
  "'none'",
  "'unsafe-inline'",
  "'unsafe-eval'",
  "'strict-dynamic'",
  "'unsafe-hashes'",
  "'report-sample'",
])

const hashTokenPattern = /^'?(sha(?:256|384|512)-[A-Za-z0-9+/=_-]+)'?$/
const nonceTokenPattern = /^'?(nonce-[A-Za-z0-9+/=_-]+)'?$/

export function normalizeDirectiveName(value: string): string {
  return value.trim().toLowerCase()
}

export function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

export function isKnownDirective(value: string): boolean {
  return (knownDirectiveNames as readonly string[]).includes(normalizeDirectiveName(value))
}

export function isFlagDirective(value: string): boolean {
  return flagDirectiveNames.has(normalizeDirectiveName(value))
}

export function parseTokenValue(value: string): CSPToken {
  const normalized = collapseWhitespace(value)
  if (!normalized) return { type: 'raw', value: normalized }

  if (keywordTokens.has(normalized)) {
    return { type: 'keyword', value: normalized }
  }

  if (nonceTokenPattern.test(normalized)) {
    return { type: 'nonce', value: normalized.replace(/^'|'$/g, '') }
  }

  if (hashTokenPattern.test(normalized)) {
    return { type: 'hash', value: normalized.replace(/^'|'$/g, '') }
  }

  if (/^[a-z][a-z0-9+.-]*:$/i.test(normalized)) {
    return { type: 'scheme', value: normalized.toLowerCase() }
  }

  if (/^[a-z-]+$/i.test(normalized)) {
    return { type: 'flag', value: normalized }
  }

  if (
    normalized === '*' ||
    /^[a-z][a-z0-9+.-]*:\/\/.+$/i.test(normalized) ||
    /^https?:\/\/.+$/i.test(normalized) ||
    /^wss?:\/\/.+$/i.test(normalized) ||
    /^[*.A-Za-z0-9-]+(?::\d+)?(?:\/.*)?$/.test(normalized)
  ) {
    return { type: 'host', value: normalized }
  }

  return { type: 'raw', value: normalized }
}

export function serializeToken(token: CSPToken): string {
  if (token.type === 'nonce' || token.type === 'hash') {
    return `'${token.value}'`
  }

  return token.value
}

export function serializeDirective(directive: CSPDirective): string {
  if (directive.tokens.length === 0) {
    return directive.name
  }

  return `${directive.name} ${directive.tokens.map(serializeToken).join(' ')}`
}

export function dedupeDirectiveTokens(tokens: CSPToken[]): CSPToken[] {
  const seen = new Set<string>()
  return tokens.filter((token) => {
    const key = `${token.type}:${serializeToken(token)}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
