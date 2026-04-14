import { useDeferredValue, useEffect, useId, useMemo, useState } from "react"

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
import { Network, Search } from "@workspace/ui/icons"

import { ports, type PortInfo } from "./data/ports"
import { filterPorts, type PortCategoryFilter } from "./core/port-lookup"

type PortNumberLookupMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  searchPlaceholder: string
  all: string
  common: string
  system: string
  registered: string
  port: string
  service: string
  protocol: string
  description: string
  aboutDescription: string
  systemPortsDesc: string
  registeredPortsDesc: string
  noResultsTitle: string
  noResultsDescription: string
}>

type PortNumberLookupClientProps = Readonly<{
  language: string
  messages: PortNumberLookupMessages
}>

const SEARCH_STORAGE_KEY = "tools:port-number-lookup:search"
const CATEGORY_STORAGE_KEY = "tools:port-number-lookup:category"
const CATEGORY_FILTERS = [
  "all",
  "common",
  "system",
  "registered",
] as const satisfies readonly PortCategoryFilter[]

function getCategoryLabel(
  category: PortCategoryFilter,
  messages: PortNumberLookupMessages
) {
  if (category === "common") return messages.common
  if (category === "system") return messages.system
  if (category === "registered") return messages.registered
  return messages.all
}

function getCategoryDescription(
  category: PortCategoryFilter,
  messages: PortNumberLookupMessages
) {
  if (category === "system") return messages.systemPortsDesc
  if (category === "registered") return messages.registeredPortsDesc
  return messages.aboutDescription
}

function getProtocolVariant(protocol: PortInfo["protocol"]) {
  if (protocol === "TCP") return "default"
  if (protocol === "UDP") return "secondary"
  return "outline"
}

function formatCount(value: number, language: string) {
  return new Intl.NumberFormat(language).format(value)
}

function PortNumberLookupClient({
  language,
  messages,
}: PortNumberLookupClientProps) {
  const searchId = useId()
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState<PortCategoryFilter>("all")
  const deferredSearchQuery = useDeferredValue(searchQuery)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedSearch = window.localStorage.getItem(SEARCH_STORAGE_KEY)
    const storedCategory = window.localStorage.getItem(CATEGORY_STORAGE_KEY)

    if (storedSearch !== null) {
      setSearchQuery(storedSearch)
    }

    if (
      storedCategory === "all" ||
      storedCategory === "common" ||
      storedCategory === "system" ||
      storedCategory === "registered"
    ) {
      setCategory(storedCategory)
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

    window.localStorage.setItem(CATEGORY_STORAGE_KEY, category)
  }, [category])

  const filteredPorts = useMemo(
    () => filterPorts(ports, deferredSearchQuery, category),
    [deferredSearchQuery, category]
  )
  const resultCount = formatCount(filteredPorts.length, language)

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
      <Card className="gap-0 pb-0">
        <CardHeader className="border-b">
          <CardTitle>{messages.meta.name}</CardTitle>
          <CardDescription>
            {getCategoryDescription(category, messages)}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id={searchId}
              name="port-search"
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
            value={category}
            className="w-full flex-wrap"
            onValueChange={(value) => {
              if (
                value === "all" ||
                value === "common" ||
                value === "system" ||
                value === "registered"
              ) {
                setCategory(value)
              }
            }}
          >
            {CATEGORY_FILTERS.map((filter) => (
              <ToggleGroupItem
                key={filter}
                value={filter}
                className="flex-1 sm:flex-none"
              >
                {getCategoryLabel(filter, messages)}
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
          {filteredPorts.length === 0 ? (
            <Empty className="rounded-none border-0 py-16">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Network />
                </EmptyMedia>
                <EmptyTitle>{messages.noResultsTitle}</EmptyTitle>
                <EmptyDescription>
                  {messages.noResultsDescription}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ScrollArea className="h-[28rem] w-full overflow-hidden sm:h-[32rem]">
              <div className="min-w-[42rem]">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="sticky top-0 bg-background/95">
                        {messages.port}
                      </TableHead>
                      <TableHead className="sticky top-0 bg-background/95">
                        {messages.service}
                      </TableHead>
                      <TableHead className="sticky top-0 bg-background/95">
                        {messages.protocol}
                      </TableHead>
                      <TableHead className="sticky top-0 min-w-72 bg-background/95">
                        {messages.description}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPorts.map((port) => (
                      <TableRow key={`${port.port}-${port.protocol}`}>
                        <TableCell className="font-mono font-semibold">
                          {port.port}
                        </TableCell>
                        <TableCell className="font-mono">
                          <div className="flex items-center gap-2">
                            <span>{port.service}</span>
                            {port.common ? (
                              <Badge variant="outline">{messages.common}</Badge>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getProtocolVariant(port.protocol)}>
                            {port.protocol}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm whitespace-normal text-muted-foreground">
                          {port.description}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default PortNumberLookupClient
