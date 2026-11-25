// @vitest-environment jsdom
import { expect, it, vi } from "vitest"
import { openNotebook } from "@workspace/notebook"
import messages from "./messages/en.json"
import { prepareNotebookPrint } from "./print-document"

vi.mock("@workspace/notebook", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@workspace/notebook")>()),
  openNotebook: vi.fn(),
}))

it("keeps code and saved results visible in a printable document", async () => {
  const signal = new AbortController().signal
  const file = new File(["notebook"], "Quarterly <review>.ipynb")
  vi.mocked(openNotebook).mockResolvedValue({
    cells: [
      {
        kind: "code",
        html: "<pre><code>print(42)</code></pre>",
        attachments: {},
        count: 1,
        outputs: [
          {
            label: "stdout",
            html: "<pre>42</pre>",
            interactive: false,
            unsupported: false,
          },
        ],
      },
    ],
  })

  const html = await prepareNotebookPrint(file, "en", messages, signal)
  const doc = new DOMParser().parseFromString(html, "text/html")

  expect(openNotebook).toHaveBeenCalledWith(file, signal)
  expect(doc.documentElement.lang).toBe("en")
  expect(doc.title).toBe("Quarterly <review>")
  expect(doc.querySelector("details")).toBeNull()
  expect(doc.querySelector("code")?.textContent).toBe("print(42)")
  expect(doc.querySelector(".nb-output pre")?.textContent).toBe("42")
  expect(
    doc
      .querySelector('meta[http-equiv="Content-Security-Policy"]')
      ?.getAttribute("content")
  ).toContain("script-src 'none'")
})
