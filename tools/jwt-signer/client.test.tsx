import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import JwtSignerClient from "./client"
import messagesCatalog from "./messages/en.json"
import { JwtSignerError, signJwt } from "./core/jwt-signer"
import { formatDateTimeLocalInput } from "./payload-claims"

import type { JwtSignerMessages } from "./client/types"

vi.mock("./core/jwt-signer", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./core/jwt-signer")>()

  return {
    ...actual,
    signJwt: vi.fn(),
  }
})

const messages = {
  meta: {
    name: "JSON Web Token (JWT) Signer",
    description: "Sign JWTs locally.",
  },
  ...messagesCatalog,
} satisfies JwtSignerMessages
const mockedSignJwt = vi.mocked(signJwt)

describe("JwtSignerClient", () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  beforeEach(() => {
    window.localStorage.clear()
    mockedSignJwt.mockReset()
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: vi.fn(() => "blob:jwt"),
    })
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: vi.fn(),
    })
  })

  test("renders the starting workflow and empty result", () => {
    render(<JwtSignerClient messages={messages} />)

    expect(
      (screen.getByLabelText("Payload JSON") as HTMLTextAreaElement).value
    ).toContain('"sub": "user_123"')
    expect(screen.getByText("No token signed yet")).toBeTruthy()
    expect(screen.getByText("Local signing only")).toBeTruthy()
  })

  test("validates JSON before signing", () => {
    render(<JwtSignerClient messages={messages} />)

    fireEvent.change(screen.getByLabelText("Payload JSON"), {
      target: { value: "[]" },
    })

    expect(screen.getByText("The payload must be a JSON object.")).toBeTruthy()
    expect(
      (screen.getByRole("button", { name: "Sign JWT" }) as HTMLButtonElement)
        .disabled
    ).toBe(true)
  })

  test("keeps the signing key editable", () => {
    render(<JwtSignerClient messages={messages} />)

    const secretInput = screen.getByLabelText("Secret") as HTMLInputElement

    expect(secretInput.value).toBe("correct horse battery staple")

    fireEvent.change(secretInput, {
      target: { value: "my-new-secret" },
    })

    expect((screen.getByLabelText("Secret") as HTMLInputElement).value).toBe(
      "my-new-secret"
    )
  })

  test("signs and displays a compact token", async () => {
    mockedSignJwt.mockResolvedValue({
      token: "header.payload.signature",
      headerJson: '{\n  "alg": "HS256"\n}\n',
      payloadJson: '{\n  "sub": "user_123"\n}\n',
      signingInput: "header.payload",
      signature: "signature",
      algorithm: "HS256",
    })
    render(<JwtSignerClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: "Sign JWT" }))

    await waitFor(() => {
      expect(screen.getByDisplayValue("header.payload.signature")).toBeTruthy()
    })
    expect(mockedSignJwt).toHaveBeenCalledWith(
      expect.objectContaining({
        algorithm: "HS256",
        key: "correct horse battery staple",
        keyFormat: "secret",
      })
    )
    expect(screen.getByText("Signature")).toBeTruthy()
    expect(
      screen.getByRole("link", { name: "Download" }).getAttribute("href")
    ).toBe("blob:jwt")
  })

  test("refreshes iat with the current time before signing", async () => {
    vi.spyOn(Date, "now").mockReturnValue(1893456000123)
    mockedSignJwt.mockResolvedValue({
      token: "header.payload.signature",
      headerJson: "{}\n",
      payloadJson: "{}\n",
      signingInput: "header.payload",
      signature: "signature",
      algorithm: "HS256",
    })
    render(<JwtSignerClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: "Sign JWT" }))

    await waitFor(() => {
      expect(mockedSignJwt).toHaveBeenCalledWith(
        expect.objectContaining({
          payloadText: expect.stringContaining('"iat": 1893456000'),
        })
      )
    })
  })

  test("server render does not read live time before hydration", () => {
    vi.spyOn(Date, "now").mockReturnValue(1893456000123)

    const html = renderToString(<JwtSignerClient messages={messages} />)

    expect(html).toContain("Signing value")
    expect(html).toContain("1713139200")
    expect(html).not.toContain("1893456000")
  })

  test("keeps the exp helper and payload JSON in sync", async () => {
    render(<JwtSignerClient messages={messages} />)

    const payloadInput = screen.getByLabelText(
      "Payload JSON"
    ) as HTMLTextAreaElement
    const expInput = screen.getByLabelText(
      "Expiration (exp)"
    ) as HTMLInputElement
    const localExpiration = "2030-01-01T00:00:30"
    const expirationSeconds = Math.floor(
      new Date(localExpiration).getTime() / 1000
    )

    fireEvent.change(expInput, {
      target: { value: localExpiration },
    })

    expect(payloadInput.value).toContain(`"exp": ${expirationSeconds}`)

    fireEvent.change(payloadInput, {
      target: { value: `{\n  "exp": ${expirationSeconds + 3600}\n}` },
    })

    await waitFor(() => {
      expect(expInput.value).toBe(
        formatDateTimeLocalInput(expirationSeconds + 3600)
      )
    })

    fireEvent.click(screen.getByRole("button", { name: "Clear" }))

    expect(payloadInput.value).not.toContain('"exp"')
  })

  test("keeps quick expiration offsets relative to the signing iat", async () => {
    const nowSpy = vi.spyOn(Date, "now").mockReturnValue(1893456000123)
    mockedSignJwt.mockResolvedValue({
      token: "header.payload.signature",
      headerJson: "{}\n",
      payloadJson: "{}\n",
      signingInput: "header.payload",
      signature: "signature",
      algorithm: "HS256",
    })
    render(<JwtSignerClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: "+15m" }))

    const payloadInput = screen.getByLabelText(
      "Payload JSON"
    ) as HTMLTextAreaElement

    expect(payloadInput.value).toContain('"exp": 1893456900')

    nowSpy.mockReturnValue(1893456060123)
    fireEvent.click(screen.getByRole("button", { name: "Sign JWT" }))

    await waitFor(() => {
      expect(mockedSignJwt).toHaveBeenCalledWith(
        expect.objectContaining({
          payloadText: expect.stringContaining('"iat": 1893456060'),
        })
      )
    })
    expect(mockedSignJwt).toHaveBeenCalledWith(
      expect.objectContaining({
        payloadText: expect.stringContaining('"exp": 1893456960'),
      })
    )
  })

  test("manual expiration input switches back to a fixed exp", async () => {
    const nowSpy = vi.spyOn(Date, "now").mockReturnValue(1893456000123)
    mockedSignJwt.mockResolvedValue({
      token: "header.payload.signature",
      headerJson: "{}\n",
      payloadJson: "{}\n",
      signingInput: "header.payload",
      signature: "signature",
      algorithm: "HS256",
    })
    render(<JwtSignerClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: "+15m" }))
    fireEvent.change(screen.getByLabelText("Expiration (exp)"), {
      target: { value: "2030-01-01T00:00:30" },
    })

    const fixedExpiration = Math.floor(
      new Date("2030-01-01T00:00:30").getTime() / 1000
    )

    nowSpy.mockReturnValue(1893456060123)
    fireEvent.click(screen.getByRole("button", { name: "Sign JWT" }))

    await waitFor(() => {
      expect(mockedSignJwt).toHaveBeenCalledWith(
        expect.objectContaining({
          payloadText: expect.stringContaining(`"exp": ${fixedExpiration}`),
        })
      )
    })
    expect(mockedSignJwt).not.toHaveBeenCalledWith(
      expect.objectContaining({
        payloadText: expect.stringContaining('"exp": 1893456960'),
      })
    )
  })

  test("shows localized signing errors", async () => {
    mockedSignJwt.mockRejectedValue(new JwtSignerError("errorKeyRequired"))
    render(<JwtSignerClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: "Sign JWT" }))

    await screen.findByText("Could not sign token")
    expect(
      screen.getByText("Enter a signing key before generating a token.")
    ).toBeTruthy()
  })

  test("resets and reloads the sample", async () => {
    render(<JwtSignerClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: "Reset" }))
    expect(
      (screen.getByLabelText("Payload JSON") as HTMLTextAreaElement).value
    ).toBe("")

    mockedSignJwt.mockResolvedValue({
      token: "header.payload.signature",
      headerJson: "{}\n",
      payloadJson: "{}\n",
      signingInput: "header.payload",
      signature: "signature",
      algorithm: "HS256",
    })
    fireEvent.click(screen.getByRole("button", { name: "Load sample" }))
    await waitFor(() => {
      expect(
        (screen.getByLabelText("Payload JSON") as HTMLTextAreaElement).value
      ).toContain('"sub": "user_123"')
    })
    fireEvent.click(screen.getByRole("button", { name: "Sign JWT" }))

    await waitFor(() => {
      expect(mockedSignJwt).toHaveBeenCalledWith(
        expect.objectContaining({ key: "correct horse battery staple" })
      )
    })
  })
})
