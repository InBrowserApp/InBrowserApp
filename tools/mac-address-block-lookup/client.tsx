import { useDeferredValue, useId, useMemo } from "react"

import {
  filterAssignments,
  getBlockRange,
  makeToolHref,
  parseMacInput,
  readQuery,
  REGISTRIES,
  type MacQuery,
} from "@workspace/mac-address"
import { loadDatabase } from "@workspace/mac-address/load"
import { MacAddressDataStatus } from "@workspace/ui/components/tool/mac-address-data-status"
import { MacAddressPagination } from "@workspace/ui/components/tool/mac-address-pagination"
import { MacAddressRecords } from "@workspace/ui/components/tool/mac-address-records"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  Card,
  CardContent,
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
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@workspace/ui/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/ui/input-group"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { Blocks, Search } from "@workspace/ui/icons"
import { useToolQuery } from "@workspace/ui/lib/use-tool-query"
import { useToolResource } from "@workspace/ui/lib/use-tool-resource"
import BlockDetails from "./block-details"
import type English from "./messages/en.json"

const PAGE_SIZE = 20
const SLUG = "mac-address-block-lookup"

function MacAddressBlockLookupClient({
  language,
  messages,
}: Readonly<{ language: string; messages: typeof English }>) {
  const searchId = useId()
  const registryId = useId()
  const makeHref = (next: MacQuery) => makeToolHref(language, SLUG, next)
  const { query, update, shareUrl } = useToolQuery(readQuery, makeHref)
  const { data, error, loading, retry } = useToolResource(loadDatabase)
  const deferredQuery = useDeferredValue(query.q)
  const formatNumber = new Intl.NumberFormat(language).format
  const filtered = useMemo(
    () =>
      filterAssignments(data?.records ?? [], {
        query: deferredQuery,
        registry: query.registry,
      }),
    [data, deferredQuery, query.registry]
  )
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const page = Math.min(query.page, pageCount)
  const start = (page - 1) * PAGE_SIZE
  const pageRecords = filtered.slice(start, start + PAGE_SIZE)
  const summary = messages.pageSummary
    .replace("{start}", formatNumber(filtered.length === 0 ? 0 : start + 1))
    .replace("{end}", formatNumber(start + pageRecords.length))
    .replace("{total}", formatNumber(filtered.length))
  const parsed = parseMacInput(deferredQuery)
  const exact =
    parsed && filtered.find((record) => record.assignment === parsed.hex)
  const showAllocation =
    !exact ||
    filtered.some(
      (record) =>
        record.assignment !== exact.assignment ||
        record.registry !== exact.registry
    )

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <Card>
        <CardContent>
          <FieldGroup>
            <Field>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <FieldLabel htmlFor={searchId}>
                  {messages.blockSearchLabel}
                </FieldLabel>
                <ToolCopyButton
                  value={shareUrl}
                  copyLabel={messages.share}
                  copiedLabel={messages.copied}
                />
              </div>
              <InputGroup className="h-11">
                <InputGroupInput
                  id={searchId}
                  name="mac-block-search"
                  type="search"
                  dir="auto"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder={messages.blockPlaceholder}
                  value={query.q}
                  onChange={(event) =>
                    update({
                      ...query,
                      q: event.target.value,
                      org: "",
                      page: 1,
                    })
                  }
                />
                <InputGroupAddon>
                  <Search aria-hidden="true" />
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Field>
              <FieldTitle id={registryId}>{messages.registry}</FieldTitle>
              <ToggleGroup
                type="single"
                variant="outline"
                spacing={8}
                value={query.registry}
                aria-labelledby={registryId}
                className="flex-wrap"
                onValueChange={(value) => {
                  if (value)
                    update({
                      ...query,
                      registry: value as MacQuery["registry"],
                      page: 1,
                    })
                }}
              >
                <ToggleGroupItem value="all">
                  {messages.allRegistries}
                </ToggleGroupItem>
                {REGISTRIES.map((registry) => (
                  <ToggleGroupItem
                    key={registry}
                    value={registry}
                    translate="no"
                    dir="ltr"
                  >
                    {registry}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
      {data ? (
        <Card aria-busy={query.q !== deferredQuery}>
          <CardHeader>
            <CardTitle>
              <h2>
                {messages.assignmentCount.replace(
                  "{count}",
                  formatNumber(filtered.length)
                )}
              </h2>
            </CardTitle>
            {exact ? (
              <BlockDetails
                record={exact}
                language={language}
                messages={messages}
              />
            ) : null}
          </CardHeader>
          <CardContent className="px-0">
            {filtered.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Blocks aria-hidden="true" />
                  </EmptyMedia>
                  <EmptyTitle>{messages.noResults}</EmptyTitle>
                  <EmptyDescription>{messages.noResultsHint}</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <MacAddressRecords
                labels={messages}
                showAllocation={showAllocation}
                rows={pageRecords.map((record) => ({
                  key: `${record.registry}-${record.assignment}-${record.organization}-${record.address}`,
                  prefix: getBlockRange(record).prefix,
                  registry: record.registry,
                  organization: record.organization,
                  address: record.address,
                  blockHref: makeToolHref(language, SLUG, {
                    q: record.assignment,
                    registry: record.registry,
                  }),
                  organizationHref: makeToolHref(
                    language,
                    "mac-address-vendor-lookup",
                    { org: record.organization }
                  ),
                }))}
              />
            )}
          </CardContent>
          <CardFooter className="block">
            <MacAddressPagination
              summary={summary}
              previousLabel={messages.previous}
              nextLabel={messages.next}
              previousHref={
                page > 1 ? makeHref({ ...query, page: page - 1 }) : null
              }
              nextHref={
                page < pageCount ? makeHref({ ...query, page: page + 1 }) : null
              }
            />
          </CardFooter>
        </Card>
      ) : null}
      <MacAddressDataStatus
        loading={loading}
        error={error}
        onRetry={retry}
        labels={messages}
        updatedLabel={
          data
            ? messages.updated.replace(
                "{date}",
                new Intl.DateTimeFormat(language, {
                  dateStyle: "medium",
                  timeZone: "UTC",
                }).format(new Date(data.updatedAt))
              )
            : undefined
        }
      />
    </div>
  )
}

export default MacAddressBlockLookupClient
