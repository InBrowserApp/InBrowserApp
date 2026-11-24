export type Triple = [number, number, number]

export type StepMesh = {
  positions: Float32Array<ArrayBuffer>
  normals?: Float32Array<ArrayBuffer>
  indices: Uint32Array<ArrayBuffer>
  color?: Triple
  faces: { first: number; last: number; color: Triple }[]
}

export type StepModel = { size: Triple; meshes: StepMesh[] }

export type ImportedMesh = {
  attributes: { position: { array: number[] }; normal?: { array: number[] } }
  index: { array: number[] }
  color?: Triple
  brep_faces: { first: number; last: number; color: Triple | null }[]
}

export function prepareModel(input: ImportedMesh[]): StepModel | null {
  const meshes = input.filter((mesh) => mesh.index.array.length > 0)
  if (!meshes.length) return null

  const min: Triple = [Infinity, Infinity, Infinity]
  const max: Triple = [-Infinity, -Infinity, -Infinity]
  for (const { attributes } of meshes) {
    attributes.position.array.forEach((value, index) => {
      const axis = index % 3
      min[axis] = Math.min(min[axis]!, value)
      max[axis] = Math.max(max[axis]!, value)
    })
  }

  const [x, y, z] = min
  const size: Triple = [max[0] - x, max[1] - y, max[2] - z]
  // Center before converting to Float32 so distant origins keep local detail.
  const center = [x + size[0] / 2, y + size[1] / 2, z + size[2] / 2]
  return {
    size,
    meshes: meshes.map(({ attributes, index, color, brep_faces }) => ({
      positions: Float32Array.from(
        attributes.position.array,
        (value, i) => value - center[i % 3]!
      ),
      normals: attributes.normal && Float32Array.from(attributes.normal.array),
      indices: Uint32Array.from(index.array),
      color,
      faces: brep_faces.flatMap(({ first, last, color }) =>
        color ? [{ first, last, color }] : []
      ),
    })),
  }
}
