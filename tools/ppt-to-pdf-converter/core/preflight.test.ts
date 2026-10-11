import { readFileSync } from "node:fs"
import * as CFB from "cfb"
import { expect, test, vi } from "vitest"
import { preflight } from "./preflight"
import { ConversionError, failure } from "./errors"

vi.mock("cfb", async (original) => {
  const actual = await original<typeof import("cfb")>()
  return { ...actual, read: vi.fn(actual.read) }
})

const source = Uint8Array.from(
  readFileSync("tools/ppt-to-pdf-converter/fixtures/field-notes.ppt")
).buffer
function mutate(change: (container: CFB.CFB$Container) => void) {
  const container = CFB.read(new Uint8Array(source), { type: "array" })
  change(container)
  return Uint8Array.from(CFB.write(container, { type: "array" }) as Uint8Array)
    .buffer
}

test("accepts the original binary presentation and all legacy aliases by content", () => {
  expect(() => preflight(source)).not.toThrow()
})
test.each([new ArrayBuffer(0), new ArrayBuffer(512), source.slice(0, 513)])(
  "rejects unrelated and truncated input",
  (bytes) => {
    expect(() => preflight(bytes)).toThrow("invalid")
  }
)
test.each(["EncryptedSummary", "EncryptedPackage"])(
  "detects %s protection before starting the engine",
  (name) => {
    expect(() =>
      preflight(
        mutate((cfb) => CFB.utils.cfb_add(cfb, name, new Uint8Array([1])))
      )
    ).toThrow("protected")
  }
)
test("detects password protection in Current User", () => {
  const input = mutate((cfb) => {
    const entry = CFB.find(cfb, "Current User")!
    const bytes = Uint8Array.from(entry.content)
    new DataView(bytes.buffer).setUint32(12, 0xf3d1c4df, true)
    entry.content = bytes
  })
  expect(() => preflight(input)).toThrow("protected")
})
test.each(["Current User", "PowerPoint Document"])(
  "requires the %s stream",
  (name) => {
    expect(() =>
      preflight(mutate((cfb) => CFB.utils.cfb_del(cfb, name)))
    ).toThrow("invalid")
    expect(() =>
      preflight(mutate((cfb) => CFB.utils.cfb_add(cfb, name, new Uint8Array())))
    ).toThrow("invalid")
  }
)
test("maps allocation failures and preserves known failures", () => {
  for (const reason of [
    new RangeError("allocation failed"),
    "out of bounds",
    new Error("Array buffer allocation failed"),
  ])
    expect(failure(reason).code).toBe("resource")
  const original = new ConversionError("unsupported")
  expect(failure(original)).toBe(original)
  expect(failure(null).code).toBe("invalid")
})
test("reports resource exhaustion while inspecting a container", () => {
  const read = vi.mocked(CFB.read).mockImplementationOnce(() => {
    throw new RangeError("allocation failed")
  })
  try {
    expect(() => preflight(source)).toThrow("resource")
  } finally {
    read.mockClear()
  }
})

test("rejects a missing referenced picture stream instead of exporting a partial slide", () => {
  expect(() =>
    preflight(mutate((cfb) => CFB.utils.cfb_del(cfb, "Pictures")))
  ).toThrow("invalid")
})

test("inspects a container without an image stream", () => {
  const sourceContainer = CFB.read(new Uint8Array(source), { type: "array" })
  const container = CFB.utils.cfb_new()
  for (const name of ["Current User", "PowerPoint Document"])
    CFB.utils.cfb_add(container, name, CFB.find(sourceContainer, name)!.content)
  const bytes = Uint8Array.from(
    CFB.write(container, { type: "array" }) as Uint8Array
  ).buffer
  expect(() => preflight(bytes)).toThrow("invalid")
})
