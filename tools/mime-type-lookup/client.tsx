import { useDeferredValue, useEffect, useId, useState } from "react"
import mimeDatabase from "mime-db"

import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import { ScrollArea, ScrollBar } from "@workspace/ui/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/ui/table"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { ArrowRight, Search } from "@workspace/ui/icons"

import {
  MIME_TYPE_CATEGORIES,
  formatCount,
  formatExtensions,
  formatRangeSummary,
  getCategoryLabel,
  getCategoryVariant,
  type MimeTypeCategory,
  type MimeTypeLookupMessages,
} from "./client-helpers"
import {
  createMimeTypeEntries,
  filterMimeTypeEntries,
  type MimeTypeFilter,
} from "./core/mime-type-lookup"

type MimeTypeLookupClientProps = Readonly<{
  language: string
  messages: MimeTypeLookupMessages
}>

const SEARCH_STORAGE_KEY = "tools:mime-type-lookup:search"
const CATEGORY_STORAGE_KEY = "tools:mime-type-lookup:category"
const MIME_TYPE_ENTRIES = createMimeTypeEntries(mimeDatabase)
const PAGE_SIZE = 20

function isMimeTypeFilter(value: string): value is MimeTypeFilter {
  return (
    value === "all" || MIME_TYPE_CATEGORIES.includes(value as MimeTypeCategory)
  )
}

function MimeTypeLookupClient({
  language,
  messages,
}: MimeTypeLookupClientProps) {
  const searchId = useId()
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<MimeTypeFilter>("all")
  const [page, setPage] = useState(1)
  const deferredSearchQuery = useDeferredValue(searchQuery)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedSearch = window.localStorage.getItem(SEARCH_STORAGE_KEY)
    const storedFilter = window.localStorage.getItem(CATEGORY_STORAGE_KEY)

    if (storedSearch !== null) {
      setSearchQuery(storedSearch)
    }

    if (storedFilter !== null && isMimeTypeFilter(storedFilter)) {
      setFilter(storedFilter)
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(SEARCH_STORAGE_KEY, searchQuery)
  }, [searchQuery])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(CATEGORY_STORAGE_KEY, filter)
  }, [filter])

  useEffect(() => {
    setPage(1)
  }, [deferredSearchQuery, filter])

  const visibleEntries = filterMimeTypeEntries(
    MIME_TYPE_ENTRIES,
    deferredSearchQuery,
    filter
  )
  const resultCount = formatCount(visibleEntries.length, language)
  const pageCount = Math.max(1, Math.ceil(visibleEntries.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pageStartIndex = (currentPage - 1) * PAGE_SIZE
  const pageEntries = visibleEntries.slice(
    pageStartIndex,
    pageStartIndex + PAGE_SIZE
  )
  const rangeStart = pageEntries.length === 0 ? 0 : pageStartIndex + 1
  const rangeEnd = pageStartIndex + pageEntries.length
  const rangeSummary = formatRangeSummary(
    rangeStart,
    rangeEnd,
    visibleEntries.length,
    language
  )

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>{messages.meta.name}</CardTitle>
          <CardDescription>{messages.meta.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id={searchId}
              name="mime-search"
              autoComplete="off"
              spellCheck={false}
              aria-label={messages.searchPlaceholder}
              value={searchQuery}
              placeholder={messages.searchPlaceholder}
              className="h-11 pl-10"
              onChange={(event) => {
                setSearchQuery(event.target.value)
              }}
            />
          </div>

          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            spacing={8}
            value={filter}
            className="w-full flex-wrap"
            onValueChange={(value) => {
              if (isMimeTypeFilter(value)) {
                setFilter(value)
              }
            }}
          >
            <ToggleGroupItem value="all" className="flex-1 sm:flex-none">
              {messages.all}
            </ToggleGroupItem>
            {MIME_TYPE_CATEGORIES.map((category) => (
              <ToggleGroupItem
                key={category}
                value={category}
                className="flex-1 sm:flex-none"
              >
                {getCategoryLabel(category, messages)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </CardContent>
      </Card>

      <Card className="gap-0 overflow-hidden pb-0">
        <CardHeader className="border-b">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <CardTitle>{messages.meta.name}</CardTitle>
              <CardDescription>{messages.meta.description}</CardDescription>
            </div>
            <Badge variant="secondary">{resultCount}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[42rem] w-full">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-background">
                <TableRow>
                  <TableHead className="min-w-64">
                    {messages.mimeType}
                  </TableHead>
                  <TableHead className="min-w-48">
                    {messages.extensions}
                  </TableHead>
                  <TableHead className="min-w-36">
                    {messages.category}
                  </TableHead>
                  <TableHead className="min-w-24">{messages.source}</TableHead>
                  <TableHead className="min-w-32">
                    {messages.compressible}
                  </TableHead>
                  <TableHead className="min-w-28">{messages.charset}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageEntries.map((entry) => (
                  <TableRow key={entry.mimeType}>
                    <TableCell className="align-top font-mono text-xs sm:text-sm">
                      {entry.mimeType}
                    </TableCell>
                    <TableCell className="align-top font-mono text-xs sm:text-sm">
                      {entry.extensions.length > 0
                        ? formatExtensions(entry.extensions)
                        : "—"}
                    </TableCell>
                    <TableCell className="align-top">
                      <Badge variant={getCategoryVariant(entry.category)}>
                        {getCategoryLabel(entry.category, messages)}
                      </Badge>
                    </TableCell>
                    <TableCell className="align-top">
                      {entry.source ? (
                        <Badge variant="outline">
                          {entry.source.toUpperCase()}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="align-top">
                      {entry.compressible === undefined ? (
                        "—"
                      ) : (
                        <Badge
                          variant={entry.compressible ? "default" : "secondary"}
                        >
                          {entry.compressible ? messages.yes : messages.no}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="align-top font-mono text-xs sm:text-sm">
                      {entry.charset ?? "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <div className="flex items-center justify-between gap-3 border-t px-4 py-3">
            <p className="text-sm text-muted-foreground">{rangeSummary}</p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label={messages.previousPage}
                disabled={currentPage === 1}
                onClick={() => {
                  setPage((value) => Math.max(1, value - 1))
                }}
              >
                <ArrowRight className="size-3.5 rotate-180" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label={messages.nextPage}
                disabled={currentPage === pageCount}
                onClick={() => {
                  setPage((value) => Math.min(pageCount, value + 1))
                }}
              >
                <ArrowRight className="size-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MimeTypeLookupClient
