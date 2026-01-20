import { toJavaScriptWarn, type Warnings, CCError } from 'curlconverter'
import { parse } from 'acorn'

type ConversionResult = {
  output: string
  warnings: string[]
  error?: string
}

type FetchBodyType = 'raw' | 'json' | 'urlencoded'

type FetchRequest = {
  url: string
  method?: string
  headers: Array<[string, string]>
  body?: string
  bodyType?: FetchBodyType
  redirect?: string
  credentials?: string
}

type ParseResult = {
  request?: FetchRequest
  warnings: string[]
  error?: string
}

type AcornNode = {
  type: string
  [key: string]: unknown
}

const fetchCallError = 'No fetch(...) call found.'

export function convertCurlToFetch(curlCommand: string): ConversionResult {
  const trimmed = curlCommand.trim()
  if (!trimmed) {
    return { output: '', warnings: [] }
  }

  try {
    const [code, warnings] = toJavaScriptWarn(trimmed)
    return {
      output: wrapFetchWithAsyncAwait(code),
      warnings: formatCurlWarnings(warnings),
    }
  } catch (error) {
    const message =
      error instanceof CCError || error instanceof Error
        ? error.message
        : 'Failed to parse cURL command.'
    return {
      output: '',
      warnings: [],
      error: message,
    }
  }
}

export function convertFetchToCurl(fetchSource: string): ConversionResult {
  const trimmed = fetchSource.trim()
  if (!trimmed) {
    return { output: '', warnings: [] }
  }

  const parseResult = parseFetchSource(trimmed)
  if (parseResult.error || !parseResult.request) {
    return {
      output: '',
      warnings: parseResult.warnings,
      error: parseResult.error ?? fetchCallError,
    }
  }

  const curlOutput = buildCurlCommand(parseResult.request, parseResult.warnings)
  return {
    output: curlOutput,
    warnings: parseResult.warnings,
  }
}

function formatCurlWarnings(warnings: Warnings): string[] {
  return warnings.map(([code, message]) => `[${code}] ${message}`)
}

