// Classic worker: the Emscripten loader and its pthreads require importScripts.
self.onmessage = async ({ data }) => {
  const urls = []
  try {
    const { input, assets, guard } = data
    const writer = data.format === "writer"
    const inputPath = writer ? "/tmp/input.odt" : "/tmp/input.ppt"
    const NativeWorker = self.Worker
    self.Worker = class extends NativeWorker {
      constructor(...args) {
        super(...args)
        this.addEventListener("message", ({ data: message }) => {
          if (message.documentResourceBlocked)
            self.postMessage({ documentResourceBlocked: true })
        })
      }
    }
    const pthread = URL.createObjectURL(
      new Blob(
        [guard, "\nimportScripts(", JSON.stringify(assets.engine), ");"],
        { type: "text/javascript" }
      )
    )
    urls.push(pthread)
    await new Promise((resolve, reject) => {
      self.Module = {
        // Library mode avoids starting the CLI alongside the conversion API.
        noInitialRun: true,
        wasmBinary: assets.binary,
        getPreloadedPackage: () => assets.archive,
        mainScriptUrlOrBlob: pthread,
        print: () => {},
        printErr: () => {},
        onRuntimeInitialized: resolve,
        onAbort: reject,
      }
      importScripts(assets.engine)
    })
    const module = self.Module
    const call = (method, ...args) => {
      const pointers = []
      try {
        return module[method](
          ...args.map((value) => {
            if (typeof value !== "string") return value
            const bytes = new TextEncoder().encode(value + "\0")
            const pointer = module._malloc(bytes.length)
            if (!pointer) throw new RangeError("Allocation failed")
            pointers.push(pointer)
            // malloc may grow memory and invalidate an earlier heap view.
            module.HEAPU8.set(bytes, pointer)
            return pointer
          })
        )
      } finally {
        for (const pointer of pointers) module._free(pointer)
      }
    }
    module.ENV.MAX_CONCURRENCY = "1"
    for (const [index, name] of [
      "NotoSansCJKsc-Regular.otf",
      "NotoSansThai.ttf",
      "NotoSansDevanagari.ttf",
    ].entries())
      module.FS.writeFile(
        "/instdir/share/fonts/truetype/" + name,
        new Uint8Array(assets.fonts[index])
      )
    const office = call("_libreofficekit_hook", "/instdir/program")
    if (!office) throw new Error("Engine initialization failed")
    await new Promise((resolve) => setTimeout(resolve, 0))
    self.postMessage({ type: "progress", stage: "converting" })
    module.FS.writeFile(inputPath, new Uint8Array(input))
    const document = call(
      "_lok_documentLoadWithOptions",
      office,
      "file://" + inputPath,
      "Batch=true,EnableMacrosExecution=false"
    )
    if (
      !document ||
      call("_lok_documentGetDocumentType", document) !== (writer ? 0 : 2)
    )
      throw new Error("Unsupported document")
    const saved = call(
      "_lok_documentSaveAs",
      document,
      "file:///tmp/output.pdf",
      "pdf",
      JSON.stringify({
        ExportHiddenSlides: { type: "boolean", value: "true" },
        ExportBookmarks: { type: "boolean", value: "false" },
        ExportNotesPages: { type: "boolean", value: "false" },
        ExportFormFields: { type: "boolean", value: "false" },
        ...(writer
          ? {
              IsSkipEmptyPages: { type: "boolean", value: "false" },
              ExportNotes: { type: "boolean", value: "false" },
            }
          : {}),
      })
    )
    if (!saved) throw new Error("PDF export failed")
    let dimensions
    if (writer) {
      // Writer has no parts contract. Its page rectangles are in twips.
      const pointer = call("_lok_documentGetPartPageRectangles", document)
      if (!pointer) throw new Error("Missing page information")
      try {
        let end = pointer
        while (end < module.HEAPU8.length && module.HEAPU8[end]) end++
        const value = new TextDecoder().decode(
          new Uint8Array(module.HEAPU8.subarray(pointer, end))
        )
        dimensions = value.split(";").map((rectangle) => {
          const parts = rectangle.split(",").map(Number)
          if (parts.length !== 4 || !parts.every(Number.isFinite))
            throw new Error("Invalid page information")
          // Writer exposes automatically inserted blank pages as 0 × 0.
          // Keep their place; the exported PDF supplies their paper size.
          if (parts[2] === 0 && parts[3] === 0) return null
          if (parts[2] <= 0 || parts[3] <= 0)
            throw new Error("Invalid page information")
          return { width: parts[2] / 20, height: parts[3] / 20 }
        })
      } finally {
        module._free(pointer)
      }
    }
    const pages = writer
      ? dimensions.length
      : call("_lok_documentGetParts", document)
    if (!Number.isInteger(pages) || pages < 1) throw new Error("Empty document")
    const bytes = module.FS.readFile("/tmp/output.pdf").slice().buffer
    self.postMessage(
      { type: "result", bytes, pages, ...(writer ? { dimensions } : {}) },
      [bytes]
    )
  } catch (error) {
    self.postMessage({
      type: "error",
      code: /memory|alloc|array buffer|array length|out of bounds/i.test(
        String(error)
      )
        ? "resource"
        : "invalid",
    })
  } finally {
    for (const url of urls) URL.revokeObjectURL(url)
  }
}
