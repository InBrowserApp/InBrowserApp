"use client"

import { useId } from "react"

import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import { Badge } from "@workspace/ui/components/ui/badge"
import {
  CardAction,
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
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { ScrollArea } from "@workspace/ui/components/ui/scroll-area"
import { Switch } from "@workspace/ui/components/ui/switch"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { Search } from "@workspace/ui/icons"

import { buildFontFaceDescriptor } from "../core/local-font-book"

import type {
  DisplayFont,
  FontGroup,
  FontSort,
  FontStyleFilter,
  LocalFontBookMessages,
} from "../types"

type FontBrowserPanelProps = Readonly<{
  messages: LocalFontBookMessages
  isSupported: boolean
  isLoading: boolean
  statusMessage: string
  fontCountLabel: string
  hasFonts: boolean
  searchQuery: string
  filterStyle: FontStyleFilter
  sortBy: FontSort
  groupByFamily: boolean
  displayGroups: readonly FontGroup[]
  activeFontId: string
  onLoadFonts: () => void
  onSearchQueryChange: (value: string) => void
  onFilterStyleChange: (value: FontStyleFilter) => void
  onSortByChange: (value: FontSort) => void
  onGroupByFamilyChange: (value: boolean) => void
  onSelectFont: (fontId: string) => void
}>

function FontBrowserPanel({
  messages,
  isSupported,
  isLoading,
  statusMessage,
  fontCountLabel,
  hasFonts,
  searchQuery,
  filterStyle,
  sortBy,
  groupByFamily,
  displayGroups,
  activeFontId,
  onLoadFonts,
  onSearchQueryChange,
  onFilterStyleChange,
  onSortByChange,
  onGroupByFamilyChange,
  onSelectFont,
}: FontBrowserPanelProps) {
  const searchInputId = useId()
  const groupSwitchId = useId()

  return (
    <ToolPanelCard className="overflow-hidden bg-linear-to-br from-card via-card to-muted/20">
      <CardHeader className="border-b bg-linear-to-r from-muted/35 via-transparent to-transparent">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="rounded-full px-3">
            {messages.libraryTitle}
          </Badge>
          {fontCountLabel ? (
            <Badge variant="outline" className="rounded-full px-3">
              {fontCountLabel}
            </Badge>
          ) : null}
        </div>
        <CardTitle>{messages.libraryTitle}</CardTitle>
        <CardDescription>{messages.meta.description}</CardDescription>
        <CardAction>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!isSupported || isLoading}
            onClick={onLoadFonts}
          >
            {messages.loadButton}
          </Button>
        </CardAction>
      </CardHeader>

      <ToolPanelCardContent className="gap-5 pt-5">
        <FieldGroup className="gap-4">
          <Field>
            <FieldLabel htmlFor={searchInputId} className="sr-only">
              {messages.searchPlaceholder}
            </FieldLabel>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
              <Input
                id={searchInputId}
                autoComplete="off"
                value={searchQuery}
                onChange={(event) => {
                  onSearchQueryChange(event.target.value)
                }}
                placeholder={messages.searchPlaceholder}
                aria-label={messages.searchPlaceholder}
                disabled={!hasFonts}
                className="pl-10"
              />
            </div>
          </Field>

          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
            <Field>
              <FieldLabel>{messages.detailsStyle}</FieldLabel>
              <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                spacing={8}
                value={filterStyle}
                onValueChange={(value) => {
                  if (!value) return
                  onFilterStyleChange(value as FontStyleFilter)
                }}
                disabled={!hasFonts}
                aria-label={messages.detailsStyle}
                className="w-full flex-wrap"
              >
                <ToggleGroupItem value="all">
                  {messages.filterStyleAll}
                </ToggleGroupItem>
                <ToggleGroupItem value="regular">
                  {messages.filterStyleRegular}
                </ToggleGroupItem>
                <ToggleGroupItem value="italic">
                  {messages.filterStyleItalic}
                </ToggleGroupItem>
              </ToggleGroup>
            </Field>

            <Field>
              <FieldLabel>{messages.sortLabel}</FieldLabel>
              <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                spacing={8}
                value={sortBy}
                onValueChange={(value) => {
                  if (!value) return
                  onSortByChange(value as FontSort)
                }}
                disabled={!hasFonts}
                aria-label={messages.sortLabel}
                className="w-full flex-wrap"
              >
                <ToggleGroupItem value="family">
                  {messages.sortFamily}
                </ToggleGroupItem>
                <ToggleGroupItem value="name">
                  {messages.sortName}
                </ToggleGroupItem>
                <ToggleGroupItem value="style">
                  {messages.sortStyle}
                </ToggleGroupItem>
              </ToggleGroup>
            </Field>

            <Field orientation="horizontal" className="self-end pt-0.5">
              <FieldLabel htmlFor={groupSwitchId}>
                {messages.groupLabel}
              </FieldLabel>
              <Switch
                id={groupSwitchId}
                checked={groupByFamily}
                onCheckedChange={onGroupByFamilyChange}
                disabled={!hasFonts}
              />
            </Field>
          </div>
        </FieldGroup>

        <div className="overflow-hidden rounded-2xl border bg-background/70">
          <ScrollArea className="h-[30rem]">
            {displayGroups.length > 0 ? (
              <div className="flex flex-col gap-5 p-4">
                {displayGroups.map((group) => (
                  <section key={group.id} className="flex flex-col gap-3">
                    {group.label ? (
                      <div className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
                        {group.label}
                      </div>
                    ) : null}

                    <div className="grid gap-2 sm:grid-cols-2">
                      {group.items.map((font) => (
                        <FontTile
                          key={font.id}
                          font={font}
                          active={font.id === activeFontId}
                          onSelect={onSelectFont}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : hasFonts ? (
              <Empty className="min-h-72 rounded-none border-none">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Search />
                  </EmptyMedia>
                  <EmptyTitle>{messages.noResults}</EmptyTitle>
                  <EmptyDescription>
                    {messages.searchPlaceholder}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : null}
          </ScrollArea>
        </div>

        {statusMessage ? (
          <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
            {statusMessage}
          </div>
        ) : null}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

function FontTile({
  font,
  active,
  onSelect,
}: Readonly<{
  font: DisplayFont
  active: boolean
  onSelect: (fontId: string) => void
}>) {
  const descriptor = buildFontFaceDescriptor(font)

  return (
    <button
      type="button"
      data-testid={`font-${font.id}`}
      data-active={active}
      onClick={() => {
        onSelect(font.id)
      }}
      className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card/80 p-4 text-left transition-colors hover:border-foreground/20 hover:bg-card data-[active=true]:border-primary/40 data-[active=true]:bg-primary/5"
    >
      <div
        className="line-clamp-2 text-lg leading-tight font-medium"
        style={descriptor ?? undefined}
      >
        {font.displayName}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span>{font.displayFamily}</span>
        <span>{font.displayStyle}</span>
      </div>
    </button>
  )
}

export default FontBrowserPanel
