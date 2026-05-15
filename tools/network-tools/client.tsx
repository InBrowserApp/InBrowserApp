import { useDeferredValue, useMemo, useState } from "react"

import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Input } from "@workspace/ui/components/ui/input"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { ToolSurface } from "@workspace/ui/components/tool/tool-surface"
import { ArrowRight, Network, Search } from "@workspace/ui/icons"

import {
  ALL_GROUPS,
  NETWORK_TOOL_GROUPS,
  countNetworkToolsByGroup,
  createLocalizedNetworkTools,
  filterNetworkTools,
  formatCount,
} from "./core/network-tools"

import type { NetworkToolGroupId, NetworkToolsMessages } from "./types"

type NetworkToolsClientProps = Readonly<{
  language: string
  messages: NetworkToolsMessages
}>

function replaceName(template: string, name: string) {
  return template.replace("{name}", name)
}

function NetworkToolsClient({ language, messages }: NetworkToolsClientProps) {
  const [query, setQuery] = useState("")
  const [activeGroup, setActiveGroup] = useState<
    NetworkToolGroupId | typeof ALL_GROUPS
  >(ALL_GROUPS)
  const deferredQuery = useDeferredValue(query)
  const tools = useMemo(
    () => createLocalizedNetworkTools(messages, language),
    [language, messages]
  )
  const groupCounts = useMemo(() => countNetworkToolsByGroup(tools), [tools])
  const filteredTools = useMemo(
    () =>
      filterNetworkTools(tools, {
        group: activeGroup,
        query: deferredQuery,
      }),
    [activeGroup, deferredQuery, tools]
  )
  const resultCount = formatCount(
    messages.resultCountTemplate,
    filteredTools.length,
    language
  )
  const isEmpty = filteredTools.length === 0

  return (
    <section className="flex flex-col gap-6" aria-live="polite">
      <ToolSurface className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label={messages.searchLabel}
              className="h-11 pl-10"
              placeholder={messages.searchLabel}
              title={messages.searchPlaceholder}
              value={query}
              onChange={(event) => {
                setQuery(event.currentTarget.value)
              }}
            />
          </div>

          {query ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setQuery("")
              }}
            >
              {messages.clearSearchLabel}
            </Button>
          ) : null}
        </div>

        <div className="flex flex-col gap-3">
          <ToggleGroup
            type="single"
            variant="outline"
            value={activeGroup}
            onValueChange={(value) => {
              setActiveGroup(
                value
                  ? (value as NetworkToolGroupId | typeof ALL_GROUPS)
                  : ALL_GROUPS
              )
            }}
            className="flex w-full flex-wrap justify-start gap-2"
            spacing={8}
          >
            <ToggleGroupItem value={ALL_GROUPS}>
              {messages.allGroupsLabel} ({tools.length})
            </ToggleGroupItem>
            {NETWORK_TOOL_GROUPS.map((group) => (
              <ToggleGroupItem key={group} value={group}>
                {messages.groups[group].label} ({groupCounts[group]})
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <p className="text-sm text-muted-foreground">{resultCount}</p>
        </div>
      </ToolSurface>

      {isEmpty ? (
        <Empty className="border bg-muted/30">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Search />
            </EmptyMedia>
            <EmptyTitle>{messages.emptyTitle}</EmptyTitle>
            <EmptyDescription>{messages.emptyDescription}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {NETWORK_TOOL_GROUPS.map((group) => {
            const groupTools = filteredTools.filter(
              (tool) => tool.group === group
            )

            if (groupTools.length === 0) {
              return null
            }

            return (
              <section key={group} className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-col gap-1">
                    <h2 className="font-heading text-lg leading-tight">
                      {messages.groups[group].label}
                    </h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {messages.groups[group].description}
                    </p>
                  </div>
                  <Badge variant="secondary">{groupTools.length}</Badge>
                </div>

                <div className="grid gap-3">
                  {groupTools.map((tool) => (
                    <a
                      key={tool.slug}
                      href={tool.href}
                      aria-label={replaceName(
                        messages.openToolLabel,
                        tool.name
                      )}
                      className="group block"
                    >
                      <ToolSurface className="flex h-full items-start gap-4 p-4 transition-colors group-hover:border-foreground/20 group-focus-visible:border-ring group-focus-visible:ring-3 group-focus-visible:ring-ring/50">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                          <Network />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="font-heading text-base leading-tight">
                              {tool.name}
                            </h3>
                            <ArrowRight className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                          </div>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {tool.description}
                          </p>
                        </div>
                      </ToolSurface>
                    </a>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default NetworkToolsClient
