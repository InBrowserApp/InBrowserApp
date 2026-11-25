import {
  Group,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  Vector3,
} from "three"
import { expect, test, vi } from "vitest"
import { modelLengthFormat } from "./model-length-format"
import { createModelMeasurement } from "./model-measurement"

test("picks the visible mesh in world coordinates behind hidden surfaces", () => {
  const scene = new Scene()
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
  camera.position.z = 6
  camera.updateMatrixWorld()
  const canvas = document.createElement("canvas")
  vi.spyOn(canvas, "getBoundingClientRect").mockReturnValue(
    new DOMRect(0, 0, 100, 100)
  )
  const root = new Group()
  root.position.z = 1
  scene.add(root)
  const geometry = new PlaneGeometry(2, 2)
  const material = new MeshBasicMaterial()
  const visible = new Mesh(geometry, material)
  const hiddenParent = new Group()
  hiddenParent.visible = false
  hiddenParent.position.z = 2
  hiddenParent.add(new Mesh(geometry, material))
  const hiddenMaterial = new MeshBasicMaterial({ visible: false })
  const hiddenSurface = new Mesh(geometry, hiddenMaterial)
  hiddenSurface.position.z = 3
  root.add(visible, hiddenParent, hiddenSurface)
  scene.updateMatrixWorld(true)

  const measurement = createModelMeasurement(scene, canvas, camera, [root])
  expect(measurement.canMeasure).toBe(true)
  expect(measurement.pick(50, 50)).toEqual(new Vector3(0, 0, 1))
  expect(measurement.pick(75, 50)).toEqual(new Vector3(0.5, 0, 1))

  visible.visible = false
  const withoutSurface = createModelMeasurement(scene, canvas, camera, [root])
  expect(withoutSurface.canMeasure).toBe(false)
  expect(withoutSurface.pick(50, 50)).toBeUndefined()
  withoutSurface.dispose()
  measurement.dispose()
  geometry.dispose()
  material.dispose()
  hiddenMaterial.dispose()
})

test("uses the format's scale for physical units and keeps raw coordinates for unitless files", () => {
  expect(modelLengthFormat("en", "meter", "millimeter")(0.0254)).toBe("25.4 mm")
  expect(modelLengthFormat("en", "millimeter", "inch")(25.4)).toBe("1 in")
  expect(modelLengthFormat("en")(25.4)).toBe("25.4")
})
