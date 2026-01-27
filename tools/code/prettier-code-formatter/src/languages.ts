import type { Plugin } from 'prettier'
import parserAngular from 'prettier/plugins/angular'
import parserBabel from 'prettier/plugins/babel'
import parserEstree from 'prettier/plugins/estree'
import parserFlow from 'prettier/plugins/flow'
import parserGlimmer from 'prettier/plugins/glimmer'
import parserGraphql from 'prettier/plugins/graphql'
import parserTypescript from 'prettier/plugins/typescript'
import parserHtml from 'prettier/plugins/html'
import parserPostcss from 'prettier/plugins/postcss'
import parserMarkdown from 'prettier/plugins/markdown'
import parserYaml from 'prettier/plugins/yaml'

export const languageKeys = [
  'javascript',
  'typescript',
  'flow',
  'json',
  'json5',
  'jsonc',
  'html',
  'angular',
  'vue',
  'lwc',
  'handlebars',
  'css',
  'scss',
  'less',
  'markdown',
  'mdx',
  'yaml',
  'graphql',
] as const

export type LanguageKey = (typeof languageKeys)[number]

export const languageLabels: Record<LanguageKey, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  flow: 'Flow',
  json: 'JSON',
  json5: 'JSON5',
  jsonc: 'JSONC',
  html: 'HTML',
  angular: 'Angular',
  vue: 'Vue',
  lwc: 'LWC',
  handlebars: 'Handlebars',
  css: 'CSS',
  scss: 'SCSS',
  less: 'Less',
  markdown: 'Markdown',
  mdx: 'MDX',
  yaml: 'YAML',
  graphql: 'GraphQL',
}

export type LanguageConfig = {
  parser: string
  plugins: Plugin[]
  highlight: string
  extensions: string[]
  sample: string
  supportsSemi?: boolean
  supportsSingleQuote?: boolean
  supportsTrailingComma?: boolean
}

