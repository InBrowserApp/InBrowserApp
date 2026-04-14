import { useDeferredValue, useEffect, useId, useMemo, useState } from "react"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Button } from "@workspace/ui/components/ui/button"
import { Badge } from "@workspace/ui/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/ui/table"
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
  aboutTitle: string
  aboutDescription: string
  systemPorts: string
  systemPortsDesc: string
  registeredPorts: string
  registeredPortsDesc: string
  dynamicPorts: string
  dynamicPortsDesc: string
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
      <Card>
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

          <div className="flex flex-wrap gap-2">
            {CATEGORY_FILTERS.map((filter) => {
              const isActive = category === filter

              return (
                <Button
                  key={filter}
                  type="button"
                  size="sm"
                  variant={isActive ? "default" : "outline"}
                  aria-pressed={isActive}
                  onClick={() => {
                    setCategory(filter)
                  }}
                >
                  {getCategoryLabel(filter, messages)}
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
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
            <div className="max-h-[65vh] overflow-auto">
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
          )}
        </CardContent>
      </Card>

      <Card className="xl:col-span-2">
        <CardHeader className="border-b">
          <CardTitle>{messages.aboutTitle}</CardTitle>
          <CardDescription>{messages.aboutDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-3">
            <li className="rounded-xl border border-border/70 bg-muted/20 p-4">
              <p className="font-medium text-foreground">
                {messages.systemPorts}
              </p>
              <p className="mt-2">{messages.systemPortsDesc}</p>
            </li>
            <li className="rounded-xl border border-border/70 bg-muted/20 p-4">
              <p className="font-medium text-foreground">
                {messages.registeredPorts}
              </p>
              <p className="mt-2">{messages.registeredPortsDesc}</p>
            </li>
            <li className="rounded-xl border border-border/70 bg-muted/20 p-4">
              <p className="font-medium text-foreground">
                {messages.dynamicPorts}
              </p>
              <p className="mt-2">{messages.dynamicPortsDesc}</p>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export default PortNumberLookupClient
