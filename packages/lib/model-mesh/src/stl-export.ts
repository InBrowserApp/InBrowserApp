import { STLExporter } from "three/addons/exporters/STLExporter.js"
import type { Object3D } from "three"

export function exportStl(
  model: Object3D,
  source?: { data: ArrayBuffer; faces: number[] }
) {
  model.updateMatrixWorld(true)
  const output = new STLExporter().parse(model, { binary: true })
  if (source) {
    new Uint8Array(output.buffer, output.byteOffset, 80).set(
      new Uint8Array(source.data, 0, 80)
    )
    const original = new DataView(source.data)
    source.faces.forEach((face, index) => {
      output.setUint16(
        132 + index * 50,
        original.getUint16(132 + face * 50, true),
        true
      )
    })
  }
  return new Blob([output], { type: "model/stl" })
}

export function exportAsciiStl(model: Object3D) {
  model.updateMatrixWorld(true)
  return new Blob([new STLExporter().parse(model, { binary: false })], {
    type: "model/stl",
  })
}
