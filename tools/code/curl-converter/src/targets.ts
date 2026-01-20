import type { Warnings } from 'curlconverter'
import {
  toAnsibleWarn,
  toCWarn,
  toCFMLWarn,
  toClojureWarn,
  toCSharpWarn,
  toDartWarn,
  toElixirWarn,
  toGoWarn,
  toHarStringWarn,
  toHTTPWarn,
  toHttpieWarn,
  toJavaWarn,
  toJavaHttpUrlConnectionWarn,
  toJavaJsoupWarn,
  toJavaOkHttpWarn,
  toJavaScriptJqueryWarn,
  toJavaScriptWarn,
  toJavaScriptXHRWarn,
  toJsonStringWarn,
  toJuliaWarn,
  toKotlinWarn,
  toLuaWarn,
  toMATLABWarn,
  toNodeAxiosWarn,
  toNodeGotWarn,
  toNodeHttpWarn,
  toNodeKyWarn,
  toNodeRequestWarn,
  toNodeSuperAgentWarn,
  toNodeWarn,
  toObjectiveCWarn,
  toOCamlWarn,
  toPerlWarn,
  toPhpGuzzleWarn,
  toPhpRequestsWarn,
  toPhpWarn,
  toPowershellRestMethodWarn,
  toPowershellWebRequestWarn,
  toPythonHttpWarn,
  toPythonWarn,
  toRHttr2Warn,
  toRWarn,
  toRubyHttpartyWarn,
  toRubyWarn,
  toRustWarn,
  toSwiftWarn,
  toWgetWarn,
} from 'curlconverter'

export type CurlTargetConfig = {
  id: string
  label: string
  extension: string
  hljs: string
  convert: (curlCommand: string) => [string, Warnings]
  transform?: (code: string) => string
}

export type CurlTargetGroup = {
  label: string
  options: CurlTargetConfig[]
}

const plaintext = 'plaintext'

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

