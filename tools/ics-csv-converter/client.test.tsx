import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react"
import { afterEach, expect, test } from "vitest"
import Client from "./client"
import messages from "./messages/zh-TW.json"

afterEach(cleanup)

test("shows localized calendar preview and replaces an error after correcting CSV input", () => {
  render(<Client language="zh-TW" messages={messages} />)
  const button = (name: string) =>
    screen.getByRole("button", { name, exact: true })
  const source = screen.getByRole("textbox", { name: messages.input })
  fireEvent.click(button(messages.reverse))
  fireEvent.change(source, {
    target: { value: "Title,Start\nWorkshop,2026-02-31" },
  })
  fireEvent.click(button(messages.convert))
  expect(screen.getByRole("alert").textContent).toBe(
    messages.rowError.replace("{row}", "2")
  )

  fireEvent.change(source, {
    target: { value: "Title,Start\nWorkshop,2026-02-23" },
  })
  fireEvent.click(button(messages.convert))
  const preview = within(screen.getByRole("table"))
  expect(
    preview.getByRole("columnheader", { name: messages.columns.Start })
  ).toBeTruthy()
  expect(preview.getByText("Workshop")).toBeTruthy()
  expect(screen.queryByRole("alert")).toBeNull()
})
