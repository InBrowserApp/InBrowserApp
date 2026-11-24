declare module "occt-import-js" {
  type ImportedMesh = import("./step-data").ImportedMesh

  export default function initialize(options: {
    locateFile: () => string
  }): Promise<{
    ReadStepFile(
      bytes: Uint8Array,
      options: { linearUnit: "millimeter"; angularDeflection: number }
    ): { success: false } | { success: true; meshes: ImportedMesh[] }
  }>
}
