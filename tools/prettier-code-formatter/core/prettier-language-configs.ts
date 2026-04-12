import { PRETTIER_MARKUP_LANGUAGE_CONFIGS } from "./prettier-markup-language-configs"
import type {
  PrettierLanguageConfig,
  PrettierLanguageKey,
} from "./prettier-types"

const PRETTIER_LANGUAGE_CONFIGS: Record<
  PrettierLanguageKey,
  PrettierLanguageConfig
> = {
  javascript: {
    label: "JavaScript",
    parser: "babel",
    pluginKeys: ["babel", "estree"],
    highlightLanguage: "javascript",
    extensions: [".js", ".mjs", ".cjs"],
    sample:
      "const greeting = (name) => {\n  return { message: 'Hello ' + name, items: [1, 2, 3] }\n}\n",
    supportsSemi: true,
    supportsSingleQuote: true,
    supportsTrailingComma: true,
  },
  jsx: {
    label: "JSX",
    parser: "babel",
    pluginKeys: ["babel", "estree"],
    highlightLanguage: "javascript",
    extensions: [".jsx"],
    sample:
      'export function App() {\n  return <main className="card">Hello</main>\n}\n',
    supportsSemi: true,
    supportsSingleQuote: true,
    supportsTrailingComma: true,
  },
  typescript: {
    label: "TypeScript",
    parser: "typescript",
    pluginKeys: ["typescript", "estree"],
    highlightLanguage: "typescript",
    extensions: [".ts", ".cts", ".mts"],
    sample:
      "type User = { id: number; name: string }\n\nconst users: User[] = [{ id: 1, name: 'Ada' }]\n",
    supportsSemi: true,
    supportsSingleQuote: true,
    supportsTrailingComma: true,
  },
  tsx: {
    label: "TSX",
    parser: "typescript",
    pluginKeys: ["typescript", "estree"],
    highlightLanguage: "typescript",
    extensions: [".tsx"],
    sample:
      "type Props = { title: string }\n\nexport function Card({ title }: Props) {\n  return <section>{title}</section>\n}\n",
    supportsSemi: true,
    supportsSingleQuote: true,
    supportsTrailingComma: true,
  },
  flow: {
    label: "Flow",
    parser: "flow",
    pluginKeys: ["flow", "estree"],
    highlightLanguage: "javascript",
    extensions: [".js.flow"],
    sample:
      "/* @flow */\ntype User = { id: number, name: string }\n\nconst user: User = { id: 1, name: 'Ada' }\n",
    supportsSemi: true,
    supportsSingleQuote: true,
    supportsTrailingComma: true,
  },
  json: {
    label: "JSON",
    parser: "json",
    pluginKeys: ["babel", "estree"],
    highlightLanguage: "json",
    extensions: [".json"],
    sample:
      '{\n  "name": "Example",\n  "items": [1, 2, 3],\n  "active": true\n}\n',
    supportsSemi: false,
    supportsSingleQuote: false,
    supportsTrailingComma: false,
  },
  "json-stringify": {
    label: "JSON.stringify",
    parser: "json-stringify",
    pluginKeys: ["babel", "estree"],
    highlightLanguage: "json",
    extensions: [".importmap"],
    filenames: ["package.json", "package-lock.json", "composer.json"],
    outputExtension: ".json",
    sample:
      '{\n  "name": "prettier-demo",\n  "private": true,\n  "scripts": {\n    "format": "prettier --write ."\n  }\n}\n',
    supportsSemi: false,
    supportsSingleQuote: false,
    supportsTrailingComma: false,
  },
  json5: {
    label: "JSON5",
    parser: "json5",
    pluginKeys: ["babel", "estree"],
    highlightLanguage: "json",
    extensions: [".json5"],
    sample:
      "{\n  // JSON5 supports comments\n  unquoted: 'value',\n  trailing: true,\n}\n",
    supportsSemi: false,
    supportsSingleQuote: false,
    supportsTrailingComma: false,
  },
  jsonc: {
    label: "JSONC",
    parser: "jsonc",
    pluginKeys: ["babel", "estree"],
    highlightLanguage: "json",
    extensions: [".jsonc"],
    sample:
      '{\n  // JSON with comments\n  "name": "Example",\n  "enabled": true\n}\n',
    supportsSemi: false,
    supportsSingleQuote: false,
    supportsTrailingComma: false,
  },
  ...PRETTIER_MARKUP_LANGUAGE_CONFIGS,
  markdown: {
    label: "Markdown",
    parser: "markdown",
    pluginKeys: ["markdown"],
    highlightLanguage: "markdown",
    extensions: [".md", ".markdown"],
    sample: "# Prettier Formatter\n\n- Paste your code\n- Adjust options\n",
    supportsSemi: false,
    supportsSingleQuote: false,
    supportsTrailingComma: false,
  },
  mdx: {
    label: "MDX",
    parser: "mdx",
    pluginKeys: ["markdown"],
    highlightLanguage: "markdown",
    extensions: [".mdx"],
    sample: "# MDX Example\n\n<Alert>Hi</Alert>\n\nexport const answer = 42\n",
    supportsSemi: true,
    supportsSingleQuote: true,
    supportsTrailingComma: true,
  },
  yaml: {
    label: "YAML",
    parser: "yaml",
    pluginKeys: ["yaml"],
    highlightLanguage: "yaml",
    extensions: [".yaml", ".yml"],
    sample: "name: Example\nitems:\n  - one\n  - two\n",
    supportsSemi: false,
    supportsSingleQuote: false,
    supportsTrailingComma: false,
  },
  graphql: {
    label: "GraphQL",
    parser: "graphql",
    pluginKeys: ["graphql"],
    highlightLanguage: "graphql",
    extensions: [".graphql", ".gql", ".graphqls"],
    sample:
      "query User($id: ID!) {\n  user(id: $id) {\n    id\n    name\n  }\n}\n",
    supportsSemi: false,
    supportsSingleQuote: false,
    supportsTrailingComma: false,
  },
}

export { PRETTIER_LANGUAGE_CONFIGS }
