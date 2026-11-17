import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test, vi } from "vitest"

import { MacAddressDataStatus } from "./mac-address-data-status"

const labels = {
  loading: "Loading registry…",
  loadError: "The registry could not be loaded.",
  retry: "Retry",
  source: "IEEE Registration Authority",
  sourceHint: "Queries are processed in your browser.",
}

afterEach(cleanup)

describe("MacAddressDataStatus", () => {
  test("announces loading politely without offering a retry", () => {
    render(
      <MacAddressDataStatus
        loading
        error={false}
        onRetry={vi.fn()}
        labels={labels}
      />
    )

    expect(screen.getByRole("status").textContent).toBe(labels.loading)
    expect(screen.getByRole("status").getAttribute("aria-live")).toBe("polite")
    expect(screen.queryByRole("button")).toBeNull()
    expect(screen.queryByRole("link")).toBeNull()
  })

  test("shows an inline error and retries when requested", () => {
    const onRetry = vi.fn()
    const { rerender } = render(
      <MacAddressDataStatus
        loading={false}
        error
        onRetry={onRetry}
        labels={labels}
      />
    )

    expect(screen.getByRole("alert").textContent).toContain(labels.loadError)
    fireEvent.click(screen.getByRole("button", { name: labels.retry }))
    expect(onRetry).toHaveBeenCalledOnce()

    rerender(
      <MacAddressDataStatus loading error onRetry={onRetry} labels={labels} />
    )
    expect(screen.queryByRole("alert")).toBeNull()
    expect(screen.getByRole("status").textContent).toBe(labels.loading)
  })

  test("attributes the dataset and displays the localized update and summary", () => {
    render(
      <MacAddressDataStatus
        loading={false}
        error={false}
        onRetry={vi.fn()}
        updatedLabel="Updated November 17, 2026"
        summary="58,804 assignments"
        labels={labels}
      />
    )

    expect(
      screen.getByRole("link", { name: labels.source }).getAttribute("href")
    ).toBe("https://standards.ieee.org/products-programs/regauth/")
    expect(screen.getByText("Updated November 17, 2026")).toBeTruthy()
    expect(screen.getByText("58,804 assignments")).toBeTruthy()
    expect(screen.getByText(labels.sourceHint)).toBeTruthy()
    expect(screen.queryByRole("button")).toBeNull()
  })

  test("supports successful datasets without optional metadata", () => {
    render(
      <MacAddressDataStatus
        loading={false}
        error={false}
        onRetry={vi.fn()}
        labels={labels}
      />
    )

    expect(screen.getByRole("link", { name: labels.source })).toBeTruthy()
    expect(screen.getByText(labels.sourceHint)).toBeTruthy()
    expect(screen.queryByRole("alert")).toBeNull()
    expect(screen.queryByRole("status")).toBeNull()
  })
})
