import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import BicSwiftValidatorClient from "./client"
import messagesCatalog from "./messages/en.json"
import zhCnMessagesCatalog from "./messages/zh-CN.json"
import meta from "./meta/en.json"
import zhCnMeta from "./meta/zh-CN.json"

const messages = { meta, ...messagesCatalog }
const zhCnMessages = { meta: zhCnMeta, ...zhCnMessagesCatalog }

describe("BicSwiftValidatorClient", () => {
  afterEach(cleanup)

  it("renders the empty state before any input", () => {
    render(<BicSwiftValidatorClient lang="en" messages={messages} />)

    expect(screen.getAllByText("BIC / SWIFT Code").length).toBeGreaterThan(0)
    expect(screen.getAllByText(meta.description).length).toBeGreaterThan(0)
    expect(screen.getAllByText("Validation Result").length).toBeGreaterThan(0)
    expect(screen.queryByText("Valid BIC / SWIFT code")).toBeNull()
  })

  it("validates a BIC-8 code", () => {
    render(<BicSwiftValidatorClient lang="en" messages={messages} />)

    fireEvent.change(
      screen.getByRole("textbox", { name: "BIC / SWIFT Code" }),
      {
        target: { value: "deut deff" },
      }
    )

    expect(
      screen.getAllByText("Valid BIC / SWIFT code").length
    ).toBeGreaterThan(0)
    expect(screen.getByDisplayValue("DEUTDEFF")).toBeTruthy()
    expect(screen.getByText("BIC-8")).toBeTruthy()
    expect(screen.getByText("Germany (DE)")).toBeTruthy()
    expect(screen.getByText("Primary Office")).toBeTruthy()
  })

  it("shows branch office details for BIC-11 codes", () => {
    render(<BicSwiftValidatorClient lang="en" messages={messages} />)

    fireEvent.change(
      screen.getByRole("textbox", { name: "BIC / SWIFT Code" }),
      {
        target: { value: "DEUTDEFF500" },
      }
    )

    expect(screen.getByText("Branch Office")).toBeTruthy()
    expect(screen.getByText("500")).toBeTruthy()
  })

  it("shows country feedback for unsupported prefixes", () => {
    render(<BicSwiftValidatorClient lang="en" messages={messages} />)

    fireEvent.change(
      screen.getByRole("textbox", { name: "BIC / SWIFT Code" }),
      {
        target: { value: "DEUTZZFF" },
      }
    )

    expect(screen.getAllByText("Unknown country code").length).toBeGreaterThan(
      0
    )
    expect(screen.getAllByText("Unknown").length).toBeGreaterThan(0)
  })

  it("localizes the country display when a localized language is active", () => {
    render(<BicSwiftValidatorClient lang="zh-CN" messages={zhCnMessages} />)

    fireEvent.change(
      screen.getByRole("textbox", { name: "BIC / SWIFT 代码" }),
      {
        target: { value: "DEUTDEFF" },
      }
    )

    expect(screen.getByText("德国 (DE)")).toBeTruthy()
  })
})