function wrapFetchWithAsyncAwait(code: string): string {
  const lines = code.split('\n')
  const importLines = lines.filter((line) => line.trim().startsWith('import '))
  const bodyLines = lines.filter((line) => !line.trim().startsWith('import '))
  let responseIndex = 0

  const transformedBody = bodyLines
    .map((line) => {
      const trimmed = line.trim()
      if (!trimmed) return ''
      const match = trimmed.match(/^([A-Za-z_$][\w$]*\.)?fetch\(/)
      if (!match) return line
      responseIndex += 1
      const responseName = responseIndex === 1 ? 'response' : `response${responseIndex}`
      const indent = line.match(/^\s*/)?.[0] ?? ''
      const withoutSemicolon = trimmed.replace(/;$/, '')
      return `${indent}const ${responseName} = await ${withoutSemicolon}`
    })
    .filter((line) => line.length > 0)

  if (!responseIndex) {
    return code.trim()
  }

  const wrappedBody = transformedBody.map((line) => `  ${line}`).join('\n')
  const importBlock = importLines.length ? `${importLines.join('\n')}\n\n` : ''

  return `${importBlock}async function run() {\n${wrappedBody}\n}\n\nrun()`
}

function parseFetchSource(source: string): ParseResult {
  const warnings: string[] = []
  let ast: AcornNode

  try {
    const parsed = parse(source, {
      ecmaVersion: 'latest',
      sourceType: 'module',
      allowAwaitOutsideFunction: true,
    }) as unknown
    if (!isAcornNode(parsed)) {
      return {
        warnings,
        error: 'Failed to parse fetch snippet.',
      }
    }
    ast = parsed
  } catch (error) {
    return {
      warnings,
      error: error instanceof Error ? error.message : 'Failed to parse fetch snippet.',
    }
  }

  const fetchCalls: AcornNode[] = []
  walkNode(ast, (node) => {
    if (node.type === 'CallExpression' && isFetchCall(node)) {
      fetchCalls.push(node)
    }
  })

  if (!fetchCalls.length) {
    return { warnings, error: fetchCallError }
  }

  if (fetchCalls.length > 1) {
    warnings.push('Multiple fetch() calls found; using the first one.')
  }

  const call = fetchCalls[0]
  if (!call) {
    return { warnings, error: fetchCallError }
  }
  const args = (call.arguments as AcornNode[]) ?? []
  const url = parseStaticString(args[0])

  if (!url) {
    return {
      warnings,
      error: 'Unsupported fetch URL. Use a string literal or template without expressions.',
    }
  }

  const request: FetchRequest = {
    url,
    headers: [],
  }

  if (args[1]) {
    parseFetchOptions(args[1], request, warnings)
  }

  return { request, warnings }
}

function parseFetchOptions(node: AcornNode, request: FetchRequest, warnings: string[]): void {
  if (node.type !== 'ObjectExpression') {
    warnings.push('Fetch options must be an object literal to convert reliably.')
    return
  }

  const properties = (node.properties as AcornNode[]) ?? []

  for (const property of properties) {
    if (property.type === 'SpreadElement') {
      warnings.push('Spread syntax in fetch options is not supported.')
      continue
    }

    const key = getPropertyKey(property)
    if (key === null) {
      warnings.push('Unsupported fetch option key.')
      continue
    }

    const value = property.value as AcornNode | undefined
    if (!value) continue

    switch (key) {
      case 'method': {
        const method = parseStaticString(value)
        if (method) {
          request.method = method
        } else {
          warnings.push('Fetch method must be a string literal.')
        }
        break
      }
      case 'headers': {
        request.headers = parseHeadersValue(value, warnings)
        break
      }
      case 'body': {
        const bodyResult = parseBodyValue(value, warnings)
        if (bodyResult) {
          request.body = bodyResult.body
          request.bodyType = bodyResult.type
        }
        break
      }
      case 'redirect': {
        const redirect = parseStaticString(value)
        if (redirect) {
          request.redirect = redirect
        } else {
          warnings.push('Fetch redirect must be a string literal.')
        }
        break
      }
      case 'credentials': {
        const credentials = parseStaticString(value)
        if (credentials) {
          request.credentials = credentials
        } else {
          warnings.push('Fetch credentials must be a string literal.')
        }
        break
      }
      default:
        warnings.push(`Fetch option "${key}" is not supported.`)
        break
    }
  }
}

function parseHeadersValue(node: AcornNode, warnings: string[]): Array<[string, string]> {
  if (node.type === 'ObjectExpression') {
    return parseHeaderObject(node, warnings)
  }

  if (node.type === 'ArrayExpression') {
    return parseHeaderArray(node, warnings)
  }

  if (node.type === 'NewExpression' && isIdentifier(node.callee, 'Headers')) {
    const args = (node.arguments as AcornNode[]) ?? []
    if (!args[0]) {
      return []
    }
    return parseHeadersValue(args[0], warnings)
  }

  warnings.push('Unsupported headers format. Use an object literal or array of pairs.')
  return []
}

function parseHeaderObject(node: AcornNode, warnings: string[]): Array<[string, string]> {
  const headers: Array<[string, string]> = []
  const properties = (node.properties as AcornNode[]) ?? []

  for (const property of properties) {
    if (property.type === 'SpreadElement') {
      warnings.push('Spread syntax in headers is not supported.')
      continue
    }

    const key = getPropertyKey(property)
    const valueNode = property.value as AcornNode | undefined

    if (key === null || !valueNode) {
      warnings.push('Unsupported header entry.')
      continue
    }

    const value = parseHeaderValue(valueNode)
    if (value === null) {
      warnings.push(`Header "${key}" must be a string literal.`)
      continue
    }

    headers.push([key, value])
  }

  return headers
}

function parseHeaderArray(node: AcornNode, warnings: string[]): Array<[string, string]> {
  const headers: Array<[string, string]> = []
  const elements = (node.elements as AcornNode[]) ?? []

  for (const element of elements) {
    if (!element || element.type !== 'ArrayExpression') {
      warnings.push('Header pairs must be arrays with two string literals.')
      continue
    }

    const pair = element.elements as AcornNode[] | undefined
    if (!pair || pair.length < 2) {
      warnings.push('Header pairs must include a key and value.')
      continue
    }

    const key = parseStaticString(pair[0])
    const value = parseStaticString(pair[1])

    if (key === null || value === null) {
      warnings.push('Header pairs must contain string literals.')
      continue
    }

    headers.push([key, value])
  }

  return headers
}

function parseHeaderValue(node: AcornNode): string | null {
  if (node.type === 'ArrayExpression') {
    const items = (node.elements as AcornNode[]) ?? []
    const values = items
      .map((item) => (item ? parseStaticString(item) : null))
      .filter((value): value is string => typeof value === 'string')
    if (!values.length) {
      return null
    }
    return values.join(', ')
  }

  return parseStaticString(node)
}

function parseBodyValue(
  node: AcornNode,
  warnings: string[],
): { body: string; type: FetchBodyType } | null {
  const rawString = parseStaticString(node)
  if (rawString !== null) {
    return { body: rawString, type: 'raw' }
  }

  if (node.type === 'CallExpression' && isJsonStringifyCall(node)) {
    const args = (node.arguments as AcornNode[]) ?? []
    const value = args[0] ? parseStaticValue(args[0]) : undefined
    if (value !== undefined) {
      return { body: JSON.stringify(value), type: 'json' }
    }
    warnings.push('JSON.stringify body must contain literal values.')
    return null
  }

  if (node.type === 'NewExpression' && isIdentifier(node.callee, 'URLSearchParams')) {
    const args = (node.arguments as AcornNode[]) ?? []
    const paramsValue = args[0] ? parseStaticValue(args[0]) : undefined
    if (paramsValue !== undefined) {
      const params = new URLSearchParams(paramsValue as Record<string, string>)
      return { body: params.toString(), type: 'urlencoded' }
    }
    warnings.push('URLSearchParams must contain literal values.')
    return null
  }

  if (node.type === 'NewExpression' && isIdentifier(node.callee, 'FormData')) {
    warnings.push('FormData bodies cannot be converted to cURL.')
    return null
  }

  warnings.push('Unsupported fetch body. Use a string, JSON.stringify, or URLSearchParams.')
  return null
}

function buildCurlCommand(request: FetchRequest, warnings: string[]): string {
  const segments: string[] = ['curl']
  const headerNames = new Set(request.headers.map(([key]) => key.toLowerCase()))
  const hasBody = Boolean(request.body)
  let method = request.method?.toUpperCase()

  if (!method && hasBody) {
    warnings.push('Body found without method; assuming POST.')
    method = 'POST'
  }

  if (method && (method !== 'GET' || hasBody)) {
    segments.push(`-X ${method}`)
    if (method === 'GET' && hasBody) {
      warnings.push('GET requests with a body are unusual and may be rejected.')
    }
  }

  if (request.body && request.bodyType === 'json' && !headerNames.has('content-type')) {
    request.headers = [...request.headers, ['Content-Type', 'application/json']]
    headerNames.add('content-type')
  }

  if (request.body && request.bodyType === 'urlencoded' && !headerNames.has('content-type')) {
    request.headers = [...request.headers, ['Content-Type', 'application/x-www-form-urlencoded']]
    headerNames.add('content-type')
  }

  for (const [key, value] of request.headers) {
    segments.push(`-H ${shellQuote(`${key}: ${value}`)}`)
  }

  if (request.redirect === 'follow') {
    segments.push('-L')
  } else if (request.redirect && request.redirect !== 'follow') {
    warnings.push(`Fetch redirect "${request.redirect}" has no direct cURL equivalent.`)
  }

  if (request.credentials) {
    warnings.push(
      'Fetch credentials are browser-managed; add --cookie manually if you need cookies.',
    )
  }

  if (request.body) {
    segments.push(`--data-raw ${shellQuote(request.body)}`)
  }

  segments.push(shellQuote(request.url))

  return segments.join(' \\\n  ')
}

function shellQuote(value: string): string {
  if (!value) return "''"
  return `'${value.replace(/'/g, `'"'"'`)}'`
}

function parseStaticString(node?: AcornNode): string | null {
  if (!node) return null

  if (node.type === 'Literal') {
    const value = node.value as unknown
    if (typeof value === 'string') return value
    if (value === null || value === undefined) return null
    if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  }

  if (node.type === 'TemplateLiteral') {
    const expressions = node.expressions as AcornNode[]
    if (expressions?.length) {
      return null
    }
    const quasis = node.quasis as Array<{ value: { cooked: string } }>
    return quasis.map((quasi) => quasi.value.cooked).join('')
  }

  return null
}

function parseStaticValue(node: AcornNode): unknown | undefined {
  if (node.type === 'Literal') {
    return node.value
  }

  if (node.type === 'TemplateLiteral') {
    const value = parseStaticString(node)
    return value === null ? undefined : value
  }

  if (node.type === 'ObjectExpression') {
    const result: Record<string, unknown> = {}
    const properties = (node.properties as AcornNode[]) ?? []
    for (const property of properties) {
      if (property.type === 'SpreadElement') return undefined
      const key = getPropertyKey(property)
      if (!key) return undefined
      const valueNode = property.value as AcornNode | undefined
      if (!valueNode) return undefined
      const value = parseStaticValue(valueNode)
      if (value === undefined) return undefined
      result[key] = value
    }
    return result
  }

  if (node.type === 'ArrayExpression') {
    const elements = (node.elements as AcornNode[]) ?? []
    const values: unknown[] = []
    for (const element of elements) {
      if (!element) return undefined
      const value = parseStaticValue(element)
      if (value === undefined) return undefined
      values.push(value)
    }
    return values
  }

  return undefined
}

function getPropertyKey(property: AcornNode): string | null {
  const keyNode = property.key as AcornNode | undefined
  if (!keyNode) return null

  if (keyNode.type === 'Identifier') {
    return typeof keyNode.name === 'string' ? keyNode.name : null
  }

  if (keyNode.type === 'Literal') {
    const value = keyNode.value
    return typeof value === 'string' || typeof value === 'number' ? String(value) : null
  }

  return null
}

function isFetchCall(node: AcornNode): boolean {
  const callee = node.callee as AcornNode | undefined
  if (!callee) return false

  if (callee.type === 'Identifier') {
    return callee.name === 'fetch'
  }

  if (callee.type === 'MemberExpression') {
    const property = callee.property as AcornNode | undefined
    return property?.type === 'Identifier' && property.name === 'fetch'
  }

  return false
}

function isIdentifier(node: unknown, name: string): boolean {
  return (
    isAcornNode(node) &&
    node.type === 'Identifier' &&
    typeof node.name === 'string' &&
    node.name === name
  )
}

function isJsonStringifyCall(node: AcornNode): boolean {
  const callee = node.callee as AcornNode | undefined
  if (!callee) return false

  if (callee.type === 'MemberExpression') {
    const objectNode = callee.object as AcornNode | undefined
    const propertyNode = callee.property as AcornNode | undefined
    return isIdentifier(objectNode, 'JSON') && isIdentifier(propertyNode, 'stringify')
  }

  return false
}

function walkNode(node: AcornNode, visit: (node: AcornNode) => void): void {
  visit(node)

  for (const value of Object.values(node)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (isAcornNode(item)) {
          walkNode(item, visit)
        }
      }
    } else if (isAcornNode(value)) {
      walkNode(value, visit)
    }
  }
}

function isAcornNode(value: unknown): value is AcornNode {
  if (!value || typeof value !== 'object') return false
  if (!('type' in value)) return false
  return typeof (value as { type?: unknown }).type === 'string'
}
