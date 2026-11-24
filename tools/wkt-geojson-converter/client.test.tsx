import { fireEvent, render, screen } from "@testing-library/react"
import { expect, it } from "vitest"
import Client from "./client"
import messages from "./messages/en.json"

it("runs both directions and associates failures with the source editor", () => {
  render(<Client messages={messages} />)
  fireEvent.click(screen.getByRole("button", { name: messages.example }))
  expect(screen.getByRole("textbox", { name: "GeoJSON" })).toHaveProperty(
    "value",
    expect.stringContaining("LineString")
  )
  fireEvent.click(screen.getByRole("button", { name: messages.swap }))
  expect(screen.getByRole("textbox", { name: "WKT" })).toHaveProperty(
    "value",
    expect.stringContaining("LINESTRING")
  )
  const source = screen.getByRole("textbox", { name: "GeoJSON" })
  fireEvent.change(source, { target: { value: "{}" } })
  fireEvent.click(screen.getByRole("button", { name: messages.convert }))
  expect(source.getAttribute("aria-invalid")).toBe("true")
  expect(screen.getByRole("status").textContent).toBe(messages.invalid)
})
