import { useDeferredValue, useId, useMemo, useState } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Input } from "@workspace/ui/components/ui/input"
import { ScrollArea } from "@workspace/ui/components/ui/scroll-area"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { LayoutGrid, Search } from "@workspace/ui/icons"

import {
  CATEGORY_SWATCH_HEX,
  COLOR_CATEGORIES,
  HTML_COLOR_NAMES,
  filterHtmlColorEntries,
  isColorFilter,
  type ColorCategory,
  type ColorFilter,
  type HtmlColorInfo,
} from "./core/color-names"
import type { HtmlColorNamesMessages } from "./types"

const CATEGORY_FILTERS = ["all", ...COLOR_CATEGORIES] as const

type HtmlColorNamesClientProps = Readonly<{
  language: string
  messages: HtmlColorNamesMessages
}>

function HtmlColorNamesClient({
  language,
  messages,
}: HtmlColorNamesClientProps) {
  const searchId = useId()
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<ColorFilter>("all")
  const deferredSearchQuery = useDeferredValue(searchQuery)

  const visibleColors = useMemo(
    () => filterHtmlColorEntries(HTML_COLOR_NAMES, deferredSearchQuery, filter),
    [deferredSearchQuery, filter]
  )
  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(language),
    [language]
  )
  const resultCount = `${numberFormatter.format(visibleColors.length)} / ${numberFormatter.format(HTML_COLOR_NAMES.length)}`
  const hasActiveFilters = searchQuery.trim().length > 0 || filter !== "all"

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <CardTitle>{messages.meta.name}</CardTitle>
            <CardDescription>{messages.meta.description}</CardDescription>
          </div>
          <Badge variant="secondary">{resultCount}</Badge>
        </div>
      </CardHeader>

      <ToolPanelCardContent className="gap-5">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id={searchId}
            name="html-color-search"
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
          {CATEGORY_FILTERS.map((categoryFilter) => (
            <ToggleGroupItem
              key={categoryFilter}
              value={categoryFilter}
              className="flex-1 sm:flex-none"
            >
              <span className="flex items-center gap-2">
                {categoryFilter === "all" ? null : (
                  <span
                    className="size-2.5 rounded-full border"
                    style={{
                      backgroundColor: CATEGORY_SWATCH_HEX[categoryFilter],
                    }}
                    aria-hidden="true"
                  />
                )}
                <span>{getCategoryLabel(categoryFilter, messages)}</span>
              </span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        {visibleColors.length === 0 ? (
          <div className="flex min-h-64 flex-1 items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 py-10">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <LayoutGrid className="size-4" />
                </EmptyMedia>
                <EmptyTitle>{messages.noResultsTitle}</EmptyTitle>
              </EmptyHeader>
            </Empty>
          </div>
        ) : (
          <ScrollArea className="h-[34rem] w-full md:h-[42rem]">
            <div className="grid gap-3 pr-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibleColors.map((color) => (
                <ColorTile key={color.name} color={color} messages={messages} />
              ))}
            </div>
          </ScrollArea>
        )}
      </ToolPanelCardContent>

      <ToolPanelCardFooter className="justify-end border-t">
        <Button
          type="button"
          variant="outline"
          disabled={!hasActiveFilters}
          onClick={() => {
            setSearchQuery("")
            setFilter("all")
          }}
        >
          {messages.resetLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

function ColorTile({
  color,
  messages,
}: Readonly<{
  color: HtmlColorInfo
  messages: HtmlColorNamesMessages
}>) {
  return (
    <article className="overflow-hidden rounded-xl border bg-card">
      <div
        className="h-20 border-b"
        style={{ backgroundColor: color.hex }}
        aria-label={`${messages.swatch}: ${color.name}`}
        title={`${messages.swatch}: ${color.name}`}
      />
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <p className="truncate font-medium">{color.name}</p>
            <p className="font-mono text-xs text-muted-foreground">
              {color.hex}
            </p>
          </div>
          <Badge variant="outline">
            {getCategoryLabel(color.category, messages)}
          </Badge>
        </div>

        <dl className="grid gap-2 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">{messages.hex}</dt>
            <dd className="font-mono text-xs">{color.hex}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">{messages.rgb}</dt>
            <dd className="font-mono text-xs">{color.rgbLabel}</dd>
          </div>
        </dl>
      </div>
    </article>
  )
}

function getCategoryLabel(
  filter: ColorFilter | ColorCategory,
  messages: HtmlColorNamesMessages
): string {
  switch (filter) {
    case "all":
      return messages.all
    case "red":
      return messages.red
    case "orange":
      return messages.orange
    case "yellow":
      return messages.yellow
    case "green":
      return messages.green
    case "cyan":
      return messages.cyan
    case "blue":
      return messages.blue
    case "purple":
      return messages.purple
    case "pink":
      return messages.pink
    case "brown":
      return messages.brown
    case "gray":
      return messages.gray
    case "white":
      return messages.white
  }
}

export default HtmlColorNamesClient
