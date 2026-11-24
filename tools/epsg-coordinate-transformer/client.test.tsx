import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, it } from "vitest"
import Client from "./client"
import messages from "./messages/en.json"

afterEach(cleanup)

it("formats the example and reuses the transformed coordinates when reversing", () => {
  render(<Client messages={messages} />)
  fireEvent.click(screen.getByRole("button", { name: messages.example }))
  expect(
    screen.getByRole("textbox", { name: messages.longitude })
  ).toHaveProperty("value", "139.76709")
  expect(screen.getByRole("textbox", { name: /Easting/ })).toHaveProperty(
    "value",
    "15558801.288"
  )
  fireEvent.click(screen.getByRole("button", { name: messages.swap }))
  expect(
    screen.getByRole("textbox", { name: messages.longitude })
  ).toHaveProperty("value", "139.76709")
})

it("accepts typed codes and exposes invalid input", () => {
  render(<Client messages={messages} />)
  const source = screen.getByRole("combobox", { name: messages.source })
  fireEvent.focus(source)
  fireEvent.change(source, { target: { value: "Mercator" } })
  expect(screen.queryByText(messages.noSystems)).toBeNull()
  fireEvent.blur(source)
  expect(screen.getByText(messages.noSystems)).toBeDefined()
  fireEvent.change(source, { target: { value: "4326" } })
  fireEvent.blur(source)
  expect(source).toHaveProperty("value", "EPSG:4326 — WGS 84")
  fireEvent.change(screen.getByRole("textbox", { name: messages.longitude }), {
    target: { value: "1" },
  })
  fireEvent.change(screen.getByRole("textbox", { name: messages.latitude }), {
    target: { value: "95" },
  })
  expect(screen.getByText(messages.invalid)).toBeDefined()
})
