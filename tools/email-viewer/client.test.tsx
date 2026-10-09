import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import Client from "./client"
import m from "./messages/en.json"
import type { Email } from "./types"
const mock = vi.hoisted(() => ({
  open: vi.fn(),
  prepare: vi.fn(),
  dispose: vi.fn(),
}))
vi.mock("./open-email", () => ({ openEmail: mock.open }))
vi.mock("./preview", () => ({ preparePreview: mock.prepare }))
vi.mock("./message-frame", () => ({
  MessageFrame: ({
    html,
    title,
    size,
  }: {
    html: string
    title: string
    size: number
  }) => (
    <div aria-label={title} data-size={size}>
      {html === "safe" ? "Safe HTML" : html}
    </div>
  ),
}))
const email = (): Email => ({
  format: "EML",
  subject: "Field notes 世界",
  from: "Mina <mina@example.test>",
  to: "Team <team@example.test>",
  cc: "",
  bcc: "",
  date: "Thu, 8 Oct 2026 14:35:00 -0700",
  html: "<p>HTML body</p>",
  text: "Plain message\n> Quoted reply",
  notices: [],
  attachments: [
    { name: "plot.png", type: "image/png", size: 1024, kind: "inline" },
    { name: "", type: "message/rfc822", size: null, kind: "nested" },
  ],
})
const file = (name = "message.eml") => new File(["mail"], name)
function choose(value = file()) {
  fireEvent.change(screen.getByLabelText(m.open), {
    target: { files: [value] },
  })
}
beforeEach(() => {
  vi.clearAllMocks()
  document.documentElement.dir = "ltr"
  mock.open.mockResolvedValue(email())
  mock.prepare.mockReturnValue({
    html: "safe",
    plainHtml: "Plain message\n> Quoted reply",
    limited: true,
    dispose: mock.dispose,
  })
})
afterEach(cleanup)

test("opens locally, preserves date/zone, shows attachment roles, switches alternatives and zooms", async () => {
  render(<Client messages={m} />)
  expect(screen.getByText(m.drop)).toBeTruthy()
  choose()
  await screen.findByText("Field notes 世界")
  expect(screen.getByText(/Thu, 8 Oct 2026 14:35:00 -0700/)).toBeTruthy()
  fireEvent.click(screen.getByText(m.headers))
  expect(screen.getByText("Team <team@example.test>")).toBeTruthy()
  fireEvent.click(screen.getByText(`${m.attachments} (2)`))
  expect(screen.getByText(m.inline)).toBeTruthy()
  expect(screen.getByText(m.nested)).toBeTruthy()
  expect(screen.getByText(m.unknownSize)).toBeTruthy()
  fireEvent.click(screen.getByText(m.compatibility))
  expect(screen.getByText(m.limited)).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: m.zoomIn }))
  expect(screen.getByText("Safe HTML").getAttribute("data-size")).toBe("18")
  for (let i = 0; i < 20; i++)
    fireEvent.click(screen.getByRole("button", { name: m.zoomOut }))
  expect(screen.getByRole("button", { name: m.zoomOut })).toHaveProperty(
    "disabled",
    true
  )
  for (let i = 0; i < 20; i++)
    fireEvent.click(screen.getByRole("button", { name: m.zoomIn }))
  expect(screen.getByRole("button", { name: m.zoomIn })).toHaveProperty(
    "disabled",
    true
  )
  fireEvent.mouseDown(screen.getByRole("tab", { name: m.plain }), {
    button: 0,
    ctrlKey: false,
  })
  const plain = await screen.findByLabelText(m.plain, {
    selector: "[data-size]",
  })
  expect(plain.textContent).toContain("Plain message\n> Quoted reply")
  expect(plain.getAttribute("data-size")).toBe("32")
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  expect(screen.getByText(m.drop)).toBeTruthy()
  expect(mock.dispose).toHaveBeenCalledOnce()
})

test("supports RTL, fallback metadata, empty and rich-text-only messages", async () => {
  document.documentElement.dir = "rtl"
  mock.open.mockResolvedValue({
    ...email(),
    subject: "",
    from: "",
    date: "",
    html: "",
    text: "",
    attachments: [],
    notices: ["rtfOnly"],
  })
  mock.prepare.mockReturnValue({
    html: "",
    plainHtml: "",
    limited: false,
    dispose: mock.dispose,
  })
  render(<Client messages={m} />)
  choose(file("rtf.msg"))
  await screen.findByText(m.subjectFallback)
  expect(screen.getAllByText(m.rtfOnly)).toHaveLength(2)
  expect(
    screen.getByRole("tablist").closest("[data-slot=tabs]")?.getAttribute("dir")
  ).toBe("rtl")
  mock.open.mockResolvedValue({ ...email(), html: "", text: "", notices: [] })
  choose(file("empty-body.eml"))
  await screen.findByText(m.noBody)
})

test("maps invalid, empty, protected and real resource errors without fixed size caps", async () => {
  render(<Client messages={m} />)
  choose(file("wrong.txt"))
  await screen.findByText(m.invalid)
  choose(new File([], "empty.eml"))
  await screen.findByText(m.emptyFile)
  expect(mock.open).not.toHaveBeenCalled()
  for (const [reason, text] of [
    [new Error("protected"), m.protected],
    [new RangeError("memory"), m.resourceLimit],
    [new Error("resourceLimit"), m.resourceLimit],
    [new Error("bad"), m.invalid],
  ] as const) {
    mock.open.mockRejectedValueOnce(reason)
    choose()
    await screen.findByText(text)
  }
  const large = file("large.eml")
  Object.defineProperty(large, "size", { value: 150 * 1024 * 1024 })
  choose(large)
  await screen.findByText("Field notes 世界")
  expect(mock.open).toHaveBeenLastCalledWith(large, expect.any(AbortSignal))
})

test("cancels stale parses on replacement and releases preview URLs", async () => {
  let finish!: (email: Email) => void
  mock.open.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve
      })
  )
  render(<Client messages={m} />)
  choose(file("old.eml"))
  await waitFor(() => expect(mock.open).toHaveBeenCalledOnce())
  const signal = mock.open.mock.calls[0]![1] as AbortSignal
  choose(file("new.emlx"))
  await screen.findByText("Field notes 世界")
  expect(signal.aborted).toBe(true)
  finish({ ...email(), subject: "Stale content" })
  await waitFor(() => expect(screen.queryByText("Stale content")).toBeNull())
  expect(mock.prepare).toHaveBeenCalledOnce()
  choose(file("next.eml"))
  await waitFor(() => expect(mock.dispose).toHaveBeenCalledOnce())
})

test("retains file controls when safe preview preparation fails", async () => {
  mock.prepare.mockImplementationOnce(() => {
    throw new RangeError("memory")
  })
  render(<Client messages={m} />)
  choose()
  await screen.findByText(m.resourceLimit)
  expect(screen.getByRole("button", { name: m.replace })).toBeTruthy()
  expect(screen.getByRole("button", { name: m.clear })).toBeTruthy()
})
