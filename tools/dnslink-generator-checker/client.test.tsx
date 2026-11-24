import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"

import DnsLink from "./client"
import messages from "./messages/en.json"

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

it("generates fields, recovers from input errors, and compares the published value", async () => {
  const answer = {
    Status: 0,
    TC: false,
    Answer: [{ type: 16, data: '"dnslink=/ipns/site.example.com"', TTL: 60 }],
  }
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockImplementationOnce(async () => Response.json(answer))
      .mockResolvedValueOnce(Response.json({ Status: 3, TC: false }))
  )
  render(<DnsLink messages={messages} />)
  const domain = screen.getByLabelText(messages.domain)
  const target = screen.getByLabelText(messages.target)
  const check = screen.getByRole("button", { name: messages.check })
  fireEvent.click(check)
  expect(screen.getByText(messages.invalidDomain)).toBeTruthy()
  fireEvent.change(domain, { target: { value: "www.example.com" } })
  fireEvent.change(target, { target: { value: "bad" } })
  fireEvent.blur(target)
  expect(screen.getByText(messages.invalidTarget)).toBeTruthy()
  fireEvent.change(target, { target: { value: "ipns://site.example.com" } })
  expect(screen.getByText("_dnslink.www.example.com")).toBeTruthy()
  expect(screen.getByText("dnslink=/ipns/site.example.com")).toBeTruthy()
  expect(
    screen.getByRole("button", { name: `${messages.copy}: ${messages.value}` })
  ).toBeTruthy()
  fireEvent.click(check)
  await screen.findByText(messages.match)
  expect(screen.getByText(messages.missing)).toBeTruthy()
  fireEvent.change(target, { target: { value: "ipns://other.example.com" } })
  expect(screen.getByText(messages.different)).toBeTruthy()
  fireEvent.change(domain, { target: { value: "other.example.com" } })
  expect(screen.queryByText(messages.published)).toBeNull()
})

it("opens a known example and handles partial resolver failures", async () => {
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockRejectedValueOnce(new Error("Unavailable"))
      .mockResolvedValueOnce(
        Response.json({
          Status: 0,
          TC: false,
          Answer: [{ type: 16, data: '"dnslink=/ipfs/invalid"', TTL: 60 }],
        })
      )
  )
  render(<DnsLink messages={messages} />)
  fireEvent.click(screen.getByRole("button", { name: messages.example }))
  expect(screen.getByLabelText(messages.domain)).toHaveProperty(
    "value",
    "docs.ipfs.tech"
  )
  await screen.findByText(messages.unavailable)
  expect(screen.getByText(messages.malformed)).toBeTruthy()
})

it("flags multiple valid records from one resolver without reporting a match", async () => {
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValueOnce(
        Response.json({
          Status: 0,
          TC: false,
          Answer: ["site.example.com", "other.example.com"].map((domain) => ({
            type: 16,
            data: `dnslink=/ipns/${domain}`,
            TTL: 60,
          })),
        })
      )
      .mockResolvedValueOnce(Response.json({ Status: 3, TC: false }))
  )
  render(<DnsLink messages={messages} />)
  fireEvent.change(screen.getByLabelText(messages.domain), {
    target: { value: "example.com" },
  })
  fireEvent.change(screen.getByLabelText(messages.target), {
    target: { value: "ipns://site.example.com" },
  })
  fireEvent.click(screen.getByRole("button", { name: messages.check }))
  await screen.findByText(messages.conflicting)
  expect(screen.queryByText(messages.match)).toBeNull()
})
