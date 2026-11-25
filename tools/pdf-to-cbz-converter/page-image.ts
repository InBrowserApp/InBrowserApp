import { AnnotationMode, OPS, Util } from "pdfjs-dist"
import type { PDFPageProxy } from "pdfjs-dist"

type PageImage = { id: string; width: number; height: number }

function near(a: number, b: number) {
  return Math.abs(a - b) <= 0.01
}

// Permit only an image draw and the graphics state operations that place it.
// Extra visible content, clipping, color changes or rotation need rendering.
export async function fullPageImage(
  page: PDFPageProxy
): Promise<PageImage | null> {
  if (page.rotate) return null
  const [left, bottom, right, top] = page.view as [
    number,
    number,
    number,
    number,
  ]
  const operators = await page.getOperatorList({
    annotationMode: AnnotationMode.ENABLE,
  })
  const { fnArray, argsArray, separateAnnots } =
    operators as typeof operators & {
      separateAnnots?: { form: boolean; canvas: boolean }
    }
  if (separateAnnots?.form || separateAnnots?.canvas) return null
  let transform = [1, 0, 0, 1, 0, 0]
  const saved: number[][] = []
  let image: PageImage | null = null
  for (const [index, op] of fnArray.entries()) {
    switch (op) {
      case OPS.dependency:
        break
      case OPS.save:
        saved.push(transform)
        break
      case OPS.restore:
        transform = saved.pop() ?? [1, 0, 0, 1, 0, 0]
        break
      case OPS.transform:
        transform = Util.transform(transform, argsArray[index] as number[])
        break
      case OPS.paintImageXObject: {
        if (image) return null
        const [id, width, height] = argsArray[index] as [string, number, number]
        const pageWidth = right - left
        const pageHeight = top - bottom
        const [a, b, c, d, x, y] = transform as [
          number,
          number,
          number,
          number,
          number,
          number,
        ]
        if (
          !near(a, pageWidth) ||
          !near(d, pageHeight) ||
          !near(b, 0) ||
          !near(c, 0) ||
          !near(x, left) ||
          !near(y, bottom) ||
          Math.abs((pageWidth * height) / pageHeight - width) > 1
        )
          return null
        image = { id, width, height }
        break
      }
      default:
        return null
    }
  }
  return image
}
