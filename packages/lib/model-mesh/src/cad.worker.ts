import { readCad, type CadFormat } from "./cad"
import { prepareCadModel } from "./cad-data"

self.onmessage = async ({
  data,
}: MessageEvent<{ buffer: ArrayBuffer; format: CadFormat }>) => {
  try {
    const meshes = await readCad(data.buffer, data.format)
    const model = meshes ? prepareCadModel(meshes) : null
    const transfer = model?.meshes.flatMap(({ positions, indices, normals }) =>
      normals
        ? [positions.buffer, indices.buffer, normals.buffer]
        : [positions.buffer, indices.buffer]
    )
    postMessage(model, { transfer })
  } catch {
    postMessage(undefined)
  }
}
