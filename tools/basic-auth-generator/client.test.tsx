import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import BasicAuthGeneratorClient from "./client"

const messages = {
  meta: {
    name: "Basic Auth Generator",
    description:
      "Generate an HTTP Basic Authorization header from a username and password.",
  },
  credentialsLabel: "Credentials",
  usernameLabel: "Username",
  passwordLabel: "Password",
  authorizationHeaderLabel: "Authorization Header",
  curlExampleLabel: "cURL Example",
  copyResultLabel: "Copy result",
  copiedLabel: "Copied",
  resetLabel: "Reset example",
} as const

afterEach(() => {
  cleanup()
  window.localStorage.clear()
})

describe("BasicAuthGeneratorClient", () => {
  test("renders the default example", () => {
    render(<BasicAuthGeneratorClient messages={messages} />)

    expect((screen.getByLabelText("Username") as HTMLInputElement).value).toBe(
      "Aladdin"
    )
    expect((screen.getByLabelText("Password") as HTMLInputElement).value).toBe(
      "open sesame"
    )
    expect(
      screen.getByRole("region", { name: "Authorization Header" }).textContent
    ).toBe("Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==")
  })

  test("updates the header and curl example when credentials change", () => {
    render(<BasicAuthGeneratorClient messages={messages} />)

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "demo" },
    })
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "s3cr3t" },
    })

    expect(
      screen.getByRole("region", { name: "Authorization Header" }).textContent
    ).toBe("Basic ZGVtbzpzM2NyM3Q=")
    expect(
      screen.getByRole("region", { name: "cURL Example" }).textContent
    ).toBe(
      'curl -H "Authorization: Basic ZGVtbzpzM2NyM3Q=" https://api.example.com/protected'
    )
  })

  test("renders lightweight highlighted tokens for the outputs", () => {
    render(<BasicAuthGeneratorClient messages={messages} />)

    const headerOutput = screen.getByRole("region", {
      name: "Authorization Header",
    })
    const curlOutput = screen.getByRole("region", {
      name: "cURL Example",
    })

    expect(
      headerOutput.querySelector('[data-token="scheme"]')?.textContent
    ).toBe("Basic")
    expect(
      headerOutput.querySelector('[data-token="credential"]')?.textContent
    ).toBe("QWxhZGRpbjpvcGVuIHNlc2FtZQ==")
    expect(
      curlOutput.querySelector('[data-token="command"]')?.textContent
    ).toBe("curl")
    expect(curlOutput.querySelector('[data-token="flag"]')?.textContent).toBe(
      "-H"
    )
    expect(
      curlOutput.querySelector('[data-token="header-name"]')?.textContent
    ).toBe("Authorization:")
    expect(curlOutput.querySelector('[data-token="url"]')?.textContent).toBe(
      "https://api.example.com/protected"
    )
  })

  test("clears the outputs when both credentials are empty", () => {
    render(<BasicAuthGeneratorClient messages={messages} />)

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "" },
    })
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "" },
    })

    expect(
      screen.getByRole("region", { name: "Authorization Header" }).textContent
    ).toBe("")
    expect(
      screen.getByRole("region", { name: "cURL Example" }).textContent
    ).toBe("")
  })

  test("resets to the default example", () => {
    render(<BasicAuthGeneratorClient messages={messages} />)

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "changed" },
    })
    fireEvent.click(screen.getByText("Reset example"))

    expect((screen.getByLabelText("Username") as HTMLInputElement).value).toBe(
      "Aladdin"
    )
    expect((screen.getByLabelText("Password") as HTMLInputElement).value).toBe(
      "open sesame"
    )
  })

  test("restores state from localStorage on mount", () => {
    window.localStorage.setItem("tools:basic-auth-generator:username", "stored")
    window.localStorage.setItem("tools:basic-auth-generator:password", "value")

    render(<BasicAuthGeneratorClient messages={messages} />)

    expect((screen.getByLabelText("Username") as HTMLInputElement).value).toBe(
      "stored"
    )
    expect((screen.getByLabelText("Password") as HTMLInputElement).value).toBe(
      "value"
    )
    expect(
      screen.getByRole("region", { name: "Authorization Header" }).textContent
    ).toBe("Basic c3RvcmVkOnZhbHVl")
  })
})
