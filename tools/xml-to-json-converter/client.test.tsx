import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import XmlToJsonConverterClient from "./client"
import {
  DEFAULT_XML_TO_JSON_OPTIONS,
  convertXmlToJsonText,
} from "./core/convert-xml-to-json"

const messages = {
  meta: {
    name: "XML to JSON Converter",
    description:
      "Convert XML to JSON. Paste XML or import a file; adjust options, preview, copy, and download.",
  },
  importFromFileLabel: "Import from file",
  xmlLabel: "XML",
  xmlDescription:
    "Paste XML directly or import a .xml or .txt file from this device.",
  xmlPlaceholder: "Paste XML here...",
  jsonLabel: "JSON",
  jsonDescription:
    "JSON output updates as soon as the input contains valid XML.",
  downloadJsonLabel: "Download JSON",
  jsonEmptyDescription:
    "Paste valid XML on the left to preview the converted JSON here.",
  invalidXmlLabel: "Invalid XML",
  optionsLabel: "Options",
  optionsDescription:
    "Adjust how XML is parsed before you copy or download the converted JSON.",
  indentSizeLabel: "Indent size",
  indentSizeDescription:
    "Choose 0 for compact output or 1-8 for pretty-printed indentation.",
  compactLabel: "Compact output",
  ignoreDeclarationLabel: "Ignore declaration",
  ignoreInstructionLabel: "Ignore instructions",
  ignoreAttributesLabel: "Ignore attributes",
  ignoreTextLabel: "Ignore text nodes",
  ignoreCdataLabel: "Ignore CDATA",
  ignoreDoctypeLabel: "Ignore doctype",
  ignoreCommentLabel: "Ignore comments",
  trimLabel: "Trim text nodes",
  nativeTypeLabel: "Parse native types",
  alwaysArrayLabel: "Always use arrays",
  alwaysChildrenLabel: "Always include children",
  copyJsonLabel: "Copy JSON",
  copiedLabel: "Copied",
} as const

const STORAGE_KEYS = {
  xmlText: "tools:xml-to-json-converter:xml-text",
  options: "tools:xml-to-json-converter:options",
} as const

beforeEach(() => {
  vi.stubGlobal(
    "URL",
    Object.assign({}, globalThis.URL, {
      createObjectURL: vi.fn(() => "blob:converted-json"),
      revokeObjectURL: vi.fn(),
    })
  )

  window.localStorage.clear()
})

afterEach(cleanup)

function getXmlInput() {
  return screen.getByRole("textbox", {
    name: messages.xmlLabel,
  }) as HTMLTextAreaElement
}

function getIndentSizeInput() {
  return screen.getByRole("spinbutton", {
    name: messages.indentSizeLabel,
  }) as HTMLInputElement
}

function getFileInput() {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

function getJsonOutput() {
  return screen.getByRole("region", {
    name: messages.jsonLabel,
  })
}

describe("XmlToJsonConverterClient", () => {
  test("renders the default example and converted JSON output", () => {
    render(<XmlToJsonConverterClient messages={messages} />)

    const xmlInput = getXmlInput()
    const jsonOutput = getJsonOutput()
    const result = convertXmlToJsonText(
      xmlInput.value,
      DEFAULT_XML_TO_JSON_OPTIONS
    )

    expect(screen.getByText(messages.optionsDescription)).toBeTruthy()
    expect(screen.getByText(messages.xmlDescription)).toBeTruthy()
    expect(screen.getByText(messages.jsonDescription)).toBeTruthy()
    expect(xmlInput.value).toContain("<note")
    expect(jsonOutput.textContent).toBe(
      result.state === "converted" ? result.json : ""
    )
    expect(jsonOutput.querySelector(".hljs")).toBeTruthy()
    expect(URL.createObjectURL).toHaveBeenCalled()
  })

  test("shows an error for invalid XML and disables export actions", () => {
    render(<XmlToJsonConverterClient messages={messages} />)

    fireEvent.change(getXmlInput(), {
      target: { value: "<note>" },
    })

    const jsonOutput = getJsonOutput()
    const outputAlert = within(jsonOutput).getByRole("alert")
    const invalidResult = convertXmlToJsonText("<note>")

    expect(outputAlert.textContent).toContain(messages.invalidXmlLabel)
    expect(outputAlert.textContent).toContain(
      invalidResult.state === "error" ? invalidResult.message : ""
    )
    expect(jsonOutput.querySelector(".hljs")).toBeNull()
    expect(
      screen.getByRole("button", { name: messages.copyJsonLabel })
    ).toHaveProperty("disabled", true)
    expect(
      screen.getByRole("button", { name: messages.downloadJsonLabel })
    ).toHaveProperty("disabled", true)
  })

  test("updates the output when XML parser options change", () => {
    render(<XmlToJsonConverterClient messages={messages} />)

    fireEvent.change(getIndentSizeInput(), {
      target: { value: "0" },
    })
    fireEvent.click(
      screen.getByRole("switch", {
        name: messages.ignoreDeclarationLabel,
      })
    )
    fireEvent.click(
      screen.getByRole("switch", {
        name: messages.ignoreAttributesLabel,
      })
    )

    expect(getJsonOutput().textContent).not.toContain("_declaration")
    expect(getJsonOutput().textContent).not.toContain("_attributes")
    expect(getJsonOutput().textContent).not.toContain("\n")
  })

  test("imports XML from a selected file", async () => {
    render(<XmlToJsonConverterClient messages={messages} />)

    const file = new File(["<root><name>demo</name></root>"], "demo.xml", {
      type: "application/xml",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(getXmlInput().value).toBe("<root><name>demo</name></root>")
    })

    expect(getJsonOutput().textContent).toContain('"root"')
    expect(getJsonOutput().textContent).toContain('"name"')
  })

  test("restores the last stored input and options", () => {
    window.localStorage.setItem(
      STORAGE_KEYS.xmlText,
      "<root><saved>true</saved></root>"
    )
    window.localStorage.setItem(
      STORAGE_KEYS.options,
      JSON.stringify({
        ignoreDeclaration: true,
        ignoreAttributes: true,
        indentSize: 0,
      })
    )

    render(<XmlToJsonConverterClient messages={messages} />)

    expect(getXmlInput().value).toBe("<root><saved>true</saved></root>")
    expect(getIndentSizeInput().value).toBe("0")
    expect(getJsonOutput().textContent).toBe(
      '{"root":{"saved":{"_text":"true"}}}'
    )
  })

  test("persists edits and options to local storage", () => {
    render(<XmlToJsonConverterClient messages={messages} />)

    fireEvent.change(getXmlInput(), {
      target: { value: "<root><persisted>true</persisted></root>" },
    })
    fireEvent.click(
      screen.getByRole("switch", {
        name: messages.ignoreDeclarationLabel,
      })
    )

    expect(window.localStorage.getItem(STORAGE_KEYS.xmlText)).toBe(
      "<root><persisted>true</persisted></root>"
    )
    expect(window.localStorage.getItem(STORAGE_KEYS.options)).toContain(
      '"ignoreDeclaration":true'
    )
  })

  test("revokes the previous download URL when output becomes invalid", () => {
    render(<XmlToJsonConverterClient messages={messages} />)

    fireEvent.change(getXmlInput(), {
      target: { value: "<note>" },
    })

    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:converted-json")
  })
})
