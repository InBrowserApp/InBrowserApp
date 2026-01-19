import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { Linter } from 'eslint'
import tsParser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'
import inbrowserI18n from './inbrowser-i18n'

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

function buildLocaleObject(langs = supportedLanguages): Record<string, { title: string }> {
  return Object.fromEntries(langs.map((lang) => [lang, { title: 'ok' }]))
}

function createLinter(): Linter {
  const linter = new Linter({ configType: 'eslintrc' })
  linter.defineParser('ts', tsParser as unknown as Linter.ParserModule)
  linter.defineParser('vue', vueParser as unknown as Linter.ParserModule)
  linter.defineRule(
    'inbrowser/i18n-info-meta-complete',
    inbrowserI18n.rules['i18n-info-meta-complete'],
  )
  linter.defineRule(
    'inbrowser/i18n-vue-block-complete',
    inbrowserI18n.rules['i18n-vue-block-complete'],
  )
  return linter
}

function verifyInfo(code: string) {
  const linter = createLinter()
  return linter.verify(
    code,
    {
      parser: 'ts',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      rules: {
        'inbrowser/i18n-info-meta-complete': 'error',
      },
    },
    { filename: 'info.ts' },
  )
}

function makeVueFile(i18nJson: string, lang?: string) {
  const langAttr = lang ? ` lang="${lang}"` : ''
  return `<template><div /></template>\n<i18n${langAttr}>\n${i18nJson}\n</i18n>\n`
}

function verifyVue(code: string) {
  const linter = createLinter()
  return linter.verify(
    code,
    {
      parser: 'vue',
      parserOptions: {
        parser: tsParser as unknown as Linter.ParserModule,
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      rules: {
        'inbrowser/i18n-vue-block-complete': 'error',
      },
    },
    { filename: 'Test.vue' },
  )
}

describe('inbrowser/i18n-info-meta-complete', () => {
  it('reports missing locales', () => {
    const code = `export const meta = { en: { title: 'ok' } }`
    const messages = verifyInfo(code)
    const missing = supportedLanguages.filter((lang) => lang !== 'en')
    const missingMessage = messages.find((msg) => msg.message.includes('Missing locales in meta'))
    expect(missingMessage).toBeTruthy()
    expect(missingMessage?.message).toContain(missing[0]!)
  })

  it('reports unknown locales', () => {
    const data = buildLocaleObject()
    data.xx = { title: 'ok' }
    const code = `export const meta = ${JSON.stringify(data, null, 2)}`
    const messages = verifyInfo(code)
    const unknownMessage = messages.find((msg) => msg.message.includes('Unknown locales in meta'))
    expect(unknownMessage).toBeTruthy()
    expect(unknownMessage?.message).toContain('xx')
  })

  it('reports dynamic keys', () => {
    const code = `export const meta = { ['en']: { title: 'ok' } }`
    const messages = verifyInfo(code)
    expect(messages[0]?.message).toContain('Meta must be a plain object')
  })
})

describe('inbrowser/i18n-vue-block-complete', () => {
  it('accepts full locale set', () => {
    const jsonText = JSON.stringify(buildLocaleObject(), null, 2)
    const code = makeVueFile(jsonText, 'json')
    const messages = verifyVue(code)
    expect(messages).toHaveLength(0)
  })

  it('reports missing locales', () => {
    const jsonText = JSON.stringify({ en: { title: 'ok' } }, null, 2)
    const code = makeVueFile(jsonText, 'json')
    const messages = verifyVue(code)
    const missing = supportedLanguages.filter((lang) => lang !== 'en')
    const missingMessage = messages.find((msg) =>
      msg.message.includes('Missing locales in <i18n> block'),
    )
    expect(missingMessage).toBeTruthy()
    expect(missingMessage?.message).toContain(missing[0]!)
  })

  it('reports unknown locales', () => {
    const data = buildLocaleObject()
    data.xx = { title: 'ok' }
    const jsonText = JSON.stringify(data, null, 2)
    const code = makeVueFile(jsonText, 'json')
    const messages = verifyVue(code)
    const unknownMessage = messages.find((msg) =>
      msg.message.includes('Unknown locales in <i18n> block'),
    )
    expect(unknownMessage).toBeTruthy()
    expect(unknownMessage?.message).toContain('xx')
  })

  it('reports invalid JSON', () => {
    const code = makeVueFile('{ invalid }', 'json')
    const messages = verifyVue(code)
    expect(messages[0]?.message).toContain('must contain valid JSON')
  })

  it('reports non-json lang', () => {
    const code = makeVueFile('foo: bar', 'yaml')
    const messages = verifyVue(code)
    expect(messages[0]?.message).toContain('lang must be "json"')
  })
})
