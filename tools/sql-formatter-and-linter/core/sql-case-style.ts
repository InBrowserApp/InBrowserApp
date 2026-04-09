type SqlCaseStyle = "preserve" | "upper" | "lower"

const SQL_CASE_STYLES = ["preserve", "upper", "lower"] as const

function isSqlCaseStyle(value: string): value is SqlCaseStyle {
  return SQL_CASE_STYLES.includes(value as SqlCaseStyle)
}

export { SQL_CASE_STYLES, isSqlCaseStyle, type SqlCaseStyle }
