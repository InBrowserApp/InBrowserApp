import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, it } from "vitest"
import { Pairs } from "./pair-list"
import m from "../messages/en.json"

afterEach(cleanup)

it("pages large detail lists without creating a row for every recorded value", () => {
  const values = Array.from({ length: 101 }, (_, id) => ({
    name: `Header-${id}`,
    value: `value-${id}`,
  }))
  const { container } = render(
    <Pairs title={m.headers} values={values} messages={m} lang="en" />
  )
  expect(container.querySelectorAll("dt")).toHaveLength(50)
  expect(screen.getByRole("button", { name: m.previous })).toHaveProperty(
    "disabled",
    true
  )
  fireEvent.click(screen.getByRole("button", { name: m.next }))
  expect(screen.getByText("Header-50")).toBeTruthy()
  expect(screen.queryByText("Header-0")).toBeNull()
  fireEvent.click(screen.getByRole("button", { name: m.next }))
  expect(container.querySelectorAll("dt")).toHaveLength(1)
  expect(screen.getByText("Header-100")).toBeTruthy()
  expect(screen.getByRole("button", { name: m.next })).toHaveProperty(
    "disabled",
    true
  )
  fireEvent.click(screen.getByRole("button", { name: m.previous }))
  expect(screen.getByText("Header-50")).toBeTruthy()
})

it("shows multipart filenames, media types and ordinary or empty form values", () => {
  render(
    <Pairs
      title={m.parameters}
      values={[
        {
          name: "upload",
          value: "photo.jpg",
          fileName: "photo.jpg",
          contentType: "image/jpeg",
        },
        {
          name: "with-value",
          value: "recorded-content",
          fileName: "notes.txt",
        },
        { name: "empty", value: "" },
      ]}
      messages={m}
      lang="en"
    />
  )
  expect(screen.getByText(`${m.fileName}: photo.jpg`)).toBeTruthy()
  expect(screen.getByText(`${m.contentType}: image/jpeg`)).toBeTruthy()
  expect(screen.getByText(`${m.fileName}: notes.txt`)).toBeTruthy()
  expect(screen.getByText("recorded-content")).toBeTruthy()
  expect(screen.getByText("empty")).toBeTruthy()
})

it("bounds long displayed field values and explains the preview limit", () => {
  const text = "x".repeat(100_001)
  const { container } = render(
    <Pairs
      title={m.headers}
      values={[{ name: "Long-Header", value: text }]}
      messages={m}
      lang="en"
    />
  )
  expect(container.querySelector("dd p")?.textContent).toHaveLength(100_000)
  expect(screen.getByText(m.valueTruncated)).toBeTruthy()
})

it("handles empty detail lists", () => {
  render(<Pairs title={m.cookies} values={[]} messages={m} lang="en" />)
  expect(screen.getByText(m.none)).toBeTruthy()
  expect(screen.queryByRole("navigation")).toBeNull()
})
