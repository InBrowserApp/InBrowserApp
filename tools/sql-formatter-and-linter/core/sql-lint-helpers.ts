type Position = {
  line: number
  column: number
}

type MaskMode =
  | "code"
  | "single-quoted-string"
  | "double-quoted-string"
  | "backtick-quoted-identifier"
  | "bracket-quoted-identifier"
  | "line-comment"
  | "block-comment"

function statementHasWhereClause(statement: string): boolean {
  const maskedStatement = maskSqlCommentsAndLiterals(statement)
  return /\bwhere\b/i.test(maskedStatement)
}

function maskSqlCommentsAndLiterals(sql: string): string {
  let masked = ""
  let mode: MaskMode = "code"
  let index = 0

  while (index < sql.length) {
    const char = sql[index] as string
    const nextChar = sql[index + 1] as string | undefined

    if (mode === "code") {
      if (char === "'") {
        mode = "single-quoted-string"
        masked += " "
        index += 1
        continue
      }

      if (char === '"') {
        mode = "double-quoted-string"
        masked += " "
        index += 1
        continue
      }

      if (char === "`") {
        mode = "backtick-quoted-identifier"
        masked += " "
        index += 1
        continue
      }

      if (char === "[") {
        mode = "bracket-quoted-identifier"
        masked += " "
        index += 1
        continue
      }

      if (char === "-" && nextChar === "-") {
        mode = "line-comment"
        masked += "  "
        index += 2
        continue
      }

      if (char === "/" && nextChar === "*") {
        mode = "block-comment"
        masked += "  "
        index += 2
        continue
      }

      masked += char
      index += 1
      continue
    }

    if (mode === "single-quoted-string") {
      if (char === "'" && nextChar === "'") {
        masked += "  "
        index += 2
        continue
      }

      masked += char === "\n" ? "\n" : " "

      if (char === "'") {
        mode = "code"
      }

      index += 1
      continue
    }

    if (mode === "double-quoted-string") {
      masked += char === "\n" ? "\n" : " "

      if (char === '"') {
        mode = "code"
      }

      index += 1
      continue
    }

    if (mode === "backtick-quoted-identifier") {
      masked += char === "\n" ? "\n" : " "

      if (char === "`") {
        mode = "code"
      }

      index += 1
      continue
    }

    if (mode === "bracket-quoted-identifier") {
      masked += char === "\n" ? "\n" : " "

      if (char === "]") {
        mode = "code"
      }

      index += 1
      continue
    }

    if (mode === "line-comment") {
      masked += char === "\n" ? "\n" : " "

      if (char === "\n") {
        mode = "code"
      }

      index += 1
      continue
    }

    masked += char === "\n" ? "\n" : " "

    if (char === "*" && nextChar === "/") {
      masked += "/"
      index += 2
      mode = "code"
      continue
    }

    index += 1
  }

  return masked
}

function indexToPosition(text: string, index: number): Position {
  if (index <= 0) {
    return { line: 1, column: 1 }
  }

  let line = 1
  let lastLineStart = 0

  for (let currentIndex = 0; currentIndex < index; currentIndex += 1) {
    if (text[currentIndex] === "\n") {
      line += 1
      lastLineStart = currentIndex + 1
    }
  }

  return {
    line,
    column: index - lastLineStart + 1,
  }
}

function parseLineColumnFromError(
  source: string,
  message: string
): Position | null {
  const detailedMatch = message.match(/line (\d+) column (\d+)/i)

  if (detailedMatch) {
    return {
      line: Number(detailedMatch[1]),
      column: Number(detailedMatch[2]),
    }
  }

  const indexMatch = message.match(/at index (\d+)/i)

  if (indexMatch) {
    return indexToPosition(source, Number(indexMatch[1]))
  }

  return null
}

export {
  indexToPosition,
  parseLineColumnFromError,
  statementHasWhereClause,
  type Position,
}
