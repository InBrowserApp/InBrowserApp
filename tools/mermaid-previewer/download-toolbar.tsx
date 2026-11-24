import type { PageSize } from "@workspace/svg-pdf"
import {
  PdfPageSizeSelect,
  type PdfPageSizeLabels,
} from "@workspace/ui/components/tool/pdf-page-size-select"
import { Button } from "@workspace/ui/components/ui/button"
import { Download, LoaderCircle } from "@workspace/ui/icons"

export type ExportFormat = "png" | "pdf"

interface Props {
  labels: { downloadPdf: string; downloadSvg: string; downloadPng: string }
  sizes?: PdfPageSizeLabels
  pageSize: PageSize
  setPageSize: (size: PageSize) => void
  url?: string
  filename: string
  exporting?: ExportFormat
  save: (format: ExportFormat) => Promise<void>
}

export function DownloadToolbar({
  labels: m,
  sizes,
  pageSize,
  setPageSize,
  url,
  filename,
  exporting,
  save,
}: Props) {
  const svgAction = (
    <>
      <Download data-icon="inline-start" aria-hidden="true" />
      {m.downloadSvg}
    </>
  )
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t px-3 py-3">
      {sizes && (
        <PdfPageSizeSelect
          labels={sizes}
          value={pageSize}
          onChange={setPageSize}
        />
      )}
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <Button
          variant={sizes ? "default" : "outline"}
          size="sm"
          disabled={!url || exporting !== undefined}
          aria-busy={exporting === "pdf"}
          onClick={() => void save("pdf")}
        >
          {exporting === "pdf" ? (
            <LoaderCircle
              data-icon="inline-start"
              className="motion-safe:animate-spin"
              aria-hidden="true"
            />
          ) : (
            <Download data-icon="inline-start" aria-hidden="true" />
          )}
          {m.downloadPdf}
        </Button>
        <Button
          asChild={Boolean(url)}
          variant="outline"
          size="sm"
          disabled={!url}
        >
          {url ? (
            <a
              href={url}
              download={`${filename}.svg`}
              data-astro-prefetch="false"
            >
              {svgAction}
            </a>
          ) : (
            svgAction
          )}
        </Button>
        {!sizes && (
          <Button
            variant="outline"
            size="sm"
            disabled={!url || exporting !== undefined}
            aria-busy={exporting === "png"}
            onClick={() => void save("png")}
          >
            {exporting === "png" ? (
              <LoaderCircle
                data-icon="inline-start"
                className="motion-safe:animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Download data-icon="inline-start" aria-hidden="true" />
            )}
            {m.downloadPng}
          </Button>
        )}
      </div>
    </div>
  )
}
