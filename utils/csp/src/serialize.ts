import { CSP_HEADER_NAME, CSP_REPORT_ONLY_HEADER_NAME } from './constants'
import { serializeDirective } from './normalize'
import type { CSPPolicy, CSPSerializeFormat } from './types'

function escapeAttributeValue(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export function serializePolicyValue(policy: CSPPolicy): string {
  return policy.directives.map(serializeDirective).join('; ').trim()
}

export function serializeContentSecurityPolicy(
  policy: CSPPolicy,
  options: {
    format: CSPSerializeFormat
    mode?: 'enforce' | 'report-only'
  },
): string {
  const value = serializePolicyValue(policy)
  if (!value) return ''

  if (options.format === 'policy') {
    return value
  }

  if (options.format === 'meta') {
    return `<meta http-equiv="Content-Security-Policy" content="${escapeAttributeValue(value)}">`
  }

  const headerName = options.mode === 'report-only' ? CSP_REPORT_ONLY_HEADER_NAME : CSP_HEADER_NAME
  return `${headerName}: ${value}`
}
