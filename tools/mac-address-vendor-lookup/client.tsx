import { useDeferredValue, useId, useMemo } from "react"

import {
  filterAssignments,
  getBlockRange,
  getOrganizations,
  makeToolHref,
  readQuery,
  type MacQuery,
} from "@workspace/mac-address"
import { loadDatabase } from "@workspace/mac-address/load"
import { MacAddressDataStatus } from "@workspace/ui/components/tool/mac-address-data-status"
import { MacAddressNavigation } from "@workspace/ui/components/tool/mac-address-navigation"
import { MacAddressPagination } from "@workspace/ui/components/tool/mac-address-pagination"
import { MacAddressRecords } from "@workspace/ui/components/tool/mac-address-records"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
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
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/ui/input-group"
import { Building2, Search } from "@workspace/ui/icons"
import { useToolQuery } from "@workspace/ui/lib/use-tool-query"
import { useToolResource } from "@workspace/ui/lib/use-tool-resource"
import OrganizationList from "./organization-list"
import RegistryFilter from "./registry-filter"
import type English from "./messages/en.json"

const PAGE_SIZE = 20
const SLUG = "mac-address-vendor-lookup"

function MacAddressVendorLookupClient({
  language,
  messages,
}: Readonly<{ language: string; messages: typeof English }>) {
  const searchId = useId()
  const makeHref = (next: MacQuery) => makeToolHref(language, SLUG, next)
  const { query, update, shareUrl } = useToolQuery(readQuery, makeHref)
  const { data, error, loading, retry } = useToolResource(loadDatabase)
  const deferredQuery = useDeferredValue(query.q)
  const formatNumber = new Intl.NumberFormat(language).format
  const registryRecords = useMemo(
    () => filterAssignments(data?.records ?? [], { registry: query.registry }),
    [data, query.registry]
  )
  const organizations = useMemo(
    () => (query.org ? [] : getOrganizations(registryRecords, deferredQuery)),
    [registryRecords, deferredQuery, query.org]
  )
  const organizationRecords = useMemo(
    () =>
      query.org
        ? filterAssignments(registryRecords, {
            organization: query.org,
            query: deferredQuery,
          })
        : [],
    [registryRecords, deferredQuery, query.org]
  )
  const addresses = useMemo(() => {
    const addresses = new Map<string, string>()
    const search = deferredQuery.trim().toLowerCase()
    for (const record of registryRecords) {
      const current = addresses.get(record.organization)
      const matches =
        search !== "" && record.address.toLowerCase().includes(search)
      if (!current || (matches && !current.toLowerCase().includes(search)))
        addresses.set(record.organization, record.address)
    }
    return addresses
  }, [registryRecords, deferredQuery])
  const organizationTotal = useMemo(() => {
    return new Set((data?.records ?? []).map((record) => record.organization))
      .size
  }, [data])
  const total = query.org ? organizationRecords.length : organizations.length
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const page = Math.min(query.page, pageCount)
  const start = (page - 1) * PAGE_SIZE
  const summary = messages.pageSummary
    .replace("{start}", formatNumber(total === 0 ? 0 : start + 1))
    .replace("{end}", formatNumber(Math.min(start + PAGE_SIZE, total)))
    .replace("{total}", formatNumber(total))
  const navItems = [
    {
      key: "lookup" as const,
      label: messages.lookup,
      href: makeToolHref(language, "mac-address-lookup"),
    },
    {
      key: "blocks" as const,
      label: messages.blocks,
      href: makeToolHref(language, "mac-address-block-lookup"),
    },
    {
      key: "vendors" as const,
      label: messages.vendors,
      href: makeToolHref(language, SLUG),
    },
  ]

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <MacAddressNavigation active="vendors" items={navItems} />
        <ToolCopyButton
          value={shareUrl}
          copyLabel={messages.share}
          copiedLabel={messages.copied}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{messages.vendors}</CardTitle>
          <CardDescription dir="auto">{messages.registrySizes}</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={searchId}>
                {messages.vendorSearchLabel}
              </FieldLabel>
              <InputGroup className="h-11">
                <InputGroupInput
                  id={searchId}
                  name="mac-organization-search"
                  type="search"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder={messages.vendorPlaceholder}
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
            <RegistryFilter
              value={query.registry}
              onChange={(registry) => update({ ...query, registry, page: 1 })}
              messages={messages}
            />
          </FieldGroup>
        </CardContent>
      </Card>
      {data ? (
        <Card aria-busy={query.q !== deferredQuery}>
          <CardHeader>
            <CardTitle>
              <h2 className="wrap-anywhere">
                {query.org
                  ? messages.organizationBlocks.replace(
                      "{organization}",
                      query.org
                    )
                  : messages.organizationCount.replace(
                      "{count}",
                      formatNumber(total)
                    )}
              </h2>
            </CardTitle>
            {query.org ? (
              <CardDescription className="flex flex-wrap items-center justify-between gap-3">
                <span>
                  {messages.assignmentCount.replace(
                    "{count}",
                    formatNumber(total)
                  )}
                </span>
                <Button asChild variant="outline">
                  <a href={makeHref({ ...query, org: "", page: 1 })}>
                    {messages.clearOrganization}
                  </a>
                </Button>
              </CardDescription>
            ) : null}
          </CardHeader>
          <CardContent className="px-0">
            {total === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Building2 aria-hidden="true" />
                  </EmptyMedia>
                  <EmptyTitle>{messages.noResults}</EmptyTitle>
                  <EmptyDescription>{messages.noResultsHint}</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : query.org ? (
              <MacAddressRecords
                labels={messages}
                rows={organizationRecords
                  .slice(start, start + PAGE_SIZE)
                  .map((record) => ({
                    key: `${record.registry}-${record.assignment}-${record.organization}-${record.address}`,
                    prefix: getBlockRange(record).prefix,
                    registry: record.registry,
                    organization: record.organization,
                    address: record.address,
                    blockHref: makeToolHref(
                      language,
                      "mac-address-block-lookup",
                      { q: record.assignment, registry: record.registry }
                    ),
                    organizationHref: makeHref({
                      ...query,
                      org: record.organization,
                      q: "",
                      page: 1,
                    }),
                  }))}
              />
            ) : (
              <OrganizationList
                organizations={organizations.slice(start, start + PAGE_SIZE)}
                addresses={addresses}
                language={language}
                messages={messages}
                makeHref={(organization) =>
                  makeHref({ ...query, org: organization, q: "", page: 1 })
                }
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
        summary={
          data
            ? messages.dataSummary
                .replace("{assignments}", formatNumber(data.records.length))
                .replace("{organizations}", formatNumber(organizationTotal))
            : undefined
        }
      />
    </div>
  )
}

export default MacAddressVendorLookupClient