export const targetGroups: CurlTargetGroup[] = [
  {
    label: 'JavaScript',
    options: [
      {
        id: 'javascript-fetch',
        label: 'JavaScript (fetch)',
        extension: '.js',
        hljs: 'javascript',
        convert: toJavaScriptWarn,
        transform: wrapFetchWithAsyncAwait,
      },
      {
        id: 'javascript-jquery',
        label: 'JavaScript (jQuery)',
        extension: '.js',
        hljs: 'javascript',
        convert: toJavaScriptJqueryWarn,
      },
      {
        id: 'javascript-xhr',
        label: 'JavaScript (XHR)',
        extension: '.js',
        hljs: 'javascript',
        convert: toJavaScriptXHRWarn,
      },
    ],
  },
  {
    label: 'Node.js',
    options: [
      {
        id: 'node-fetch',
        label: 'Node.js (fetch)',
        extension: '.js',
        hljs: 'javascript',
        convert: toNodeWarn,
        transform: wrapFetchWithAsyncAwait,
      },
      {
        id: 'node-axios',
        label: 'Node.js (axios)',
        extension: '.js',
        hljs: 'javascript',
        convert: toNodeAxiosWarn,
      },
      {
        id: 'node-got',
        label: 'Node.js (got)',
        extension: '.js',
        hljs: 'javascript',
        convert: toNodeGotWarn,
      },
      {
        id: 'node-http',
        label: 'Node.js (http)',
        extension: '.js',
        hljs: 'javascript',
        convert: toNodeHttpWarn,
      },
      {
        id: 'node-ky',
        label: 'Node.js (ky)',
        extension: '.js',
        hljs: 'javascript',
        convert: toNodeKyWarn,
      },
      {
        id: 'node-superagent',
        label: 'Node.js (superagent)',
        extension: '.js',
        hljs: 'javascript',
        convert: toNodeSuperAgentWarn,
      },
      {
        id: 'node-request',
        label: 'Node.js (request)',
        extension: '.js',
        hljs: 'javascript',
        convert: toNodeRequestWarn,
      },
    ],
  },
  {
    label: 'Python',
    options: [
      {
        id: 'python-requests',
        label: 'Python (requests)',
        extension: '.py',
        hljs: 'python',
        convert: toPythonWarn,
      },
      {
        id: 'python-http',
        label: 'Python (http.client)',
        extension: '.py',
        hljs: 'python',
        convert: toPythonHttpWarn,
      },
    ],
  },
  {
    label: 'Java',
    options: [
      {
        id: 'java',
        label: 'Java (HttpClient)',
        extension: '.java',
        hljs: 'java',
        convert: toJavaWarn,
      },
      {
        id: 'java-httpurlconnection',
        label: 'Java (HttpURLConnection)',
        extension: '.java',
        hljs: 'java',
        convert: toJavaHttpUrlConnectionWarn,
      },
      {
        id: 'java-okhttp',
        label: 'Java (OkHttp)',
        extension: '.java',
        hljs: 'java',
        convert: toJavaOkHttpWarn,
      },
      {
        id: 'java-jsoup',
        label: 'Java (Jsoup)',
        extension: '.java',
        hljs: 'java',
        convert: toJavaJsoupWarn,
      },
    ],
  },
  {
    label: 'PHP',
    options: [
      {
        id: 'php',
        label: 'PHP',
        extension: '.php',
        hljs: 'php',
        convert: toPhpWarn,
      },
      {
        id: 'php-guzzle',
        label: 'PHP (Guzzle)',
        extension: '.php',
        hljs: 'php',
        convert: toPhpGuzzleWarn,
      },
      {
        id: 'php-requests',
        label: 'PHP (Requests)',
        extension: '.php',
        hljs: 'php',
        convert: toPhpRequestsWarn,
      },
    ],
  },
  {
    label: 'Ruby',
    options: [
      {
        id: 'ruby',
        label: 'Ruby',
        extension: '.rb',
        hljs: 'ruby',
        convert: toRubyWarn,
      },
      {
        id: 'ruby-httparty',
        label: 'Ruby (HTTParty)',
        extension: '.rb',
        hljs: 'ruby',
        convert: toRubyHttpartyWarn,
      },
    ],
  },
  {
    label: 'R',
    options: [
      {
        id: 'r-httr',
        label: 'R (httr)',
        extension: '.r',
        hljs: 'r',
        convert: toRWarn,
      },
      {
        id: 'r-httr2',
        label: 'R (httr2)',
        extension: '.r',
        hljs: 'r',
        convert: toRHttr2Warn,
      },
    ],
  },
  {
    label: 'PowerShell',
    options: [
      {
        id: 'powershell-restmethod',
        label: 'PowerShell (Invoke-RestMethod)',
        extension: '.ps1',
        hljs: 'powershell',
        convert: toPowershellRestMethodWarn,
      },
      {
        id: 'powershell-webrequest',
        label: 'PowerShell (Invoke-WebRequest)',
        extension: '.ps1',
        hljs: 'powershell',
        convert: toPowershellWebRequestWarn,
      },
    ],
  },
  {
    label: 'Command Line',
    options: [
      {
        id: 'http',
        label: 'HTTP',
        extension: '.http',
        hljs: 'http',
        convert: toHTTPWarn,
      },
      {
        id: 'httpie',
        label: 'HTTPie',
        extension: '.sh',
        hljs: 'bash',
        convert: toHttpieWarn,
      },
      {
        id: 'wget',
        label: 'Wget',
        extension: '.sh',
        hljs: 'bash',
        convert: toWgetWarn,
      },
    ],
  },
  {
    label: 'Data',
    options: [
      {
        id: 'json',
        label: 'JSON',
        extension: '.json',
        hljs: 'json',
        convert: toJsonStringWarn,
      },
      {
        id: 'har',
        label: 'HAR',
        extension: '.har',
        hljs: 'json',
        convert: toHarStringWarn,
      },
    ],
  },
  {
    label: 'Other Languages',
    options: [
      {
        id: 'ansible',
        label: 'Ansible',
        extension: '.yml',
        hljs: 'yaml',
        convert: toAnsibleWarn,
      },
      {
        id: 'c',
        label: 'C',
        extension: '.c',
        hljs: 'c',
        convert: toCWarn,
      },
      {
        id: 'csharp',
        label: 'C#',
        extension: '.cs',
        hljs: 'csharp',
        convert: toCSharpWarn,
      },
      {
        id: 'clojure',
        label: 'Clojure',
        extension: '.clj',
        hljs: 'clojure',
        convert: toClojureWarn,
      },
      {
        id: 'cfml',
        label: 'CFML',
        extension: '.cfm',
        hljs: plaintext,
        convert: toCFMLWarn,
      },
      {
        id: 'dart',
        label: 'Dart',
        extension: '.dart',
        hljs: 'dart',
        convert: toDartWarn,
      },
      {
        id: 'elixir',
        label: 'Elixir',
        extension: '.ex',
        hljs: 'elixir',
        convert: toElixirWarn,
      },
      {
        id: 'go',
        label: 'Go',
        extension: '.go',
        hljs: 'go',
        convert: toGoWarn,
      },
      {
        id: 'julia',
        label: 'Julia',
        extension: '.jl',
        hljs: 'julia',
        convert: toJuliaWarn,
      },
      {
        id: 'kotlin',
        label: 'Kotlin',
        extension: '.kt',
        hljs: 'kotlin',
        convert: toKotlinWarn,
      },
      {
        id: 'lua',
        label: 'Lua',
        extension: '.lua',
        hljs: 'lua',
        convert: toLuaWarn,
      },
      {
        id: 'matlab',
        label: 'MATLAB',
        extension: '.m',
        hljs: 'matlab',
        convert: toMATLABWarn,
      },
      {
        id: 'objective-c',
        label: 'Objective-C',
        extension: '.m',
        hljs: 'objectivec',
        convert: toObjectiveCWarn,
      },
      {
        id: 'ocaml',
        label: 'OCaml',
        extension: '.ml',
        hljs: 'ocaml',
        convert: toOCamlWarn,
      },
      {
        id: 'perl',
        label: 'Perl',
        extension: '.pl',
        hljs: 'perl',
        convert: toPerlWarn,
      },
      {
        id: 'rust',
        label: 'Rust',
        extension: '.rs',
        hljs: 'rust',
        convert: toRustWarn,
      },
      {
        id: 'swift',
        label: 'Swift',
        extension: '.swift',
        hljs: 'swift',
        convert: toSwiftWarn,
      },
    ],
  },
]

export const defaultTargetId = 'javascript-fetch'

const targetMap = new Map<string, CurlTargetConfig>(
  targetGroups.flatMap((group) => group.options.map((target) => [target.id, target])),
)

export function getTargetConfig(id: string): CurlTargetConfig | undefined {
  return targetMap.get(id)
}
