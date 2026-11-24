import { readFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import {
  PDFArray,
  PDFBool,
  PDFDict,
  PDFDocument,
  PDFName,
  PDFString,
} from "pdf-lib"
import { describe, expect, test, vi } from "vitest"
import { AnnotationType } from "pdfjs-dist"
import type { PDFDocumentProxy } from "pdfjs-dist"
import { flattenForm } from "./flatten-form"

vi.mock("pdfjs-dist", async () => import("pdfjs-dist/legacy/build/pdf.mjs"))

const acroForm = PDFName.of("AcroForm")
const sample = join(dirname(fileURLToPath(import.meta.url)), "sample-form.pdf")
const live = () => new AbortController().signal

describe("flattenForm", () => {
  test("preserves page content, checked appearances and links while removing the fields", async () => {
    const pdf = await PDFDocument.load(await readFile(sample))
    const first = pdf.getPage(0)
    const link = pdf.context.obj({
      Type: "Annot",
      Subtype: "Link",
      Rect: [10, 10, 20, 20],
      A: { S: "URI", URI: PDFString.of("https://inbrowser.app/") },
    })
    first.node.addAnnot(pdf.context.register(link))
    const form = pdf.getForm()
    form.getTextField("Full name").setText("Ada Chen")
    form.getDropdown("Preferred session").select("Afternoon session")
    form.getRadioGroup("Attendance").select("Online")
    form.getCheckBox("Send me workshop updates").check()
    form.getTextField("Email address").acroField.getWidgets()[0]!.setFlags(2)
    const originalContent = (first.node.Contents() as PDFArray)
      .asArray()
      .map(String)
    const source = { getPage: vi.fn() } as unknown as PDFDocumentProxy

    const output = await PDFDocument.load(
      await flattenForm(await pdf.save(), source, live())
    )
    expect(source.getPage).not.toHaveBeenCalled()
    expect(output.getPageCount()).toBe(2)
    expect(output.catalog.has(acroForm)).toBe(false)
    const flatFirst = output.getPage(0)
    expect(
      (flatFirst.node.Contents() as PDFArray).asArray().map(String)
    ).toEqual(expect.arrayContaining(originalContent))
    expect(flatFirst.node.Annots()?.size()).toBe(1)
    const remaining = flatFirst.node.Annots()?.lookup(0, PDFDict)
    expect(remaining?.get(PDFName.of("Subtype"))).toBe(PDFName.of("Link"))
    expect(output.getPage(1).node.Annots()?.size()).toBe(0)
    const resources = flatFirst.node
      .Resources()
      ?.lookup(PDFName.of("XObject"), PDFDict)
    expect(resources?.keys()).toHaveLength(5)
  })

  test("uses the live widget render when a viewer needs to generate appearances", async () => {
    const pdf = await PDFDocument.load(await readFile(sample))
    pdf.catalog
      .lookup(acroForm, PDFDict)
      .set(PDFName.of("NeedAppearances"), PDFBool.True)
    const controller = new AbortController()
    const getContext = vi.spyOn(HTMLCanvasElement.prototype, "getContext")
    getContext.mockReturnValue({} as CanvasRenderingContext2D)
    const page = {
      getAnnotations: vi.fn().mockResolvedValue([
        {
          annotationType: AnnotationType.WIDGET,
          id: "filled",
          fieldType: "Tx",
          fieldValue: "Prefilled",
          hasAppearance: false,
        },
      ]),
      getViewport: vi.fn().mockReturnValue({ width: 100, height: 100 }),
      render: vi.fn().mockImplementation(() => {
        controller.abort()
        return {
          promise: Promise.reject(new Error("render interrupted")),
          cancel: vi.fn(),
        }
      }),
    }
    const storage = { getRawValue: vi.fn(), setValue: vi.fn(), remove: vi.fn() }
    const source = {
      getPage: vi.fn().mockResolvedValue(page),
      annotationStorage: storage,
    } as unknown as PDFDocumentProxy

    await expect(
      flattenForm(await pdf.save(), source, controller.signal)
    ).rejects.toThrow("render interrupted")
    expect(source.getPage).toHaveBeenCalledWith(1)
    expect(storage.setValue).toHaveBeenCalledWith("filled", {
      value: "Prefilled",
    })
    expect(storage.remove).toHaveBeenCalledWith("filled")
    expect(page.render).toHaveBeenCalledWith(
      expect.objectContaining({
        canvas: null,
        canvasContext: expect.any(Object),
        background: "transparent",
        operationsFilter: expect.any(Function),
      })
    )
    getContext.mockRestore()
  })
})
