import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, it, vi } from "vitest"
import HarAnalyzer from "./client"
import { Requests } from "./components/requests"
import { Summary } from "./components/summary"
import { BodyView } from "./components/fields"
import { Waterfall } from "./components/timing"
import { parseHar } from "./core/parse"
import { exampleHar } from "./sample"
import m from "./messages/en.json"
import type { Body } from "./types"

const capture = parseHar(exampleHar())
class FakeWorker {
  static latest?: FakeWorker
  onmessage: ((event: { data: unknown }) => void) | null = null
  onerror = null
  postMessage = vi.fn()
  terminate = vi.fn()
  constructor() {
    FakeWorker.latest = this
  }
}
const button = (name: string | RegExp) => screen.getByRole("button", { name })
const mount = () => render(<HarAnalyzer messages={m} lang="en" />)
const input = () => screen.getByLabelText(m.chooseFile, { selector: "input" })
const tab = (name: string) =>
  fireEvent.mouseDown(screen.getByRole("tab", { name }), {
    button: 0,
    ctrlKey: false,
  })
beforeEach(() => {
  FakeWorker.latest = undefined
  vi.stubGlobal("Worker", FakeWorker)
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

it("offers local file import and a synthetic example, then clears the capture", () => {
  mount()
  expect(screen.getByText(m.privacy)).toBeTruthy()
  const click = vi.spyOn(input() as HTMLInputElement, "click")
  fireEvent.click(button(m.chooseFile))
  fireEvent.click(button(`${m.dropHint} ${m.limits}`))
  expect(click).toHaveBeenCalledTimes(2)
  fireEvent.click(button(m.loadExample))
  expect(screen.getByRole("table")).toBeTruthy()
  expect(screen.getByText(m.sensitive)).toBeTruthy()
  expect(screen.getAllByRole("row")).toHaveLength(10)
  fireEvent.click(button(m.clear))
  expect(screen.queryByRole("table")).toBeNull()
})

it("searches requests, shows an empty result, and resets filters", () => {
  mount()
  fireEvent.click(button(m.loadExample))
  const search = screen.getByRole("searchbox", { name: m.search })
  fireEvent.change(search, { target: { value: "api/activity" } })
  expect(screen.getAllByRole("row")).toHaveLength(2)
  expect(button(/activity/)).toBeTruthy()
  fireEvent.change(search, { target: { value: "no-such-request" } })
  expect(screen.getByText(m.noMatches)).toBeTruthy()
  fireEvent.click(button(m.resetFilters))
  expect(screen.getAllByRole("row")).toHaveLength(10)
})

it("filters errors and redirects and sorts slow or large requests", async () => {
  mount()
  fireEvent.click(button(m.loadExample))
  async function select(label: string, option: string) {
    fireEvent.keyDown(screen.getByRole("combobox", { name: label }), {
      key: "ArrowDown",
    })
    fireEvent.click(await screen.findByRole("option", { name: option }))
  }
  await select(m.statusFilter, m.failed)
  expect(screen.getAllByRole("row")).toHaveLength(4)
  await select(m.statusFilter, m.redirects)
  expect(button(/logo.svg/)).toBeTruthy()
  fireEvent.click(button(m.resetFilters))
  await select(m.sort, m.slowest)
  expect(
    within(screen.getAllByRole("row")[1]!).getByRole("button").textContent
  ).toContain("activity")
  await select(m.sort, m.largest)
  expect(
    within(screen.getAllByRole("row")[1]!).getByRole("button").textContent
  ).toContain("app.js")
})

it("opens request details, inspects query and JSON response, and restores focus on close", async () => {
  mount()
  fireEvent.click(button(m.loadExample))
  const trigger = button(/projects/)
  fireEvent.click(trigger)
  const dialog = screen.getByRole("dialog", { name: m.details })
  expect(within(dialog).getByText("HTTP/2")).toBeTruthy()
  tab(m.request)
  expect(within(dialog).getByText("page")).toBeTruthy()
  expect(within(dialog).getByText(m.bodyMissing)).toBeTruthy()
  tab(m.response)
  expect(within(dialog).getByText(/"Alpha"/)).toBeTruthy()
  tab(m.timing)
  expect(within(dialog).getByText(m.sslNote)).toBeTruthy()
  fireEvent.click(within(dialog).getByRole("button", { name: m.close }))
  expect(screen.queryByRole("dialog")).toBeNull()
  await vi.waitFor(() => expect(document.activeElement).toBe(trigger))
  fireEvent.click(button(/search https/))
  tab(m.request)
  expect(screen.getByText('{"query":"network"}')).toBeTruthy()
})

it("bounds the rendered list and supports paging both ways", () => {
  const entries = Array.from({ length: 101 }, (_, id) => ({
    ...capture.entries[0]!,
    id,
    url: `https://example.com/item-${id}`,
  }))
  render(<Requests capture={{ ...capture, entries }} messages={m} lang="en" />)
  expect(screen.getAllByRole("row")).toHaveLength(51)
  expect(button(m.previous)).toHaveProperty("disabled", true)
  fireEvent.click(button(m.next))
  expect(button(/item-50 /)).toBeTruthy()
  fireEvent.click(button(m.next))
  expect(screen.getAllByRole("row")).toHaveLength(2)
  expect(button(m.next)).toHaveProperty("disabled", true)
  fireEvent.click(button(m.previous))
  fireEvent.change(screen.getByRole("searchbox"), {
    target: { value: "item-100" },
  })
  expect(button(/item-100 /)).toBeTruthy()
  expect(screen.queryByRole("button", { name: m.next })).toBeNull()
})

it("accepts dropped files, handles empty drops, and displays parse errors and skipped counts", () => {
  mount()
  const zone = button(`${m.dropHint} ${m.limits}`)
  fireEvent.dragOver(zone)
  fireEvent.dragLeave(zone)
  fireEvent.drop(zone, { dataTransfer: { files: [] } })
  expect(FakeWorker.latest).toBeUndefined()
  const file = new File(["{}"], "test.har")
  fireEvent.drop(zone, { dataTransfer: { files: [file] } })
  expect(screen.getByRole("button", { name: m.loading })).toHaveProperty(
    "disabled",
    true
  )
  act(() => FakeWorker.latest!.onmessage!({ data: { error: "invalidHar" } }))
  expect(screen.getByRole("alert").textContent).toContain(m.errors.invalidHar)
  fireEvent.change(input(), { target: { files: [file] } })
  act(() =>
    FakeWorker.latest!.onmessage!({
      data: { capture: { ...capture, skipped: 2 } },
    })
  )
  expect(screen.getByText(`${m.skipped}: 2`)).toBeTruthy()
  fireEvent.change(input(), { target: { files: [] } })
  fireEvent.change(input(), { target: { files: [file] } })
  act(() =>
    FakeWorker.latest!.onmessage!({
      data: { capture: parseHar('{"log":{"entries":[]}}') },
    })
  )
  expect(screen.getByText(m.emptyCapture)).toBeTruthy()
  expect(screen.getByText(m.unknown)).toBeTruthy()
})

it.each(["ar", "he"])(
  "uses RTL directions in %s controls and request details",
  (lang) => {
    render(<HarAnalyzer messages={m} lang={lang} />)
    fireEvent.click(button(m.loadExample))
    expect(
      screen.getByRole("combobox", { name: m.statusFilter }).getAttribute("dir")
    ).toBe("rtl")
    fireEvent.click(button(/projects/))
    expect(screen.getByRole("dialog").getAttribute("dir")).toBe("rtl")
    expect(
      screen
        .getByRole("tab", { name: m.request })
        .closest('[data-slot="tabs"]')!
        .getAttribute("dir")
    ).toBe("rtl")
  }
)

it("shows missing, empty, encoded and truncated bodies without executing captured HTML", () => {
  const base: Body = { text: "", mimeType: "", encoding: "", params: [] }
  const { rerender, container } = render(
    <BodyView body={base} messages={m} lang="en" />
  )
  expect(screen.getByText(m.bodyEmpty)).toBeTruthy()
  rerender(
    <BodyView
      body={{
        ...base,
        text: "<script>window.pwned=true</script>",
        encoding: "base64",
        params: [{ name: "form-key", value: "form-value" }],
      }}
      messages={m}
      lang="en"
    />
  )
  expect(screen.getByText(m.bodyEncoded)).toBeTruthy()
  expect(screen.getByText("form-value")).toBeTruthy()
  expect(container.querySelector("script")).toBeNull()
  rerender(
    <BodyView
      body={{ ...base, text: "x".repeat(100_001) }}
      messages={m}
      lang="en"
    />
  )
  expect(screen.getByText(m.bodyTruncated)).toBeTruthy()
})

it("handles unknown totals and timings without manufacturing transferred bytes", () => {
  const entry = {
    ...capture.entries[0]!,
    duration: null,
    transferSize: null,
    timings: {
      blocked: null,
      dns: null,
      connect: null,
      ssl: null,
      send: null,
      wait: null,
      receive: null,
    },
  }
  const empty = { ...capture, span: 0, entries: [entry] }
  render(
    <>
      <Summary capture={empty} messages={m} lang="en" />
      <Waterfall entry={entry} capture={empty} messages={m} lang="en" />
    </>
  )
  expect(screen.getAllByText(m.unknown)).toHaveLength(2)
  expect(screen.getByRole("img").getAttribute("aria-label")).toContain(
    m.unknown
  )
})

it("cancels an import and keeps file selection reachable through visible controls", () => {
  mount()
  expect(input()).toHaveProperty("tabIndex", -1)
  fireEvent.change(input(), {
    target: { files: [new File(["{}"], "network.har")] },
  })
  const worker = FakeWorker.latest!
  expect(screen.getByRole("status").textContent).toBe(m.loading)
  fireEvent.click(button(m.cancelImport))
  expect(worker.terminate).toHaveBeenCalledOnce()
  expect(screen.queryByRole("button", { name: m.cancelImport })).toBeNull()
  expect(button(m.chooseFile)).toHaveProperty("disabled", false)
  expect(screen.getByRole("status").textContent).toBe("")
})

it("copies the recorded JSON text without changing large numeric identifiers", async () => {
  const text = '{"id":9223372036854775807,"value":0.12345678901234567890}'
  const write = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue()
  render(
    <BodyView
      body={{ text, mimeType: "application/json", encoding: "", params: [] }}
      messages={m}
      lang="en"
    />
  )
  expect(screen.getByText(text)).toBeTruthy()
  fireEvent.click(button(m.copy))
  await vi.waitFor(() => expect(write).toHaveBeenCalledWith(text))
})

it("does not report a complete capture span when one request duration is missing", () => {
  render(
    <Summary
      capture={{
        ...capture,
        entries: [
          capture.entries[0]!,
          { ...capture.entries[1]!, duration: null },
        ],
      }}
      messages={m}
      lang="en"
    />
  )
  const span = screen
    .getByText(m.duration)
    .closest<HTMLElement>('[data-slot="card"]')!
  expect(within(span).getByText(m.unknown)).toBeTruthy()
})
