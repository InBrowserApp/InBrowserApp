import { openReader } from "@workspace/pdf-reader"
import type { Reader, ReaderState } from "@workspace/pdf-reader"
import { PasswordException } from "pdfjs-dist"
import type { PDFDocumentProxy } from "pdfjs-dist"

type FormProblem = "xfa" | "protected" | "noFields"

export class FormOpenError extends Error {
  constructor(readonly problem: FormProblem) {
    super(problem)
  }
}

export type OpenForm = {
  reader: Reader
  pdf: PDFDocumentProxy
}

async function checkForm(pdf: PDFDocumentProxy) {
  const { info } = await pdf.getMetadata()
  const { IsXFAPresent, EncryptFilterName } = info as {
    IsXFAPresent: boolean
    EncryptFilterName: string | null
  }
  if (IsXFAPresent) throw new FormOpenError("xfa")
  if (EncryptFilterName) throw new FormOpenError("protected")

  const fields = await pdf.getFieldObjects()
  const canFill = Array.from(fields?.values() ?? []).some((widgets) =>
    widgets.some((widget) => {
      const { type, hidden, editable, page } = widget as {
        type: string
        hidden: boolean
        editable: boolean
        page: number
      }
      return (
        editable &&
        !hidden &&
        page >= 0 &&
        ["text", "checkbox", "radiobutton", "combobox", "listbox"].includes(
          type
        )
      )
    })
  )
  if (!canFill) throw new FormOpenError("noFields")
}

export async function openForm(
  file: File,
  container: HTMLDivElement,
  signal: AbortSignal,
  onChange: (update: Partial<ReaderState>) => void,
  onError: () => void
): Promise<OpenForm> {
  let pdf!: PDFDocumentProxy
  try {
    const reader = await openReader({
      file,
      container,
      signal,
      onChange,
      onError,
      onPassword: () => {
        throw new FormOpenError("protected")
      },
      prepareForm: async (document) => {
        await checkForm(document)
        pdf = document
      },
    })
    return { reader, pdf }
  } catch (error) {
    if (error instanceof PasswordException) throw new FormOpenError("protected")
    throw error
  }
}
