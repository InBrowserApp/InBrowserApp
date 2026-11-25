// @vitest-environment jsdom
import { readFileSync } from "node:fs"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterAll, afterEach, beforeAll, expect, test, vi } from "vitest"
import Client from "./client"
import m from "./messages/en.json"
import { openIpa } from "./read"

const files = "tools/ipa-metadata-viewer/fixtures/"
const fixture = (name = "trail-notes.ipa") =>
  new File([readFileSync(files + name)], name)
const descriptor = Object.getOwnPropertyDescriptor(
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
  if (descriptor)
    Object.defineProperty(Blob.prototype, "arrayBuffer", descriptor)
  else Reflect.deleteProperty(Blob.prototype, "arrayBuffer")
})

test("opens binary metadata for the main app and keeps its original Info.plist", async () => {
  const result = await openIpa(fixture())
  expect(result).toMatchObject({
    appName: "Trail Notes",
    bundleId: "org.example.trailnotes",
    version: "1.3.0",
    build: "13",
    minimumOs: "17.0",
    platforms: ["iPhoneOS"],
    path: "Payload/Trail Notes.app/Info.plist",
  })
  expect(result!.xml).toContain("<key>UIDeviceFamily</key>")
  expect(result!.xml).not.toContain("Trail Notes Share")
  expect(
    new TextDecoder().decode(await result!.original.slice(0, 8).arrayBuffer())
  ).toBe("bplist00")
})

test("opens XML metadata, preserves numeric build numbers, and filters platform strings", async () => {
  const result = await openIpa(fixture("xml-app.ipa"))
  expect(result).toMatchObject({
    appName: "Notebook",
    bundleId: "org.example.notebook",
    build: "18446744073709551615",
    version: undefined,
    minimumOs: undefined,
    platforms: ["iPhoneOS", "iPhoneSimulator"],
  })
  expect(
    new TextDecoder().decode(await result!.original.slice(0, 5).arrayBuffer())
  ).toBe("<?xml")
})

test("distinguishes missing app metadata from unreadable inputs", async () => {
  await expect(openIpa(fixture("extension-only.ipa"))).resolves.toBeNull()
  await expect(openIpa(fixture("bad-plist.ipa"))).rejects.toThrow(
    "unexpected content after the root value"
  )
  await expect(
    openIpa(new File(["plain text"], "not-ipa.ipa"))
  ).rejects.toThrow("Invalid IPA archive")
  const empty = Uint8Array.from(
    atob("UEsFBgAAAAAAAAAAAAAAAAAAAAAAAA=="),
    (char) => char.charCodeAt(0)
  )
  await expect(openIpa(new File([empty], "empty.ipa"))).resolves.toBeNull()
})

test("preserves the overview and original download when XML preview is unavailable", async () => {
  render(<Client messages={m} lang="en" />)
  fireEvent.change(screen.getByLabelText(m.open), {
    target: { files: [fixture("binary-without-xml-preview.ipa")] },
  })
  await screen.findByText("org.example.journal")
  fireEvent.mouseDown(screen.getByRole("tab", { name: m.details }), {
    button: 0,
  })
  await screen.findByText(m.previewUnavailable)
  expect(screen.getByRole("link", { name: m.download })).toBeTruthy()
  expect(screen.queryByRole("button", { name: m.copyXml })).toBeNull()
})

test("opens the built-in IPA, downloads the primary plist, and recovers after replacement", async () => {
  const response = new Response()
  vi.spyOn(response, "blob").mockResolvedValue(fixture())
  const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(response)
  try {
    render(<Client messages={m} lang="en" />)
    const picker = screen.getByLabelText(m.open)
    const choose = vi.spyOn(picker, "click")
    fireEvent.click(screen.getByRole("button", { name: m.open }))
    expect(choose).toHaveBeenCalledOnce()
    fireEvent.click(screen.getByRole("button", { name: m.example }))
    await screen.findByText("org.example.trailnotes")
    fireEvent.mouseDown(screen.getByRole("tab", { name: m.details }), {
      button: 0,
    })
    expect(
      (await screen.findByRole("link", { name: m.download })).getAttribute(
        "download"
      )
    ).toBe("Info.plist")
    expect(screen.getByText("Payload/Trail Notes.app/Info.plist")).toBeTruthy()
    expect(screen.getByText(/CFBundleDisplayName/)).toBeTruthy()
    fireEvent.change(picker, {
      target: { files: [fixture("extension-only.ipa")] },
    })
    await screen.findByText(m.missing)
    fireEvent.change(picker, { target: { files: [fixture("bad-plist.ipa")] } })
    await screen.findByText(m.invalid)
    fireEvent.change(picker, { target: { files: [fixture("xml-app.ipa")] } })
    await screen.findByText("org.example.notebook")
    expect(screen.getAllByText(m.unspecified)).toHaveLength(2)
    fireEvent.click(screen.getByRole("button", { name: m.clear }))
    expect(screen.getByText(m.drop)).toBeTruthy()
  } finally {
    fetch.mockRestore()
  }
})
