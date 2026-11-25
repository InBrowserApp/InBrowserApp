import { readStep } from "@workspace/model-mesh/cad"
import { prepareModel } from "./step-data"

self.onmessage = async ({ data }: MessageEvent<ArrayBuffer>) => {
  try {
    const meshes = await readStep(data)
    const model = meshes ? prepareModel(meshes) : null
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
