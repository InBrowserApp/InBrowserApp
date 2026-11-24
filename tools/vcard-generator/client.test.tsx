import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import Client from "./client"
import messages from "./messages/en.json"

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

function watchDownloads() {
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
  return vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:contact")
}

function fill(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } })
}

test("previews a contact and downloads its latest details as VCF", async () => {
  const download = watchDownloads()
  render(<Client messages={messages} language="en" />)

  expect(screen.queryByRole("link", { name: messages.download })).toBeNull()
  expect(
    screen.getByRole<HTMLButtonElement>("button", { name: messages.copy })
      .disabled
  ).toBe(true)

  fill(messages.firstName, "Taylor")
  fill(messages.lastName, "Morgan")
  fill(messages.email, "taylor@example.com")
  fill(messages.phone, "+1 202 555 0100")
  fireEvent.click(screen.getByText(messages.more))
  fill(messages.jobTitle, "Events lead")
  fill(messages.website, "example.com")
  fill(messages.notes, "Met on Tuesday")

  expect(screen.getByText("Taylor Morgan")).toBeTruthy()
  expect(screen.getByText("Events lead")).toBeTruthy()
  expect(screen.getByText("taylor@example.com")).toBeTruthy()

  const link = screen.getByRole("link", { name: messages.download })
  expect(link.getAttribute("download")).toBe("Taylor Morgan.vcf")
  expect(link.getAttribute("href")).toBe("blob:contact")

  const blob = download.mock.lastCall?.[0] as Blob
  expect(blob.type).toBe("text/vcard;charset=utf-8")
  expect(await blob.text()).toContain(
    "N:Morgan;Taylor;;;\r\nFN:Taylor Morgan\r\nTEL:+1 202 555 0100\r\nEMAIL:taylor@example.com\r\nTITLE:Events lead\r\nURL:https://example.com\r\nNOTE:Met on Tuesday"
  )
})

test("shows the family name first for Chinese while keeping vCard name fields structured", async () => {
  const download = watchDownloads()
  render(<Client messages={messages} language="zh-TW" />)

  expect(screen.getAllByRole("textbox")[0]).toBe(
    screen.getByLabelText(messages.lastName)
  )
  fill(messages.firstName, "小明")
  fill(messages.lastName, "王")

  expect(screen.getByText("王 小明")).toBeTruthy()
  const blob = download.mock.lastCall?.[0] as Blob
  expect(await blob.text()).toContain("N:王;小明;;;\r\nFN:王 小明\r\n")
})
