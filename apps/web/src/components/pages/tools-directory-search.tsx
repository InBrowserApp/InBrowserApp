import {
  useDeferredValue,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from "react"

import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@workspace/ui/components/ui/input-group"
import { Search, X } from "@workspace/ui/icons"
import { ToolsDirectoryResults } from "@/components/pages/tools-directory-results"
import {
  isPlainLeftClick,
  normalizeQuery,
  rankEntries,
  readLocationState,
} from "@/components/pages/tools-directory-search-utils"
import {
  TOOLS_PER_PAGE,
  getLocalizedToolsPagePath,
  paginateToolEntries,
} from "@/lib/tools-directory"

import type { MouseEvent } from "react"
import type { SiteLanguage } from "@/lib/site"
import type { ToolDirectoryEntry } from "@/lib/tools-directory"

type ToolsDirectorySearchMessages = Readonly<{
  searchLabel: string
  searchPlaceholder: string
  resultCountSuffix: string
  clearSearchLabel: string
  emptyRegistryTitle: string
  emptyRegistryDescription: string
  emptySearchTitle: string
  emptySearchDescription: string
  toolsTitle: string
}>

type ToolsDirectorySearchProps = Readonly<{
  basePath: string
  entries: readonly ToolDirectoryEntry[]
  language: SiteLanguage
  messages: ToolsDirectorySearchMessages
  pageNumber: number
}>

function ToolsDirectorySearch({
  basePath,
  entries,
  language,
  messages,
  pageNumber,
}: ToolsDirectorySearchProps) {
  const [query, setQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(pageNumber)
  const [locationReady, setLocationReady] = useState(false)
  const deferredQuery = useDeferredValue(query)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsStatusRef = useRef<HTMLParagraphElement>(null)
  const composingRef = useRef(false)
  const focusResultsRef = useRef(false)
  const normalizedQuery = normalizeQuery(deferredQuery)
  const rankedEntries = useMemo(
    () => rankEntries(entries, normalizedQuery, language),
    [entries, language, normalizedQuery]
  )
  const pageCount = Math.max(
    1,
    Math.ceil(rankedEntries.length / TOOLS_PER_PAGE)
  )
  const safePage = Math.min(currentPage, pageCount)
  const page = paginateToolEntries(rankedEntries, safePage)
  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(language),
    [language]
  )
  const syncStateToUrl = useEffectEvent(
    (nextQuery: string, nextPage: number) => {
      const url = new URL(window.location.href)

      if (nextQuery) {
        url.pathname = getLocalizedToolsPagePath(basePath, pageNumber)
        url.searchParams.set("query", nextQuery)
        if (nextPage > 1) {
          url.searchParams.set("page", String(nextPage))
        } else {
          url.searchParams.delete("page")
        }
      } else {
        url.pathname = getLocalizedToolsPagePath(basePath, nextPage)
        url.searchParams.delete("query")
        url.searchParams.delete("page")
      }

      window.history.replaceState(window.history.state, "", url)
    }
  )

  useEffect(() => {
    if (inputRef.current && !composingRef.current) {
      inputRef.current.value = query
    }
  }, [query])

  useEffect(() => {
    const syncFromLocation = () => {
      const state = readLocationState(pageNumber)
      setQuery(state.query)
      setCurrentPage(state.query ? state.pageNumber : pageNumber)
      setLocationReady(true)
    }

    syncFromLocation()
    window.addEventListener("popstate", syncFromLocation)
    return () => window.removeEventListener("popstate", syncFromLocation)
  }, [pageNumber])

  useEffect(() => {
    if (locationReady && query === deferredQuery) {
      syncStateToUrl(normalizedQuery, safePage)
    }
  }, [deferredQuery, locationReady, normalizedQuery, query, safePage])

  useEffect(() => {
    if (focusResultsRef.current) {
      focusResultsRef.current = false
      resultsStatusRef.current?.focus({ preventScroll: true })
      resultsStatusRef.current?.scrollIntoView({ block: "start" })
    }
  }, [safePage])

  const setSearchQuery = (nextQuery: string) => {
    setQuery(nextQuery)
    setCurrentPage(normalizeQuery(nextQuery) ? 1 : pageNumber)
  }
  const handleSearchPageChange = (
    event: MouseEvent<HTMLAnchorElement>,
    nextPage: number
  ) => {
    if (!isPlainLeftClick(event)) {
      return
    }

    event.preventDefault()
    const url = new URL(event.currentTarget.href)
    window.history.pushState(window.history.state, "", url)
    focusResultsRef.current = true
    setCurrentPage(nextPage)
  }
  const resultRange = page.total
    ? `${numberFormatter.format(page.start)}–${numberFormatter.format(page.end)} / `
    : ""
  const resultCount = `${resultRange}${numberFormatter.format(page.total)} ${messages.resultCountSuffix}`
  return (
    <div className="flex flex-col gap-6">
      <div role="search">
        <FieldGroup>
          <Field>
            <FieldLabel className="sr-only" htmlFor="tool-directory-search">
              {messages.searchLabel}
            </FieldLabel>
            <InputGroup className="h-11">
              <InputGroupInput
                ref={inputRef}
                id="tool-directory-search"
                name="query"
                type="search"
                autoComplete="off"
                enterKeyHint="search"
                spellCheck={false}
                aria-controls="tool-directory-results"
                className="text-base md:text-sm"
                defaultValue={query}
                placeholder={messages.searchPlaceholder}
                onCompositionStart={() => {
                  composingRef.current = true
                }}
                onCompositionEnd={(event) => {
                  composingRef.current = false
                  setSearchQuery(event.currentTarget.value)
                }}
                onChange={(event) => {
                  if (!composingRef.current) {
                    setSearchQuery(event.currentTarget.value)
                  }
                }}
              />
              <InputGroupAddon align="inline-start">
                <Search aria-hidden="true" />
              </InputGroupAddon>
              {query ? (
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    aria-label={messages.clearSearchLabel}
                    size="icon-sm"
                    onClick={() => {
                      setSearchQuery("")
                      inputRef.current?.focus()
                    }}
                  >
                    <X aria-hidden="true" />
                  </InputGroupButton>
                </InputGroupAddon>
              ) : null}
            </InputGroup>
          </Field>
        </FieldGroup>
      </div>

      <ToolsDirectoryResults
        basePath={basePath}
        browsePageNumber={pageNumber}
        busy={query !== deferredQuery}
        emptyRegistryDescription={messages.emptyRegistryDescription}
        emptyRegistryTitle={messages.emptyRegistryTitle}
        emptySearchDescription={messages.emptySearchDescription}
        emptySearchTitle={messages.emptySearchTitle}
        language={language}
        page={page}
        query={normalizedQuery}
        resultCount={resultCount}
        resultsStatusRef={resultsStatusRef}
        toolsTitle={messages.toolsTitle}
        onSearchPageChange={handleSearchPageChange}
      />
    </div>
  )
}

export { ToolsDirectorySearch }
