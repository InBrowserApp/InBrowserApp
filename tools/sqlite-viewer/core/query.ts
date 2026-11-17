const MAX_FILE_BYTES = 50 * 1024 * 1024
const MAX_RESULT_BYTES = 5 * 1024 * 1024
const MAX_SQL_LENGTH = 100_000
const SQLITE_HEADER = "SQLite format 3\0"

function validateFile(size: number, header: Uint8Array) {
  if (size > MAX_FILE_BYTES) throw new Error("tooLarge")
  if (
    size < 100 ||
    SQLITE_HEADER.split("").some(
      (char, index) => header[index] !== char.charCodeAt(0)
    )
  )
    throw new Error("invalid")
}

function validateQuery(sql: string) {
  if (sql.length > MAX_SQL_LENGTH) throw new Error("queryTooLarge")
  // SQLite does the actual parsing; this gate excludes PRAGMA setters,
  // ATTACH and other commands that query_only does not fully restrict.
  const uncommented = sql
    .replace(/--[^\n]*(?:\n|$)|\/\*[\s\S]*?\*\//g, " ")
    .trim()
  if (!uncommented.trim()) throw new Error("emptyQuery")
  // EXPLAIN PRAGMA can also apply settings during preparation. Only allow
  // query plans for the same read statements accepted without EXPLAIN.
  if (
    !/^(?:(?:SELECT|WITH)\b|EXPLAIN\s+(?:QUERY\s+PLAN\s+)?(?:SELECT|WITH)\b)/i.test(
      uncommented
    )
  ) {
    throw new Error("readOnlyError")
  }
}

function quoteIdentifier(name: string) {
  return `"${name.replaceAll('"', '""')}"`
}

function validateStatementTail(tail: string) {
  if (
    tail
      .replace(/--[^\n]*(?:\n|$)|\/\*[\s\S]*?(?:\*\/|$)/g, "")
      .replace(/[\s;]/g, "")
  ) {
    throw new Error("singleStatement")
  }
}

function previewQuery(name: string) {
  return `SELECT * FROM ${quoteIdentifier(name)};`
}

export {
  MAX_RESULT_BYTES,
  validateFile,
  validateQuery,
  validateStatementTail,
  previewQuery,
}
