declare module "occt-import-js" {
  type ImportedMesh = import("./cad").ImportedMesh
  type ReadFile = (
    bytes: Uint8Array,
    options: { linearUnit: "millimeter"; angularDeflection: number }
  ) => { success: false } | { success: true; meshes: ImportedMesh[] }

  export default function initialize(options: {
    locateFile: () => string
  }): Promise<{
    ReadStepFile: ReadFile
    ReadIgesFile: ReadFile
  }>
}
