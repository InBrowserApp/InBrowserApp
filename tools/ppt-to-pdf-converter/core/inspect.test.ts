import { expect, test } from "vitest"
import { inspect } from "./inspect"

const join = (...parts: Uint8Array[]) => {
  const output = new Uint8Array(
    parts.reduce((total, part) => total + part.length, 0)
  )
  let offset = 0
  for (const part of parts) {
    output.set(part, offset)
    offset += part.length
  }
  return output
}
const words = (...values: number[]) => {
  const output = new Uint8Array(values.length * 4)
  values.forEach((value, index) =>
    new DataView(output.buffer).setUint32(index * 4, value, true)
  )
  return output
}
const atom = (
  type: number,
  data = new Uint8Array(),
  instance = 0,
  container = false
) =>
  join(
    words((type << 16) | (instance << 4) | (container ? 15 : 0), data.length),
    data
  )
function fixture(
  options: {
    store?: boolean
    embedded?: boolean
    property?: number
    imageIndex?: number
    size?: number
    imageType?: number
    imageLength?: number
    entryType?: number
    entryLength?: number
    slides?: boolean
  } = {}
) {
  const pixels = new Uint8Array(options.imageLength ?? 25)
  if (pixels.length >= 25) pixels.set([137, 80, 78, 71, 13, 10, 26, 10], 17)
  const image = atom(options.imageType ?? 0xf01e, pixels)
  const entry = new Uint8Array(options.entryLength ?? 36)
  if (entry.length >= 36)
    new DataView(entry.buffer).setUint32(20, options.size ?? image.length, true)
  const store =
    options.store === false
      ? new Uint8Array()
      : atom(
          0xf001,
          atom(
            options.entryType ?? 0xf007,
            options.embedded ? join(entry, image) : entry
          ),
          1,
          true
        )
  const list =
    options.slides === false
      ? new Uint8Array()
      : atom(4080, join(atom(1011, words(2)), atom(4000)), 0, true)
  const root = atom(
    1000,
    join(
      list,
      atom(4080, atom(1011, words(3)), 1, true),
      atom(4080, atom(1011, words(99)), 2, true),
      store,
      atom(42)
    ),
    0,
    true
  )
  const property = new Uint8Array(6)
  const view = new DataView(property.buffer)
  view.setUint16(0, options.property ?? 0x4104, true)
  view.setUint32(2, options.imageIndex ?? 1, true)
  const slide = atom(
    1006,
    atom(0xf004, atom(0xf00b, property, 1), 0, true),
    0,
    true
  )
  const master = atom(1016, new Uint8Array(), 0, true)
  const directoryOffset = root.length + slide.length + master.length
  const directory = atom(
    6002,
    words((3 << 20) | 1, 0, root.length, root.length + slide.length)
  )
  const editOffset = directoryOffset + directory.length
  const edit = atom(4085, words(0, 0, 0, directoryOffset, 1))
  const document = join(root, slide, master, directory, edit)
  const current = new Uint8Array(20)
  new DataView(current.buffer).setUint32(16, editOffset, true)
  return {
    document,
    current,
    pictures: image,
    directoryOffset,
    editOffset,
    slideOffset: root.length,
  }
}
function run(source: ReturnType<typeof fixture>) {
  return inspect(source.document, source.current, source.pictures)
}
function set(source: Uint8Array, offset: number, value: number) {
  new DataView(source.buffer).setUint32(offset, value, true)
}

test.each([false, true])(
  "checks live slide and master picture references (embedded=%s)",
  (embedded) => {
    expect(run(fixture({ embedded }))).toMatchObject({ pages: 1 })
  }
)
test.each([
  { property: 0x0104, store: false },
  { property: 0xc104, store: false },
  { imageIndex: 0, store: false },
])("ignores scalar, complex and empty BLIP references", (options) => {
  expect(run(fixture(options))).toMatchObject({ pages: 1 })
})
test.each([
  { store: false },
  { imageIndex: 2 },
  { entryType: 42 },
  { entryLength: 2 },
  { imageType: 42 },
  { imageLength: 16 },
  { size: 999 },
])("rejects a missing or inconsistent required picture", (options) => {
  expect(() => run(fixture(options))).toThrow("unsupported")
})
test("rejects missing delayed picture bytes", () => {
  const source = fixture()
  source.pictures = new Uint8Array()
  expect(() => run(source)).toThrow("invalid")
})
test("rejects damaged record lengths and incomplete property lists", () => {
  const source = fixture()
  set(source.document, 4, source.document.length)
  expect(() => run(source)).toThrow("invalid")
  const truncated = fixture()
  // The property atom advertises two entries but contains only one.
  set(truncated.document, truncated.slideOffset + 16, (0xf00b << 16) | (2 << 4))
  expect(() => run(truncated)).toThrow("invalid")
  expect(() =>
    inspect(source.document, new Uint8Array(), source.pictures)
  ).toThrow("invalid")
})
test("rejects invalid current edits, unsupported directories and missing live objects", () => {
  const wrongEdit = fixture()
  set(wrongEdit.document, wrongEdit.editOffset, 42 << 16)
  expect(() => run(wrongEdit)).toThrow("invalid")
  const wrongDirectory = fixture()
  set(wrongDirectory.document, wrongDirectory.directoryOffset, 42 << 16)
  expect(() => run(wrongDirectory)).toThrow("unsupported")
  const missing = fixture()
  set(missing.document, missing.directoryOffset + 8, (3 << 20) | 2)
  expect(() => run(missing)).toThrow("invalid")
  const wrongRoot = fixture()
  set(wrongRoot.document, 0, (42 << 16) | 15)
  expect(() => run(wrongRoot)).toThrow("invalid")
  const scalarRoot = fixture()
  set(scalarRoot.document, 0, 1000 << 16)
  expect(() => run(scalarRoot)).toThrow("invalid")
  expect(() => run(fixture({ slides: false }))).toThrow("invalid")
})
test("resolves the latest saved persist map and rejects cyclic edit histories", () => {
  const source = fixture()
  const latestOffset = source.document.length
  source.document = join(
    source.document,
    atom(4085, words(0, 0, source.editOffset, source.directoryOffset, 1))
  )
  set(source.current, 16, latestOffset)
  expect(run(source)).toMatchObject({ pages: 1 })
  set(source.document, source.editOffset + 16, latestOffset)
  expect(() => run(source)).toThrow("invalid")
})

test("keeps native vector picture records for the office renderer", () => {
  const result = run(fixture({ imageType: 0xf01a, imageLength: 50 }))
  expect(result.pages).toBe(1)
  expect(result.images).toEqual([])
})
