import {
  AnimationMixer,
  Color,
  DirectionalLight,
  GridHelper,
  Group,
  HemisphereLight,
  OrthographicCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import type { Material, Mesh } from "three"
import type { OpenModel } from "./load-model"

export function createModelViewport(
  host: HTMLElement,
  { object, size, center, zUp, animations }: OpenModel
) {
  const radius = size.length() / 2
  const renderer = new WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.domElement.className = "absolute inset-0 block"
  renderer.domElement.setAttribute("aria-hidden", "true")
  host.append(renderer.domElement)

  const scene = new Scene()
  const origin = new Group()
  origin.position.copy(center).negate()
  origin.add(object)
  scene.add(origin)
  const grid = new GridHelper(radius * 7, 24)
  if (zUp) grid.rotation.x = Math.PI / 2
  grid.position[zUp ? "z" : "y"] = -(zUp ? size.z : size.y) / 2 - radius * 0.03
  grid.material.transparent = true
  grid.material.opacity = 0.22
  grid.material.depthWrite = false
  scene.add(grid)

  scene.add(new HemisphereLight(0xf3f7ff, 0x6a7893, 2))
  const key = new DirectionalLight(0xffffff, 2.2)
  const fill = new DirectionalLight(0x9acaff, 1.3)
  key.position.set(-3, 5, 8)
  fill.position.set(4, -2, 3)
  if (zUp) {
    key.position.applyAxisAngle(new Vector3(1, 0, 0), Math.PI / 2)
    fill.position.applyAxisAngle(new Vector3(1, 0, 0), Math.PI / 2)
  }
  scene.add(key, fill)

  const camera = new OrthographicCamera(
    -1,
    1,
    1,
    -1,
    radius * 0.001,
    radius * 60
  )
  if (zUp) camera.up.set(0, 0, 1)
  const direction = zUp ? new Vector3(1, -1, 0.86) : new Vector3(1, 0.86, 1)
  camera.position.copy(direction).setLength(radius * 6)
  const controls = new OrbitControls(camera, renderer.domElement)
  const mixer = animations?.length ? new AnimationMixer(object) : undefined
  let clipIndex = -1
  let frame = 0
  let previousTime = 0
  controls.minZoom = 0.12
  controls.maxZoom = 100
  controls.zoomToCursor = true
  controls.update()

  function render() {
    grid.visible =
      camera.position[zUp ? "z" : "y"] > grid.position[zUp ? "z" : "y"]
    renderer.render(scene, camera)
  }

  function step(time: number) {
    mixer!.update(Math.min((time - previousTime) / 1000, 0.1))
    previousTime = time
    render()
    frame = requestAnimationFrame(step)
  }

  function resize() {
    const { clientWidth: width, clientHeight: height } = host
    if (!width || !height) return
    const aspect = width / height
    const halfHeight = (radius * 1.16) / Math.min(aspect, 1)
    camera.top = halfHeight
    camera.bottom = -halfHeight
    camera.left = -halfHeight * aspect
    camera.right = halfHeight * aspect
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
    render()
  }

  function applyTheme() {
    const color = new Color(
      document.documentElement.classList.contains("dark") ? 0x9aabc1 : 0x506985
    )
    grid.material.color.copy(color)
    render()
  }

  const observer = new ResizeObserver(resize)
  observer.observe(host)
  const theme = new MutationObserver(applyTheme)
  theme.observe(document.documentElement, { attributeFilter: ["class"] })
  controls.addEventListener("change", render)
  resize()
  applyTheme()
  return {
    fit() {
      camera.position.sub(controls.target).setLength(radius * 6)
      controls.target.set(0, 0, 0)
      camera.zoom = 1
      camera.updateProjectionMatrix()
      controls.update()
    },
    zoom(factor: number) {
      controls.dollyIn(factor)
    },
    pan(x: number, y: number) {
      controls.pan(x, y)
    },
    rotate(x: number, y: number) {
      if (x) controls.rotateLeft(x)
      if (y) controls.rotateUp(y)
    },
    setWireframe(visible: boolean) {
      object.traverse((node) => {
        const { material } = node as Mesh
        if (!material) return
        for (const item of Array.isArray(material) ? material : [material]) {
          if ("wireframe" in item)
            (item as Material & { wireframe: boolean }).wireframe = visible
        }
      })
      render()
    },
    setPlayback(index: number, playing: boolean) {
      const clip = animations?.[index]
      if (!mixer || !clip) return
      cancelAnimationFrame(frame)
      if (clipIndex !== index) {
        mixer.stopAllAction()
        mixer.clipAction(clip).reset().play()
        mixer.update(0)
        clipIndex = index
      }
      if (playing) {
        previousTime = performance.now()
        frame = requestAnimationFrame(step)
      }
      render()
    },
    dispose() {
      cancelAnimationFrame(frame)
      mixer?.stopAllAction()
      mixer?.uncacheRoot(object)
      observer.disconnect()
      theme.disconnect()
      controls.dispose()
      object.removeFromParent()
      grid.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
    },
  }
}
