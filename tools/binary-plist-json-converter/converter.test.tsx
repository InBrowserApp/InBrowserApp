// @vitest-environment jsdom
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react"
import { buildBinaryPlist, parseBinaryPlist, PlistUid } from "rork-plist"
import { afterEach, beforeEach, expect, test } from "vitest"
import Client from "./client"
import { exampleJson, jsonToPlist, plistToJson } from "./codec"
import m from "./messages/en.json"

const descriptors = [
  [
    "arrayBuffer",
    Object.getOwnPropertyDescriptor(File.prototype, "arrayBuffer"),
  ],
  ["text", Object.getOwnPropertyDescriptor(File.prototype, "text")],
] as const
beforeEach(() => {
  for (const [method] of descriptors) {
    Object.defineProperty(File.prototype, method, {
      configurable: true,
      value(this: File) {
        return new Promise<string | ArrayBuffer>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result!)
          reader.onerror = reject
          if (method === "text") reader.readAsText(this)
          else reader.readAsArrayBuffer(this)
        })
      },
    })
  }
})
afterEach(() => {
  cleanup()
  for (const [method, descriptor] of descriptors) {
    if (descriptor) Object.defineProperty(File.prototype, method, descriptor)
    else Reflect.deleteProperty(File.prototype, method)
  }
})

test("round-trips native dates, data, UIDs, big integers, and dictionaries that look like tags", () => {
  const source = {
    name: "Notebook",
    count: 123,
    picture: Uint8Array.of(1, 2, 3),
    created: new Date("2025-01-01T00:00:00Z"),
    large: 9007199254740993n,
    link: new PlistUid(42),
    items: [false, 0.25, { $plist: "date", value: "literal" }],
  }
  const text = plistToJson(buildBinaryPlist(source))
  const output = JSON.parse(text)
  expect(output).toMatchObject({
    picture: { $plist: "data", value: "AQID" },
    created: { $plist: "date", value: "2025-01-01T00:00:00.000Z" },
    large: { $plist: "integer", value: "9007199254740993" },
    link: { $plist: "uid", value: 42 },
    items: [
      false,
      0.25,
      { $plist: "dictionary", value: { $plist: "date", value: "literal" } },
    ],
  })
  expect(parseBinaryPlist(jsonToPlist(text))).toEqual(source)
})

test("accepts an ordinary dictionary with additional tag-like keys and UTF-8 BOM", () => {
  const object = JSON.parse(
    '{"$plist":"data","value":"ordinary","label":"text","__proto__":true}'
  )
  expect(
    parseBinaryPlist(jsonToPlist("\uFEFF" + JSON.stringify(object)))
  ).toEqual(object)
  expect(
    parseBinaryPlist(
      jsonToPlist('{"$plist":"date","value":"2025-01-01T00:00:00Z"}')
    )
  ).toEqual(new Date("2025-01-01T00:00:00Z"))
  expect(
    parseBinaryPlist(jsonToPlist('{"$plist":"unknown","value":"ordinary"}'))
  ).toEqual({ $plist: "unknown", value: "ordinary" })
})

test.each([
  ["null", "Null is not a plist value"],
  ["[9007199254740994]", "Unsupported JSON number"],
  ["1e999", "Unsupported JSON number"],
  [
    '{"$plist":"date","value":"2025-02-31T00:00:00Z"}',
    "Invalid plist type tag",
  ],
  ['{"$plist":"integer","value":"12.2"}', "Invalid plist type tag"],
  ['{"$plist":"dictionary","value":[1]}', "Invalid plist type tag"],
  ['{"$plist":"uid","value":"2"}', "Invalid plist type tag"],
  ['{"$plist":"data","value":12}', "Invalid plist type tag"],
  ['{"$plist":"real","value":"1e999"}', "Invalid plist type tag"],
  ['{"$plist":"real","value":"0xf"}', "Invalid plist type tag"],
])("rejects unrepresentable input %s", (text, message) => {
  expect(() => jsonToPlist(text)).toThrow(message)
})

