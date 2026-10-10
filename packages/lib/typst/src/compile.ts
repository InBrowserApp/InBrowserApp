import { createTypstCompiler } from "@myriaddreamin/typst.ts/compiler"
import {
  loadFonts,
  withAccessModel,
  withPackageRegistry,
} from "@myriaddreamin/typst.ts/options.init"
import { MemoryAccessModel } from "@myriaddreamin/typst.ts/fs/memory"
import wasmUrl from "@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm?gzip-url"
import { diagnostic, failure, readSource } from "./core/document"
import type { CompileResult, Phase } from "./types"

const fontUrls = [
  new URL("./assets/fonts/DejaVuSansMono-Bold.ttf", import.meta.url).href,
  new URL("./assets/fonts/DejaVuSansMono-BoldOblique.ttf", import.meta.url)
    .href,
  new URL("./assets/fonts/DejaVuSansMono-Oblique.ttf", import.meta.url).href,
  new URL("./assets/fonts/DejaVuSansMono.ttf", import.meta.url).href,
  new URL("./assets/fonts/LibertinusSerif-Bold.otf", import.meta.url).href,
  new URL("./assets/fonts/LibertinusSerif-BoldItalic.otf", import.meta.url)
    .href,
  new URL("./assets/fonts/LibertinusSerif-Italic.otf", import.meta.url).href,
  new URL("./assets/fonts/LibertinusSerif-Regular.otf", import.meta.url).href,
  new URL("./assets/fonts/LibertinusSerif-Semibold.otf", import.meta.url).href,
  new URL("./assets/fonts/LibertinusSerif-SemiboldItalic.otf", import.meta.url)
    .href,
  new URL("./assets/fonts/NewCM10-Bold.otf", import.meta.url).href,
  new URL("./assets/fonts/NewCM10-BoldItalic.otf", import.meta.url).href,
  new URL("./assets/fonts/NewCM10-Italic.otf", import.meta.url).href,
  new URL("./assets/fonts/NewCM10-Regular.otf", import.meta.url).href,
  new URL("./assets/fonts/NewCMMath-Bold.otf", import.meta.url).href,
  new URL("./assets/fonts/NewCMMath-Book.otf", import.meta.url).href,
  new URL("./assets/fonts/NewCMMath-Regular.otf", import.meta.url).href,
]

async function fetchBytes(url: string, compressed = false) {
  const response = await fetch(url)
  if (!response.ok || !response.body) throw new Error("asset unavailable")
  const body = compressed
    ? response.body.pipeThrough(new DecompressionStream("gzip"))
    : response.body
  return new Uint8Array(await new Response(body).arrayBuffer())
}

export async function compile(
  file: File,
  progress: (phase: Phase) => void
): Promise<CompileResult> {
  let phase: Phase = "reading"
  try {
    progress(phase)
    const source = readSource(await file.arrayBuffer())
    phase = "preparing"
    progress(phase)
    const [wasm, fonts] = await Promise.all([
      fetchBytes(wasmUrl, true),
      Promise.all(fontUrls.map((url) => fetchBytes(url))),
    ])
    const compiler = createTypstCompiler()
    await compiler.init({
      getModule: () => wasm,
      beforeBuild: [
        loadFonts(fonts, { assets: false }),
        withAccessModel(new MemoryAccessModel()),
        withPackageRegistry({ resolve: () => undefined }),
      ],
    })
    phase = "compiling"
    progress(phase)
    compiler.addSource("/main.typ", source)
    return await compiler.runWithWorld(
      { mainFilePath: "/main.typ", root: "/" },
      async (world) => {
        // Export alone omits warnings when compilation succeeds.
        const report = await world.compile({ diagnostics: "full" })
        const output = report.hasError
          ? undefined
          : await world.pdf({ diagnostics: "full" })
        const diagnostics = [
          ...(report.diagnostics ?? []),
          ...(output?.diagnostics ?? []),
        ].map(diagnostic)
        return output?.result
          ? { pdf: output.result.slice().buffer, diagnostics }
          : { error: "failed", diagnostics }
      }
    )
  } catch (reason) {
    const error = failure(reason)
    return {
      error:
        phase === "preparing" && error !== "resource"
          ? "engineUnavailable"
          : error,
      diagnostics: [],
    }
  }
}
