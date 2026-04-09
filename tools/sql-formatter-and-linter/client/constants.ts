import {
  DEFAULT_SQL_FORMAT_OPTIONS,
  DEFAULT_SQL_LINT_OPTIONS,
} from "../core/sql-format"

const DEFAULT_SQL = `SELECT id, email, created_at
FROM users
WHERE status = 'active'
ORDER BY created_at DESC;`

const STORAGE_KEYS = {
  sourceSql: "tools:sql-formatter-and-linter:source-sql",
  formatOptions: "tools:sql-formatter-and-linter:format-options",
  lintOptions: "tools:sql-formatter-and-linter:lint-options",
} as const

export {
  DEFAULT_SQL,
  DEFAULT_SQL_FORMAT_OPTIONS,
  DEFAULT_SQL_LINT_OPTIONS,
  STORAGE_KEYS,
}
