import { act, createElement, type ComponentType } from "react"
import { hydrateRoot } from "react-dom/client"
import { renderToString } from "react-dom/server"
import { afterEach, expect, test, vi } from "vitest"

// These cross-tool integration cases live in a tool package so they use its
// React test dependencies without adding React to the repository root.
const clients = import.meta.glob<{
  default: ComponentType<Record<string, unknown>>
}>("../*/client.tsx")
const catalogs = import.meta.glob<{ default: Record<string, unknown> }>(
  "../*/{messages,meta}/en.json"
)

const tools = [
  "color-picker",
  "cron-expression-generator",
  "cron-expression-parser",
  "current-network-time",
  "duration-calculator",
  "html-to-markdown-converter",
  "time-diff-calculator",
  "time-zone-converter",
  "timer",
  "unix-timestamp-converter",
]

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  document.body.innerHTML = ""
  localStorage.clear()
})

test.each(tools)(
  "%s hydrates across time and browser capability changes",
  async (slug) => {
    const dateTimeFormat = Intl.DateTimeFormat
    let timeZone = "UTC"
    vi.spyOn(Intl, "DateTimeFormat").mockImplementation(
      function (locales, options) {
        return new dateTimeFormat(locales, { timeZone, ...options })
      }
    )
    vi.spyOn(Date, "now").mockReturnValue(Date.UTC(2024, 0, 1))
    for (const name of [
      "window",
      "document",
      "navigator",
      "Notification",
      "EyeDropper",
    ]) {
      vi.stubGlobal(name, undefined)
    }
    const prefix = slug === "color-picker" ? "." : `../${slug}`
    const { default: Client } = await clients[`${prefix}/client.tsx`]!()
    const { default: meta } = await catalogs[`${prefix}/meta/en.json`]!()
    const { default: messages } =
      await catalogs[`${prefix}/messages/en.json`]!()
    const element = createElement(Client, {
      language: "en",
      messages: { meta, ...messages },
    })
    const html = renderToString(element)
    vi.unstubAllGlobals()

    // Hydrate a prerendered document months later, in a different zone/browser.
    timeZone = "Asia/Shanghai"
    vi.mocked(Date.now).mockReturnValue(Date.UTC(2024, 6, 1))
    vi.stubGlobal("EyeDropper", class {})
    vi.stubGlobal("Notification", { permission: "default" })
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => {}))
    )
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true)
    const container = document.createElement("div")
    container.innerHTML = html
    document.body.append(container)
    const errors: unknown[] = []
    let root: ReturnType<typeof hydrateRoot>
    await act(async () => {
      root = hydrateRoot(container, element, {
        onRecoverableError: (error) => errors.push(error),
      })
    })
    expect(errors).toEqual([])
    expect(container.textContent).not.toBe("")
    await act(async () => root.unmount())
  }
)
