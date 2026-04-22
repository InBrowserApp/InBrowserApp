import { useDeferredValue, useEffect, useId, useState } from "react"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Badge } from "@workspace/ui/components/ui/badge"
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
import { Search } from "@workspace/ui/icons"

import {
  CATEGORY_FILTERS,
  formatCount,
  getCategoryLabel,
  getCategoryVariant,
  getFilterLabel,
  getVisibleRows,
  type HttpStatusCodeDescriptions,
  type HttpStatusCodeLookupMessages,
} from "./client-helpers"
import { type HttpStatusCodeFilter } from "./core/http-status-code-lookup"

type HttpStatusCodeLookupClientProps = Readonly<{
  language: string
  descriptions: HttpStatusCodeDescriptions
  messages: HttpStatusCodeLookupMessages
}>

const SEARCH_STORAGE_KEY = "tools:http-status-code-lookup:search"
const CATEGORY_STORAGE_KEY = "tools:http-status-code-lookup:category"

function HttpStatusCodeLookupClient({
  descriptions,
  language,
  messages,
}: HttpStatusCodeLookupClientProps) {
  const searchId = useId()
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<HttpStatusCodeFilter>("all")
  const deferredSearchQuery = useDeferredValue(searchQuery)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedSearch = window.localStorage.getItem(SEARCH_STORAGE_KEY)
    const storedFilter = window.localStorage.getItem(CATEGORY_STORAGE_KEY)

    if (storedSearch !== null) {
      setSearchQuery(storedSearch)
    }

    if (
      storedFilter === "all" ||
      storedFilter === "common" ||
      storedFilter === "informational" ||
      storedFilter === "success" ||
      storedFilter === "redirection" ||
      storedFilter === "client-error" ||
      storedFilter === "server-error"
    ) {
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

  const visibleRows = getVisibleRows(descriptions, deferredSearchQuery, filter)
  const resultCount = formatCount(visibleRows.length, language)

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
              name="status-search"
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
              if (
                value === "all" ||
                value === "common" ||
                value === "informational" ||
                value === "success" ||
                value === "redirection" ||
                value === "client-error" ||
                value === "server-error"
              ) {
                setFilter(value)
              }
            }}
          >
            {CATEGORY_FILTERS.map((categoryFilter) => (
              <ToggleGroupItem
                key={categoryFilter}
                value={categoryFilter}
                className="flex-1 sm:flex-none"
              >
                {getFilterLabel(categoryFilter, messages)}
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
          {visibleRows.length === 0 ? (
            <div className="px-6 py-10">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Search className="size-4" />
                  </EmptyMedia>
                  <EmptyTitle>{messages.noResultsTitle}</EmptyTitle>
                  <EmptyDescription>
                    {messages.noResultsDescription}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          ) : (
            <ScrollArea className="h-[42rem] w-full">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-background">
                  <TableRow>
                    <TableHead className="w-24 whitespace-nowrap">
                      {messages.code}
                    </TableHead>
                    <TableHead className="w-52 whitespace-nowrap">
                      {messages.name}
                    </TableHead>
                    <TableHead className="w-44 whitespace-nowrap">
                      {messages.category}
                    </TableHead>
                    <TableHead className="min-w-80">
                      {messages.description}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleRows.map((statusCode) => (
                    <TableRow key={statusCode.code}>
                      <TableCell className="align-top font-mono font-semibold whitespace-nowrap">
                        {statusCode.code}
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="space-y-2">
                          <p className="font-medium">{statusCode.name}</p>
                          {statusCode.common ? (
                            <Badge variant="outline">{messages.common}</Badge>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="align-top">
                        <Badge
                          variant={getCategoryVariant(statusCode.category)}
                        >
                          {getCategoryLabel(statusCode.category, messages)}
                        </Badge>
                      </TableCell>
                      <TableCell className="align-top text-sm leading-6 text-muted-foreground">
                        {statusCode.description}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default HttpStatusCodeLookupClient
