import { metaUnsupportedDirectiveNames } from './constants'
import { isFlagDirective, isKnownDirective, serializeToken } from './normalize'
import type { CSPDiagnostic, CSPMode, CSPPolicy } from './types'

function createDiagnostic(
  code: string,
  severity: CSPDiagnostic['severity'],
  message: string,
  directive?: string,
  token?: string,
): CSPDiagnostic {
  return { code, severity, message, directive, token }
}

export function diagnoseContentSecurityPolicy(
  policy: CSPPolicy,
  options: {
    delivery: 'header' | 'meta'
    mode: CSPMode
  },
): CSPDiagnostic[] {
  const diagnostics: CSPDiagnostic[] = []
  const directiveMap = new Map(policy.directives.map((directive) => [directive.name, directive]))

  for (const directive of policy.directives) {
    if (!isKnownDirective(directive.name)) {
      diagnostics.push(
        createDiagnostic(
          'parse.unknown-directive',
          'warning',
          `Unknown directive "${directive.name}" will be preserved as-is.`,
          directive.name,
        ),
      )
    }

    if (options.delivery === 'meta' && metaUnsupportedDirectiveNames.has(directive.name)) {
      diagnostics.push(
        createDiagnostic(
          'directive.meta-unsupported',
          'warning',
          `"${directive.name}" is not applied when CSP is delivered through a meta tag.`,
          directive.name,
        ),
      )
    }

    if (!isFlagDirective(directive.name) && directive.tokens.length === 0) {
      diagnostics.push(
        createDiagnostic(
          'directive.empty-value',
          'warning',
          `"${directive.name}" has no values configured.`,
          directive.name,
        ),
      )
    }

    const tokenValues = directive.tokens.map(serializeToken)
    if (tokenValues.includes("'none'") && tokenValues.length > 1) {
      diagnostics.push(
        createDiagnostic(
          'directive.none-with-other-sources',
          'error',
          `"${directive.name}" mixes 'none' with other source expressions.`,
          directive.name,
        ),
      )
    }

    for (const token of directive.tokens) {
      const serialized = serializeToken(token)

      if (token.type === 'raw') {
        diagnostics.push(
          createDiagnostic(
            'token.unrecognized-source-expression',
            'warning',
            `Could not classify "${serialized}" in "${directive.name}".`,
            directive.name,
            serialized,
          ),
        )
      }

      if (token.type === 'nonce' && !/^nonce-[A-Za-z0-9+/_-]+={0,2}$/i.test(token.value)) {
        diagnostics.push(
          createDiagnostic(
            'token.invalid-nonce-format',
            'error',
            `"${serialized}" does not look like a valid nonce source expression.`,
            directive.name,
            serialized,
          ),
        )
      }

      if (token.type === 'hash' && !/^sha(?:256|384|512)-[A-Za-z0-9+/=_-]+$/i.test(token.value)) {
        diagnostics.push(
          createDiagnostic(
            'token.invalid-hash-format',
            'error',
            `"${serialized}" does not look like a valid hash source expression.`,
            directive.name,
            serialized,
          ),
        )
      }

      if (serialized === "'unsafe-inline'") {
        diagnostics.push(
          createDiagnostic(
            'directive.unsafe-inline-used',
            'warning',
            `"${directive.name}" contains 'unsafe-inline'.`,
            directive.name,
            serialized,
          ),
        )
      }

      if (serialized === "'unsafe-eval'") {
        diagnostics.push(
          createDiagnostic(
            'directive.unsafe-eval-used',
            'warning',
            `"${directive.name}" contains 'unsafe-eval'.`,
            directive.name,
            serialized,
          ),
        )
      }

      if (token.type === 'host' && serialized.includes('*')) {
        diagnostics.push(
          createDiagnostic(
            'directive.wildcard-host-used',
            'warning',
            `"${directive.name}" uses a wildcard source.`,
            directive.name,
            serialized,
          ),
        )
      }

      if (serialized === 'data:') {
        diagnostics.push(
          createDiagnostic(
            'directive.data-scheme-used',
            'warning',
            `"${directive.name}" allows data: URLs.`,
            directive.name,
            serialized,
          ),
        )
      }

      if (serialized === 'blob:') {
        diagnostics.push(
          createDiagnostic(
            'directive.blob-scheme-used',
            'warning',
            `"${directive.name}" allows blob: URLs.`,
            directive.name,
            serialized,
          ),
        )
      }
    }

    if (directive.name === 'report-uri') {
      diagnostics.push(
        createDiagnostic(
          'directive.report-uri-deprecated',
          'info',
          '"report-uri" is deprecated in favor of "report-to" in modern browsers.',
          directive.name,
        ),
      )
    }
  }

  if (directiveMap.has('default-src') && !directiveMap.has('script-src')) {
    diagnostics.push(
      createDiagnostic(
        'directive.script-src-missing-while-default-src-present',
        'info',
        'script-src is missing, so scripts will fall back to default-src.',
        'script-src',
      ),
    )
  }

  if (directiveMap.has('default-src') && !directiveMap.has('style-src')) {
    diagnostics.push(
      createDiagnostic(
        'directive.style-src-missing-while-default-src-present',
        'info',
        'style-src is missing, so styles will fall back to default-src.',
        'style-src',
      ),
    )
  }

  if (!directiveMap.has('object-src')) {
    diagnostics.push(
      createDiagnostic(
        'policy.missing-object-src',
        'info',
        'Consider setting object-src to reduce plugin/embed attack surface.',
      ),
    )
  }

  if (!directiveMap.has('base-uri')) {
    diagnostics.push(
      createDiagnostic(
        'policy.missing-base-uri',
        'info',
        'Consider setting base-uri to control the document base URL.',
      ),
    )
  }

  if (options.delivery === 'header' && !directiveMap.has('frame-ancestors')) {
    diagnostics.push(
      createDiagnostic(
        'policy.missing-frame-ancestors',
        'info',
        'Consider setting frame-ancestors to limit who can embed the page.',
      ),
    )
  }

  if (options.mode === 'report-only') {
    diagnostics.push(
      createDiagnostic(
        'policy.report-only-selected',
        'info',
        'Report-Only mode does not enforce the policy in the browser.',
      ),
    )
  }

  return diagnostics
}
