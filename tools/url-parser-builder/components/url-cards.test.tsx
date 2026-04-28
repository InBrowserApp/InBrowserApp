import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test, vi } from "vitest"

import meta from "../meta/en.json"
import messages from "../messages/en.json"
import { UrlAuthorityCard } from "./url-authority-card"
import { UrlPathCard } from "./url-path-card"
import { UrlPreviewCard } from "./url-preview-card"

const localizedMessages = { meta, ...messages } as const

afterEach(() => {
  cleanup()
})

describe("url parser builder cards", () => {
  test("authority card reports edits for every authority field", () => {
    const onFieldChange = vi.fn()

    render(
      <UrlAuthorityCard
        messages={localizedMessages}
        protocol="https"
        username=""
        password=""
        hostname="example.com"
        port=""
        onFieldChange={onFieldChange}
      />
    )

    fireEvent.change(screen.getByLabelText(messages.protocolLabel), {
      target: { value: "http" },
    })
    fireEvent.change(screen.getByLabelText(messages.usernameLabel), {
      target: { value: "marina" },
    })
    fireEvent.change(screen.getByLabelText(messages.passwordLabel), {
      target: { value: "teal waves" },
    })
    fireEvent.change(screen.getByLabelText(messages.hostnameLabel), {
      target: { value: "docs.inbrowser.app" },
    })
    fireEvent.change(screen.getByLabelText(messages.portLabel), {
      target: { value: "8080" },
    })

    expect(onFieldChange.mock.calls).toEqual([
      ["protocol", "http"],
      ["username", "marina"],
      ["password", "teal waves"],
      ["hostname", "docs.inbrowser.app"],
      ["port", "8080"],
    ])
  })

  test("path card reports pathname and fragment changes", () => {
    const onFieldChange = vi.fn()

    render(
      <UrlPathCard
        messages={localizedMessages}
        pathname="/docs"
        fragment="intro"
        onFieldChange={onFieldChange}
      />
    )

    fireEvent.change(screen.getByLabelText(messages.pathLabel), {
      target: { value: "/guides/url-parsing" },
    })
    fireEvent.change(screen.getByLabelText(messages.fragmentLabel), {
      target: { value: "examples" },
    })

    expect(onFieldChange.mock.calls).toEqual([
      ["pathname", "/guides/url-parsing"],
      ["fragment", "examples"],
    ])
  })

  test("preview card disables copying and shows an alert when the build fails", () => {
    const { rerender } = render(
      <UrlPreviewCard
        messages={localizedMessages}
        finalUrl="https://example.com/"
        buildErrorDescription={null}
      />
    )

    expect(screen.queryByText(messages.buildErrorTitle)).toBeNull()
    expect(
      (
        screen.getByRole("button", {
          name: messages.copyUrlLabel,
        }) as HTMLButtonElement
      ).disabled
    ).toBe(false)

    rerender(
      <UrlPreviewCard
        messages={localizedMessages}
        finalUrl=""
        buildErrorDescription={messages.invalidPortDescription}
      />
    )

    expect(screen.getByText(messages.buildErrorTitle)).toBeTruthy()
    expect(screen.getByText(messages.invalidPortDescription)).toBeTruthy()
    expect(
      (
        screen.getByRole("button", {
          name: messages.copyUrlLabel,
        }) as HTMLButtonElement
      ).disabled
    ).toBe(true)
  })
})