export const languageConfigs: Record<LanguageKey, LanguageConfig> = {
  javascript: {
    parser: 'babel',
    plugins: [parserBabel, parserEstree],
    highlight: 'javascript',
    extensions: ['.js', '.jsx', '.mjs', '.cjs'],
    supportsSemi: true,
    supportsSingleQuote: true,
    supportsTrailingComma: true,
    sample: `const greeting = (name) => {\n  return { message: 'Hello ' + name, items: [1, 2, 3] }\n}\n`,
  },
  typescript: {
    parser: 'typescript',
    plugins: [parserTypescript, parserEstree],
    highlight: 'typescript',
    extensions: ['.ts', '.tsx'],
    supportsSemi: true,
    supportsSingleQuote: true,
    supportsTrailingComma: true,
    sample: `type User = { id: number; name: string }\n\nconst users: User[] = [{ id: 1, name: 'Ada' }]\n`,
  },
  flow: {
    parser: 'flow',
    plugins: [parserFlow, parserEstree],
    highlight: 'javascript',
    extensions: ['.js', '.jsx'],
    supportsSemi: true,
    supportsSingleQuote: true,
    supportsTrailingComma: true,
    sample: `/* @flow */\ntype User = { id: number, name: string }\n\nconst user: User = { id: 1, name: 'Ada' }\n`,
  },
  json: {
    parser: 'json',
    plugins: [parserBabel, parserEstree],
    highlight: 'json',
    extensions: ['.json'],
    sample: `{
  "name": "Example",
  "items": [1, 2, 3],
  "active": true
}\n`,
  },
  json5: {
    parser: 'json5',
    plugins: [parserBabel, parserEstree],
    highlight: 'json',
    extensions: ['.json5'],
    sample: `{
  // JSON5 supports comments
  unquoted: 'value',
  trailing: true,
}\n`,
  },
  jsonc: {
    parser: 'jsonc',
    plugins: [parserBabel, parserEstree],
    highlight: 'json',
    extensions: ['.jsonc'],
    sample: `{
  // JSON with comments
  "name": "Example",
  "enabled": true
}\n`,
  },
  html: {
    parser: 'html',
    plugins: [parserHtml],
    highlight: 'xml',
    extensions: ['.html', '.htm'],
    supportsSingleQuote: true,
    sample: `<div class="card"><h1>Hello</h1><p>Prettier formatting</p></div>\n`,
  },
  angular: {
    parser: 'angular',
    plugins: [parserAngular],
    highlight: 'xml',
    extensions: ['.html', '.htm'],
    supportsSingleQuote: true,
    sample: `<div *ngIf="isReady">{{ title }}</div>\n`,
  },
  vue: {
    parser: 'vue',
    plugins: [parserHtml],
    highlight: 'xml',
    extensions: ['.vue'],
    supportsSingleQuote: true,
    sample: `<template>\n  <div class="card">{{ message }}</div>\n</template>\n\n<script setup lang="ts">\nconst message = 'Hello'\n<\\/script>\n`,
  },
  lwc: {
    parser: 'lwc',
    plugins: [parserHtml],
    highlight: 'xml',
    extensions: ['.html', '.htm'],
    supportsSingleQuote: true,
    sample: `<template>\n  <lightning-button label="Hello" onclick={handleClick}></lightning-button>\n</template>\n`,
  },
  handlebars: {
    parser: 'glimmer',
    plugins: [parserGlimmer],
    highlight: 'handlebars',
    extensions: ['.hbs', '.handlebars', '.mustache'],
    supportsSingleQuote: true,
    sample: `{{#if isReady}}\n  <span>{{title}}</span>\n{{/if}}\n`,
  },
  css: {
    parser: 'css',
    plugins: [parserPostcss],
    highlight: 'css',
    extensions: ['.css'],
    supportsSingleQuote: true,
    sample: `.card {\n  display: flex;\n  gap: 12px;\n}\n`,
  },
  scss: {
    parser: 'scss',
    plugins: [parserPostcss],
    highlight: 'scss',
    extensions: ['.scss'],
    supportsSingleQuote: true,
    sample: `$primary: #2b4b6f;\n\n.card {\n  color: $primary;\n  &:hover {\n    opacity: 0.9;\n  }\n}\n`,
  },
  less: {
    parser: 'less',
    plugins: [parserPostcss],
    highlight: 'less',
    extensions: ['.less'],
    supportsSingleQuote: true,
    sample: `@primary: #2b4b6f;\n\n.card {\n  color: @primary;\n  &:hover {\n    opacity: 0.9;\n  }\n}\n`,
  },
  markdown: {
    parser: 'markdown',
    plugins: [parserMarkdown],
    highlight: 'markdown',
    extensions: ['.md', '.markdown'],
    sample: `# Prettier Formatter\n\n- Paste your code\n- Adjust options\n`,
  },
  mdx: {
    parser: 'mdx',
    plugins: [parserMarkdown],
    highlight: 'markdown',
    extensions: ['.mdx'],
    supportsSemi: true,
    supportsSingleQuote: true,
    supportsTrailingComma: true,
    sample: `# MDX Example\n\n<Alert>Hi</Alert>\n\nexport const answer = 42\n`,
  },
  yaml: {
    parser: 'yaml',
    plugins: [parserYaml],
    highlight: 'yaml',
    extensions: ['.yaml', '.yml'],
    sample: `name: Example\nitems:\n  - one\n  - two\n`,
  },
  graphql: {
    parser: 'graphql',
    plugins: [parserGraphql],
    highlight: 'graphql',
    extensions: ['.graphql', '.gql'],
    sample: `query User($id: ID!) {\n  user(id: $id) {\n    id\n    name\n  }\n}\n`,
  },
}

export const fileExtensions = Array.from(
  new Set(Object.values(languageConfigs).flatMap((config) => config.extensions)),
)

export const extensionToLanguage: Record<string, LanguageKey> = {
  js: 'javascript',
  jsx: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  json5: 'json5',
  json: 'json',
  jsonc: 'jsonc',
  html: 'html',
  htm: 'html',
  vue: 'vue',
  css: 'css',
  scss: 'scss',
  less: 'less',
  md: 'markdown',
  markdown: 'markdown',
  mdx: 'mdx',
  yaml: 'yaml',
  yml: 'yaml',
  graphql: 'graphql',
  gql: 'graphql',
  hbs: 'handlebars',
  handlebars: 'handlebars',
  mustache: 'handlebars',
}
