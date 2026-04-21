import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import UserAgentParserClient from "./client"

const messages = {
  meta: {
    name: "User-Agent Parser",
    description:
      "Parse user agent strings to identify browser, OS, device, engine, and CPU details. Works entirely offline.",
  },
  "use-current": "Use my user agent",
  "input-label": "User Agent",
  "input-placeholder": "Paste a user agent string here...",
  "input-error": "Enter a user agent string to parse.",
  "json-output": "JSON Output",
  "empty-state": "Paste a user agent string to see parsed details.",
  "parsed-details": "Parsed Details",
  unknown: "Unknown",
  browser: "Browser",
  os: "Operating System",
  engine: "Engine",
  device: "Device",
  cpu: "CPU",
  name: "Name",
  version: "Version",
  major: "Major",
  type: "Type",
  vendor: "Vendor",
  model: "Model",
  architecture: "Architecture",
  copyLabel: "Copy",
  copiedLabel: "Copied",
} as const

const zhMessages = {
  ...messages,
  meta: {
    name: "用户代理（User-Agent）解析器",
    description:
      "解析 User-Agent 字符串，识别浏览器、操作系统、设备、引擎与 CPU 信息。全程离线。",
  },
  "use-current": "使用我的用户代理",
  "input-label": "用户代理（User-Agent）",
  "input-placeholder": "在此粘贴 User-Agent 字符串...",
  "input-error": "请输入要解析的 User-Agent 字符串。",
  "json-output": "JSON 输出",
  "empty-state": "粘贴 User-Agent 字符串以查看解析结果。",
  "parsed-details": "解析结果",
  unknown: "未知",
  browser: "浏览器",
  os: "操作系统",
  engine: "引擎",
  device: "设备",
  cpu: "CPU",
  name: "名称",
  version: "版本",
  major: "主版本",
  type: "类型",
  vendor: "厂商",
  model: "型号",
  architecture: "架构",
  copyLabel: "复制",
  copiedLabel: "已复制",
} as const

afterEach(() => {
  cleanup()
})

describe("UserAgentParserClient", () => {
  test("renders empty states before parsing", () => {
    render(<UserAgentParserClient messages={messages} />)

    expect(screen.getByLabelText(messages["input-label"])).toBeTruthy()
    expect(screen.getAllByText(messages["empty-state"]).length).toBeGreaterThan(
      0
    )
  })

  test("parses a user agent string and renders details", async () => {
    render(<UserAgentParserClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages["input-label"]), {
      target: {
        value:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
      },
    })

    await waitFor(() => {
      expect(screen.getByText("Chrome")).toBeTruthy()
      expect(screen.getByText("Windows")).toBeTruthy()
      expect(screen.getByText(messages.browser)).toBeTruthy()
    })

    expect(
      screen.getByRole("button", { name: messages.copyLabel })
    ).toBeTruthy()
    expect(
      screen.getByRole("region", { name: messages["json-output"] }).textContent
    ).toContain("Mozilla/5.0")
  })

  test("uses the current user agent when requested", async () => {
    const descriptor = Object.getOwnPropertyDescriptor(
      window.navigator,
      "userAgent"
    )

    Object.defineProperty(window.navigator, "userAgent", {
      configurable: true,
      value: "Test UA",
    })

    render(<UserAgentParserClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("button", { name: messages["use-current"] })
    )

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test UA")).toBeTruthy()
    })

    if (descriptor) {
      Object.defineProperty(window.navigator, "userAgent", descriptor)
    }
  })

  test("localizes the main labels in zh-CN", () => {
    render(<UserAgentParserClient messages={zhMessages} />)

    expect(screen.getByLabelText(zhMessages["input-label"])).toBeTruthy()
    expect(
      screen.getAllByText(zhMessages["parsed-details"]).length
    ).toBeGreaterThan(0)
    expect(
      screen.getAllByText(zhMessages["empty-state"]).length
    ).toBeGreaterThan(0)
  })
})
