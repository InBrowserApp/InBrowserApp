import { ShapeUtils, Vector2, Vector3 } from "three"

// OBJLoader uses a triangle fan, which can cover space outside a concave face.
export function triangulateObj(source: string) {
  const vertices: Vector3[] = []
  return source
    .replaceAll("\r\n", "\n")
    .replaceAll("\\\n", "")
    .split("\n")
    .map((line) => {
      const start = line.trimStart()
      if (!/^[fv]\s/.test(start)) return line
      const content = start.split("#", 1)[0]!.trimEnd()
      const [kind, ...values] = content.split(/\s+/)
      if (kind === "v") {
        const [x, y, z] = values
        vertices.push(new Vector3(Number(x), Number(y), Number(z)))
        return content
      }
      if (values.length < 4) return content
      const points = values.map((value) => {
        const index = Number(value.split("/", 1)[0])
        return vertices[index < 0 ? vertices.length + index : index - 1]
      })
      if (points.some((point) => !point)) return line
      return triangulateFace(points as Vector3[], values) || line
    })
    .join("\n")
}

function triangulateFace(points: Vector3[], references: string[]) {
  const origin = points[0]!
  const normal = new Vector3()
  const edge = new Vector3()
  const next = new Vector3()
  for (let i = 1; i < points.length - 1; i++) {
    edge.subVectors(points[i]!, origin)
    next.subVectors(points[i + 1]!, origin)
    normal.add(edge.cross(next))
  }
  const nx = Math.abs(normal.x)
  const ny = Math.abs(normal.y)
  const nz = Math.abs(normal.z)
  const projected = points.map(({ x, y, z }) => {
    if (nx >= ny && nx >= nz) return new Vector2(y, z)
    if (ny >= nz) return new Vector2(x, z)
    return new Vector2(x, y)
  })
  const clockwise = ShapeUtils.isClockWise(projected)
  const faces = ShapeUtils.triangulateShape(projected, [])
  return faces
    .map(([a, b, c]) => {
      const triangle = [a!, b!, c!]
      if (
        ShapeUtils.isClockWise(triangle.map((i) => projected[i]!)) !== clockwise
      ) {
        triangle.reverse()
      }
      return `f ${triangle.map((i) => references[i]).join(" ")}`
    })
    .join("\n")
}
