declare module "dxf-viewer/src/ColorTransform.js" {
  export function TransformColor(
    color: number,
    clearColor: number,
    colorCorrection: boolean,
    blackWhiteInversion: boolean
  ): number
}

declare module "dxf-viewer/src/DxfWorker.js" {
  export class DxfWorker {
    constructor(worker: null)
    Load(
      url: string,
      fonts: string[],
      options: {
        fileEncoding: string
        retainParsedDxf: true
        sceneOptions: { suppressPaperSpace: true; arcTessellationAngle: number }
      }
    ): Promise<{
      scene: unknown
      dxf: { header?: Record<string, unknown> }
    }>
  }
}

declare module "dxf-viewer/src/SceneReader.js" {
  export class SceneReader {
    constructor(scene: unknown)
    GetLayers(): Iterable<{
      name: string
      displayName: string
      visible?: boolean
      color: number
    }>
    ReadPrimitives(): Iterable<Primitive>
  }
  export type Primitive = {
    type: "POINT" | "POLYLINE" | "TRIANGLE"
    layer: string | null
    color: number
    vertices: [number, number][]
  }
}
