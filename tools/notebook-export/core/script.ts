import type { Notebook } from "@workspace/notebook"

const extensions: Record<string, string> = {
  python: "py",
  python3: "py",
  ipython: "py",
  javascript: "js",
  typescript: "ts",
  r: "R",
  julia: "jl",
  bash: "sh",
  sh: "sh",
  shell: "sh",
  sql: "sql",
  ruby: "rb",
  go: "go",
  rust: "rs",
  java: "java",
  c: "c",
  "c++": "cpp",
  "c#": "cs",
  csharp: "cs",
  fsharp: "fs",
  scala: "scala",
  swift: "swift",
  php: "php",
  perl: "pl",
  lua: "lua",
  matlab: "m",
  octave: "m",
  powershell: "ps1",
}

export function codeScript(notebook: Notebook) {
  const cells = notebook.cells.filter((cell) => cell.kind === "code")
  let text = cells
    .map((cell) => {
      if (cell.source === undefined) throw new Error("INVALID")
      return cell.source
    })
    .join("\n\n")
  if (text && !text.endsWith("\n")) text += "\n"
  const language = (notebook.language || "").trim().toLowerCase()
  const extension = Object.hasOwn(extensions, language)
    ? extensions[language]!
    : "txt"
  return {
    text,
    extension,
    count: cells.length,
    unknownLanguage: extension === "txt",
  }
}
