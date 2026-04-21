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

import { CopyableValue } from "./components/copyable-value"
import {
  CATEGORY_SWATCHES,
  COLOR_CATEGORIES,
  COLOR_DATA,
  filterColors,
  formatRgb,
  isColorFilter,
  type ColorCategory,
  type ColorFilter,
} from "./core/html-color-names"

type HtmlColorNamesMessages = Readonly<{
  all: string
  blue: string
  brown: string
  cyan: string
  gray: string
  green: string
  hex: string
  name: string
  noResults: string
  orange: string
  pink: string
  purple: string
  red: string
  rgb: string
  searchPlaceholder: string
  swatch: string
  white: string
  yellow: string
  meta: Readonly<{
    name: string
    description: string
  }>
}>

type HtmlColorNamesClientProps = Readonly<{
  language: string
  messages: HtmlColorNamesMessages
}>

const SEARCH_STORAGE_KEY = "tools:html-color-names:search"
const CATEGORY_STORAGE_KEY = "tools:html-color-names:category"

function getCategoryLabel(
  category: ColorCategory,
  messages: HtmlColorNamesMessages
): string {
  return messages[category]
}

function HtmlColorNamesClient({
  language,
  messages,
}: HtmlColorNamesClientProps) {
  const searchId = useId()
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<ColorFilter>("all")
  const deferredSearchQuery = useDeferredValue(searchQuery)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedSearch = window.localStorage.getItem(SEARCH_STORAGE_KEY)
    const storedFilter = window.localStorage.getItem(CATEGORY_STORAGE_KEY)

    if (storedSearch !== null) {
      setSearchQuery(storedSearch)
    }

    if (storedFilter !== null && isColorFilter(storedFilter)) {
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

  const visibleColors = filterColors(COLOR_DATA, deferredSearchQuery, filter)
  const resultCount = new Intl.NumberFormat(language).format(
    visibleColors.length
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
              name="html-color-names-search"
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
              if (isColorFilter(value)) {
                setFilter(value)
              }
            }}
          >
            <ToggleGroupItem value="all" className="flex-1 sm:flex-none">
              {messages.all}
            </ToggleGroupItem>
            {COLOR_CATEGORIES.map((category) => (
              <ToggleGroupItem
                key={category}
                value={category}
                className="flex-1 sm:flex-none"
              >
                <span
                  aria-hidden="true"
                  className="size-3 rounded-xs border border-border/60"
                  style={{ backgroundColor: CATEGORY_SWATCHES[category] }}
                />
                <span>{getCategoryLabel(category, messages)}</span>
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
          {visibleColors.length === 0 ? (
            <div className="px-6 py-10">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Search className="size-4" />
                  </EmptyMedia>
                  <EmptyTitle>{messages.noResults}</EmptyTitle>
                  <EmptyDescription>{messages.noResults}</EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          ) : (
            <ScrollArea className="h-[42rem] w-full">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-background">
                  <TableRow>
                    <TableHead className="w-20">{messages.swatch}</TableHead>
                    <TableHead className="min-w-48">{messages.name}</TableHead>
                    <TableHead className="min-w-36">{messages.hex}</TableHead>
                    <TableHead className="min-w-40">{messages.rgb}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleColors.map((color) => (
                    <TableRow key={color.name}>
                      <TableCell className="align-top">
                        <div
                          className="size-8 rounded-md border border-border/60"
                          style={{ backgroundColor: color.hex }}
                        />
                      </TableCell>
                      <TableCell className="align-top">
                        <CopyableValue
                          ariaLabel={color.name}
                          value={color.name}
                        />
                      </TableCell>
                      <TableCell className="align-top">
                        <CopyableValue
                          ariaLabel={color.hex}
                          value={color.hex}
                        />
                      </TableCell>
                      <TableCell className="align-top">
                        <CopyableValue
                          ariaLabel={formatRgb(color.rgb)}
                          value={formatRgb(color.rgb)}
                        />
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

export default HtmlColorNamesClient
