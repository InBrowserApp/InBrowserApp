import type { Diagnostic } from "../types"

// Conservative, nonblocking checks for literal source structure. This does not
// interpret TeX macros, catcodes, or conditional execution.
export function inspectStructure(source: string): Diagnostic[] {
  const notes: Diagnostic[] = []
  const groups: number[] = []
  const environments: { name: string; line: number }[] = []
  let math: { delimiter: string; line: number } | null = null
  let line = 1
  let index = 0
  const advance = (end: number) => {
    for (; index < end; index++) if (source[index] === "\n") line++
  }
  while (index < source.length) {
    const char = source[index]
    if (char === "%") {
      const end = source.indexOf("\n", index)
      advance(end < 0 ? source.length : end)
      continue
    }
    if (char === "\\") {
      const command = /^\\([a-zA-Z]+\*?|.)/.exec(
        source.slice(index, index + 32)
      )
      if (command) {
        const name = command[1]!
        const next = index + command[0].length
        if (name === "verb" || name === "verb*") {
          const delimiter = source[next]
          const end = delimiter ? source.indexOf(delimiter, next + 1) : -1
          advance(end < 0 ? source.length : end + 1)
          continue
        }
        if (name === "begin" || name === "end") {
          const argument = /^\s*\{([\w*]+)\}/.exec(source.slice(next))
          if (argument) {
            const environment = argument[1]!
            if (
              name === "begin" &&
              /^(?:verbatim\*?|lstlisting|minted)$/.test(environment)
            ) {
              const closing = `\\end{${environment}}`
              const end = source.indexOf(closing, next + argument[0].length)
              if (end < 0) notes.push({ line, code: "environmentSyntax" })
              advance(end < 0 ? source.length : end + closing.length)
              continue
            }
            if (name === "begin") environments.push({ name: environment, line })
            else if (environments.at(-1)?.name === environment)
              environments.pop()
            else notes.push({ line, code: "environmentSyntax" })
            advance(next + argument[0].length)
            continue
          }
        }
        if (["(", "[", ")", "]"].includes(name)) {
          if (name === "(" || name === "[") {
            if (math) notes.push({ line, code: "mathSyntax" })
            math = { delimiter: name === "(" ? ")" : "]", line }
          } else if (math?.delimiter === name) math = null
          else notes.push({ line, code: "mathSyntax" })
        }
        advance(next)
        continue
      }
    }
    if (char === "$" && (!math || math.delimiter.startsWith("$"))) {
      const delimiter = source[index + 1] === "$" ? "$$" : "$"
      if (math?.delimiter === delimiter) math = null
      else if (math) notes.push({ line, code: "mathSyntax" })
      else math = { delimiter, line }
      advance(index + delimiter.length)
      continue
    }
    if (char === "{") groups.push(line)
    if (char === "}") {
      if (groups.length) groups.pop()
      else notes.push({ line, code: "groupSyntax" })
    }
    advance(index + 1)
  }
  for (const opening of groups)
    notes.push({ line: opening, code: "groupSyntax" })
  for (const opening of environments)
    notes.push({ line: opening.line, code: "environmentSyntax" })
  if (math) notes.push({ line: math.line, code: "mathSyntax" })
  return notes
}
