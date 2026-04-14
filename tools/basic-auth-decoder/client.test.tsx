import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import BasicAuthDecoderClient from "./client"

const messages = {
  meta: {
    name: "Basic Auth Decoder",
    description:
      "Decode an HTTP Basic Authorization header to extract the original username and password.",
  },
  authorizationHeaderLabel: "Authorization Header",
  authorizationHeaderDescription:
    "Paste a Basic header such as: Basic dXNlcjpwYXNz",
  authorizationHeaderPlaceholder:
    "Paste a Basic header such as: Basic dXNlcjpwYXNz",
  decodedCredentialsLabel: "Decoded Credentials",
  decodedCredentialsDescription:
    "Decode an HTTP Basic Authorization header to extract the original username and password.",
  usernameLabel: "Username",
  passwordLabel: "Password",
  copyResultLabel: "Copy result",
  copiedLabel: "Copied",
  resetLabel: "Reset example",
  invalidHeaderTitle: "Invalid Basic Authorization header",
  invalidBase64Title: "Invalid Base64 content",
} as const

afterEach(() => {
  cleanup()
  window.localStorage.clear()
})

describe("BasicAuthDecoderClient", () => {
  test("renders the default example", () => {
    render(<BasicAuthDecoderClient messages={messages} />)

    expect(
      screen.getByText(messages.authorizationHeaderDescription)
    ).toBeTruthy()
    expect(
      screen.getByText(messages.decodedCredentialsDescription)
    ).toBeTruthy()
    expect(
      (screen.getByLabelText("Authorization Header") as HTMLTextAreaElement)
        .value
    ).toBe("Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==")
    expect(screen.getByRole("region", { name: "Username" }).textContent).toBe(
      "Aladdin"
    )
    expect(screen.getByRole("region", { name: "Password" }).textContent).toBe(
      "open sesame"
    )
  })

  test("decodes a full Authorization header line", () => {
    render(<BasicAuthDecoderClient messages={messages} />)

    fireEvent.change(screen.getByLabelText("Authorization Header"), {
      target: {
        value: "Authorization: BASIC ZGVtbzpzM2NyM3Q6ZXh0cmE=",
      },
    })

    expect(screen.getByRole("region", { name: "Username" }).textContent).toBe(
      "demo"
    )
    expect(screen.getByRole("region", { name: "Password" }).textContent).toBe(
      "s3cr3t:extra"
    )
  })

  test("shows an alert for an invalid header", () => {
    render(<BasicAuthDecoderClient messages={messages} />)

    fireEvent.change(screen.getByLabelText("Authorization Header"), {
      target: { value: "Bearer token" },
    })

    expect(screen.getByRole("alert").textContent).toContain(
      messages.invalidHeaderTitle
    )
  })

  test("shows an alert for invalid base64", () => {
    render(<BasicAuthDecoderClient messages={messages} />)

    fireEvent.change(screen.getByLabelText("Authorization Header"), {
      target: { value: "Basic !!!" },
    })

    expect(screen.getByRole("alert").textContent).toContain(
      messages.invalidBase64Title
    )
  })

  test("resets to the default example", () => {
    render(<BasicAuthDecoderClient messages={messages} />)

    fireEvent.change(screen.getByLabelText("Authorization Header"), {
      target: { value: "Basic ZGVtbzpzZWNyZXQ=" },
    })
    fireEvent.click(screen.getByText("Reset example"))

    expect(
      (screen.getByLabelText("Authorization Header") as HTMLTextAreaElement)
        .value
    ).toBe("Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==")
  })

  test("restores state from localStorage on mount", () => {
    window.localStorage.setItem(
      "tools:basic-auth-decoder:authorization-header",
      "Authorization: Basic c3RvcmVkOnZhbHVl"
    )

    render(<BasicAuthDecoderClient messages={messages} />)

    expect(
      (screen.getByLabelText("Authorization Header") as HTMLTextAreaElement)
        .value
    ).toBe("Authorization: Basic c3RvcmVkOnZhbHVl")
    expect(screen.getByRole("region", { name: "Username" }).textContent).toBe(
      "stored"
    )
    expect(screen.getByRole("region", { name: "Password" }).textContent).toBe(
      "value"
    )
  })
})
