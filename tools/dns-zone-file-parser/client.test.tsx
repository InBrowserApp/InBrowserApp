import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"
import Client from "./client"
import messages from "./messages/en.json"

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

function renderParser() {
  return render(<Client messages={messages} language="en" />)
}

const click = (name: string) =>
  fireEvent.click(screen.getByRole("button", { name }))
const input = (name: string, value: string) =>
  fireEvent.change(screen.getByLabelText(name), { target: { value } })

test("shows a local sample, filters its records, and copies the visible rows", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined)
  vi.stubGlobal("navigator", { clipboard: { writeText } })
  renderParser()
  expect(screen.queryByRole("table")).toBeNull()
  click(messages.example)
  expect(screen.getByText("8 of 8 records")).toBeTruthy()
  input(messages.search, "  HELLO; WORLD ")
  expect(screen.getByText("1 of 8 records")).toBeTruthy()
  expect(screen.queryByText("2001:db8::80")).toBeNull()
  click(messages.copy)
  await screen.findByText(messages.copied)
  expect(JSON.parse(writeText.mock.calls[0]![0])).toMatchObject([
    { name: "example.com.", type: "TXT", ttl: 3600, data: '"hello; world"' },
  ])
  input(messages.search, "nomatch")
  expect(screen.getByText(messages.noMatches)).toBeTruthy()
})

test("applies an initial origin and shows notes alongside readable records", () => {
  renderParser()
  input(messages.source, "$INCLUDE extras.zone")
  expect(screen.getByText(messages.noRecords)).toBeTruthy()
  expect(
    screen.getByText(messages.unsupported.replace("{directive}", "$INCLUDE"))
  ).toBeTruthy()
  input(messages.source, "$INCLUDE extras.zone\nwww IN A 192.0.2.1")
  input(messages.origin, " lab.example ")
  expect(screen.getByText("www.lab.example.")).toBeTruthy()
  expect(screen.getByText("—")).toBeTruthy()
  input(messages.source, "bad IN A")
  expect(screen.getByText(messages.record)).toBeTruthy()
})

test("reads a local file and reports a read failure without losing the input", async () => {
  const { container } = renderParser()
  const picker =
    container.querySelector<HTMLInputElement>('input[type="file"]')!
  const open = vi.spyOn(picker, "click")
  click(messages.open)
  expect(open).toHaveBeenCalledOnce()
  fireEvent.change(picker, { target: { files: [] } })
  fireEvent.change(picker, {
    target: {
      files: [{ name: "lab.zone", text: async () => "host A 192.0.2.10" }],
    },
  })
  expect(await screen.findByText("lab.zone")).toBeTruthy()
  expect(screen.getByText("192.0.2.10")).toBeTruthy()
  fireEvent.change(picker, {
    target: {
      files: [
        {
          name: "unreadable.zone",
          text: async () => {
            throw new Error("read failed")
          },
        },
      ],
    },
  })
  expect(await screen.findByRole("alert")).toBeTruthy()
  expect(screen.getByText("192.0.2.10")).toBeTruthy()
})

test("a late file result or error never replaces subsequent pasted input", async () => {
  const { container } = renderParser()
  const picker =
    container.querySelector<HTMLInputElement>('input[type="file"]')!
  let resolve!: (text: string) => void
  let reject!: (error: Error) => void
  fireEvent.change(picker, {
    target: {
      files: [
        {
          name: "slow.zone",
          text: () =>
            new Promise((done) => {
              resolve = done
            }),
        },
      ],
    },
  })
  fireEvent.change(picker, {
    target: {
      files: [
        {
          name: "broken.zone",
          text: () =>
            new Promise((_, fail) => {
              reject = fail
            }),
        },
      ],
    },
  })
  input(messages.source, "new A 192.0.2.77")
  await act(async () => {
    resolve("old A 192.0.2.99")
    reject(new Error("failed"))
  })
  expect(screen.getByText("192.0.2.77")).toBeTruthy()
  expect(screen.queryByRole("alert")).toBeNull()
  expect(screen.queryByText("192.0.2.99")).toBeNull()
})
