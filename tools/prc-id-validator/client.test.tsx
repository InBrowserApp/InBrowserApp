import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import PrcIdValidatorClient from "./client"
import { getResidentIdCheckDigit } from "./core/resident-id"
import enMessages from "./messages/en.json"
import zhCNMessages from "./messages/zh-CN.json"
import enMeta from "./meta/en.json"
import zhCNMeta from "./meta/zh-CN.json"

function buildMessages(meta: typeof enMeta, messages: typeof enMessages) {
  return { meta, ...messages }
}

function buildResidentId(core: string) {
  const checkDigit = getResidentIdCheckDigit(core)

  if (!checkDigit) {
    throw new Error(`Unable to build resident id for core: ${core}`)
  }

  return `${core}${checkDigit}`
}

afterEach(() => {
  cleanup()
})

describe("PrcIdValidatorClient", () => {
  it("renders the empty result state before input", () => {
    render(
      <PrcIdValidatorClient messages={buildMessages(enMeta, enMessages)} />
    )

    expect(screen.getAllByText("Validation Result")).toHaveLength(2)
    expect(
      screen.getAllByText(
        "Validate PRC Resident ID numbers, decode region, birthdate, and checksum"
      )
    ).toHaveLength(3)
  })

  it("shows decoded resident id details for a valid id", () => {
    const residentId = buildResidentId("11010119900101001")

    render(
      <PrcIdValidatorClient messages={buildMessages(enMeta, enMessages)} />
    )

    const input = screen.getByPlaceholderText("Enter 18-digit ID number")
    fireEvent.change(input, {
      target: { value: "110101 19900101-0015" },
    })

    expect(screen.getAllByText("Valid").length).toBeGreaterThan(0)
    expect(screen.getByText("北京市")).toBeTruthy()
    expect(screen.getByText("市辖区")).toBeTruthy()
    expect(screen.getByText("东城区")).toBeTruthy()
    expect(screen.getByText("Male")).toBeTruthy()
    expect(screen.getByText(residentId)).toBeTruthy()
  })

  it("shows known region info while the id is still incomplete", () => {
    render(
      <PrcIdValidatorClient messages={buildMessages(enMeta, enMessages)} />
    )

    const input = screen.getByPlaceholderText("Enter 18-digit ID number")
    fireEvent.change(input, {
      target: { value: "11" },
    })

    expect(screen.getAllByText("北京市").length).toBeGreaterThan(0)
    expect(screen.queryByRole("alert")).toBeNull()
  })

  it("shows partial birthdate progress before the full date is entered", () => {
    render(
      <PrcIdValidatorClient messages={buildMessages(enMeta, enMessages)} />
    )

    const input = screen.getByPlaceholderText("Enter 18-digit ID number")
    fireEvent.change(input, {
      target: { value: "3505241990" },
    })

    expect(screen.getByText("1990-MM-DD")).toBeTruthy()
    expect(screen.getByText("1990")).toBeTruthy()
    expect(screen.getAllByText("MM").length).toBeGreaterThan(0)
    expect(screen.getAllByText("DD").length).toBeGreaterThan(0)
  })

  it("localizes labels in zh-CN", () => {
    const residentId = buildResidentId("11010119900101002")

    render(
      <PrcIdValidatorClient messages={buildMessages(zhCNMeta, zhCNMessages)} />
    )

    const input = screen.getByPlaceholderText("输入18位身份证号")
    fireEvent.change(input, {
      target: { value: residentId.toLowerCase() },
    })

    expect(screen.getAllByText("验证结果").length).toBeGreaterThan(0)
    expect(screen.getAllByText("有效").length).toBeGreaterThan(0)
    expect(screen.getByText("女")).toBeTruthy()
  })
})
