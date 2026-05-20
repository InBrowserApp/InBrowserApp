import { degrees, PDFDocument } from "pdf-lib"

type PdfPageEntry = Readonly<{
  height: number
  id: string
  rotation: number
  sourcePageNumber: number
  width: number
}>

type PdfInspection = Readonly<{
  pageCount: number
  pages: readonly PdfPageEntry[]
}>

type OrganizedPdfResult = Readonly<{
  bytes: Uint8Array
  fileName: string
  pageCount: number
}>

type PdfPagePlan = Readonly<{
  rotation: number
  sourcePageNumber: number
}>

const PDF_EXTENSION = /\.pdf$/i

function isPdfFile(file: Pick<File, "name" | "type">) {
  return file.type === "application/pdf" || PDF_EXTENSION.test(file.name)
}

function normalizeRotation(value: number) {
  const normalized = value % 360
  return normalized < 0 ? normalized + 360 : normalized
}

function formatPageSize(width: number, height: number) {
  return `${formatNumber(width)} x ${formatNumber(height)} pt`
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return "0 B"
  }

  if (bytes < 1024) {
    return `${bytes} B`
  }

  const units = ["KB", "MB", "GB"] as const
  let value = bytes / 1024
  let unitIndex = 0

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }

  return `${value >= 10 ? value.toFixed(1) : value.toFixed(2)} ${
    units[unitIndex]
  }`
}

function formatNumber(value: number) {
  return Number.isInteger(value)
    ? String(value)
    : value.toFixed(2).replace(/\.?0+$/, "")
}

function createOutputFileName(fileName: string) {
  const baseName = fileName.trim().replace(PDF_EXTENSION, "") || "document"
  return `${baseName}-organized.pdf`
}

function createPdfBlob(bytes: Uint8Array) {
  return new Blob([bytes as Uint8Array<ArrayBuffer>], {
    type: "application/pdf",
  })
}

function isEncryptedPdfError(error: unknown) {
  return error instanceof Error && error.name === "EncryptedPDFError"
}

function movePage(
  pages: readonly PdfPageEntry[],
  fromIndex: number,
  toIndex: number
) {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= pages.length ||
    toIndex >= pages.length
  ) {
    return [...pages]
  }

  const nextPages = [...pages]
  const [movedPage] = nextPages.splice(fromIndex, 1) as [PdfPageEntry]

  nextPages.splice(toIndex, 0, movedPage)
  return nextPages
}

function rotatePage(
  pages: readonly PdfPageEntry[],
  pageId: string,
  delta: number
) {
  return pages.map((page) =>
    page.id === pageId
      ? { ...page, rotation: normalizeRotation(page.rotation + delta) }
      : page
  )
}

function removePage(pages: readonly PdfPageEntry[], pageId: string) {
  return pages.filter((page) => page.id !== pageId)
}

async function inspectPdf(file: File): Promise<PdfInspection> {
  const buffer = await file.arrayBuffer()

  try {
    const document = await PDFDocument.load(buffer)
    const pages = document.getPages().map((page, index) => {
      const size = page.getSize()

      return {
        height: size.height,
        id: `page-${index + 1}`,
        rotation: normalizeRotation(page.getRotation().angle),
        sourcePageNumber: index + 1,
        width: size.width,
      }
    })

    return {
      pageCount: pages.length,
      pages,
    }
  } catch (error) {
    if (isEncryptedPdfError(error)) {
      throw new Error("ENCRYPTED_PDF")
    }

    throw new Error("INVALID_PDF")
  }
}

async function organizePdf(
  file: File,
  pages: readonly PdfPagePlan[]
): Promise<OrganizedPdfResult> {
  if (!pages.length) {
    throw new Error("NO_PAGES")
  }

  try {
    const sourceBytes = await file.arrayBuffer()
    const sourceDocument = await PDFDocument.load(sourceBytes)
    const outputDocument = await PDFDocument.create()
    const sourcePageCount = sourceDocument.getPageCount()
    const sourceIndices = pages.map((page) => {
      if (
        !Number.isInteger(page.sourcePageNumber) ||
        page.sourcePageNumber < 1 ||
        page.sourcePageNumber > sourcePageCount
      ) {
        throw new Error("INVALID_PAGE_PLAN")
      }

      return page.sourcePageNumber - 1
    })
    const copiedPages = await outputDocument.copyPages(
      sourceDocument,
      sourceIndices
    )

    copiedPages.forEach((page, index) => {
      const plan = pages[index] as PdfPagePlan
      page.setRotation(degrees(normalizeRotation(plan.rotation)))

      outputDocument.addPage(page)
    })

    return {
      bytes: await outputDocument.save(),
      fileName: createOutputFileName(file.name),
      pageCount: pages.length,
    }
  } catch (error) {
    if (isEncryptedPdfError(error)) {
      throw new Error("ENCRYPTED_PDF")
    }

    throw new Error("EXPORT_FAILED")
  }
}

export {
  createOutputFileName,
  createPdfBlob,
  formatBytes,
  formatPageSize,
  inspectPdf,
  isPdfFile,
  movePage,
  normalizeRotation,
  organizePdf,
  removePage,
  rotatePage,
}
export type { PdfPageEntry }
