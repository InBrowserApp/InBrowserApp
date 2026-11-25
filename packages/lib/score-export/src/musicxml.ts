import { OpenSheetMusicDisplay } from "opensheetmusicdisplay"
import { inScoreHost, paperSizes, placeFullPage } from "./pages"
import type { ScorePaper } from "./pages"

const formats = { a4: "A4 P", letter: "Letter P" } as const

export function musicXmlBasename(name: string) {
  return name.replace(/\.(?:musicxml|xml|mxl)$/i, "")
}

export async function renderMusicXmlPages(
  file: File,
  paper: ScorePaper = "a4"
) {
  const { width } = paperSizes[paper]
  return inScoreHost(width, async (host) => {
    const display = new OpenSheetMusicDisplay(host, {
      backend: "svg",
      pageFormat: formats[paper],
      autoResize: false,
      keepWarm: false,
    })
    try {
      await display.load(file)
      display.render()
      const title = host.querySelector<SVGTextElement>(".osmd-title text")
      const titleWidth = title?.getBBox().width ?? 0
      // Leave room for PDF outline fonts, which can be wider than the preview font.
      const titleLimit = width * 0.7
      if (titleWidth > titleLimit) {
        display.EngravingRules.SheetTitleHeight *= titleLimit / titleWidth
        display.render()
        const fitted = host.querySelector(".osmd-title text")!
        fitted.setAttribute("x", String(width / 2))
        fitted.setAttribute("text-anchor", "middle")
      }
      const pages = host.querySelectorAll<SVGSVGElement>(
        'svg[id^="osmdSvgPage"]'
      )
      if (!pages.length) throw new Error("The score has no rendered pages")
      return Array.from(pages, (page) =>
        placeFullPage(page.cloneNode(true) as SVGSVGElement, paper)
      )
    } finally {
      display.destroy()
    }
  })
}
