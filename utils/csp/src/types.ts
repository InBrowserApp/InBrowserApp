export type CSPDiagnosticSeverity = 'error' | 'warning' | 'info'

export type CSPInputKind = 'policy' | 'header' | 'meta'

export type CSPDelivery = 'header' | 'meta'

export type CSPMode = 'enforce' | 'report-only'

export type CSPTokenType = 'keyword' | 'scheme' | 'nonce' | 'hash' | 'host' | 'flag' | 'raw'

export type CSPToken = {
  type: CSPTokenType
  value: string
}

export type CSPDirective = {
  name: string
  tokens: CSPToken[]
}

export type CSPPolicy = {
  directives: CSPDirective[]
}

export type CSPDiagnostic = {
  code: string
  severity: CSPDiagnosticSeverity
  message: string
  directive?: string
  token?: string
}

export type CSPParseResult = {
  inputKind: CSPInputKind
  delivery: CSPDelivery
  mode: CSPMode
  policy: CSPPolicy
  diagnostics: CSPDiagnostic[]
}

export type CSPSerializeFormat = 'policy' | 'header' | 'meta'

export type CSPPresetID = 'strict-starter' | 'spa-starter' | 'legacy-relaxed' | 'report-only-audit'
