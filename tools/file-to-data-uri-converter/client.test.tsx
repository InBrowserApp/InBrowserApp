import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import FileToDataUriConverterClient from "./client"

vi.mock("./core/data-uri", async () => {
  const actual =
    await vi.importActual<typeof import("./core/data-uri")>("./core/data-uri")

  return {
    ...actual,
    readFileAsDataUri: vi.fn(),
  }
})

import { readFileAsDataUri } from "./core/data-uri"

const mockedReadFileAsDataUri = vi.mocked(readFileAsDataUri)

const messages = {
  meta: {
    name: "File to Data URI Converter",
    description:
      "Convert files into Data URI strings for embedding in HTML, CSS, or JSON. Works fully offline.",
  },
  file: "File",
  dragOrClick: "Click or drag to upload a file",
  clearFile: "Clear file",
  dataUri: "Data URI",
  dataUriPlaceholder: "Generated Data URI will appear here...",
  onlyOneFile: "Only one file can be uploaded",
  readFailed: "Failed to read file",
  unknownType: "Unknown type",
  fileSize: "File size",
  mimeType: "MIME Type",
  copyLabel: "Copy",
  copiedLabel: "Copied",
} as const

const zhMessages = {
  ...messages,
  meta: {
    name: "文件转 Data URI 转换器",
    description:
      "将文件转换为 Data URI 字符串，便于嵌入 HTML、CSS 或 JSON，完全离线。",
  },
  file: "文件",
  dragOrClick: "点击或拖拽上传文件",
  clearFile: "清除文件",
  dataUri: "Data URI",
  dataUriPlaceholder: "生成的 Data URI 将显示在这里...",
  onlyOneFile: "只能上传一个文件",
  readFailed: "读取文件失败",
  unknownType: "未知类型",
  fileSize: "文件大小",
  mimeType: "MIME 类型",
  copyLabel: "复制",
  copiedLabel: "已复制",
} as const

afterEach(() => {
  cleanup()
})

beforeEach(() => {
  mockedReadFileAsDataUri.mockReset()
})

describe("FileToDataUriConverterClient", () => {
  test("renders the empty state before a file is selected", () => {
    render(<FileToDataUriConverterClient messages={messages} />)

    expect(screen.getByText(messages.dragOrClick)).toBeTruthy()
    expect(screen.getByText(messages.dataUriPlaceholder)).toBeTruthy()
  })

  test("reads a single file and shows the generated data uri", async () => {
    mockedReadFileAsDataUri.mockResolvedValueOnce(
      "data:text/plain;base64,SGVsbG8="
    )

    render(<FileToDataUriConverterClient messages={messages} />)

    fireEvent.change(screen.getByTestId("file-to-data-uri-input"), {
      target: {
        files: [new File(["hello"], "hello.txt", { type: "text/plain" })],
      },
    })

    await waitFor(() => {
      expect(
        screen.getByDisplayValue("data:text/plain;base64,SGVsbG8=")
      ).toBeTruthy()
    })

    expect(screen.getAllByText("hello.txt").length).toBeGreaterThan(0)
    expect(screen.getAllByText("text/plain").length).toBeGreaterThan(0)
  })

  test("shows an error when multiple files are provided", () => {
    render(<FileToDataUriConverterClient messages={messages} />)

    fireEvent.change(screen.getByTestId("file-to-data-uri-input"), {
      target: {
        files: [
          new File(["a"], "a.txt", { type: "text/plain" }),
          new File(["b"], "b.txt", { type: "text/plain" }),
        ],
      },
    })

    expect(screen.getByText(messages.onlyOneFile)).toBeTruthy()
    expect(mockedReadFileAsDataUri).not.toHaveBeenCalled()
  })

  test("shows an error when file reading fails", async () => {
    mockedReadFileAsDataUri.mockRejectedValueOnce(new Error("read-failed"))

    render(<FileToDataUriConverterClient messages={messages} />)

    fireEvent.change(screen.getByTestId("file-to-data-uri-input"), {
      target: {
        files: [new File(["hello"], "hello.txt", { type: "text/plain" })],
      },
    })

    await waitFor(() => {
      expect(screen.getAllByText(messages.readFailed).length).toBeGreaterThan(0)
    })
  })

  test("localizes the main labels in zh-CN", () => {
    render(<FileToDataUriConverterClient messages={zhMessages} />)

    expect(screen.getAllByText(zhMessages.file).length).toBeGreaterThan(0)
    expect(screen.getByText(zhMessages.dataUriPlaceholder)).toBeTruthy()
  })
})
