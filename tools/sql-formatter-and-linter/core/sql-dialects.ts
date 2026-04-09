const sqlDialects = [
  "sql",
  "bigquery",
  "clickhouse",
  "db2",
  "db2i",
  "hive",
  "mariadb",
  "mysql",
  "n1ql",
  "plsql",
  "postgresql",
  "redshift",
  "singlestoredb",
  "snowflake",
  "spark",
  "sqlite",
  "tidb",
  "trino",
  "tsql",
] as const

type SqlDialect = (typeof sqlDialects)[number]

const dialectLabels: Record<SqlDialect, string> = {
  sql: "SQL (Generic)",
  bigquery: "BigQuery",
  clickhouse: "ClickHouse",
  db2: "DB2",
  db2i: "DB2i",
  hive: "Hive",
  mariadb: "MariaDB",
  mysql: "MySQL",
  n1ql: "N1QL",
  plsql: "PL/SQL",
  postgresql: "PostgreSQL",
  redshift: "Redshift",
  singlestoredb: "SingleStoreDB",
  snowflake: "Snowflake",
  spark: "Spark SQL",
  sqlite: "SQLite",
  tidb: "TiDB",
  trino: "Trino",
  tsql: "T-SQL",
}

const sqlFileExtensions = [
  ".sql",
  ".ddl",
  ".dml",
  ".mysql",
  ".pgsql",
  ".psql",
  ".sqlite",
  ".db2",
  ".hql",
  ".trino",
  ".tsql",
  ".txt",
] as const

const extensionToDialect: Record<string, SqlDialect> = {
  sql: "sql",
  ddl: "sql",
  dml: "sql",
  mysql: "mysql",
  mariadb: "mariadb",
  pgsql: "postgresql",
  psql: "postgresql",
  sqlite: "sqlite",
  db2: "db2",
  hql: "hive",
  trino: "trino",
  tsql: "tsql",
}

const SQL_FILE_ACCEPT = sqlFileExtensions.join(",")

function isSqlDialect(value: string): value is SqlDialect {
  return sqlDialects.includes(value as SqlDialect)
}

function detectDialectFromFilename(filename: string): SqlDialect | null {
  const match = filename.toLowerCase().match(/\.([a-z0-9]+)$/)
  const extension = match?.[1]

  if (!extension) {
    return null
  }

  return extensionToDialect[extension] ?? null
}

export {
  SQL_FILE_ACCEPT,
  detectDialectFromFilename,
  dialectLabels,
  isSqlDialect,
  sqlDialects,
  type SqlDialect,
}
