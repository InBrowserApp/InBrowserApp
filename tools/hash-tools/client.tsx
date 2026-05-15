import { useDeferredValue, useMemo, useState } from "react"

import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
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
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { ArrowRight, RefreshCcw, Search } from "@workspace/ui/icons"

import {
  HASH_TOOL_GROUPS,
  HASH_TOOLS,
  countHashToolsByGroup,
  filterHashTools,
  getHashToolHref,
  groupHashTools,
  isHashToolGroupFilter,
  type HashTool,
  type HashToolFilter,
  type HashToolGroupId,
  type HashToolKindId,
} from "./core/hash-tools"

type HashToolsMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  search: {
    label: string
    placeholder: string
    description: string
    clear: string
  }
  filters: {
    label: string
    all: string
    resultCount: string
    emptyTitle: string
    emptyDescription: string
    showAll: string
  }
  stats: {
    toolCount: string
    groupCount: string
    privacy: string
  }
  groups: Record<HashToolGroupId, { name: string; description: string }>
  kinds: Record<HashToolKindId, string>
  actions: {
    openTool: string
  }
  notes: {
    title: string
    body: string
  }
}>

type HashToolsClientProps = Readonly<{
  lang: string
  messages: HashToolsMessages
}>

function formatCount(template: string, count: number) {
  return template.replace("{count}", String(count))
}

function ToolCard({
  lang,
  messages,
  tool,
}: Readonly<{
  lang: string
  messages: HashToolsMessages
  tool: HashTool
}>) {
  return (
    <Card size="sm" className="h-full">
      <CardHeader>
        <CardTitle className="leading-tight">{tool.label}</CardTitle>
        <CardAction>
          <Badge variant="secondary">{messages.kinds[tool.kind]}</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-1.5">
        {tool.tags.slice(0, 4).map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </CardContent>
      <CardFooter className="border-t">
        <Button asChild size="sm" className="w-full">
          <a href={getHashToolHref(tool.slug, lang)}>
            {messages.actions.openTool}
            <ArrowRight data-icon="inline-end" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

function HashToolsClient({ lang, messages }: HashToolsClientProps) {
  const [query, setQuery] = useState("")
  const [selectedGroup, setSelectedGroup] = useState<HashToolFilter>("all")
  const deferredQuery = useDeferredValue(query)

  const countsByGroup = useMemo(() => countHashToolsByGroup(HASH_TOOLS), [])
  const filteredTools = useMemo(
    () =>
      filterHashTools(HASH_TOOLS, {
        query: deferredQuery,
        group: selectedGroup,
      }),
    [deferredQuery, selectedGroup]
  )
  const groupedTools = useMemo(
    () => groupHashTools(filteredTools),
    [filteredTools]
  )

  function handleGroupChange(value: string) {
    setSelectedGroup(isHashToolGroupFilter(value) ? value : "all")
  }

  function handleReset() {
    setQuery("")
    setSelectedGroup("all")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <Card size="sm">
          <CardHeader>
            <CardTitle>
              {formatCount(messages.stats.toolCount, HASH_TOOLS.length)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle>
              {formatCount(messages.stats.groupCount, HASH_TOOL_GROUPS.length)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle>{messages.stats.privacy}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>{messages.search.label}</CardTitle>
          <CardDescription>{messages.search.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="hash-tools-search">
                {messages.search.label}
              </FieldLabel>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  id="hash-tools-search"
                  type="search"
                  value={query}
                  placeholder={messages.search.placeholder}
                  autoComplete="off"
                  onChange={(event) => {
                    setQuery(event.target.value)
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={query.length === 0}
                  onClick={() => {
                    setQuery("")
                  }}
                >
                  <RefreshCcw data-icon="inline-start" />
                  {messages.search.clear}
                </Button>
              </div>
              <FieldDescription>
                {formatCount(
                  messages.filters.resultCount,
                  filteredTools.length
                )}
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel>{messages.filters.label}</FieldLabel>
              <ToggleGroup
                type="single"
                variant="outline"
                value={selectedGroup}
                aria-label={messages.filters.label}
                onValueChange={handleGroupChange}
                className="flex w-full flex-wrap justify-start"
              >
                <ToggleGroupItem value="all">
                  {messages.filters.all}
                </ToggleGroupItem>
                {HASH_TOOL_GROUPS.map((group) => (
                  <ToggleGroupItem key={group.id} value={group.id}>
                    {messages.groups[group.id].name}
                    <Badge variant="secondary">{countsByGroup[group.id]}</Badge>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>{messages.notes.title}</CardTitle>
          <CardDescription>{messages.notes.body}</CardDescription>
        </CardHeader>
      </Card>

      {filteredTools.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Search />
            </EmptyMedia>
            <EmptyTitle>{messages.filters.emptyTitle}</EmptyTitle>
            <EmptyDescription>
              {messages.filters.emptyDescription}
            </EmptyDescription>
          </EmptyHeader>
          <Button type="button" variant="outline" onClick={handleReset}>
            <RefreshCcw data-icon="inline-start" />
            {messages.filters.showAll}
          </Button>
        </Empty>
      ) : (
        <div className="flex flex-col gap-6">
          {groupedTools.map((entry) => (
            <section key={entry.group} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <h2 className="font-heading text-xl leading-tight">
                  {messages.groups[entry.group].name}
                </h2>
                <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                  {messages.groups[entry.group].description}
                </p>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {entry.tools.map((tool) => (
                  <li key={tool.slug}>
                    <ToolCard lang={lang} messages={messages} tool={tool} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

export default HashToolsClient
export type { HashToolsMessages }
