import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import {
  convertAnimationToGif,
  type ConversionReply,
} from "@workspace/raster-image/animation-to-gif"
import { afterEach, expect, test, vi } from "vitest"
import { animationToGifMessages } from "../../lib/animation-to-gif-messages"
import { AnimationToGif } from "./animation-to-gif"

vi.mock("@workspace/raster-image/animation-to-gif", () => ({
  convertAnimationToGif: vi.fn(),
}))

const convert = vi.mocked(convertAnimationToGif)
const messages = animationToGifMessages("en")

afterEach(() => {
  cleanup()
  convert.mockReset()
})

function startConversion() {
  let resolve!: (reply: ConversionReply) => void
  const work = new Promise<ConversionReply>((settle) => {
    resolve = settle
  })
  convert.mockReturnValueOnce(work)
  const { container } = render(
    <AnimationToGif format="apng" language="en" messages={messages} />
  )
  fireEvent.change(container.querySelector('input[type="file"]')!, {
    target: { files: [new File(["input"], "sequence.apng")] },
  })
  const create = screen.getByRole("button", { name: messages.createAnimation })
  create.focus()
  fireEvent.click(create)
  const cancel = screen.getByRole("button", { name: messages.cancel })
  return { cancel, create, resolve }
}

test("the focused Create button stays in place through a conversion error", async () => {
  const { create, resolve } = startConversion()
  expect(create.getAttribute("aria-disabled")).toBe("true")
  expect(document.activeElement).toBe(create)
  fireEvent.click(create)
  expect(convert).toHaveBeenCalledTimes(1)
  await act(async () => resolve({ error: "invalid" }))
  expect(screen.getByRole("alert").textContent).toBe(messages.invalidApng)
  expect(create.getAttribute("aria-disabled")).toBe("false")
  expect(document.activeElement).toBe(create)
})

test.each(["cancellation", "completion"])(
  "focus returns to Create when Cancel disappears after %s",
  async (outcome) => {
    const { cancel, create, resolve } = startConversion()
    cancel.focus()
    if (outcome === "cancellation") {
      fireEvent.click(cancel)
      expect(convert.mock.calls[0]?.[2].aborted).toBe(true)
    } else {
      await act(async () => resolve({ error: "invalid" }))
    }
    expect(screen.queryByRole("button", { name: messages.cancel })).toBeNull()
    expect(document.activeElement).toBe(create)
  }
)
