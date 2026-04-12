import { afterEach, describe, expect, it, vi } from "vitest"

import { createPrettierFormatRequest } from "../core/prettier-languages"
import { formatRequest } from "./prettier.worker"

type WorkerMessagePayload = {
  id: number
  request: ReturnType<typeof createPrettierFormatRequest>
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("formatRequest", () => {
  it("formats supported source with the required plugins", async () => {
    await expect(
      formatRequest(
        createPrettierFormatRequest("const answer=42", {
          language: "javascript",
        })
      )
    ).resolves.toBe("const answer = 42;\n")
  })

  it("formats mjml templates with the official html plugin", async () => {
    await expect(
      formatRequest(
        createPrettierFormatRequest(
          "<mjml><mj-body><mj-section><mj-column><mj-text>Hello</mj-text></mj-column></mj-section></mj-body></mjml>",
          {
            language: "mjml",
          }
        )
      )
    ).resolves.toContain("<mj-text>Hello</mj-text>")
  })

  it("rejects invalid input with the underlying prettier message", async () => {
    await expect(
      formatRequest(createPrettierFormatRequest("{", { language: "json" }))
    ).rejects.toThrow()
  })

  it("registers a worker message handler that posts formatted results", async () => {
    vi.resetModules()

    let messageListener:
      | ((event: MessageEvent<WorkerMessagePayload>) => void | Promise<void>)
      | null = null
    const postMessage = vi.fn()

    vi.stubGlobal("self", {
      addEventListener: vi.fn(
        (type: string, listener: typeof messageListener) => {
          if (type === "message") {
            messageListener = listener
          }
        }
      ),
      postMessage,
    })

    await import("./prettier.worker")

    expect(messageListener).toBeTruthy()

    await messageListener!({
      data: {
        id: 1,
        request: createPrettierFormatRequest("const answer=42", {
          language: "javascript",
        }),
      },
    } as MessageEvent<WorkerMessagePayload>)

    expect(postMessage).toHaveBeenCalledWith({
      id: 1,
      ok: true,
      formatted: "const answer = 42;\n",
    })
  })

  it("posts worker failures as error messages", async () => {
    vi.resetModules()

    let messageListener:
      | ((event: MessageEvent<WorkerMessagePayload>) => void | Promise<void>)
      | null = null
    const postMessage = vi.fn()

    vi.stubGlobal("self", {
      addEventListener: vi.fn(
        (type: string, listener: typeof messageListener) => {
          if (type === "message") {
            messageListener = listener
          }
        }
      ),
      postMessage,
    })

    await import("./prettier.worker")

    expect(messageListener).toBeTruthy()

    await messageListener!({
      data: {
        id: 2,
        request: createPrettierFormatRequest("{", { language: "json" }),
      },
    } as MessageEvent<WorkerMessagePayload>)

    expect(postMessage).toHaveBeenCalledWith({
      id: 2,
      ok: false,
      message: expect.any(String),
    })
  })

  it("stringifies non-Error worker failures", async () => {
    vi.resetModules()

    let messageListener:
      | ((event: MessageEvent<WorkerMessagePayload>) => void | Promise<void>)
      | null = null
    const postMessage = vi.fn()

    vi.doMock("prettier/standalone", () => ({
      default: {
        format: vi.fn(async () => {
          throw "string failure"
        }),
      },
    }))
    vi.stubGlobal("self", {
      addEventListener: vi.fn(
        (type: string, listener: typeof messageListener) => {
          if (type === "message") {
            messageListener = listener
          }
        }
      ),
      postMessage,
    })

    await import("./prettier.worker")

    expect(messageListener).toBeTruthy()

    await messageListener!({
      data: {
        id: 3,
        request: createPrettierFormatRequest("const answer=42", {
          language: "javascript",
        }),
      },
    } as MessageEvent<WorkerMessagePayload>)

    expect(postMessage).toHaveBeenCalledWith({
      id: 3,
      ok: false,
      message: "string failure",
    })
  })

  it("does not register a message handler when self cannot receive events", async () => {
    vi.resetModules()

    vi.stubGlobal("self", {})

    await expect(import("./prettier.worker")).resolves.toBeTruthy()
  })
})
