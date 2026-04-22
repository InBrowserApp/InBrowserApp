import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import IbanValidatorClient from "./client"
import messagesCatalog from "./messages/en.json"
import zhCnMessagesCatalog from "./messages/zh-CN.json"
import meta from "./meta/en.json"
import zhCnMeta from "./meta/zh-CN.json"

const messages = { meta, ...messagesCatalog }
const zhCnMessages = { meta: zhCnMeta, ...zhCnMessagesCatalog }

describe("IbanValidatorClient", () => {
  afterEach(cleanup)

  it("renders the empty state before any input", () => {
    render(<IbanValidatorClient lang="en" messages={messages} />)

    expect(screen.getAllByText("IBAN").length).toBeGreaterThan(0)
    expect(screen.getAllByText(meta.description).length).toBeGreaterThan(0)
    expect(screen.getAllByText("Validation Result").length).toBeGreaterThan(0)
    expect(screen.queryByText("Valid IBAN")).toBeNull()
  })

  it("formats and validates a UK IBAN", () => {
    render(<IbanValidatorClient lang="en" messages={messages} />)

    fireEvent.change(screen.getByRole("textbox", { name: "IBAN" }), {
      target: { value: "GB29NWBK60161331926819" },
    })

    expect(screen.getAllByText("Valid IBAN").length).toBeGreaterThan(0)
    expect(screen.getByDisplayValue("GB29 NWBK 6016 1331 9268 19")).toBeTruthy()
    expect(screen.getByText("United Kingdom (GB)")).toBeTruthy()
    expect(screen.getAllByText("Pass").length).toBeGreaterThan(0)
  })

  it("shows checksum feedback for an invalid IBAN", () => {
    render(<IbanValidatorClient lang="en" messages={messages} />)

    fireEvent.change(screen.getByRole("textbox", { name: "IBAN" }), {
      target: { value: "GB29NWBK60161331926818" },
    })

    expect(screen.getAllByText("Invalid checksum").length).toBeGreaterThan(0)
    expect(screen.getByDisplayValue("GB29 NWBK 6016 1331 9268 18")).toBeTruthy()
  })

  it("shows unknown country feedback for unsupported prefixes", () => {
    render(<IbanValidatorClient lang="en" messages={messages} />)

    fireEvent.change(screen.getByRole("textbox", { name: "IBAN" }), {
      target: { value: "ZZ00TEST12345678901234" },
    })

    expect(screen.getAllByText("Unknown country code").length).toBeGreaterThan(
      0
    )
    expect(screen.getAllByText("Unknown").length).toBeGreaterThan(0)
  })

  it("localizes the country display when a localized language is active", () => {
    render(<IbanValidatorClient lang="zh-CN" messages={zhCnMessages} />)

    fireEvent.change(screen.getByRole("textbox", { name: "IBAN" }), {
      target: { value: "GB29NWBK60161331926819" },
    })

    expect(screen.getByText("英国 (GB)")).toBeTruthy()
  })
})
