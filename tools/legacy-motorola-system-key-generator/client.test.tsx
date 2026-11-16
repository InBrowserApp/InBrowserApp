import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import LegacySystemKeyClient from "./client"
import messages from "./messages/en.json"

beforeEach(() => {
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:legacy-key")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

function changeInput(value: string) {
  fireEvent.change(screen.getByLabelText(messages.systemIdLabel), {
    target: { value },
  })
}

describe("LegacySystemKeyClient", () => {
  test("explains compatibility before allowing a download", () => {
    render(<LegacySystemKeyClient messages={messages} />)

    expect(screen.getByText(messages.compatibilityTitle)).toBeTruthy()
    expect(screen.getByText(messages.compatibilityDescription)).toBeTruthy()
    expect(screen.getByText(messages.emptyState)).toBeTruthy()
    expect(
      screen
        .getByRole("button", { name: messages.downloadLabel })
        .hasAttribute("disabled")
    ).toBe(true)
    expect(
      screen.getByLabelText(messages.systemIdLabel).getAttribute("aria-invalid")
    ).toBe("false")
    expect(URL.createObjectURL).not.toHaveBeenCalled()
  })

  test("previews and downloads the actual 27-byte binary file", async () => {
    render(<LegacySystemKeyClient messages={messages} />)
    changeInput("1234")

    expect(screen.getByText("1234", { selector: "code" })).toBeTruthy()
    expect(screen.getByText("SYS01234.KEY")).toBeTruthy()
    expect(screen.getByText(messages.fileSizeValue)).toBeTruthy()
    expect(screen.getByLabelText(messages.hexPreviewLabel).textContent).toBe(
      "2C B5 32 B3 88 0D 6A DF 4B B4 E9 95 2C 6D 1C 03 37 24 1F 5B 93 BF 24 1A 08 FF 95"
    )
    const download = screen.getByRole("link", { name: messages.downloadLabel })
    expect(download.getAttribute("download")).toBe("SYS01234.KEY")
    expect(download.getAttribute("href")).toBe("blob:legacy-key")

    const file = vi.mocked(URL.createObjectURL).mock.calls[0]![0] as Blob
    expect(file.type).toBe("application/octet-stream")
    expect(file.size).toBe(27)
    expect(Buffer.from(await file.arrayBuffer()).toString("hex")).toBe(
      "2cb532b3880d6adf4bb4e9952c6d1c0337241f5b93bf241a08ff95"
    )
  })

  test("normalizes short lowercase IDs and refreshes download resources", () => {
    vi.mocked(URL.createObjectURL)
      .mockReturnValueOnce("blob:first-key")
      .mockReturnValueOnce("blob:second-key")
    render(<LegacySystemKeyClient messages={messages} />)
    changeInput(" a ")
    expect(screen.getByText("000A")).toBeTruthy()
    expect(
      screen
        .getByRole("link", { name: messages.downloadLabel })
        .getAttribute("download")
    ).toBe("SYS0000A.KEY")

    changeInput("FFFF")
    expect(
      screen
        .getByRole("link", { name: messages.downloadLabel })
        .getAttribute("href")
    ).toBe("blob:second-key")
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:first-key")
  })

  test.each(["12345", "0x12", "12G4", "12 34"])(
    "rejects invalid input %j and removes a stale download",
    (input) => {
      render(<LegacySystemKeyClient messages={messages} />)
      changeInput("1234")
      changeInput(input)

      const field = screen.getByLabelText(
        messages.systemIdLabel
      ) as HTMLInputElement
      expect(field.value).toBe(input)
      expect(field.getAttribute("aria-invalid")).toBe("true")
      const error = screen.getByText(messages.invalidSystemId)
      expect(field.getAttribute("aria-describedby")).toContain(error.id)
      expect(screen.getByText(messages.emptyState)).toBeTruthy()
      expect(
        screen.queryByRole("link", { name: messages.downloadLabel })
      ).toBeNull()
      expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:legacy-key")
    }
  )

  test("clears validation and preview when the input is erased", () => {
    render(<LegacySystemKeyClient messages={messages} />)
    changeInput("invalid")
    changeInput(" ")
    expect(screen.queryByText(messages.invalidSystemId)).toBeNull()
    expect(screen.getByText(messages.emptyState)).toBeTruthy()

    changeInput("1234")
    changeInput("")
    expect(screen.queryByText("SYS01234.KEY")).toBeNull()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:legacy-key")
  })
})
