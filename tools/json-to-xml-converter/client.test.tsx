import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import JsonToXmlConverterClient from "./client"
import {
  DEFAULT_JSON_TO_XML_OPTIONS,
  convertJsonToXmlText,
} from "./core/convert-json-to-xml"

const messages = {
  meta: {
    name: "JSON to XML Converter",
    description:
      "Convert JSON to XML. Paste JSON or import a file; preview, copy, and download.",
  },
  importFromFileLabel: "Import from file",
  downloadXmlLabel: "Download XML",
  jsonLabel: "JSON",
  jsonDescription:
    "Paste JSON directly or import a .json or .txt file from this device.",
  xmlLabel: "XML",
  xmlDescription:
    "XML output updates as soon as the input contains valid JSON.",
  xmlEmptyDescription:
    "Paste valid JSON on the left to preview the converted XML here.",
  jsonPlaceholder: "Paste JSON here...",
  invalidJsonLabel: "Invalid JSON",
  invalidXmlTagLabel: "Invalid XML tag",
  optionsLabel: "Options",
  optionsDescription:
    "Adjust the XML wrapper and output style before you copy or download.",
  rootElementLabel: "Root element",
  rootElementDescription:
    "XML needs a single top-level element. This tag wraps the converted JSON.",
  arrayItemTagLabel: "Array item tag",
  arrayItemTagDescription:
    "Repeated values inside JSON arrays use this XML tag.",
  indentSizeLabel: "Indent size",
  indentSizeDescription:
    "Choose 0 for compact output or 1-8 for pretty-printed indentation.",
  includeDeclarationLabel: "Include XML declaration",
  includeDeclarationDescription:
    'Adds <?xml version="1.0" encoding="UTF-8"?> to the top of the output.',
  expandEmptyElementsLabel: "Expand empty elements",
  expandEmptyElementsDescription:
    "Use <tag></tag> instead of self-closing tags for empty values.",
  invalidRootElementNameMessage:
    "Enter a valid XML root tag. Start with a letter or underscore, then use letters, numbers, dots, hyphens, or underscores only.",
  invalidArrayItemTagMessage:
    "Enter a valid XML array item tag. Start with a letter or underscore, then use letters, numbers, dots, hyphens, or underscores only.",
  copyXmlLabel: "Copy XML",
  copiedLabel: "Copied",
} as const

const STORAGE_KEYS = {
  jsonText: "tools:json-to-xml-converter:json-text",
  options: "tools:json-to-xml-converter:options",
} as const

beforeEach(() => {
  vi.stubGlobal(
    "URL",
    Object.assign({}, globalThis.URL, {
      createObjectURL: vi.fn(() => "blob:converted-xml"),
      revokeObjectURL: vi.fn(),
    })
  )

  window.localStorage.clear()
})

afterEach(cleanup)

function getJsonInput() {
  return screen.getByRole("textbox", {
    name: messages.jsonLabel,
  }) as HTMLTextAreaElement
}

function getRootElementInput() {
  return screen.getByRole("textbox", {
    name: messages.rootElementLabel,
  }) as HTMLInputElement
}

function getArrayItemTagInput() {
  return screen.getByRole("textbox", {
    name: messages.arrayItemTagLabel,
  }) as HTMLInputElement
}

function getIndentSizeInput() {
  return screen.getByRole("spinbutton", {
    name: messages.indentSizeLabel,
  }) as HTMLInputElement
}

