import type { MouseEvent } from "react"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@workspace/ui/components/ui/pagination"
import { ChevronLeft, ChevronRight } from "@workspace/ui/icons"
import {
  getLocalizedToolsPagePath,
  getPaginationItems,
} from "@/lib/tools-directory"

import type { SiteLanguage } from "@/lib/site"

type ToolsDirectoryPaginationProps = Readonly<{
  basePath: string
  browsePageNumber: number
  currentPage: number
  label: string
  language: SiteLanguage
  onSearchPageChange: (
    event: MouseEvent<HTMLAnchorElement>,
    pageNumber: number
  ) => void
  pageCount: number
  query: string
}>

function getSearchPageHref(
  browsePath: string,
  query: string,
  pageNumber: number
) {
  const params = new URLSearchParams({ query })

  if (pageNumber > 1) {
    params.set("page", String(pageNumber))
  }

  return `${browsePath}?${params.toString()}`
}

function ToolsDirectoryPagination({
  basePath,
  browsePageNumber,
  currentPage,
  label,
  language,
  onSearchPageChange,
  pageCount,
  query,
}: ToolsDirectoryPaginationProps) {
  const numberFormatter = new Intl.NumberFormat(language)
  const browsePath = getLocalizedToolsPagePath(basePath, browsePageNumber)
  const getHref = (pageNumber: number) =>
    query
      ? getSearchPageHref(browsePath, query, pageNumber)
      : getLocalizedToolsPagePath(basePath, pageNumber)
  const getLabel = (pageNumber: number) =>
    `${label} ${numberFormatter.format(pageNumber)}`
  const handleClick = (
    event: MouseEvent<HTMLAnchorElement>,
    pageNumber: number
  ) => {
    if (query) {
      onSearchPageChange(event, pageNumber)
    }
  }

  return (
    <Pagination aria-label={label}>
      <PaginationContent>
        {currentPage > 1 ? (
          <PaginationItem>
            <PaginationLink
              aria-label={getLabel(currentPage - 1)}
              href={getHref(currentPage - 1)}
              rel="prev"
              onClick={(event) => handleClick(event, currentPage - 1)}
            >
              <ChevronLeft aria-hidden="true" className="rtl:rotate-180" />
            </PaginationLink>
          </PaginationItem>
        ) : null}

        {getPaginationItems(currentPage, pageCount).map((item, index) =>
          item === null ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                aria-label={getLabel(item)}
                href={getHref(item)}
                isActive={item === currentPage}
                onClick={(event) => handleClick(event, item)}
              >
                {numberFormatter.format(item)}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        {currentPage < pageCount ? (
          <PaginationItem>
            <PaginationLink
              aria-label={getLabel(currentPage + 1)}
              href={getHref(currentPage + 1)}
              rel="next"
              onClick={(event) => handleClick(event, currentPage + 1)}
            >
              <ChevronRight aria-hidden="true" className="rtl:rotate-180" />
            </PaginationLink>
          </PaginationItem>
        ) : null}
      </PaginationContent>
    </Pagination>
  )
}

export { ToolsDirectoryPagination }
