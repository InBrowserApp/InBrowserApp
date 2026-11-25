import { OPS } from "pdfjs-dist"
import type { PDFPageProxy } from "pdfjs-dist"
import { expect, it } from "vitest"
import { fullPageImage } from "./page-image"

type Operator = [number, unknown[]]
const image: Operator[] = [
  [OPS.save, []],
  [OPS.transform, [300, 0, 0, 450, 20, 30]],
  [OPS.dependency, ["scan"]],
  [OPS.paintImageXObject, ["scan", 600, 900]],
  [OPS.restore, []],
]

function fixture(operators: Operator[], view = [20, 30, 320, 480], rotate = 0) {
  return {
    view,
    rotate,
    async getOperatorList() {
      return {
        fnArray: operators.map(([operator]) => operator),
        argsArray: operators.map(([, args]) => args),
      }
    },
  } as unknown as PDFPageProxy
}

it("recognizes an image covering the page at its original aspect ratio", async () => {
  await expect(fullPageImage(fixture(image))).resolves.toEqual({
    id: "scan",
    width: 600,
    height: 900,
  })
})

it("uses the composed page when graphics, text, or annotations are present", async () => {
  for (const operator of [OPS.stroke, OPS.showText, OPS.beginAnnotation]) {
    await expect(
      fullPageImage(fixture([...image, [operator, []]]))
    ).resolves.toBeNull()
  }
})

it("uses the composed page for cropped, rotated, or stretched scans", async () => {
  await expect(
    fullPageImage(fixture(image, [40, 30, 320, 480]))
  ).resolves.toBeNull()
  await expect(fullPageImage(fixture(image, undefined, 90))).resolves.toBeNull()
  const stretched: Operator[] = image.map(([operator, args]) =>
    operator === OPS.paintImageXObject
      ? [operator, ["scan", 600, 800]]
      : [operator, args]
  )
  await expect(fullPageImage(fixture(stretched))).resolves.toBeNull()
})
