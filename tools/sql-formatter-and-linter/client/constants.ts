import {
  DEFAULT_SQL_FORMAT_OPTIONS,
  DEFAULT_SQL_LINT_OPTIONS,
} from "../core/sql-format"

type SqlFormatterAndLinterMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  sourceSqlLabel: string
  sourceSqlDescription: string
  sourceSqlPlaceholder: string
  formattedSqlLabel: string
  formattedSqlDescription: string
  formattedSqlEmptyDescription: string
  formattingErrorLabel: string
  useSampleLabel: string
  clearLabel: string
  importFromFileLabel: string
  copySqlLabel: string
  copiedLabel: string
  downloadSqlLabel: string
  optionsLabel: string
  optionsDescription: string
  formatSectionLabel: string
  formatSectionDescription: string
  lintSectionLabel: string
  lintSectionDescription: string
  dialectLabel: string
  tabWidthLabel: string
  useTabsLabel: string
  linesBetweenQueriesLabel: string
  expressionWidthLabel: string
  keywordCaseLabel: string
  dataTypeCaseLabel: string
  functionCaseLabel: string
  preserveCaseLabel: string
  upperCaseLabel: string
  lowerCaseLabel: string
  checkSelectStarLabel: string
  checkUnsafeMutationLabel: string
  requireSemicolonLabel: string
  maxLineLengthLabel: string
  maxLineLengthDescription: string
  lintResultsLabel: string
  lintResultsDescription: string
  lintIdleTitle: string
  lintIdleDescription: string
  lintCleanTitle: string
  lintCleanDescription: string
  issueCountLabel: string
  errorCountLabel: string
  warningCountLabel: string
  infoCountLabel: string
  severityLabel: string
  codeLabel: string
  locationLabel: string
  messageLabel: string
  errorSeverityLabel: string
  warningSeverityLabel: string
  infoSeverityLabel: string
}>

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
  type SqlFormatterAndLinterMessages,
}
