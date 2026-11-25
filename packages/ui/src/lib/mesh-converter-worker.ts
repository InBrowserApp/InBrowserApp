export function createMeshConverterWorker() {
  return new Worker(
    new URL(
      "../components/tool/mesh-converter/convert.worker.ts",
      import.meta.url
    ),
    {
      type: "module",
    }
  )
}
