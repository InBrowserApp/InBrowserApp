import {
  BufferGeometry,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  Raycaster,
  SphereGeometry,
  Vector2,
  Vector3,
} from "three"
import type { Object3D, OrthographicCamera, Scene } from "three"

export function createModelMeasurement(
  scene: Scene,
  canvas: HTMLCanvasElement,
  camera: OrthographicCamera,
  modelRoots: Object3D[]
) {
  const color = 0xff7b43
  const geometry = new SphereGeometry(1, 12, 8)
  const material = new MeshBasicMaterial({ color, depthTest: false })
  const dots = [new Mesh(geometry, material), new Mesh(geometry, material)]
  for (const dot of dots) {
    dot.visible = false
    dot.renderOrder = 2
  }

  const line = new Line(
    new BufferGeometry().setFromPoints([new Vector3(), new Vector3()]),
    new LineBasicMaterial({ color, depthTest: false })
  )
  line.frustumCulled = false
  line.visible = false
  line.renderOrder = 1
  scene.add(line, ...dots)

  const ray = new Raycaster()
  const pointer = new Vector2()
  return {
    pick(x: number, y: number) {
      const bounds = canvas.getBoundingClientRect()
      pointer.set(
        ((x - bounds.left) / bounds.width) * 2 - 1,
        1 - ((y - bounds.top) / bounds.height) * 2
      )
      ray.setFromCamera(pointer, camera)
      const meshes: Mesh[] = []
      for (const root of modelRoots) {
        root.traverseVisible((node) => {
          if ((node as Mesh).isMesh) meshes.push(node as Mesh)
        })
      }
      return ray.intersectObjects(meshes, false).find((hit) => {
        const { material } = hit.object as Mesh
        const surface = Array.isArray(material)
          ? material[hit.face?.materialIndex ?? 0]
          : material
        return surface?.visible && surface.opacity !== 0
      })?.point
    },
    show(points: Vector3[]) {
      dots.forEach((dot, index) => {
        const point = points[index]
        dot.visible = Boolean(point)
        if (point) dot.position.copy(point)
      })
      const [first, second] = points
      line.visible = Boolean(first && second)
      if (first && second) {
        const position = line.geometry.getAttribute("position")
        position.setXYZ(0, first.x, first.y, first.z)
        position.setXYZ(1, second.x, second.y, second.z)
        position.needsUpdate = true
      }
    },
    resizeMarkers() {
      for (const dot of dots) {
        dot.scale.setScalar((camera.top / camera.zoom) * 0.016)
      }
    },
    dispose() {
      geometry.dispose()
      material.dispose()
      line.geometry.dispose()
      line.material.dispose()
    },
  }
}
