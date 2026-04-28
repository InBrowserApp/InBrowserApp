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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Switch } from "@workspace/ui/components/ui/switch"
import { Search } from "@workspace/ui/icons"

import FontTile from "./font-tile"

import type {
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
    <ToolPanelCard className="h-auto min-w-0 overflow-hidden">
      <CardHeader className="gap-2 border-b">
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

      <ToolPanelCardContent className="gap-4 pt-4">
        <FieldGroup className="gap-4">
          <Field>
            <FieldLabel htmlFor={searchInputId} className="sr-only">
              {messages.searchPlaceholder}
            </FieldLabel>
            <div className="relative">
              <Search className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
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
                className="ps-10 text-sm"
              />
            </div>
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field>
              <FieldLabel>{messages.detailsStyle}</FieldLabel>
              <Select
                value={filterStyle}
                onValueChange={(value) => {
                  onFilterStyleChange(value as FontStyleFilter)
                }}
                disabled={!hasFonts}
              >
                <SelectTrigger
                  size="sm"
                  aria-label={messages.detailsStyle}
                  className="w-full"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{messages.filterStyleAll}</SelectItem>
                  <SelectItem value="regular">
                    {messages.filterStyleRegular}
                  </SelectItem>
                  <SelectItem value="italic">
                    {messages.filterStyleItalic}
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>{messages.sortLabel}</FieldLabel>
              <Select
                value={sortBy}
                onValueChange={(value) => {
                  onSortByChange(value as FontSort)
                }}
                disabled={!hasFonts}
              >
                <SelectTrigger
                  size="sm"
                  aria-label={messages.sortLabel}
                  className="w-full"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="family">{messages.sortFamily}</SelectItem>
                  <SelectItem value="name">{messages.sortName}</SelectItem>
                  <SelectItem value="style">{messages.sortStyle}</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field
            orientation="horizontal"
            className="justify-between gap-3 rounded-xl border bg-muted/15 px-3 py-2"
          >
            <div className="flex min-w-0 flex-col">
              <FieldLabel htmlFor={groupSwitchId}>
                {messages.groupLabel}
              </FieldLabel>
              {fontCountLabel ? (
                <Badge
                  variant="outline"
                  className="mt-1 w-fit rounded-full px-2.5 text-xs"
                >
                  {fontCountLabel}
                </Badge>
              ) : null}
            </div>
            <Switch
              id={groupSwitchId}
              checked={groupByFamily}
              onCheckedChange={onGroupByFamilyChange}
              disabled={!hasFonts}
            />
          </Field>
        </FieldGroup>

        <div className="overflow-hidden rounded-2xl border bg-muted/15">
          <ScrollArea className="h-[30rem]">
            {displayGroups.length > 0 ? (
              <div className="flex flex-col gap-4 p-4">
                {displayGroups.map((group) => (
                  <section key={group.id} className="flex flex-col gap-3">
                    {group.label ? (
                      <div className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
                        {group.label}
                      </div>
                    ) : null}

                    <div className="grid gap-3 sm:grid-cols-2">
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
            ) : (
              <Empty className="min-h-72 rounded-none border-none px-6">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Search />
                  </EmptyMedia>
                  <EmptyTitle>{messages.loadButton}</EmptyTitle>
                  <EmptyDescription>
                    {messages.meta.description}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </ScrollArea>
        </div>

        {statusMessage ? (
          <div
            aria-live="polite"
            className="rounded-2xl border border-dashed border-border/80 bg-muted/15 px-4 py-3 text-sm text-muted-foreground"
          >
            {statusMessage}
          </div>
        ) : null}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export default FontBrowserPanel