function getFileInput() {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

function getXmlOutput() {
  return screen.getByRole("region", {
    name: messages.xmlLabel,
  })
}

describe("JsonToXmlConverterClient", () => {
  test("renders the default example and converted XML output", () => {
    render(<JsonToXmlConverterClient messages={messages} />)

    const jsonInput = getJsonInput()
    const xmlOutput = getXmlOutput()

    expect(screen.getByText(messages.optionsDescription)).toBeTruthy()
    expect(screen.getByText(messages.jsonDescription)).toBeTruthy()
    expect(screen.getByText(messages.xmlDescription)).toBeTruthy()
    expect(jsonInput.value).toContain('"project"')
    expect(xmlOutput.textContent).toBe(
      convertJsonToXmlText(jsonInput.value, DEFAULT_JSON_TO_XML_OPTIONS)
        .state === "converted"
        ? convertJsonToXmlText(jsonInput.value, DEFAULT_JSON_TO_XML_OPTIONS).xml
        : ""
    )
    expect(xmlOutput.querySelector(".hljs")).toBeTruthy()
    expect(URL.createObjectURL).toHaveBeenCalled()
  })

  test("shows an error for invalid JSON and disables export actions", () => {
    render(<JsonToXmlConverterClient messages={messages} />)

    fireEvent.change(getJsonInput(), {
      target: { value: "{" },
    })

    const xmlOutput = getXmlOutput()
    const outputAlert = within(xmlOutput).getByRole("alert")

    expect(outputAlert.textContent).toContain(messages.invalidJsonLabel)
    expect(xmlOutput.querySelector(".hljs")).toBeNull()
    expect(
      screen.getByRole("button", { name: messages.copyXmlLabel })
    ).toHaveProperty("disabled", true)
    expect(
      screen.getByRole("button", { name: messages.downloadXmlLabel })
    ).toHaveProperty("disabled", true)
  })

  test("surfaces XML tag validation inside the options card", () => {
    render(<JsonToXmlConverterClient messages={messages} />)

    fireEvent.change(getRootElementInput(), {
      target: { value: "123 root" },
    })

    expect(
      screen.getAllByText(messages.invalidRootElementNameMessage)
    ).toHaveLength(2)
    expect(getXmlOutput().textContent).toContain(messages.invalidXmlTagLabel)
  })

  test("updates the output when XML options change", () => {
    render(<JsonToXmlConverterClient messages={messages} />)

    fireEvent.change(getArrayItemTagInput(), {
      target: { value: "entry" },
    })
    fireEvent.change(getIndentSizeInput(), {
      target: { value: "0" },
    })
    fireEvent.click(
      screen.getByRole("switch", {
        name: messages.includeDeclarationLabel,
      })
    )

    expect(getXmlOutput().textContent).toContain("<entry>en</entry>")
    expect(getXmlOutput().textContent?.startsWith("<?xml")).toBe(false)
    expect(getXmlOutput().textContent).not.toContain("\n")
  })

  test("imports JSON from a selected file", async () => {
    render(<JsonToXmlConverterClient messages={messages} />)

    const file = new File(['{"name":"demo"}'], "demo.json", {
      type: "application/json",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(getJsonInput().value).toBe('{"name":"demo"}')
    })

    expect(getXmlOutput().textContent).toContain("<name>demo</name>")
  })

  test("restores the last stored input and options", () => {
    window.localStorage.setItem(STORAGE_KEYS.jsonText, '{"saved":true}')
    window.localStorage.setItem(
      STORAGE_KEYS.options,
      JSON.stringify({
        rootElementName: "payload",
        arrayItemTag: "value",
        indentSize: 0,
        includeXmlDeclaration: false,
        fullTagEmptyElement: true,
      })
    )

    render(<JsonToXmlConverterClient messages={messages} />)

    expect(getJsonInput().value).toBe('{"saved":true}')
    expect(getRootElementInput().value).toBe("payload")
    expect(getXmlOutput().textContent).toBe(
      "<payload><saved>true</saved></payload>"
    )
  })

  test("persists edits and options to local storage", () => {
    render(<JsonToXmlConverterClient messages={messages} />)

    fireEvent.change(getJsonInput(), {
      target: { value: '{"persisted":true}' },
    })
    fireEvent.change(getRootElementInput(), {
      target: { value: "payload" },
    })

    expect(window.localStorage.getItem(STORAGE_KEYS.jsonText)).toBe(
      '{"persisted":true}'
    )
    expect(window.localStorage.getItem(STORAGE_KEYS.options)).toContain(
      '"rootElementName":"payload"'
    )
  })

  test("revokes the previous download URL when output becomes invalid", () => {
    render(<JsonToXmlConverterClient messages={messages} />)

    fireEvent.change(getJsonInput(), {
      target: { value: "{" },
    })

    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:converted-xml")
  })
})
