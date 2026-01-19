import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const languagesPath = path.join(repoRoot, 'shared/locale/src/languages.ts')

function readSupportedLanguages(): string[] {
  const source = fs.readFileSync(languagesPath, 'utf8')
  const match = source.match(/supportedLanguages\s*=\s*\[(.*?)\]\s*as const/s)
  if (!match) {
    throw new Error('supportedLanguages array not found')
  }
  const langs = [...match[1].matchAll(/['"]([^'"]+)['"]/g)].map((m) => m[1])
  if (langs.length === 0) {
    throw new Error('supportedLanguages array is empty')
  }
  return langs
}

const supportedLanguages = readSupportedLanguages()
const supportedLanguageSet = new Set(supportedLanguages)

type ObjectExpressionNode = {
  type: 'ObjectExpression'
  properties: Array<unknown>
}

function unwrapObjectExpression(node: unknown): ObjectExpressionNode | null {
  if (!node || typeof node !== 'object') return null
  const typed = node as { type: string; expression?: unknown }
  if (typed.type === 'ObjectExpression') return typed as ObjectExpressionNode
  if (typed.type === 'TSAsExpression' || typed.type === 'TSSatisfiesExpression') {
    return unwrapObjectExpression(typed.expression)
  }
  if (typed.type === 'TSNonNullExpression') return unwrapObjectExpression(typed.expression)
  return null
}

function getStaticKey(node: unknown): string | null {
  if (!node || typeof node !== 'object') return null
  const typed = node as {
    type: string
    name?: string
    value?: unknown
    expressions?: unknown[]
    quasis?: unknown[]
  }
  if (typed.type === 'Identifier' && typed.name) return typed.name
  if (typed.type === 'Literal' && typeof typed.value === 'string') return typed.value
  if (typed.type === 'TemplateLiteral') {
    const expressions = Array.isArray(typed.expressions) ? typed.expressions : []
    const quasis = Array.isArray(typed.quasis) ? typed.quasis : []
    if (expressions.length === 0 && quasis.length === 1) {
      const quasi = quasis[0] as { value?: { cooked?: string } }
      return quasi.value?.cooked ?? null
    }
  }
  return null
}

function extractObjectKeys(node: ObjectExpressionNode): { keys: string[]; hasDynamic: boolean } {
  const keys: string[] = []
  let hasDynamic = false
  for (const prop of node.properties) {
    if (!prop || typeof prop !== 'object') {
      hasDynamic = true
      continue
    }
    const typed = prop as { type: string; computed?: boolean; key?: unknown }
    if (typed.type !== 'Property') {
      hasDynamic = true
      continue
    }
    if (typed.computed) {
      hasDynamic = true
      continue
    }
    const key = getStaticKey(typed.key)
    if (!key) {
      hasDynamic = true
      continue
    }
    keys.push(key)
  }
  return { keys, hasDynamic }
}

const infoMetaRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure tool info meta includes all supported locales',
    },
    schema: [],
    messages: {
      missingLocales: 'Missing locales in meta: {{missing}}',
      unknownLocales: 'Unknown locales in meta: {{unknown}}',
      dynamicKeys: 'Meta must be a plain object with static locale keys',
    },
  },
  create(context: { report: (options: Record<string, unknown>) => void }) {
    return {
      VariableDeclarator(node: { id?: unknown; init?: unknown }) {
        if (!node?.id || typeof node.id !== 'object') return
        const id = node.id as { type: string; name?: string }
        if (id.type !== 'Identifier' || id.name !== 'meta') return
        const objectExpression = unwrapObjectExpression(node.init)
        if (!objectExpression) return
        const { keys, hasDynamic } = extractObjectKeys(objectExpression)
        if (hasDynamic) {
          context.report({ node: objectExpression, messageId: 'dynamicKeys' })
          return
        }
        const keySet = new Set(keys)
        const missing = supportedLanguages.filter((lang) => !keySet.has(lang))
        const unknown = keys.filter((lang) => !supportedLanguageSet.has(lang))
        if (missing.length) {
          context.report({
            node: objectExpression,
            messageId: 'missingLocales',
            data: { missing: missing.join(', ') },
          })
        }
        if (unknown.length) {
          context.report({
            node: objectExpression,
            messageId: 'unknownLocales',
            data: { unknown: unknown.join(', ') },
          })
        }
      },
    }
  },
}

const vueI18nRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure Vue <i18n> blocks include all supported locales',
    },
    schema: [],
    messages: {
      missingLocales: 'Missing locales in <i18n> block: {{missing}}',
      unknownLocales: 'Unknown locales in <i18n> block: {{unknown}}',
      invalidLang: '<i18n> lang must be "json"',
      invalidJson: '<i18n> block must contain valid JSON with locale keys',
    },
  },
  create(context: {
    getSourceCode: () => {
      text: string
      getLocFromIndex: (index: number) => { line: number; column: number }
    }
    report: (options: Record<string, unknown>) => void
  }) {
    const sourceCode = context.getSourceCode()
    const content = sourceCode.text
    const blockRegex = /<i18n(?=\s|>)([^>]*)>([\s\S]*?)<\/i18n>/gi

    return {
      Program() {
        let match: RegExpExecArray | null
        while ((match = blockRegex.exec(content))) {
          const start = sourceCode.getLocFromIndex(match.index)
          const end = sourceCode.getLocFromIndex(match.index + match[0].length)
          const loc = { start, end }

          const attrs = match[1] ?? ''
          const langMatch = attrs.match(/lang\s*=\s*['"]([^'"]+)['"]/i)
          if (langMatch && langMatch[1].toLowerCase() !== 'json') {
            context.report({ loc, messageId: 'invalidLang' })
            continue
          }

          const jsonText = match[2].trim()
          if (!jsonText) {
            context.report({ loc, messageId: 'invalidJson' })
            continue
          }

          let data: unknown
          try {
            data = JSON.parse(jsonText)
          } catch {
            context.report({ loc, messageId: 'invalidJson' })
            continue
          }

          if (!data || typeof data !== 'object' || Array.isArray(data)) {
            context.report({ loc, messageId: 'invalidJson' })
            continue
          }

          const keys = Object.keys(data)
          const keySet = new Set(keys)
          const missing = supportedLanguages.filter((lang) => !keySet.has(lang))
          const unknown = keys.filter((lang) => !supportedLanguageSet.has(lang))

          if (missing.length) {
            context.report({
              loc,
              messageId: 'missingLocales',
              data: { missing: missing.join(', ') },
            })
          }
          if (unknown.length) {
            context.report({
              loc,
              messageId: 'unknownLocales',
              data: { unknown: unknown.join(', ') },
            })
          }
        }
      },
    }
  },
}

export default {
  rules: {
    'i18n-info-meta-complete': infoMetaRule,
    'i18n-vue-block-complete': vueI18nRule,
  },
}
