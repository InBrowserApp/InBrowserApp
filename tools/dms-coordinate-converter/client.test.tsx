import { fireEvent, render, screen, within } from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"
import Client from "./client"
import messages from "./messages/en.json"

afterEach(() => vi.restoreAllMocks())

it("converts in either direction and copies the entered decimal precision", async () => {
  const writeText = vi
    .spyOn(navigator.clipboard, "writeText")
    .mockResolvedValue()
  render(<Client messages={messages} />)
  const decimalCopy = screen.getByRole("button", {
    name: `${messages.copy} (${messages.decimal})`,
  })
  const dmsCopy = screen.getByRole("button", {
    name: `${messages.copy} (${messages.dms})`,
  })
  expect(decimalCopy).toHaveProperty("disabled", true)
  fireEvent.click(screen.getByRole("button", { name: messages.example }))
  const latitude = screen.getByRole("textbox", { name: messages.latitude })
  const longitude = screen.getByRole("textbox", { name: messages.longitude })
  fireEvent.change(latitude, { target: { value: "35.68123456" } })
  fireEvent.click(decimalCopy)
  expect(writeText).toHaveBeenCalledWith("35.68123456, 139.76709")

  const dmsLatitude = within(
    screen.getByRole("group", { name: messages.latitude })
  )
  fireEvent.change(dmsLatitude.getByRole("combobox"), {
    target: { value: "negative" },
  })
  expect((latitude as HTMLInputElement).value).toMatch(/^-/)
  fireEvent.click(dmsCopy)
  expect(writeText.mock.lastCall?.[0]).toMatch(/S, .* E$/)

  fireEvent.change(
    dmsLatitude.getByRole("textbox", { name: messages.minutes }),
    { target: { value: "60" } }
  )
  expect((await screen.findByText(messages.invalid)).getAttribute("role")).toBe(
    "status"
  )
  fireEvent.change(longitude, { target: { value: "181" } })
  expect(longitude.getAttribute("aria-invalid")).toBe("true")
})
