import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, expect, test } from "vitest"

import { PagePreview } from "./page-preview"
import uiMessages from "../messages/en.json"
import meta from "../meta/en.json"

afterEach(cleanup)

test.each([0, 90, 180, 270])(
  "fits the complete preview at %i degrees",
  (rotation) => {
    render(
      <PagePreview
        isRenderingPreviews={false}
        messages={{ ...uiMessages, meta }}
        page={{
          id: "page-2",
          sourcePageNumber: 2,
          rotation,
          width: 300,
          height: 420,
        }}
        preview={{
          dataUrl: "data:image/jpeg;base64,test",
          width: 214,
          height: 300,
          pageNumber: 2,
        }}
        previewError=""
      />
    )
    const preview = screen.getByRole("img", {
      name: `${uiMessages.previewAltLabel} 2`,
    })
    expect(preview.getAttribute("viewBox")).toBe(
      rotation % 180 ? "0 0 300 214" : "0 0 214 300"
    )
    expect(preview.querySelector("image")?.getAttribute("transform")).toContain(
      `rotate(${rotation})`
    )
  }
)
