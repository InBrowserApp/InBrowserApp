import { afterEach, describe, expect, test, vi } from "vitest"
import * as fileType from "file-type/core"
import {
  compareExtension,
  formatHex,
  getExtension,
  inspectFile,
  SAMPLE_BYTES,
} from "./inspect"

vi.mock("file-type/core", { spy: true })

afterEach(() => vi.restoreAllMocks())

const png = Uint8Array.from(
  atob(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGOo/w8AAgABf//RyUkAAAAASUVORK5CYII="
  ),
  (char) => char.charCodeAt(0)
)

describe("file signatures", () => {
  test("detects a renamed PNG from bytes even when browser MIME disagrees", async () => {
    const result = await inspectFile(
      new File([png], "photo.jpg", { type: "image/jpeg" })
    )
    expect(result).toMatchObject({
      detected: { ext: "png", mime: "image/png" },
      extension: "jpg",
      browserMime: "image/jpeg",
      status: "mismatch",
    })
    expect(result.hex).toContain("89 50 4E 47 0D 0A 1A 0A")
    expect(result.extensions).toContain("png")
  })

  test.each(["jpg", "jpeg", "jpe", "JPEG"])(
    "accepts the JPEG extension alias %s",
    async (extension) => {
      const result = await inspectFile(
        new File(
          [new Uint8Array([255, 216, 255, 224, 0, 16, 74, 70, 73, 70, 0, 1])],
          `photo.${extension}`
        )
      )
      expect(result.detected?.mime).toBe("image/jpeg")
      expect(result.status).toBe("match")
    }
  )

  test("detects PDF and filenames without extensions", async () => {
    const result = await inspectFile(new File(["%PDF-1.7\n"], "document"))
    expect(result.status).toBe("missing")
    expect(result.detected?.ext).toBe("pdf")
  })

  test("does not claim text is a signature match or override with browser MIME", async () => {
    const result = await inspectFile(
      new File(["plain text\n<script>alert(1)</script>"], "fake.png", {
        type: "image/png",
      })
    )
    expect(result.detected).toBeNull()
    expect(result.status).toBe("unknown")
    expect(result.extensions).toEqual([])
  })

  test("treats a generic XML signature in SVG as inconclusive", async () => {
    const result = await inspectFile(
      new File(
        ['<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg"/>'],
        "image.svg"
      )
    )
    expect(result.detected?.ext).toBe("xml")
    expect(result.status).toBe("container")
  })

  test("handles zero-byte files explicitly", async () => {
    const result = await inspectFile(new File([], "empty.bin"))
    expect(result.status).toBe("empty")
    expect(result.hex).toBe("")
  })

  test("keeps incomplete headers inspectable if the parser rejects them", async () => {
    vi.mocked(fileType.fileTypeFromBuffer).mockRejectedValueOnce(
      new Error("End of stream")
    )
    const result = await inspectFile(
      new File([png.subarray(0, 12)], "partial.png")
    )
    expect(result.detected).toBeNull()
    expect(result.status).toBe("unknown")
    expect(result.hex).toContain("89 50 4E 47")
  })

  test("uses the detected extension when mime-db has no entry", async () => {
    vi.mocked(fileType.fileTypeFromBuffer).mockResolvedValueOnce({
      ext: "png",
      mime: "application/x-new-format",
    } as fileType.FileTypeResult)
    const result = await inspectFile(new File([png], "image.png"))
    expect(result.extensions).toEqual(["png"])
  })

  test("reads a bounded slice rather than the entire file", async () => {
    const file = new File([png, new Uint8Array(SAMPLE_BYTES * 2)], "large.png")
    const slice = vi.spyOn(file, "slice")
    const wholeFile = vi.spyOn(file, "arrayBuffer")
    const result = await inspectFile(file)
    expect(slice).toHaveBeenCalledExactlyOnceWith(0, SAMPLE_BYTES)
    expect(wholeFile).not.toHaveBeenCalled()
    expect(result.fileSize).toBe(file.size)
    expect(result.hex.split("\n")).toHaveLength(16)
  })

  test("propagates read errors so the UI can offer a retry", async () => {
    const file = new File([png], "unreadable.png")
    vi.spyOn(file, "slice").mockImplementation(() => {
      throw new Error("Read failed")
    })
    await expect(inspectFile(file)).rejects.toThrow("Read failed")
  })
})

describe("extension comparison", () => {
  const zip = { ext: "zip", mime: "application/zip" }
  test.each(["docx", "xlsx", "epub", "jar", "apk", "pages"])(
    "does not assume a %s container is mislabeled",
    (extension) => {
      expect(compareExtension(extension, zip, ["zip"])).toBe("container")
    }
  )
  test("still flags a PNG filename for a ZIP signature", () => {
    expect(compareExtension("png", zip, ["zip"])).toBe("mismatch")
  })
  test("matches normal ZIP names before considering derived formats", () => {
    expect(compareExtension("zip", zip, ["zip"])).toBe("match")
  })
  test("handles formats outside the container map", () => {
    expect(
      compareExtension("jpg", { ext: "png", mime: "image/png" }, ["png"])
    ).toBe("mismatch")
  })
  test.each([
    ["unknown", null, "unknown"],
    ["", zip, "missing"],
  ] as const)(
    "classifies %s without guessing",
    (extension, detected, expected) => {
      expect(compareExtension(extension, detected, ["zip"])).toBe(expected)
    }
  )
  test.each([
    ["photo.JPEG", "jpeg"],
    ["archive.tar.gz", "gz"],
    ["README", ""],
    [".gitignore", ""],
    ["file.", ""],
    [".hidden.png", "png"],
    ["", ""],
  ])("extracts %s", (name, extension) =>
    expect(getExtension(name)).toBe(extension)
  )
})

describe("hex preview", () => {
  test("shows offsets, uppercase bytes and printable ASCII only", () => {
    const hex = formatHex(new Uint8Array([0, 31, 32, 65, 126, 127, 255]))
    expect(hex).toBe(
      "00000000  00 1F 20 41 7E 7F FF                             |.. A~..|"
    )
    expect(formatHex(new Uint8Array())).toBe("")
  })
  test("caps at 256 bytes and uses hexadecimal offsets", () => {
    const rows = formatHex(new Uint8Array(300).fill(65)).split("\n")
    expect(rows).toHaveLength(16)
    expect(rows[1]).toMatch(/^00000010  /)
    expect(rows[15]).toMatch(/^000000F0  /)
    expect(rows[0]).toContain("|AAAAAAAAAAAAAAAA|")
  })
})
