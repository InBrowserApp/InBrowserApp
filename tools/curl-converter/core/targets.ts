type CurlTargetConfig = Readonly<{
  id: string
  label: string
  extension: string
  highlightLanguage: string
  runtimeKey: CurlConverterRuntimeKey
  transform?: (code: string) => string
}>

type CurlTargetGroup = Readonly<{
  label: string
  options: CurlTargetConfig[]
}>

type CurlConverterRuntimeKey = `to${string}Warn`

type TargetTuple = readonly [
  id: string,
  label: string,
  extension: string,
  highlightLanguage: string,
  runtimeKey: CurlConverterRuntimeKey,
  transform?: "wrapFetchWithAsyncAwait",
]

const PLAINTEXT = "plaintext"
const WRAP_FETCH = "wrapFetchWithAsyncAwait"

function wrapFetchWithAsyncAwait(code: string): string {
  const lines = code.split("\n")
  const importLines = lines.filter((line) => line.trim().startsWith("import "))
  const bodyLines = lines.filter((line) => !line.trim().startsWith("import "))
  let responseIndex = 0

  const transformedBody = bodyLines
    .map((line) => {
      const trimmed = line.trim()

      if (!trimmed) {
        return ""
      }

      const match = trimmed.match(/^([A-Za-z_$][\w$]*\.)?fetch\(/)

      if (!match) {
        return line
      }

      responseIndex += 1
      const responseName =
        responseIndex === 1 ? "response" : `response${responseIndex}`
      const indent = line.slice(0, line.length - line.trimStart().length)
      const withoutSemicolon = trimmed.replace(/;$/, "")
      return `${indent}const ${responseName} = await ${withoutSemicolon}`
    })
    .filter((line) => line.length > 0)

  if (!responseIndex) {
    return code.trim()
  }

  const wrappedBody = transformedBody.map((line) => `  ${line}`).join("\n")
  const importBlock =
    importLines.length > 0 ? `${importLines.join("\n")}\n\n` : ""
  return `${importBlock}async function run() {\n${wrappedBody}\n}\n\nrun()`
}

function resolveTransform(transform?: TargetTuple[5]) {
  if (transform === WRAP_FETCH) {
    return wrapFetchWithAsyncAwait
  }

  return undefined
}

function defineGroup(
  label: string,
  options: readonly TargetTuple[]
): CurlTargetGroup {
  return {
    label,
    options: options.map(
      ([
        id,
        optionLabel,
        extension,
        highlightLanguage,
        runtimeKey,
        transform,
      ]) => ({
        id,
        label: optionLabel,
        extension,
        highlightLanguage,
        runtimeKey,
        transform: resolveTransform(transform),
      })
    ),
  }
}

const targetGroups: CurlTargetGroup[] = [
  defineGroup("JavaScript", [
    [
      "javascript-fetch",
      "JavaScript (fetch)",
      ".js",
      "javascript",
      "toJavaScriptWarn",
      WRAP_FETCH,
    ],
    [
      "javascript-jquery",
      "JavaScript (jQuery)",
      ".js",
      "javascript",
      "toJavaScriptJqueryWarn",
    ],
    [
      "javascript-xhr",
      "JavaScript (XHR)",
      ".js",
      "javascript",
      "toJavaScriptXHRWarn",
    ],
  ]),
  defineGroup("Node.js", [
    [
      "node-fetch",
      "Node.js (fetch)",
      ".js",
      "javascript",
      "toNodeWarn",
      WRAP_FETCH,
    ],
    ["node-axios", "Node.js (axios)", ".js", "javascript", "toNodeAxiosWarn"],
    ["node-got", "Node.js (got)", ".js", "javascript", "toNodeGotWarn"],
    ["node-http", "Node.js (http)", ".js", "javascript", "toNodeHttpWarn"],
    ["node-ky", "Node.js (ky)", ".js", "javascript", "toNodeKyWarn"],
    [
      "node-superagent",
      "Node.js (superagent)",
      ".js",
      "javascript",
      "toNodeSuperAgentWarn",
    ],
    [
      "node-request",
      "Node.js (request)",
      ".js",
      "javascript",
      "toNodeRequestWarn",
    ],
  ]),
  defineGroup("Python", [
    ["python-requests", "Python (requests)", ".py", "python", "toPythonWarn"],
    [
      "python-http",
      "Python (http.client)",
      ".py",
      "python",
      "toPythonHttpWarn",
    ],
  ]),
  defineGroup("Java", [
    ["java", "Java (HttpClient)", ".java", "java", "toJavaWarn"],
    [
      "java-httpurlconnection",
      "Java (HttpURLConnection)",
      ".java",
      "java",
      "toJavaHttpUrlConnectionWarn",
    ],
    ["java-okhttp", "Java (OkHttp)", ".java", "java", "toJavaOkHttpWarn"],
    ["java-jsoup", "Java (Jsoup)", ".java", "java", "toJavaJsoupWarn"],
  ]),
  defineGroup("PHP", [
    ["php", "PHP", ".php", "php", "toPhpWarn"],
    ["php-guzzle", "PHP (Guzzle)", ".php", "php", "toPhpGuzzleWarn"],
    ["php-requests", "PHP (Requests)", ".php", "php", "toPhpRequestsWarn"],
  ]),
  defineGroup("Ruby", [
    ["ruby", "Ruby", ".rb", "ruby", "toRubyWarn"],
    ["ruby-httparty", "Ruby (HTTParty)", ".rb", "ruby", "toRubyHttpartyWarn"],
  ]),
  defineGroup("R", [
    ["r-httr", "R (httr)", ".r", "r", "toRWarn"],
    ["r-httr2", "R (httr2)", ".r", "r", "toRHttr2Warn"],
  ]),
  defineGroup("PowerShell", [
    [
      "powershell-restmethod",
      "PowerShell (Invoke-RestMethod)",
      ".ps1",
      "powershell",
      "toPowershellRestMethodWarn",
    ],
    [
      "powershell-webrequest",
      "PowerShell (Invoke-WebRequest)",
      ".ps1",
      "powershell",
      "toPowershellWebRequestWarn",
    ],
  ]),
  defineGroup("Command Line", [
    ["http", "HTTP", ".http", "http", "toHTTPWarn"],
    ["httpie", "HTTPie", ".sh", "bash", "toHttpieWarn"],
    ["wget", "Wget", ".sh", "bash", "toWgetWarn"],
  ]),
  defineGroup("Data", [
    ["json", "JSON", ".json", "json", "toJsonStringWarn"],
    ["har", "HAR", ".har", "json", "toHarStringWarn"],
  ]),
  defineGroup("Other Languages", [
    ["ansible", "Ansible", ".yml", "yaml", "toAnsibleWarn"],
    ["c", "C", ".c", "c", "toCWarn"],
    ["csharp", "C#", ".cs", "csharp", "toCSharpWarn"],
    ["clojure", "Clojure", ".clj", "clojure", "toClojureWarn"],
    ["cfml", "CFML", ".cfm", PLAINTEXT, "toCFMLWarn"],
    ["dart", "Dart", ".dart", "dart", "toDartWarn"],
    ["elixir", "Elixir", ".ex", "elixir", "toElixirWarn"],
    ["go", "Go", ".go", "go", "toGoWarn"],
    ["julia", "Julia", ".jl", "julia", "toJuliaWarn"],
    ["kotlin", "Kotlin", ".kt", "kotlin", "toKotlinWarn"],
    ["lua", "Lua", ".lua", "lua", "toLuaWarn"],
    ["matlab", "MATLAB", ".m", "matlab", "toMATLABWarn"],
    ["objective-c", "Objective-C", ".m", "objectivec", "toObjectiveCWarn"],
    ["ocaml", "OCaml", ".ml", "ocaml", "toOCamlWarn"],
    ["perl", "Perl", ".pl", "perl", "toPerlWarn"],
    ["rust", "Rust", ".rs", "rust", "toRustWarn"],
    ["swift", "Swift", ".swift", "swift", "toSwiftWarn"],
  ]),
]

const defaultTargetId = "javascript-fetch"

const targetMap = new Map(
  targetGroups.flatMap((group) =>
    group.options.map((target) => [target.id, target] as const)
  )
)

function getTargetConfig(id: string): CurlTargetConfig | undefined {
  return targetMap.get(id)
}

function getDownloadFilename(id: string): string {
  return `converted${getTargetConfig(id)?.extension ?? ".txt"}`
}

export {
  type CurlConverterRuntimeKey,
  defaultTargetId,
  getDownloadFilename,
  getTargetConfig,
  targetGroups,
  wrapFetchWithAsyncAwait,
}
