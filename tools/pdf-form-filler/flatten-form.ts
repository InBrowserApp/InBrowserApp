import {
  concatTransformationMatrix,
  drawObject,
  PDFArray,
  PDFBool,
  PDFDict,
  PDFDocument,
  PDFName,
  PDFNumber,
  PDFRef,
  PDFStream,
  PDFWidgetAnnotation,
  popGraphicsState,
  pushGraphicsState,
} from "pdf-lib"
import { AnnotationMode, AnnotationType, OPS, Util } from "pdfjs-dist"
import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist"

const ACRO_FORM = PDFName.of("AcroForm")
const SUBTYPE = PDFName.of("Subtype")
const WIDGET = PDFName.of("Widget")
// PDF annotation flags: Invisible (1), Hidden (2), and NoView (32).
const HIDDEN_ON_SCREEN = 1 | 2 | 32

function numbers(array: PDFArray) {
  return array
    .asArray()
    .map((_, index) => array.lookup(index, PDFNumber).asNumber())
}

function appearanceFor(widget: PDFWidgetAnnotation) {
  const { dict } = widget
  const appearances = dict.lookup(PDFName.of("AP"))
  if (!(appearances instanceof PDFDict)) return null
  let ref = appearances.get(PDFName.of("N"))
  const states = dict.context.lookup(ref)
  if (states instanceof PDFDict) {
    const state = widget.getAppearanceState()
    if (!state) return null
    ref = states.get(state)
  }
  const stream = dict.context.lookup(ref)
  if (!(stream instanceof PDFStream)) return null
  const bbox = stream.dict.lookup(PDFName.of("BBox"))
  if (!(bbox instanceof PDFArray)) return null

  const matrix = stream.dict.lookup(PDFName.of("Matrix"))
  const bounds: [number, number, number, number] = [
    Infinity,
    Infinity,
    -Infinity,
    -Infinity,
  ]
  Util.axialAlignedBoundingBox(
    numbers(bbox),
    matrix instanceof PDFArray ? numbers(matrix) : [1, 0, 0, 1, 0, 0],
    bounds
  )
  const [left, bottom, right, top] = bounds
  if (!bounds.every(Number.isFinite) || right <= left || top <= bottom)
    return null
  const { x, y, width, height } = widget.getRectangle()
  const sx = Math.abs(width) / (right - left)
  const sy = Math.abs(height) / (top - bottom)
  return {
    ref: ref instanceof PDFRef ? ref : dict.context.register(stream),
    sx,
    sy,
    tx: Math.min(x, x + width) - left * sx,
    ty: Math.min(y, y + height) - bottom * sy,
  }
}

async function renderWidgetLayer(
  page: PDFPageProxy,
  storage: PDFDocumentProxy["annotationStorage"],
  signal: AbortSignal
) {
  // PDF.js can draw entries when the form's own font cannot encode them and
  // saveDocument leaves the appearance for the viewer to generate.
  const annotations = (await page.getAnnotations({ intent: "display" })).filter(
    ({ annotationType }) => annotationType === AnnotationType.WIDGET
  )
  const widgets = new Set(annotations.map(({ id }) => id))
  signal.throwIfAborted()
  const size = page.getViewport({ scale: 1, rotation: 0 })
  const scale = Math.min(
    3,
    8192 / Math.max(size.width, size.height),
    Math.sqrt(16_000_000 / (size.width * size.height))
  )
  const viewport = page.getViewport({ scale, rotation: 0 })
  const canvas = document.createElement("canvas")
  canvas.width = Math.ceil(viewport.width)
  canvas.height = Math.ceil(viewport.height)
  // PDF.js creates an opaque context by default, which would cover the page.
  const canvasContext = canvas.getContext("2d", { alpha: true })
  if (!canvasContext)
    throw new Error("Could not create a transparent field layer")
  // Some form producers write a value without an appearance or NeedAppearances.
  // Let PDF.js render those existing values through the same path as live edits.
  const seeded = annotations.filter(
    ({ id, fieldType, fieldValue, hasAppearance }) =>
      !hasAppearance &&
      (fieldType === "Tx" || fieldType === "Ch") &&
      fieldValue?.length &&
      !storage.getRawValue(id)
  )
  let insideWidget = false
  try {
    for (const { id, fieldValue } of seeded) {
      storage.setValue(id, { value: fieldValue })
    }
    const task = page.render({
      canvas: null,
      canvasContext,
      viewport,
      transform: [
        canvas.width / viewport.width,
        0,
        0,
        canvas.height / viewport.height,
        0,
        0,
      ],
      annotationMode: AnnotationMode.ENABLE_STORAGE,
      background: "transparent",
      operationsFilter: (index, { fnArray, argsArray }) => {
        if (fnArray[index] === OPS.beginAnnotation) {
          insideWidget = widgets.has(argsArray[index][0])
        }
        const include = insideWidget
        if (fnArray[index] === OPS.endAnnotation) insideWidget = false
        return include
      },
    })
    const cancel = () => task.cancel()
    signal.addEventListener("abort", cancel, { once: true })
    try {
      await task.promise
    } finally {
      signal.removeEventListener("abort", cancel)
    }
    const png = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob)
        else reject(new Error("Could not render form fields"))
      }, "image/png")
    })
    return png.arrayBuffer()
  } finally {
    for (const { id } of seeded) storage.remove(id)
    canvas.width = canvas.height = 0
  }
}

export async function flattenForm(
  bytes: Uint8Array,
  source: PDFDocumentProxy,
  signal: AbortSignal
) {
  const pdf = await PDFDocument.load(bytes, { updateMetadata: false })
  const acroForm = pdf.catalog.lookup(ACRO_FORM)
  const needsAppearances =
    acroForm instanceof PDFDict &&
    acroForm.lookup(PDFName.of("NeedAppearances")) === PDFBool.True

  for (const [index, page] of pdf.getPages().entries()) {
    signal.throwIfAborted()
    const annotations = page.node.Annots()
    if (!annotations) continue
    const widgets = []
    for (let i = 0; i < annotations.size(); i++) {
      const annotation = annotations.lookup(i)
      if (annotation instanceof PDFDict && annotation.get(SUBTYPE) === WIDGET) {
        widgets.push({
          index: i,
          widget: PDFWidgetAnnotation.fromDict(annotation),
        })
      }
    }
    const visible = widgets.filter(
      ({ widget }) => !(widget.getFlags() & HIDDEN_ON_SCREEN)
    )
    if (visible.length) {
      const appearances = visible.map(({ widget }) => appearanceFor(widget))
      if (
        !needsAppearances &&
        appearances.every((appearance) => appearance !== null)
      ) {
        for (const { ref, sx, sy, tx, ty } of appearances) {
          const name = page.node.newXObject("FormField", ref)
          page.pushOperators(
            pushGraphicsState(),
            concatTransformationMatrix(sx, 0, 0, sy, tx, ty),
            drawObject(name),
            popGraphicsState()
          )
        }
      } else {
        const sourcePage = await source.getPage(index + 1)
        const image = await pdf.embedPng(
          await renderWidgetLayer(sourcePage, source.annotationStorage, signal)
        )
        const [x, y, right, top] = sourcePage.view as [
          number,
          number,
          number,
          number,
        ]
        page.drawImage(image, { x, y, width: right - x, height: top - y })
      }
    }
    for (const entry of widgets.reverse()) annotations.remove(entry.index)
  }
  pdf.catalog.delete(ACRO_FORM)
  return pdf.save({ updateFieldAppearances: false })
}
