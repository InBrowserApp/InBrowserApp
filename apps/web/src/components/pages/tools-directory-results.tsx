import type { MouseEvent, RefObject } from "react"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { LayoutGrid, Search } from "@workspace/ui/icons"
import { ToolDirectoryCard } from "@/components/pages/tool-directory-card"
import { ToolsDirectoryPagination } from "@/components/pages/tools-directory-pagination"
import { localizePath } from "@/lib/site"

import type { SiteLanguage } from "@/lib/site"
import type { ToolDirectoryPage } from "@/lib/tools-directory"

type ToolsDirectoryResultsProps = Readonly<{
  basePath: string
  browsePageNumber: number
  busy: boolean
  emptyRegistryDescription: string
  emptyRegistryTitle: string
  emptySearchDescription: string
  emptySearchTitle: string
  language: SiteLanguage
  onSearchPageChange: (
    event: MouseEvent<HTMLAnchorElement>,
    pageNumber: number
  ) => void
  page: ToolDirectoryPage
  query: string
  resultCount: string
  resultsStatusRef: RefObject<HTMLParagraphElement | null>
  toolsTitle: string
}>

function ToolsDirectoryResults({
  basePath,
  browsePageNumber,
  busy,
  emptyRegistryDescription,
  emptyRegistryTitle,
  emptySearchDescription,
  emptySearchTitle,
  language,
  onSearchPageChange,
  page,
  query,
  resultCount,
  resultsStatusRef,
  toolsTitle,
}: ToolsDirectoryResultsProps) {
  const isRegistryEmpty = !query && page.total === 0
  const isSearchEmpty = Boolean(query) && page.total === 0

  return (
    <div
      id="tool-directory-results"
      className="flex flex-col gap-6"
      aria-busy={busy}
    >
      {!isRegistryEmpty && !isSearchEmpty ? (
        <p
          ref={resultsStatusRef}
          role="status"
          tabIndex={-1}
          className="scroll-mt-6 text-sm text-muted-foreground tabular-nums outline-none"
          aria-atomic="true"
          aria-live="polite"
        >
          {resultCount}
        </p>
      ) : null}

      {isRegistryEmpty || isSearchEmpty ? (
        <Empty className="border bg-muted/30 py-12">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              {isRegistryEmpty ? (
                <LayoutGrid aria-hidden="true" />
              ) : (
                <Search aria-hidden="true" />
              )}
            </EmptyMedia>
            <EmptyTitle>
              {isRegistryEmpty ? emptyRegistryTitle : emptySearchTitle}
            </EmptyTitle>
            <EmptyDescription>
              {isRegistryEmpty
                ? emptyRegistryDescription
                : emptySearchDescription}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {page.entries.map((entry) => (
            <li key={entry.slug} className="min-w-0">
              <ToolDirectoryCard
                entry={entry}
                href={localizePath(`/tools/${entry.slug}`, language)}
              />
            </li>
          ))}
        </ul>
      )}

      {!isRegistryEmpty && !isSearchEmpty && page.pageCount > 1 ? (
        <ToolsDirectoryPagination
          basePath={basePath}
          browsePageNumber={browsePageNumber}
          currentPage={page.pageNumber}
          label={toolsTitle}
          language={language}
          pageCount={page.pageCount}
          query={query}
          onSearchPageChange={onSearchPageChange}
        />
      ) : null}
    </div>
  )
}

export { ToolsDirectoryResults }
