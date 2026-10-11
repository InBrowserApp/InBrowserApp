// Classic worker: the Emscripten loader and its pthreads require importScripts.
self.onmessage = async ({ data }) => {
  const urls = []
  try {
    const { input, assets, guard } = data
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
    module.FS.writeFile("/tmp/input.ppt", new Uint8Array(input))
    const document = call(
      "_lok_documentLoadWithOptions",
      office,
      "file:///tmp/input.ppt",
      "Batch=true,EnableMacrosExecution=false"
    )
    if (!document || call("_lok_documentGetDocumentType", document) !== 2)
      throw new Error("Unsupported presentation")
    const pages = call("_lok_documentGetParts", document)
    if (!Number.isInteger(pages) || pages < 1)
      throw new Error("Empty presentation")
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
      })
    )
    if (!saved) throw new Error("PDF export failed")
    const bytes = module.FS.readFile("/tmp/output.pdf").slice().buffer
    self.postMessage({ type: "result", bytes, pages }, [bytes])
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
