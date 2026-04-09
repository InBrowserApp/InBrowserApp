import {
  startTransition,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react"

import {
  DEFAULT_SQL,
  DEFAULT_SQL_FORMAT_OPTIONS,
  DEFAULT_SQL_LINT_OPTIONS,
  STORAGE_KEYS,
  type SqlFormatterAndLinterMessages,
} from "./client/constants"
import {
  parseStoredFormatOptions,
  parseStoredLintOptions,
} from "./client/storage"
import { FormattedSqlCard } from "./components/formatted-sql-card"
import { LintResultsCard } from "./components/lint-results-card"
import { OptionsCard } from "./components/options-card"
import { SqlInputCard } from "./components/sql-input-card"
import { runSqlTool } from "./core/sql-format"
import { detectDialectFromFilename } from "./core/sql-dialects"

type SqlFormatterAndLinterClientProps = Readonly<{
  messages: SqlFormatterAndLinterMessages
}>

function SqlFormatterAndLinterClient({
  messages,
}: SqlFormatterAndLinterClientProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const downloadUrlRef = useRef<string | null>(null)

  const [sourceSql, setSourceSql] = useState(DEFAULT_SQL)
  const [formatOptions, setFormatOptions] = useState(DEFAULT_SQL_FORMAT_OPTIONS)
  const [lintOptions, setLintOptions] = useState(DEFAULT_SQL_LINT_OPTIONS)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const deferredSourceSql = useDeferredValue(sourceSql)
  const toolState = runSqlTool(
    deferredSourceSql,
    formatOptions,
    lintOptions,
    messages.formattingErrorLabel
  )
  const downloadFilename = `formatted-${formatOptions.dialect}.sql`
  const formattedSql =
    toolState.formatResult.state === "formatted"
      ? toolState.formatResult.sql
      : ""

  useEffect(() => {
    const storedSourceSql = window.localStorage.getItem(STORAGE_KEYS.sourceSql)
    const storedFormatOptions = window.localStorage.getItem(
      STORAGE_KEYS.formatOptions
    )
    const storedLintOptions = window.localStorage.getItem(
      STORAGE_KEYS.lintOptions
    )

    if (storedSourceSql !== null) {
      setSourceSql(storedSourceSql)
    }

    setFormatOptions(parseStoredFormatOptions(storedFormatOptions))
    setLintOptions(parseStoredLintOptions(storedLintOptions))
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.sourceSql, sourceSql)
  }, [sourceSql])

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.formatOptions,
      JSON.stringify(formatOptions)
    )
  }, [formatOptions])

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.lintOptions,
      JSON.stringify(lintOptions)
    )
  }, [lintOptions])

  useEffect(() => {
    if (toolState.formatResult.state !== "formatted") {
      setDownloadUrl(null)
      return
    }

    const nextUrl = URL.createObjectURL(
      new Blob([formattedSql], {
        type: "application/sql;charset=utf-8",
      })
    )

    downloadUrlRef.current = nextUrl
    setDownloadUrl(nextUrl)

    return () => {
      URL.revokeObjectURL(nextUrl)
      downloadUrlRef.current = null
    }
  }, [formattedSql, toolState.formatResult.state])

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!file) {
      return
    }

    const nextSql = await file.text()
    const detectedDialect = detectDialectFromFilename(file.name)

    startTransition(() => {
      setSourceSql(nextSql)

      if (detectedDialect) {
        setFormatOptions((currentOptions) => ({
          ...currentOptions,
          dialect: detectedDialect,
        }))
      }
    })
  }

  function handleSetSourceSql(value: string) {
    setSourceSql(value)
  }

  function handleUseSample() {
    startTransition(() => {
      setSourceSql(DEFAULT_SQL)
      setFormatOptions(DEFAULT_SQL_FORMAT_OPTIONS)
      setLintOptions(DEFAULT_SQL_LINT_OPTIONS)
    })
  }

  function handleClear() {
    startTransition(() => {
      setSourceSql("")
    })
  }

  return (
    <div className="grid gap-6">
      <div className="grid items-stretch gap-6 xl:grid-cols-2">
        <SqlInputCard
          fileInputRef={fileInputRef}
          hasInputError={toolState.formatResult.state === "error"}
          messages={messages}
          sourceSql={sourceSql}
          onClear={handleClear}
          onFileChange={(event) => {
            void handleFileChange(event)
          }}
          onSourceSqlChange={handleSetSourceSql}
          onUseSample={handleUseSample}
        />
        <FormattedSqlCard
          downloadFilename={downloadFilename}
          downloadUrl={downloadUrl}
          formatResult={toolState.formatResult}
          messages={messages}
        />
      </div>

      <div className="grid items-stretch gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <OptionsCard
          formatOptions={formatOptions}
          lintOptions={lintOptions}
          messages={messages}
          setFormatOptions={setFormatOptions}
          setLintOptions={setLintOptions}
        />
        <LintResultsCard
          issues={toolState.lintIssues}
          messages={messages}
          sourceSql={deferredSourceSql}
        />
      </div>
    </div>
  )
}

export default SqlFormatterAndLinterClient
