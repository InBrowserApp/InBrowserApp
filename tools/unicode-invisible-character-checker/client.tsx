import {
  startTransition,
  useDeferredValue,
  useEffect,
  useId,
  useState,
} from "react"

import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { FileText, RefreshCcw } from "@workspace/ui/icons"

import {
  DEFAULT_ENABLED_CATEGORIES,
  SAMPLE_TEXT,
  STORAGE_KEY_CATEGORIES,
  STORAGE_KEY_TEXT,
} from "./constants"
import { FilterCard } from "./components/filter-card"
import { FindingsTable } from "./components/findings-table"
import { ResultsCard } from "./components/results-card"
import {
  scanInvisibleCharacters,
  type InvisibleCategory,
} from "./core/unicode-invisible"

import type { UnicodeInvisibleMessages } from "./types"

type UnicodeInvisibleCharacterCheckerClientProps = Readonly<{
  messages: UnicodeInvisibleMessages
}>

function UnicodeInvisibleCharacterCheckerClient({
  messages,
}: UnicodeInvisibleCharacterCheckerClientProps) {
  const textareaId = useId()
  const [text, setText] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<
    readonly InvisibleCategory[]
  >(DEFAULT_ENABLED_CATEGORIES)
  const [cleanedDownloadUrl, setCleanedDownloadUrl] = useState<string | null>(
    null
  )
  const [annotatedDownloadUrl, setAnnotatedDownloadUrl] = useState<
    string | null
  >(null)
  const deferredText = useDeferredValue(text)
  const scanResult = scanInvisibleCharacters(
    deferredText,
    new Set(selectedCategories)
  )
  const categoryLabels: Record<InvisibleCategory, string> = {
    "zero-width": messages.zeroWidthLabel,
    "bidi-control": messages.bidiControlLabel,
    "space-like": messages.spaceLikeLabel,
    format: messages.formatLabel,
  }

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedText = window.localStorage.getItem(STORAGE_KEY_TEXT)
    const storedCategories = window.localStorage.getItem(STORAGE_KEY_CATEGORIES)

    if (storedText !== null) {
      setText(storedText)
    }

    if (storedCategories !== null) {
      try {
        const parsed = JSON.parse(storedCategories)

        if (Array.isArray(parsed)) {
          setSelectedCategories(
            DEFAULT_ENABLED_CATEGORIES.filter((category) =>
              parsed.includes(category)
            )
          )
        }
      } catch {
        setSelectedCategories(DEFAULT_ENABLED_CATEGORIES)
      }
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEY_TEXT, text)
  }, [text])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(
      STORAGE_KEY_CATEGORIES,
      JSON.stringify(selectedCategories)
    )
  }, [selectedCategories])

  useEffect(() => {
    const nextCleanedUrl = scanResult.cleanedText
      ? URL.createObjectURL(
          new Blob([scanResult.cleanedText], {
            type: "text/plain;charset=utf-8",
          })
        )
      : null
    const nextAnnotatedUrl = scanResult.annotatedText
      ? URL.createObjectURL(
          new Blob([scanResult.annotatedText], {
            type: "text/plain;charset=utf-8",
          })
        )
      : null

    setCleanedDownloadUrl(nextCleanedUrl)
    setAnnotatedDownloadUrl(nextAnnotatedUrl)

    return () => {
      if (nextCleanedUrl) {
        URL.revokeObjectURL(nextCleanedUrl)
      }

      if (nextAnnotatedUrl) {
        URL.revokeObjectURL(nextAnnotatedUrl)
      }
    }
  }, [scanResult.annotatedText, scanResult.cleanedText])

  const hasInput = deferredText.length > 0

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <ToolPanelCard>
          <CardHeader className="border-b">
            <CardTitle>{messages.inputTitle}</CardTitle>
            <CardDescription>{messages.inputDescription}</CardDescription>
          </CardHeader>
          <ToolPanelCardContent>
            <label htmlFor={textareaId} className="sr-only">
              {messages.inputPlaceholder}
            </label>
            <Textarea
              id={textareaId}
              aria-label={messages.inputPlaceholder}
              value={text}
              rows={12}
              placeholder={messages.inputPlaceholder}
              onChange={(event) => {
                setText(event.target.value)
              }}
              className="min-h-80 resize-y text-sm"
            />
          </ToolPanelCardContent>
          <ToolPanelCardFooter className="flex flex-wrap justify-start gap-3 border-t">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                startTransition(() => {
                  setText(SAMPLE_TEXT)
                })
              }}
            >
              <FileText data-icon="inline-start" />
              {messages.loadSample}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                startTransition(() => {
                  setText("")
                })
              }}
            >
              <RefreshCcw data-icon="inline-start" />
              {messages.clearText}
            </Button>
          </ToolPanelCardFooter>
        </ToolPanelCard>

        <FilterCard
          title={messages.filtersTitle}
          description={messages.filtersDescription}
          selectAllLabel={messages.selectAll}
          resetFiltersLabel={messages.resetFilters}
          categoryLabels={categoryLabels}
          categories={DEFAULT_ENABLED_CATEGORIES}
          selectedCategories={selectedCategories}
          onToggle={(category, checked) => {
            setSelectedCategories((current) =>
              checked
                ? [...current, category]
                : current.filter((item) => item !== category)
            )
          }}
          onSelectAll={() => {
            setSelectedCategories(DEFAULT_ENABLED_CATEGORIES)
          }}
          onReset={() => {
            setSelectedCategories(DEFAULT_ENABLED_CATEGORIES)
          }}
        />
      </div>

      {hasInput ? (
        <>
          <ResultsCard
            title={messages.resultsTitle}
            description={messages.resultsDescription}
            findingsCountLabel={messages.findingsCountLabel}
            cleanLengthLabel={messages.cleanLengthLabel}
            activeFiltersLabel={messages.activeFiltersLabel}
            selectedCategoriesCount={selectedCategories.length}
            noIssuesLabel={messages.noIssuesLabel}
            cleanedTitle={messages.cleanedTitle}
            annotatedTitle={messages.annotatedTitle}
            copyLabel={messages.copyLabel}
            copiedLabel={messages.copiedLabel}
            downloadCleaned={messages.downloadCleaned}
            downloadAnnotated={messages.downloadAnnotated}
            cleanedDownloadUrl={cleanedDownloadUrl}
            annotatedDownloadUrl={annotatedDownloadUrl}
            categoryLabels={categoryLabels}
            scanResult={scanResult}
          />

          <Card>
            <CardHeader className="border-b">
              <CardTitle>{messages.findingsTableTitle}</CardTitle>
              <CardDescription>{messages.resultsDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <FindingsTable
                matches={scanResult.matches}
                categoryLabels={categoryLabels}
                title={messages.findingsTableTitle}
                emptyDescription={messages.noIssuesLabel}
                indexLabel={messages.indexLabel}
                lineLabel={messages.lineLabel}
                columnLabel={messages.columnLabel}
                codeLabel={messages.codeLabel}
                nameLabel={messages.nameLabel}
                categoryLabel={messages.categoryLabel}
                previewLabel={messages.previewLabel}
              />
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent>
            <Empty className="border-border/80 bg-muted/20">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FileText />
                </EmptyMedia>
                <EmptyTitle>{messages.emptyStateTitle}</EmptyTitle>
                <EmptyDescription>
                  {messages.emptyStateDescription}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default UnicodeInvisibleCharacterCheckerClient
