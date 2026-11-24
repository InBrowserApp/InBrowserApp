import {
  BufferGeometry,
  Color,
  DirectionalLight,
  GridHelper,
  HemisphereLight,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  Raycaster,
  Scene,
  SphereGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { makeMesh } from "./model-scene"
import { saveScreenshot } from "./screenshot"
import type { StepModel } from "./step-data"

type Point = Vector3
const directions = {
  isometric: new Vector3(1, 1, 0.85),
  front: new Vector3(0, -1, 0),
  top: new Vector3(0, -0.000001, 1),
  right: new Vector3(1, 0, 0),
}
export type View = keyof typeof directions
export type Viewport = ReturnType<typeof createViewport>

export function createViewport(host: HTMLElement, model: StepModel) {
  const radius = Math.max(Math.hypot(...model.size) / 2, 0.001)
  const renderer = new WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.domElement.className = "absolute inset-0 block"
  renderer.domElement.setAttribute("aria-hidden", "true")
  host.append(renderer.domElement)

  const scene = new Scene()
  const baseColor = new Color(0x659ce8)
  const meshes = model.meshes.map((mesh) => makeMesh(mesh, baseColor))
  scene.add(...meshes)
  const camera = new OrthographicCamera(
    -1,
    1,
    1,
    -1,
    radius * 0.01,
    radius * 12
  )
  camera.up.set(0, 0, 1)
  camera.position.copy(directions.isometric).setLength(radius * 4)
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.minZoom = 0.12
  controls.maxZoom = 100
  controls.zoomToCursor = true
  controls.update()

  scene.add(new HemisphereLight(0xf3f7ff, 0x637898, 2.15))
  const key = new DirectionalLight(0xffffff, 2)
  key.position.set(-2, 4, 7)
  scene.add(key)
  const fill = new DirectionalLight(0xa7caff, 1.3)
  fill.position.set(2, -4, 3)
  scene.add(fill)

  const grid = new GridHelper(radius * 12, 64, 0x8098b3, 0x9eb1c6)
  grid.rotation.x = Math.PI / 2
  grid.position.z = -model.size[2] / 2 - radius * 0.04
  grid.material.transparent = true
  grid.material.depthWrite = false
  scene.add(grid)

  const dotGeometry = new SphereGeometry(1, 12, 8)
  const dotMaterial = new MeshBasicMaterial({
    color: 0xff7b43,
    depthTest: false,
  })
  const dots = [
    new Mesh(dotGeometry, dotMaterial),
    new Mesh(dotGeometry, dotMaterial),
  ]
  const lineGeometry = new BufferGeometry().setFromPoints([
    new Vector3(),
    new Vector3(),
  ])
  const line = new Line(
    lineGeometry,
    new LineBasicMaterial({ color: 0xff7b43, depthTest: false })
  )
  line.frustumCulled = false
  line.visible = false
  line.renderOrder = 1
  for (const dot of dots) {
    dot.visible = false
    dot.renderOrder = 2
  }
  scene.add(line, ...dots)

  function render() {
    grid.visible = camera.position.z > grid.position.z
    for (const dot of dots) {
      dot.scale.setScalar((camera.top / camera.zoom) * 0.016)
    }
    renderer.render(scene, camera)
  }

  function setTheme() {
    const dark = document.documentElement.classList.contains("dark")
    scene.background = new Color(dark ? 0x131e2e : 0xeaf1fa)
    grid.material.opacity = dark ? 0.23 : 0.42
    render()
  }

  function resize() {
    const { clientWidth: width, clientHeight: height } = host
    if (!width || !height) return
    const aspect = width / height
    const halfHeight = (radius * 1.18) / Math.min(aspect, 1)
    camera.top = halfHeight
    camera.bottom = -halfHeight
    camera.left = -halfHeight * aspect
    camera.right = halfHeight * aspect
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
    render()
  }

  const observer = new ResizeObserver(resize)
  observer.observe(host)
  const theme = new MutationObserver(setTheme)
  theme.observe(document.documentElement, { attributeFilter: ["class"] })
  controls.addEventListener("change", render)
  resize()
  setTheme()

  function fit(direction = camera.position.clone().sub(controls.target)) {
    controls.target.set(0, 0, 0)
    camera.position.copy(direction).setLength(radius * 4)
    camera.zoom = 1
    camera.updateProjectionMatrix()
    controls.update()
    render()
  }

  const ray = new Raycaster()
  return {
    fit: () => fit(),
    view: (view: View) => fit(directions[view]),
    zoom: (factor: number) => controls.dollyIn(factor),
    rotate: (horizontal: number, vertical: number) => {
      if (horizontal) controls.rotateLeft(horizontal)
      if (vertical) controls.rotateUp(vertical)
    },
    pick(x: number, y: number): Point | undefined {
      const bounds = renderer.domElement.getBoundingClientRect()
      ray.setFromCamera(
        new Vector2(
          ((x - bounds.left) / bounds.width) * 2 - 1,
          1 - ((y - bounds.top) / bounds.height) * 2
        ),
        camera
      )
      return ray.intersectObjects(meshes)[0]?.point
    },
    showMeasurement(points: Point[]) {
      dots.forEach((dot, index) => {
        const point = points[index]
        dot.visible = Boolean(point)
        if (point) dot.position.copy(point)
      })
      const [first, second] = points
      line.visible = Boolean(first && second)
      if (first && second) {
        const position = lineGeometry.getAttribute("position")
        position.setXYZ(0, first.x, first.y, first.z)
        position.setXYZ(1, second.x, second.y, second.z)
        position.needsUpdate = true
      }
      render()
    },
    save(filename: string, label?: string) {
      render()
      return saveScreenshot(
        renderer.domElement,
        renderer.getPixelRatio(),
        filename,
        label
      )
    },
    dispose() {
      observer.disconnect()
      theme.disconnect()
      controls.dispose()
      for (const mesh of meshes) {
        mesh.geometry.dispose()
        mesh.material.dispose()
      }
      grid.dispose()
      dotGeometry.dispose()
      dotMaterial.dispose()
      lineGeometry.dispose()
      line.material.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
    },
  }
}
