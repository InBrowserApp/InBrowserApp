import type { CSPDirective, CSPPolicy } from './types'

export const CSP_HEADER_NAME = 'Content-Security-Policy'
export const CSP_REPORT_ONLY_HEADER_NAME = 'Content-Security-Policy-Report-Only'

export const knownDirectiveNames = [
  'default-src',
  'script-src',
  'style-src',
  'img-src',
  'connect-src',
  'font-src',
  'media-src',
  'object-src',
  'frame-src',
  'worker-src',
  'manifest-src',
  'base-uri',
  'form-action',
  'frame-ancestors',
  'report-uri',
  'report-to',
  'sandbox',
  'upgrade-insecure-requests',
  'block-all-mixed-content',
] as const

export const flagDirectiveNames = new Set<string>([
  'upgrade-insecure-requests',
  'block-all-mixed-content',
])

export const metaUnsupportedDirectiveNames = new Set<string>([
  'frame-ancestors',
  'sandbox',
  'report-uri',
  'report-to',
])

export const quickAddTokensByDirective: Record<string, string[]> = {
  'default-src': ["'self'", "'none'", 'https:', 'data:', 'blob:'],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", "'strict-dynamic'", 'https:'],
  'style-src': ["'self'", "'unsafe-inline'", 'https:'],
  'img-src': ["'self'", 'data:', 'blob:', 'https:'],
  'connect-src': ["'self'", 'https:', 'wss:'],
  'font-src': ["'self'", 'data:', 'https:'],
  'media-src': ["'self'", 'blob:', 'https:'],
  'object-src': ["'none'", "'self'"],
  'frame-src': ["'self'", 'https:'],
  'worker-src': ["'self'", 'blob:'],
  'manifest-src': ["'self'"],
  'base-uri': ["'self'", "'none'"],
  'form-action': ["'self'", "'none'"],
  'frame-ancestors': ["'self'", "'none'"],
  'report-uri': ['https://example.com/csp-report'],
  'report-to': ['csp-endpoint'],
  sandbox: ['allow-forms', 'allow-scripts', 'allow-same-origin'],
}

export function createEmptyPolicy(): CSPPolicy {
  return { directives: [] }
}

export function clonePolicy(policy: CSPPolicy): CSPPolicy {
  return {
    directives: policy.directives.map((directive) => ({
      name: directive.name,
      tokens: directive.tokens.map((token) => ({ ...token })),
    })),
  }
}

export function createDirective(name: string, values: string[] = []): CSPDirective {
  return {
    name,
    tokens: values.map((value) => ({ type: 'raw', value })),
  }
}
