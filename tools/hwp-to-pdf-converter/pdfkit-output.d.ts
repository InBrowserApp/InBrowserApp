declare module "pdfkit/output" {
  import type PDFDocument from "pdfkit"

  export function toBytes(
    document: PDFDocument
  ): Promise<Uint8Array<ArrayBuffer>>
}