test("opens binary Plist input, displays JSON, and handles replacing it with invalid data", async () => {
  render(<Client messages={m} lang="en" />)
  const panel = within(screen.getByRole("tabpanel", { name: m.plistToJson }))
  fireEvent.click(panel.getByRole("button", { name: m.example }))
  expect((await panel.findByLabelText(m.jsonOutput)).textContent).toBe(
    exampleJson
  )
  expect(
    (await panel.findByRole("link", { name: m.downloadJson })).getAttribute(
      "download"
    )
  ).toBe("notebook.json")
  fireEvent.change(panel.getByLabelText(m.open), {
    target: { files: [new File(["bad"], "bad.plist")] },
  })
  await panel.findByText(m.badPlist)
  expect(panel.queryByLabelText(m.jsonOutput)).toBeNull()
  fireEvent.click(panel.getByRole("button", { name: m.clear }))
  expect(panel.getByText(m.drop)).toBeTruthy()
})

test("converts JSON, keeps the input on failure, and preserves the editor when switching direction", async () => {
  render(<Client messages={m} lang="en" />)
  fireEvent.click(screen.getByRole("tab", { name: m.jsonToPlist }))
  const panel = within(screen.getByRole("tabpanel", { name: m.jsonToPlist }))
  const textbox = panel.getByRole("textbox", {
    name: m.jsonInput,
  }) as HTMLTextAreaElement
  const convert = panel.getByRole("button", { name: m.convert })
  fireEvent.change(textbox, { target: { value: "{bad}" } })
  fireEvent.click(convert)
  expect(panel.getByText(m.invalidJson)).toBeTruthy()
  expect(textbox.value).toBe("{bad}")
  fireEvent.change(textbox, { target: { value: '{"a":null}' } })
  fireEvent.click(convert)
  expect(panel.getByText(m.invalidValue)).toBeTruthy()
  fireEvent.click(panel.getByRole("button", { name: m.example }))
  fireEvent.click(convert)
  expect(
    (await panel.findByRole("link", { name: m.downloadPlist })).getAttribute(
      "download"
    )
  ).toBe("notebook.plist")
  fireEvent.click(screen.getByRole("tab", { name: m.plistToJson }))
  fireEvent.click(screen.getByRole("tab", { name: m.jsonToPlist }))
  expect(textbox.value).toBe(exampleJson)
  fireEvent.change(textbox, { target: { value: "{}" } })
  expect(panel.queryByText(m.ready)).toBeNull()
})

test("imports JSON from a local file and bases the artifact name on the input", async () => {
  render(<Client messages={m} lang="ar" />)
  fireEvent.click(screen.getByRole("tab", { name: m.jsonToPlist }))
  const element = screen.getByRole("tabpanel", { name: m.jsonToPlist })
  const panel = within(element)
  fireEvent.change(element.querySelector("input[type=file]")!, {
    target: { files: [new File(['{"a":true}'], "settings.json")] },
  })
  await panel.findByDisplayValue('{"a":true}')
  fireEvent.click(panel.getByRole("button", { name: m.convert }))
  expect(
    (await panel.findByRole("link", { name: m.downloadPlist })).getAttribute(
      "download"
    )
  ).toBe("settings.plist")
})

test("round-trips Python plistlib's large finite reals and signed zero", () => {
  const fixture =
    "YnBsaXN0MDDTAQIDBAUGWWxhcmdlUmVhbFxuZWdhdGl2ZVplcm9Zd2hvbGVSZWFsI1SySa0llMN9I4AAAAAAAAAAIz/wAAAAAAAACA8ZJjA5QgAAAAAAAAEBAAAAAAAAAAcAAAAAAAAAAAAAAAAAAABL"
  const bytes = Uint8Array.from(atob(fixture), (character) =>
    character.charCodeAt(0)
  )
  const json = plistToJson(bytes)
  expect(JSON.parse(json)).toEqual({
    largeReal: { $plist: "real", value: "1e+100" },
    negativeZero: { $plist: "real", value: "-0" },
    wholeReal: 1,
  })
  expect(parseBinaryPlist(jsonToPlist(json))).toEqual({
    largeReal: 1e100,
    negativeZero: -0,
    wholeReal: 1,
  })
  expect(plistToJson(jsonToPlist(json))).toBe(json)
})
