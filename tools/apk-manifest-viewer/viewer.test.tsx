// @vitest-environment jsdom
import { readFileSync } from "node:fs"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { openArchive } from "@workspace/archive/archive"
import { afterAll, afterEach, beforeAll, expect, test, vi } from "vitest"
import { decodeBinaryXml } from "./binary-xml"
import Client from "./client"
import m from "./messages/en.json"
import { openManifest, readManifestBytes } from "./read"

const android = "http://schemas.android.com/apk/res/android"
const apk = readFileSync("tools/apk-manifest-viewer/fixtures/trail-notes.apk")
const textManifest = readFileSync(
  "tools/apk-manifest-viewer/fixtures/AndroidManifest.xml",
  "utf8"
)
const fixture = () => new File([apk], "trail-notes.apk")
const originalBuffer = Object.getOwnPropertyDescriptor(
  Blob.prototype,
  "arrayBuffer"
)

beforeAll(() => {
  Object.defineProperty(Blob.prototype, "arrayBuffer", {
    configurable: true,
    value(this: Blob) {
      return new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as ArrayBuffer)
        reader.onerror = reject
        reader.readAsArrayBuffer(this)
      })
    },
  })
})
afterEach(cleanup)
afterAll(() => {
  if (originalBuffer)
    Object.defineProperty(Blob.prototype, "arrayBuffer", originalBuffer)
  else Reflect.deleteProperty(Blob.prototype, "arrayBuffer")
})

async function compiledManifest() {
  const archive = await openArchive(fixture())
  try {
    const blob = await archive.readEntry("AndroidManifest.xml")
    return new Uint8Array(await blob.arrayBuffer())
  } finally {
    await archive.dispose()
  }
}

test("reads the manifest from an AAPT2-built APK and exports valid structured XML", async () => {
  const output = await openManifest(fixture())
  expect(output).toMatchObject({
    packageName: "org.example.trailnotes",
    versionName: "1.3.0",
    versionCode: "13",
    minSdk: "24",
    targetSdk: "35",
    permissions: ["android.permission.INTERNET", "android.permission.CAMERA"],
  })
  const doc = new DOMParser().parseFromString(output!.xml, "application/xml")
  expect(
    doc.querySelector("activity")?.getAttributeNS(android, "exported")
  ).toBe("true")
  expect(
    doc.querySelector("application")?.getAttributeNS(android, "allowBackup")
  ).toBe("false")
  expect(
    doc.querySelector("application")?.getAttributeNS(android, "theme")
  ).toMatch(/^@0x[a-f0-9]{8}$/)
  expect(
    doc
      .querySelector("intent-filter > category")
      ?.getAttributeNS(android, "name")
  ).toBe("android.intent.category.LAUNCHER")
  expect(output!.xml).toContain("\n  <uses-sdk")
})

test("opens an extracted binary manifest and accepts an empty ZIP only as missing", async () => {
  const binary = new File([await compiledManifest()], "AndroidManifest.xml")
  expect((await openManifest(binary))?.packageName).toBe(
    "org.example.trailnotes"
  )
  const emptyZip = Uint8Array.from(
    atob("UEsFBgAAAAAAAAAAAAAAAAAAAAAAAA=="),
    (char) => char.charCodeAt(0)
  )
  await expect(
    openManifest(new File([emptyZip], "empty.apk"))
  ).resolves.toBeNull()
})

test("reads text XML, de-duplicates declared permissions and normalizes UTF-16 downloads to UTF-8", async () => {
  const xml =
    '<?xml version="1.0" encoding="UTF-16"?><manifest xmlns:android="' +
    android +
    '" package="example.text"><uses-permission android:name="android.permission.INTERNET"/><uses-permission-sdk-m android:name="android.permission.INTERNET"/><uses-permission/></manifest>'
  for (const encoding of ["utf16le", "utf16be"] as const) {
    const buffer = Buffer.from("\uFEFF" + xml, "utf16le")
    if (encoding === "utf16be") buffer.swap16()
    const result = readManifestBytes(buffer)
    expect(result.packageName).toBe("example.text")
    expect(result.permissions).toEqual(["android.permission.INTERNET"])
    expect(result.xml).toContain('encoding="utf-8"')
  }
  expect(
    (await openManifest(new File([textManifest], "AndroidManifest.xml")))
      ?.versionName
  ).toBe("1.3.0")
  expect(() =>
    readManifestBytes(new TextEncoder().encode("<example/>"))
  ).toThrow("Missing manifest element")
})

