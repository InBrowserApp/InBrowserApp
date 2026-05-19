import { useDeferredValue, useMemo, useState } from "react"

import {
  IMAGE_TOOL_GROUPS,
  countImageToolsByGroup,
  filterImageTools,
  resolveImageToolGroups,
} from "./core/image-tools"
import { Badge } from "@workspace/ui/components/ui/badge"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@workspace/ui/components/ui/input-group"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { ToolIcon } from "@workspace/ui/components/tool/tool-icon"
import { ToolSurface } from "@workspace/ui/components/tool/tool-surface"
import { ImageIcon, Search, X } from "@workspace/ui/icons"

import type {
  ImageToolGroup,
  ImageToolGroupFilter,
  ImageToolSummary,
} from "./core/image-tools"
import type { ToolMeta } from "@workspace/tool-sdk"

type ImageToolsRelatedTool = ImageToolSummary &
  Readonly<{
    category: string
    icon: string
  }>

type ImageToolsMessages = Readonly<{
  meta: ToolMeta
  searchLabel: string
  searchPlaceholder: string
  clearSearchLabel: string
  resultCountTemplate: string
  allToolsLabel: string
  convertGroupLabel: string
  optimizeGroupLabel: string
  inspectGroupLabel: string
  createGroupLabel: string
  scanGroupLabel: string
  filterDescription: string
  openToolLabel: string
  noToolsTitle: string
  noToolsDescription: string
  emptySearchTitle: string
  emptySearchDescription: string
}>

type ImageToolsClientProps = Readonly<{
  lang: string
  messages: ImageToolsMessages
  relatedTools: readonly ImageToolsRelatedTool[]
}>

const GROUP_LABEL_KEYS = {
  convert: "convertGroupLabel",
  create: "createGroupLabel",
  inspect: "inspectGroupLabel",
  optimize: "optimizeGroupLabel",
  scan: "scanGroupLabel",
} as const satisfies Record<ImageToolGroup, keyof ImageToolsMessages>

function localizeToolHref(slug: string, lang: string) {
  return lang === "en" ? `/tools/${slug}` : `/${lang}/tools/${slug}`
}

function formatResultCount(template: string, count: number, lang: string) {
  return template.replace("{count}", new Intl.NumberFormat(lang).format(count))
}

function ImageToolsClient({
  lang,
  messages,
  relatedTools,
}: ImageToolsClientProps) {
  const [query, setQuery] = useState("")
  const [selectedGroup, setSelectedGroup] =
    useState<ImageToolGroupFilter>("all")
  const deferredQuery = useDeferredValue(query)
  const groupCounts = useMemo(
    () => countImageToolsByGroup(relatedTools),
    [relatedTools]
  )
  const visibleTools = useMemo(
    () =>
      filterImageTools(relatedTools, {
        group: selectedGroup,
        query: deferredQuery,
      }),
    [deferredQuery, relatedTools, selectedGroup]
  )
  const groupChoices = [
    {
      count: relatedTools.length,
      label: messages.allToolsLabel,
      value: "all" as const,
    },
    ...IMAGE_TOOL_GROUPS.map((group) => ({
      count: groupCounts[group],
      label: messages[GROUP_LABEL_KEYS[group]],
      value: group,
    })),
  ]
  const hasTools = relatedTools.length > 0
  const hasSearchOrFilter = query.trim() !== "" || selectedGroup !== "all"
  const resultCountLabel = formatResultCount(
    messages.resultCountTemplate,
    visibleTools.length,
    lang
  )

  return (
    <div className="flex flex-col gap-6">
      <ToolSurface className="flex flex-col gap-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <InputGroup className="h-11">
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              aria-label={messages.searchLabel}
              placeholder={messages.searchPlaceholder}
              value={query}
              onChange={(event) => {
                setQuery(event.currentTarget.value)
              }}
            />
            {query ? (
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  aria-label={messages.clearSearchLabel}
                  size="icon-xs"
                  onClick={() => {
                    setQuery("")
                  }}
                >
                  <X />
                </InputGroupButton>
              </InputGroupAddon>
            ) : null}
          </InputGroup>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {resultCountLabel}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-muted-foreground">
            {messages.filterDescription}
          </p>
          <ToggleGroup
            type="single"
            value={selectedGroup}
            variant="outline"
            className="flex w-full flex-wrap justify-start gap-2"
            onValueChange={(value) => {
              if (value) {
                setSelectedGroup(value as ImageToolGroupFilter)
              }
            }}
          >
            {groupChoices.map((choice) => (
              <ToggleGroupItem
                key={choice.value}
                value={choice.value}
                className="gap-1.5 rounded-lg"
              >
                <span>{choice.label}</span>
                <span className="text-xs text-muted-foreground">
                  {new Intl.NumberFormat(lang).format(choice.count)}
                </span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </ToolSurface>

      {!hasTools ? (
        <ImageToolsEmptyState
          description={messages.noToolsDescription}
          title={messages.noToolsTitle}
        />
      ) : visibleTools.length === 0 ? (
        <ImageToolsEmptyState
          description={messages.emptySearchDescription}
          title={messages.emptySearchTitle}
        />
      ) : (
        <div
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          aria-busy={query !== deferredQuery}
        >
          {visibleTools.map((tool) => (
            <ImageToolCard
              key={tool.slug}
              lang={lang}
              messages={messages}
              tool={tool}
            />
          ))}
        </div>
      )}

      {hasSearchOrFilter ? null : (
        <p className="text-sm leading-6 text-muted-foreground">
          {messages.meta.description}
        </p>
      )}
    </div>
  )
}

function ImageToolCard({
  lang,
  messages,
  tool,
}: Readonly<{
  lang: string
  messages: ImageToolsMessages
  tool: ImageToolsRelatedTool
}>) {
  const groups = resolveImageToolGroups(tool)

  return (
    <a
      aria-label={`${messages.openToolLabel}: ${tool.meta.name}`}
      className="group block rounded-lg outline-none"
      href={localizeToolHref(tool.slug, lang)}
    >
      <ToolSurface className="flex h-full flex-col gap-4 transition-colors group-hover:border-foreground/20 group-focus-visible:border-ring group-focus-visible:ring-3 group-focus-visible:ring-ring/50">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <ToolIcon icon={tool.icon} className="size-5" aria-hidden="true" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h2 className="font-heading text-lg leading-tight tracking-[var(--tracking-display)]">
              {tool.meta.name}
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              {tool.meta.description}
            </p>
          </div>
        </div>
        <div className="mt-auto flex flex-wrap gap-2">
          {groups.map((group) => (
            <Badge key={group} variant="secondary">
              {messages[GROUP_LABEL_KEYS[group]]}
            </Badge>
          ))}
        </div>
      </ToolSurface>
    </a>
  )
}

function ImageToolsEmptyState({
  description,
  title,
}: Readonly<{
  description: string
  title: string
}>) {
  return (
    <Empty className="border border-dashed border-border/80 bg-muted/30 py-12">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ImageIcon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

export default ImageToolsClient
export type { ImageToolsMessages, ImageToolsRelatedTool }
