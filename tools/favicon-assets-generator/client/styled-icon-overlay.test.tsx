import { cleanup, render } from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import { StyledIconOverlay } from "./styled-icon-overlay"

afterEach(cleanup)

describe("StyledIconOverlay", () => {
  test("renders an img with padding derived from marginPercent / 2", () => {
    const { container } = render(
      <StyledIconOverlay
        src="blob:icon"
        alt="icon"
        containerStyle={{ left: "10%", top: "10%", width: "20%" }}
        background={null}
        marginPercent={40}
      />
    )

    const img = container.querySelector("img")
    expect(img).not.toBeNull()
    expect(img!.style.padding).toBe("20%")
    expect(img!.style.boxSizing).toBe("border-box")
    expect(img!.getAttribute("src")).toBe("blob:icon")
    expect(img!.getAttribute("alt")).toBe("icon")
  })

  test("renders a background div with the configured color + radius when background is set", () => {
    const { container } = render(
      <StyledIconOverlay
        src="blob:icon"
        alt="icon"
        containerStyle={{ left: 0, top: 0, width: "100%" }}
        background={{ color: "#ABC123", radius: 30 }}
        marginPercent={0}
      />
    )

    const bgDiv = container.querySelector('[aria-hidden="true"]') as HTMLElement
    expect(bgDiv).not.toBeNull()
    expect(bgDiv.style.backgroundColor.toUpperCase()).toBe("#ABC123")
    expect(bgDiv.style.borderRadius).toBe("15%")
  })

  test("does not render the background div when background is null", () => {
    const { container } = render(
      <StyledIconOverlay
        src="blob:icon"
        alt="icon"
        containerStyle={{ width: "10%" }}
        background={null}
        marginPercent={0}
      />
    )

    expect(container.querySelector('[aria-hidden="true"]')).toBeNull()
  })

  test("does not render the img when src is null", () => {
    const { container } = render(
      <StyledIconOverlay
        src={null}
        alt="icon"
        containerStyle={{ width: "10%" }}
        background={{ color: "#FFFFFF", radius: 0 }}
        marginPercent={10}
      />
    )

    expect(container.querySelector("img")).toBeNull()
  })

  test("propagates borderRadius to the container and clipPath to the inner elements", () => {
    const { container } = render(
      <StyledIconOverlay
        src="blob:icon"
        alt="icon"
        containerStyle={{ width: "16%" }}
        background={{ color: "#FFFFFF", radius: 0 }}
        marginPercent={20}
        borderRadius="20%"
        clipPath="circle(40%)"
      />
    )

    const outer = container.querySelector("div") as HTMLElement
    expect(outer.style.borderRadius).toBe("20%")

    const bgDiv = container.querySelector('[aria-hidden="true"]') as HTMLElement
    expect(bgDiv.style.clipPath).toBe("circle(40%)")

    const img = container.querySelector("img") as HTMLImageElement
    expect(img.style.clipPath).toBe("circle(40%)")
  })

  test("applies the container positioning from containerStyle", () => {
    const { container } = render(
      <StyledIconOverlay
        src="blob:icon"
        alt="icon"
        containerStyle={{
          left: "76.7%",
          top: "69.5%",
          width: "16.2%",
          aspectRatio: "1 / 1",
        }}
        background={{ color: "#FFFFFF", radius: 0 }}
        marginPercent={0}
      />
    )

    const outer = container.querySelector("div") as HTMLElement
    expect(outer.style.left).toBe("76.7%")
    expect(outer.style.top).toBe("69.5%")
    expect(outer.style.width).toBe("16.2%")
    expect(outer.style.aspectRatio).toBe("1 / 1")
  })
})