test("rejects truncated binary XML and invalid chunk/attribute boundaries", async () => {
  const raw = await compiledManifest()
  expect(() => decodeBinaryXml(raw.slice(0, 4))).toThrow(
    "Invalid Android binary XML"
  )
  expect(() => decodeBinaryXml(raw.slice(0, -1))).toThrow(
    "Invalid Android binary XML"
  )
  const mutate = (change: (view: DataView) => void) => {
    const bytes = raw.slice()
    change(new DataView(bytes.buffer))
    expect(() => decodeBinaryXml(bytes)).toThrow("Invalid Android binary XML")
  }
  mutate((view) => view.setUint16(0, 1, true))
  mutate((view) => view.setUint16(2, 4, true))
  mutate((view) => view.setUint16(10, 16, true))
  mutate((view) => view.setUint32(28, 12, true))
  mutate((view) => view.setUint16(1396, 0, true))
  mutate((view) => view.setUint16(1398, 12, true))
  mutate((view) => view.setUint16(1400, 0xffff, true))
  mutate((view) => view.setUint32(1408, 0xfffffff0, true))
  mutate((view) => view.setUint32(1644, 1, true))
  mutate((view) => view.setUint32(4, 1624, true))
})

test("shows summary and downloadable XML, then lets the user replace an unreadable file", async () => {
  render(<Client messages={m} lang="en" />)
  const input = screen.getByLabelText(m.open)
  fireEvent.change(input, {
    target: { files: [new File(["broken"], "broken.apk")] },
  })
  await screen.findByText(m.invalid)
  fireEvent.change(input, { target: { files: [fixture()] } })
  await screen.findByText("org.example.trailnotes")
  expect(screen.getByText("android.permission.CAMERA")).toBeTruthy()
  fireEvent.mouseDown(screen.getByRole("tab", { name: m.manifest }), {
    button: 0,
  })
  expect(
    (await screen.findByRole("link", { name: m.download })).getAttribute(
      "download"
    )
  ).toBe("AndroidManifest.xml")
  expect(screen.getByText(/<intent-filter>/)).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  expect(screen.getByText(m.drop)).toBeTruthy()
})

test("shows unspecified fields and no requests for an otherwise valid minimal manifest", async () => {
  render(<Client messages={m} lang="ar" />)
  fireEvent.change(screen.getByLabelText(m.open), {
    target: {
      files: [
        new File(
          ['<manifest package="example.minimal"/>'],
          "AndroidManifest.xml"
        ),
      ],
    },
  })
  await screen.findByText("example.minimal")
  expect(screen.getAllByText(m.unspecified)).toHaveLength(4)
  expect(screen.getByText(m.noPermissions)).toBeTruthy()
})

test("opens the built-in APK and reports an archive that lacks a manifest", async () => {
  const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue({
    blob: async () => new Blob([apk]),
  } as Response)
  try {
    render(<Client messages={m} lang="en" />)
    const picker = screen.getByLabelText(m.open)
    const open = vi.spyOn(picker, "click")
    fireEvent.click(screen.getByRole("button", { name: m.open }))
    expect(open).toHaveBeenCalledOnce()
    fireEvent.click(screen.getByRole("button", { name: m.example }))
    await screen.findByText("org.example.trailnotes")
    const zip = Uint8Array.from(
      atob("UEsFBgAAAAAAAAAAAAAAAAAAAAAAAA=="),
      (char) => char.charCodeAt(0)
    )
    fireEvent.change(picker, {
      target: { files: [new File([zip], "empty.apk")] },
    })
    await screen.findByText(m.missing)
  } finally {
    fetch.mockRestore()
  }
})

