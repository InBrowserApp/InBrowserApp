import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import * as React from "react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

const sampleCurl = [
  "curl -X POST 'https://api.example.com/v1/messages' \\",
  "  -H 'Content-Type: application/json' \\",
  "  -H 'Authorization: Bearer token' \\",
  `  --data-raw '{"message":"Hello"}'`,
].join("\n")

const mocks = vi.hoisted(() => {
  const targetGroups: Array<{
    label: string
    options: Array<{
      id: string
      label: string
      extension: string
      highlightLanguage: string
      runtimeKey: string
    }>
  }> = [
    {
      label: "JavaScript",
      options: [
        {
          id: "javascript-fetch",
          label: "JavaScript (fetch)",
          extension: ".js",
          highlightLanguage: "javascript",
          runtimeKey: "toJavaScriptWarn",
        },
      ],
    },
    {
      label: "Python",
      options: [
        {
          id: "python-requests",
          label: "Python (requests)",
          extension: ".py",
          highlightLanguage: "python",
          runtimeKey: "toPythonWarn",
        },
      ],
    },
  ]

  return {
    targetGroups,
    getTargetConfig: vi.fn((id: string) =>
      targetGroups
        .flatMap((group) => group.options)
        .find((option) => option.id === id)
    ),
    convertCurlToTarget: vi.fn(
      async (curlCommand: string, targetId: string) => {
        if (!curlCommand.trim()) {
          return { output: "", warnings: [] }
        }

        if (curlCommand.includes("warn")) {
          return { output: `warn:${targetId}`, warnings: ["[WARN] be careful"] }
        }

        if (curlCommand.includes("error")) {
          return { output: "", warnings: [], error: "Failed to parse" }
        }

        return { output: `${targetId}:${curlCommand}`, warnings: [] }
      }
    ),
  }
})

vi.mock("./core/targets", () => ({
  defaultTargetId: "javascript-fetch",
  getDownloadFilename: (id: string) =>
    id === "python-requests" ? "converted.py" : "converted.js",
  getTargetConfig: mocks.getTargetConfig,
  targetGroups: mocks.targetGroups,
}))

vi.mock("./core/converter", () => ({
  convertCurlToTarget: mocks.convertCurlToTarget,
}))

vi.mock("@workspace/ui/components/ui/select", async () => {
  const React = await import("react")

  const Context = React.createContext<{
    value: string
    onValueChange: (value: string) => void
  } | null>(null)

  function Select({
    value,
    onValueChange,
    children,
  }: React.PropsWithChildren<{
    value: string
    onValueChange: (value: string) => void
  }>) {
    return (
      <Context.Provider value={{ value, onValueChange }}>
        <div>{children}</div>
      </Context.Provider>
    )
  }

  function SelectTrigger(
    props: React.PropsWithChildren<
      React.ButtonHTMLAttributes<HTMLButtonElement>
    >
  ) {
    return <button type="button" {...props} />
  }

  function SelectValue({ placeholder }: { placeholder?: string }) {
    const context = React.useContext(Context)
    return <span>{context?.value || placeholder}</span>
  }

  function SelectContent({ children }: React.PropsWithChildren) {
    return <div>{children}</div>
  }

  function SelectGroup({ children }: React.PropsWithChildren) {
    return <div>{children}</div>
  }

  function SelectLabel({ children }: React.PropsWithChildren) {
    return <div>{children}</div>
  }

  function SelectItem({
    value,
    children,
  }: React.PropsWithChildren<{ value: string }>) {
    const context = React.useContext(Context)
    return (
      <button
        type="button"
        onClick={() => {
          context?.onValueChange(value)
        }}
      >
        {children}
      </button>
    )
  }

  return {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  }
})

import CurlConverterClient from "./client"

const messages = {
  meta: {
    name: "cURL Converter",
    description:
      "Convert cURL commands into code for many languages and HTTP clients.",
  },
  targetLanguageLabel: "Output Language",
  languagePlaceholder: "Select a language",
  inputCurlLabel: "cURL Command",
  outputCodeLabel: "Converted Code",
  curlPlaceholder: "Paste a cURL command here...",
  useSampleLabel: "Use sample",
  clearLabel: "Clear",
  downloadCodeLabel: "Download",
  warningsTitle: "Warnings",
  errorsTitle: "Errors",
  importFromFileLabel: "Import from file",
  copyResultLabel: "Copy result",
  copiedLabel: "Copied",
} as const

beforeEach(() => {
  vi.stubGlobal("URL", {
    createObjectURL: vi.fn(() => "blob:download"),
    revokeObjectURL: vi.fn(),
  })
})

afterEach(() => {
  cleanup()
  window.localStorage.clear()
  vi.unstubAllGlobals()
})

describe("CurlConverterClient", () => {
  test("renders the default sample and output", async () => {
    render(<CurlConverterClient messages={messages} />)

    expect(
      (screen.getByLabelText("cURL Command") as HTMLTextAreaElement).value
    ).toBe(sampleCurl)

    await waitFor(() => {
      expect(
        screen.getByRole("region", { name: "Converted Code" }).textContent
      ).toContain("javascript-fetch:curl -X POST")
    })
  })

  test("changes the target and updates output metadata", async () => {
    render(<CurlConverterClient messages={messages} />)

    fireEvent.click(screen.getByText("Python (requests)"))

    await waitFor(() => {
      expect(
        screen.getByRole("region", { name: "Converted Code" }).textContent
      ).toContain("python-requests:curl -X POST")
    })

    expect(
      screen.getByRole("link", { name: "Download" }).getAttribute("download")
    ).toBe("converted.py")
  })

  test("shows warnings and errors", async () => {
    render(<CurlConverterClient messages={messages} />)

    fireEvent.change(screen.getByLabelText("cURL Command"), {
      target: { value: "warn" },
    })

    await waitFor(() => {
      expect(screen.getByText("Warnings")).toBeTruthy()
      expect(screen.getByText("[WARN] be careful")).toBeTruthy()
    })

    fireEvent.change(screen.getByLabelText("cURL Command"), {
      target: { value: "error" },
    })

    await waitFor(() => {
      expect(screen.getByText("Errors")).toBeTruthy()
      expect(screen.getByText("Failed to parse")).toBeTruthy()
    })
  })

  test("supports clearing and restoring the sample", () => {
    render(<CurlConverterClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: "Clear" }))
    expect(
      (screen.getByLabelText("cURL Command") as HTMLTextAreaElement).value
    ).toBe("")

    fireEvent.click(screen.getByRole("button", { name: "Use sample" }))
    expect(
      (screen.getByLabelText("cURL Command") as HTMLTextAreaElement).value
    ).toBe(sampleCurl)
  })

  test("imports text from a file", async () => {
    render(<CurlConverterClient messages={messages} />)

    const input = screen.getByLabelText("Import from file") as HTMLInputElement
    const file = new File(["curl https://example.com"], "request.txt", {
      type: "text/plain",
    })

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(
        (screen.getByLabelText("cURL Command") as HTMLTextAreaElement).value
      ).toBe("curl https://example.com")
    })
  })

  test("restores stored target when it is valid", async () => {
    window.localStorage.setItem(
      "tools:curl-converter:target",
      "python-requests"
    )

    render(<CurlConverterClient messages={messages} />)

    await waitFor(() => {
      expect(mocks.getTargetConfig).toHaveBeenCalledWith("python-requests")
      expect(
        screen.getByRole("region", { name: "Converted Code" }).textContent
      ).toContain("python-requests:curl -X POST")
    })
  })
})
