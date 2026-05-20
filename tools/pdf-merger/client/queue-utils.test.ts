import { afterEach, describe, expect, test, vi } from "vitest"

import {
  createErrorQueueItem,
  createQueueItem,
  createReadyQueueItem,
  moveQueueItem,
} from "./queue-utils"

function createPdfFile(name: string) {
  return new File([new Uint8Array([37, 80, 68, 70])], name, {
    lastModified: 1,
    type: "application/pdf",
  })
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe("pdf merger queue utils", () => {
  test("creates queue items with crypto ids and object URLs", () => {
    vi.spyOn(crypto, "randomUUID").mockReturnValue(
      "11111111-1111-4111-8111-111111111111"
    )
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:pdf")

    expect(createQueueItem(createPdfFile("scan.pdf"))).toMatchObject({
      id: "11111111-1111-4111-8111-111111111111",
      name: "scan.pdf",
      previewUrl: "blob:pdf",
      status: "reading",
    })
  })

  test("creates fallback ids when randomUUID is unavailable", () => {
    const originalRandomUUID = crypto.randomUUID

    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:pdf")
    Object.defineProperty(crypto, "randomUUID", {
      configurable: true,
      value: undefined,
    })

    expect(createQueueItem(createPdfFile("fallback.pdf")).id).toMatch(
      /^pdf-merger-/
    )

    Object.defineProperty(crypto, "randomUUID", {
      configurable: true,
      value: originalRandomUUID,
    })
  })

  test("transitions queue items to ready and error states", () => {
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:pdf")

    const item = createQueueItem(createPdfFile("scan.pdf"))
    expect(createReadyQueueItem(item, 3)).toMatchObject({
      pageCount: 3,
      status: "ready",
    })
    expect(
      createErrorQueueItem(item, new Error("encrypted-pdf"))
    ).toMatchObject({
      errorCode: "encrypted-pdf",
      pageCount: null,
      status: "error",
    })
    expect(createErrorQueueItem(item, new Error("plain"))).toMatchObject({
      errorCode: "invalid-pdf",
      status: "error",
    })
  })

  test("moves queue items by index", () => {
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:pdf")

    const first = createQueueItem(createPdfFile("first.pdf"))
    const second = createQueueItem(createPdfFile("second.pdf"))

    expect(
      moveQueueItem([first, second], 1, 0).map((item) => item.name)
    ).toEqual(["second.pdf", "first.pdf"])
    expect(moveQueueItem([first, second], 2, 0)).toHaveLength(2)
  })
})