test.each([
  [0x00, 0, "@null"],
  [0x00, 1, "@empty"],
  [0x07, 0x7f010001, "@0x7f010001"],
  [0x02, 0x01010089, "?0x01010089"],
  [0x08, 0x7f010002, "?0x7f010002"],
  [0x04, 0x3f000000, "0.5"],
  [0x05, 0x6401, "100dp"],
  [0x05, 0x640f, "100"],
  [0x06, 0x4010, "50%"],
  [0x06, 0x4011, "50%p"],
  [0x1c, 0xff3377aa, "#ff3377aa"],
  [0x11, 0x0000abcd, "0x0000abcd"],
])(
  "formats Android typed attribute %i as %s",
  async (type, value, expected) => {
    const raw = await compiledManifest()
    const view = new DataView(raw.buffer)
    // The sample's first manifest attribute is versionCode.
    const versionCode = 1408
    view.setUint32(versionCode + 8, 0xffffffff, true)
    view.setUint8(versionCode + 15, type)
    view.setUint32(versionCode + 16, value, true)
    expect(readManifestBytes(raw).versionCode).toBe(expected)
  }
)

function utf8Manifest() {
  function header(type: number, headerSize: number, payloadSize: number) {
    const bytes = new Uint8Array(headerSize + payloadSize)
    const view = new DataView(bytes.buffer)
    view.setUint16(0, type, true)
    view.setUint16(2, headerSize, true)
    view.setUint32(4, bytes.length, true)
    return { bytes, view }
  }
  const packageName = "org.example." + "ä".repeat(140)
  const strings = ["manifest", "package", packageName, "Original ]]> text"]
  const length = (size: number) =>
    size < 128 ? [size] : [0x80 | (size >> 8), size & 0xff]
  const stringBytes = strings.map((value) => {
    const bytes = new TextEncoder().encode(value)
    return Uint8Array.from([
      ...length(value.length),
      ...length(bytes.length),
      ...bytes,
      0,
    ])
  })
  const directorySize = strings.length * 4
  const pool = header(
    1,
    28,
    directorySize + stringBytes.reduce((sum, bytes) => sum + bytes.length, 0)
  )
  pool.view.setUint32(8, strings.length, true)
  pool.view.setUint32(16, 0x100, true)
  pool.view.setUint32(20, 28 + directorySize, true)
  let offset = 0
  for (const [index, bytes] of stringBytes.entries()) {
    pool.view.setUint32(28 + index * 4, offset, true)
    pool.bytes.set(bytes, 28 + directorySize + offset)
    offset += bytes.length
  }
  const start = header(0x0102, 16, 40)
  start.view.setUint32(16, 0xffffffff, true)
  start.view.setUint16(24, 20, true)
  start.view.setUint16(26, 20, true)
  start.view.setUint16(28, 1, true)
  start.view.setUint32(36, 0xffffffff, true)
  start.view.setUint32(40, 1, true)
  start.view.setUint32(44, 0xffffffff, true)
  start.view.setUint16(48, 8, true)
  start.view.setUint8(51, 3)
  start.view.setUint32(52, 2, true)
  const cdata = header(0x0104, 16, 12)
  cdata.view.setUint32(16, 3, true)
  const end = header(0x0103, 16, 8)
  end.view.setUint32(16, 0xffffffff, true)
  const document = header(
    3,
    8,
    pool.bytes.length +
      start.bytes.length +
      cdata.bytes.length +
      end.bytes.length
  )
  let cursor = 8
  for (const item of [pool, start, cdata, end]) {
    document.bytes.set(item.bytes, cursor)
    cursor += item.bytes.length
  }
  return { bytes: document.bytes, packageName }
}

test("reads multi-byte UTF-8 string lengths and preserves text chunks without adding whitespace", () => {
  const { bytes, packageName } = utf8Manifest()
  const output = readManifestBytes(bytes)
  expect(output.packageName).toBe(packageName)
  const parsed = new DOMParser().parseFromString(output.xml, "application/xml")
  expect(parsed.documentElement.textContent).toBe("Original ]]> text")
  expect(output.xml).toContain("Original ]]&gt; text")
})

test("uses Android's combined long version code without losing precision", () => {
  const encoder = new TextEncoder()
  const manifest = (major: string) =>
    encoder.encode(
      `<manifest xmlns:android="${android}" android:versionCode="13" android:versionCodeMajor="${major}"/>`
    )
  const version = readManifestBytes(manifest("2147483647"))
  expect(version.versionCode).toBe("9223372032559808525")
  expect(version.xml).toContain('android:versionCodeMajor="2147483647"')
  expect(readManifestBytes(manifest("@string/version")).versionCode).toBe("13")
})
