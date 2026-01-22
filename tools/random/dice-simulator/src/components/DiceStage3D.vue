<template>
  <div class="stage" ref="containerRef" data-testid="dice-stage">
    <canvas ref="canvasRef" class="stage-canvas" />
    <div v-if="hiddenCount" class="stage-pill" data-testid="stage-overflow">
      {{ t('showing', { visible: visibleResults.length, total: results.length }) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useElementSize } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { useThemeVars } from 'naive-ui'

type Vec3 = { x: number; y: number; z: number }
type Vec2 = { x: number; y: number }
type Mat3 = [number, number, number, number, number, number, number, number, number]

interface Face {
  indices: number[]
}

interface Polyhedron {
  vertices: Vec3[]
  faces: Face[]
}

interface DieSeed {
  x: number
  y: number
  shade: number
  rotX: number
  rotY: number
  rotZ: number
  spin: number
  spinAxis: Vec3
}

const props = defineProps<{
  results: number[]
  faces: number
  rollId: number
  maxVisible?: number
}>()

const emit = defineEmits<{
  (e: 'settled'): void
}>()

const { t } = useI18n()
const themeVars = useThemeVars()

const containerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const { width, height } = useElementSize(containerRef)

const maxVisible = computed(() => props.maxVisible ?? 60)
const visibleResults = computed(() => props.results.slice(0, maxVisible.value))
const hiddenCount = computed(() => Math.max(0, props.results.length - visibleResults.value.length))

const seeds = ref<DieSeed[]>([])
let rafId = 0
let animationStart = 0
const animationDuration = 700
const geometryCache = new Map<number, Polyhedron>()
const cameraDistance = 3.4
const cameraDirection: Vec3 = { x: 0, y: 0, z: 1 }
const lightDirection = normalize({ x: 0.4, y: 0.7, z: 1 })
const tiltRotation = createEulerMatrix(-0.45, 0.55, 0)

const redrawToken = ref(0)
const fallbackSeed: DieSeed = {
  x: 0,
  y: 0,
  shade: 0.5,
  rotX: 0,
  rotY: 0,
  rotZ: 0,
  spin: 0,
  spinAxis: { x: 0, y: 1, z: 0 },
}

function scheduleDraw() {
  redrawToken.value += 1
}

function getCanvas(): HTMLCanvasElement | null {
  return canvasRef.value
}

async function exportImage(scale = 1): Promise<Blob | null> {
  const canvas = getCanvas()
  if (!canvas) return null
  const exportCanvas = document.createElement('canvas')
  exportCanvas.width = canvas.width * scale
  exportCanvas.height = canvas.height * scale
  const ctx = exportCanvas.getContext('2d')
  if (!ctx) return null
  ctx.drawImage(canvas, 0, 0, exportCanvas.width, exportCanvas.height)

  return new Promise((resolve) => {
    exportCanvas.toBlob((blob) => resolve(blob), 'image/png')
  })
}

defineExpose({
  exportImage,
})

function prepareSeeds() {
  const count = visibleResults.value.length
  seeds.value = Array.from({ length: count }, () => ({
    x: Math.random() * 2 - 1,
    y: Math.random() * 2 - 1,
    shade: Math.random(),
    rotX: Math.random() * Math.PI * 2,
    rotY: Math.random() * Math.PI * 2,
    rotZ: Math.random() * Math.PI * 2,
    spin: 1 + Math.random() * 2,
    spinAxis: normalize({
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
      z: Math.random() * 2 - 1,
    }),
  }))
}

function startAnimation() {
  if (rafId) {
    cancelAnimationFrame(rafId)
  }
  if (!visibleResults.value.length) {
    drawScene(1)
    emit('settled')
    return
  }
  prepareSeeds()
  animationStart = performance.now()
  animate()
}

function animate() {
  rafId = requestAnimationFrame((now) => {
    const elapsed = now - animationStart
    const progress = Math.min(elapsed / animationDuration, 1)
    drawScene(progress)
    if (progress < 1) {
      animate()
    } else {
      rafId = 0
      emit('settled')
    }
  })
}

function drawScene(progress: number) {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const pixelRatio = window.devicePixelRatio || 1
  const cssWidth = Math.max(1, width.value || 1)
  const cssHeight = Math.max(1, height.value || 1)
  const targetWidth = Math.floor(cssWidth * pixelRatio)
  const targetHeight = Math.floor(cssHeight * pixelRatio)

  if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
    canvas.width = targetWidth
    canvas.height = targetHeight
  }

  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  ctx.clearRect(0, 0, cssWidth, cssHeight)

  drawBackground(ctx, cssWidth, cssHeight)

  if (!visibleResults.value.length) {
    drawPlaceholder(ctx, cssWidth, cssHeight)
    return
  }

  const layout = computeLayout(visibleResults.value.length, cssWidth, cssHeight)
  const eased = easeOutCubic(progress)

  layout.forEach((position, index) => {
    const seed = seeds.value[index] ?? fallbackSeed
    const jitter = (1 - eased) * position.size * 0.45
    const offsetX = seed.x * jitter
    const offsetY = seed.y * jitter
    const bounce = Math.sin(eased * Math.PI) * jitter * 0.4
    drawDie(
      ctx,
      position.x + offsetX,
      position.y + offsetY - bounce,
      position.size,
      visibleResults.value[index] ?? 1,
      props.faces,
      seed,
      eased,
    )
  })
}

function computeLayout(count: number, canvasWidth: number, canvasHeight: number) {
  const padding = Math.max(24, Math.min(40, canvasWidth * 0.06))
  const usableWidth = Math.max(120, canvasWidth - padding * 2)
  const usableHeight = Math.max(120, canvasHeight - padding * 2)
  const columns = Math.max(1, Math.ceil(Math.sqrt((count * usableWidth) / usableHeight)))
  const rows = Math.ceil(count / columns)
  const cellWidth = usableWidth / columns
  const cellHeight = usableHeight / rows
  const size = Math.min(cellWidth, cellHeight) * 0.6

  const positions: Array<{ x: number; y: number; size: number }> = []
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < columns; col += 1) {
      const index = row * columns + col
      if (index >= count) break
      const x = padding + col * cellWidth + cellWidth / 2
      const y = padding + row * cellHeight + cellHeight / 2
      positions.push({ x, y, size })
    }
  }

  return positions
}

function drawBackground(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
  const base = themeVars.value.bodyColor || '#f5f7ff'
  const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight)
  gradient.addColorStop(0, mixColor(base, '#ffffff', 0.2))
  gradient.addColorStop(1, mixColor(base, '#d6d9f7', 0.2))
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)
}

function drawPlaceholder(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
  ctx.fillStyle = themeVars.value.textColor3 || '#9aa0b5'
  ctx.font = '600 16px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(t('empty'), canvasWidth / 2, canvasHeight / 2)
}

interface FaceRenderData {
  indices: number[]
  vertices: Vec3[]
  center: Vec3
  normal: Vec3
  u: Vec3
  v: Vec3
  radius: number
  depth: number
  facing: number
}

interface DieMaterial {
  base: string
  ink: string
  edge: string
}

function drawDie(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  value: number,
  faces: number,
  seed: DieSeed,
  progress: number,
) {
  const geometry = getPolyhedron(faces)
  const material = getMaterial(faces, seed.shade)

  const spinAngle = (1 - progress) * seed.spin * Math.PI * 2
  const spinRotation = createAxisAngleMatrix(seed.spinAxis, spinAngle)
  const baseRotation = createEulerMatrix(seed.rotX, seed.rotY, seed.rotZ)
  const rotation = multiplyMatrices(spinRotation, multiplyMatrices(baseRotation, tiltRotation))

  const transformed = geometry.vertices.map((vertex) => applyMatrix(rotation, vertex))
  const facesData = geometry.faces.map((face) => buildFaceData(face, transformed))
  const frontIndex = facesData.reduce((best, face, index) => {
    return face.facing > (facesData[best]?.facing ?? -1) ? index : best
  }, 0)

  drawShadow(ctx, x, y, size, progress)

  facesData
    .map((face, index) => ({ ...face, index }))
    .filter((face) => face.facing > -0.15)
    .sort((a, b) => a.depth - b.depth)
    .forEach((face) => {
      drawFace(ctx, face, material, size, x, y)
    })

  if (facesData[frontIndex]) {
    drawFaceLabel(ctx, facesData[frontIndex], value, faces, material, size, x, y)
  }
}

function drawShadow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  progress: number,
) {
  const alpha = 0.18 + 0.12 * progress
  ctx.save()
  ctx.translate(x, y + size * 0.62)
  ctx.scale(1, 0.32)
  ctx.beginPath()
  ctx.ellipse(0, 0, size * 0.55, size * 0.42, 0, 0, Math.PI * 2)
  ctx.fillStyle = `rgba(18, 20, 26, ${alpha.toFixed(3)})`
  ctx.fill()
  ctx.restore()
}

function drawFace(
  ctx: CanvasRenderingContext2D,
  face: FaceRenderData & { index: number },
  material: DieMaterial,
  size: number,
  offsetX: number,
  offsetY: number,
) {
  const intensity = clamp(0.2 + 0.8 * Math.max(0, dot(face.normal, lightDirection)), 0, 1)
  const fillColor = shadeColor(material.base, intensity)
  const points = face.vertices.map((vertex) => projectPoint(vertex, size, offsetX, offsetY))

  ctx.fillStyle = fillColor
  ctx.strokeStyle = material.edge
  ctx.lineWidth = Math.max(0.8, size * 0.035)
  ctx.lineJoin = 'round'

  ctx.beginPath()
  points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y)
    } else {
      ctx.lineTo(point.x, point.y)
    }
  })
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
}

function drawFaceLabel(
  ctx: CanvasRenderingContext2D,
  face: FaceRenderData,
  value: number,
  faces: number,
  material: DieMaterial,
  size: number,
  offsetX: number,
  offsetY: number,
) {
  if (faces === 6) {
    drawPips(ctx, face, value, material, size, offsetX, offsetY)
    return
  }

  const projected = projectPoint(face.center, size, offsetX, offsetY)
  const base = face.radius * size * projected.scale
  const fontSize = clamp(base * (value >= 10 ? 0.85 : 1), 10, size * 0.6)

  ctx.fillStyle = material.ink
  ctx.font = `700 ${fontSize}px "Iowan Old Style", "Times New Roman", serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(String(value), projected.x, projected.y)
}

const pipLayout: Record<number, Vec2[]> = {
  1: [{ x: 0, y: 0 }],
  2: [
    { x: -1, y: -1 },
    { x: 1, y: 1 },
  ],
  3: [
    { x: -1, y: -1 },
    { x: 0, y: 0 },
    { x: 1, y: 1 },
  ],
  4: [
    { x: -1, y: -1 },
    { x: 1, y: -1 },
    { x: -1, y: 1 },
    { x: 1, y: 1 },
  ],
  5: [
    { x: -1, y: -1 },
    { x: 1, y: -1 },
    { x: 0, y: 0 },
    { x: -1, y: 1 },
    { x: 1, y: 1 },
  ],
  6: [
    { x: -1, y: -1 },
    { x: 1, y: -1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: -1, y: 1 },
    { x: 1, y: 1 },
  ],
}

function drawPips(
  ctx: CanvasRenderingContext2D,
  face: FaceRenderData,
  value: number,
  material: DieMaterial,
  size: number,
  offsetX: number,
  offsetY: number,
) {
  const layout = pipLayout[value] ?? pipLayout[1]
  const spacing = face.radius * 0.55
  const pipRadius = face.radius * 0.16

  ctx.fillStyle = material.ink

  layout.forEach((pip) => {
    const pipCenter = addVec(
      face.center,
      addVec(scaleVec(face.u, pip.x * spacing), scaleVec(face.v, pip.y * spacing)),
    )
    const projected = projectPoint(pipCenter, size, offsetX, offsetY)
    const radius = pipRadius * size * projected.scale
    ctx.beginPath()
    ctx.arc(projected.x, projected.y, radius, 0, Math.PI * 2)
    ctx.fill()
  })
}

function buildFaceData(face: Face, vertices: Vec3[]): FaceRenderData {
  const faceVertices = face.indices.map((index) => vertices[index]).filter(Boolean)
  const center = averageVec(faceVertices)
  const normal = normalize(
    cross(
      subVec(faceVertices[1] ?? center, faceVertices[0] ?? center),
      subVec(faceVertices[2] ?? center, faceVertices[0] ?? center),
    ),
  )
  const u = normalize(subVec(faceVertices[1] ?? center, faceVertices[0] ?? center))
  const v = normalize(cross(normal, u))
  const radius =
    faceVertices.reduce((sum, vertex) => sum + length(subVec(vertex, center)), 0) /
    Math.max(1, faceVertices.length)

  return {
    indices: face.indices,
    vertices: faceVertices,
    center,
    normal,
    u,
    v,
    radius,
    depth: center.z,
    facing: dot(normal, cameraDirection),
  }
}

function getMaterial(faces: number, shadeSeed: number): DieMaterial {
  const palette: Record<number, { base: string; ink: string }> = {
    4: { base: '#d8655f', ink: '#fff3df' },
    6: { base: '#f3f0e7', ink: '#1b1a17' },
    8: { base: '#4f79d6', ink: '#f3f7ff' },
    10: { base: '#47a372', ink: '#effdf5' },
    12: { base: '#8f6ad1', ink: '#f7f0ff' },
    20: { base: '#d4a04b', ink: '#fff5e2' },
  }

  const themeBase = themeVars.value.primaryColor || '#6b7cff'
  const entry = palette[faces]
  const base = entry?.base ?? mixColor(themeBase, '#ffffff', 0.25)
  const ink = entry?.ink ?? '#f8fbff'
  const variant = (shadeSeed - 0.5) * 0.2
  const adjustedBase =
    variant >= 0 ? mixColor(base, '#ffffff', variant) : mixColor(base, '#000000', -variant)

  return {
    base: adjustedBase,
    ink,
    edge: mixColor(adjustedBase, '#000000', 0.35),
  }
}

function shadeColor(base: string, intensity: number) {
  const light = mixColor(base, '#ffffff', 0.45)
  const dark = mixColor(base, '#000000', 0.35)
  return mixColor(dark, light, intensity)
}

function projectPoint(point: Vec3, size: number, offsetX: number, offsetY: number) {
  const perspective = cameraDistance / (cameraDistance - point.z)
  return {
    x: offsetX + point.x * perspective * size,
    y: offsetY - point.y * perspective * size,
    scale: perspective,
  }
}

function getPolyhedron(faces: number): Polyhedron {
  const cached = geometryCache.get(faces)
  if (cached) return cached

  let polyhedron: Polyhedron
  switch (faces) {
    case 4:
      polyhedron = makeTetrahedron()
      break
    case 6:
      polyhedron = makeCube()
      break
    case 8:
      polyhedron = makeOctahedron()
      break
    case 10:
      polyhedron = makePentagonalBipyramid()
      break
    case 12:
      polyhedron = makeDodecahedron()
      break
    case 20:
      polyhedron = makeIcosahedron()
      break
    default:
      if (faces <= 6) {
        polyhedron = makeCube()
      } else if (faces <= 10) {
        polyhedron = makePentagonalBipyramid()
      } else if (faces <= 12) {
        polyhedron = makeDodecahedron()
      } else {
        polyhedron = makeIcosahedron()
      }
      break
  }

  const normalized = normalizePolyhedron(withOutwardFaces(polyhedron))
  geometryCache.set(faces, normalized)
  return normalized
}

function makeTetrahedron(): Polyhedron {
  return {
    vertices: [
      { x: 1, y: 1, z: 1 },
      { x: -1, y: -1, z: 1 },
      { x: -1, y: 1, z: -1 },
      { x: 1, y: -1, z: -1 },
    ],
    faces: [
      { indices: [0, 1, 2] },
      { indices: [0, 3, 1] },
      { indices: [0, 2, 3] },
      { indices: [1, 3, 2] },
    ],
  }
}

function makeCube(): Polyhedron {
  return {
    vertices: [
      { x: -1, y: -1, z: -1 },
      { x: 1, y: -1, z: -1 },
      { x: 1, y: 1, z: -1 },
      { x: -1, y: 1, z: -1 },
      { x: -1, y: -1, z: 1 },
      { x: 1, y: -1, z: 1 },
      { x: 1, y: 1, z: 1 },
      { x: -1, y: 1, z: 1 },
    ],
    faces: [
      { indices: [4, 5, 6, 7] },
      { indices: [0, 3, 2, 1] },
      { indices: [0, 4, 7, 3] },
      { indices: [1, 2, 6, 5] },
      { indices: [3, 7, 6, 2] },
      { indices: [0, 1, 5, 4] },
    ],
  }
}

function makeOctahedron(): Polyhedron {
  return {
    vertices: [
      { x: 1, y: 0, z: 0 },
      { x: -1, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 },
      { x: 0, y: -1, z: 0 },
      { x: 0, y: 0, z: 1 },
      { x: 0, y: 0, z: -1 },
    ],
    faces: [
      { indices: [0, 2, 4] },
      { indices: [2, 1, 4] },
      { indices: [1, 3, 4] },
      { indices: [3, 0, 4] },
      { indices: [2, 0, 5] },
      { indices: [1, 2, 5] },
      { indices: [3, 1, 5] },
      { indices: [0, 3, 5] },
    ],
  }
}

function makePentagonalBipyramid(): Polyhedron {
  const ring = Array.from({ length: 5 }, (_, index) => {
    const angle = (Math.PI * 2 * index) / 5
    return { x: Math.cos(angle), y: Math.sin(angle), z: 0 }
  })
  const topIndex = ring.length
  const bottomIndex = ring.length + 1
  const vertices = [...ring, { x: 0, y: 0, z: 1 }, { x: 0, y: 0, z: -1 }]
  const faces: Face[] = []

  for (let i = 0; i < ring.length; i += 1) {
    const next = (i + 1) % ring.length
    faces.push({ indices: [topIndex, i, next] })
    faces.push({ indices: [bottomIndex, next, i] })
  }

  return { vertices, faces }
}

function makeIcosahedron(): Polyhedron {
  const phi = (1 + Math.sqrt(5)) / 2
  const vertices = [
    { x: -1, y: phi, z: 0 },
    { x: 1, y: phi, z: 0 },
    { x: -1, y: -phi, z: 0 },
    { x: 1, y: -phi, z: 0 },
    { x: 0, y: -1, z: phi },
    { x: 0, y: 1, z: phi },
    { x: 0, y: -1, z: -phi },
    { x: 0, y: 1, z: -phi },
    { x: phi, y: 0, z: -1 },
    { x: phi, y: 0, z: 1 },
    { x: -phi, y: 0, z: -1 },
    { x: -phi, y: 0, z: 1 },
  ]

  const faces = [
    { indices: [0, 11, 5] },
    { indices: [0, 5, 1] },
    { indices: [0, 1, 7] },
    { indices: [0, 7, 10] },
    { indices: [0, 10, 11] },
    { indices: [1, 5, 9] },
    { indices: [5, 11, 4] },
    { indices: [11, 10, 2] },
    { indices: [10, 7, 6] },
    { indices: [7, 1, 8] },
    { indices: [3, 9, 4] },
    { indices: [3, 4, 2] },
    { indices: [3, 2, 6] },
    { indices: [3, 6, 8] },
    { indices: [3, 8, 9] },
    { indices: [4, 9, 5] },
    { indices: [2, 4, 11] },
    { indices: [6, 2, 10] },
    { indices: [8, 6, 7] },
    { indices: [9, 8, 1] },
  ]

  return { vertices, faces }
}

function makeDodecahedron(): Polyhedron {
  const icosahedron = makeIcosahedron()
  const dual = buildDual(icosahedron)
  return dual
}

function buildDual(source: Polyhedron): Polyhedron {
  const faceCenters = source.faces.map((face) =>
    normalize(averageVec(face.indices.map((index) => source.vertices[index]).filter(Boolean))),
  )
  const facesByVertex = source.vertices.map(() => [] as number[])
  source.faces.forEach((face, faceIndex) => {
    face.indices.forEach((vertexIndex) => {
      facesByVertex[vertexIndex]?.push(faceIndex)
    })
  })

  const faces = facesByVertex.map((faceIndices, vertexIndex) => {
    const normal = normalize(source.vertices[vertexIndex] ?? { x: 0, y: 0, z: 1 })
    const ordered = orderFaceIndices(faceIndices, faceCenters, normal)
    return { indices: orientFace(ordered, faceCenters) }
  })

  return {
    vertices: faceCenters,
    faces,
  }
}

function orderFaceIndices(indices: number[], centers: Vec3[], normal: Vec3) {
  const reference = Math.abs(normal.x) < 0.8 ? { x: 1, y: 0, z: 0 } : { x: 0, y: 1, z: 0 }
  const u = normalize(cross(normal, reference))
  const v = cross(normal, u)
  return [...indices].sort((a, b) => {
    const pointA = centers[a] ?? { x: 0, y: 0, z: 0 }
    const pointB = centers[b] ?? { x: 0, y: 0, z: 0 }
    const angleA = Math.atan2(dot(pointA, v), dot(pointA, u))
    const angleB = Math.atan2(dot(pointB, v), dot(pointB, u))
    return angleA - angleB
  })
}

function normalizePolyhedron(polyhedron: Polyhedron): Polyhedron {
  const maxLength = Math.max(...polyhedron.vertices.map((vertex) => length(vertex)))
  const scale = maxLength ? 1 / maxLength : 1
  return {
    vertices: polyhedron.vertices.map((vertex) => scaleVec(vertex, scale)),
    faces: polyhedron.faces,
  }
}

function withOutwardFaces(polyhedron: Polyhedron): Polyhedron {
  return {
    vertices: polyhedron.vertices,
    faces: polyhedron.faces.map((face) => ({
      indices: orientFace(face.indices, polyhedron.vertices),
    })),
  }
}

function orientFace(indices: number[], vertices: Vec3[]) {
  const faceVertices = indices.map((index) => vertices[index]).filter(Boolean)
  const center = averageVec(faceVertices)
  const normal = normalize(
    cross(
      subVec(faceVertices[1] ?? center, faceVertices[0] ?? center),
      subVec(faceVertices[2] ?? center, faceVertices[0] ?? center),
    ),
  )
  return dot(normal, center) < 0 ? [...indices].reverse() : indices
}

function createAxisAngleMatrix(axis: Vec3, angle: number): Mat3 {
  const axisLength = length(axis)
  if (!axisLength) {
    return [1, 0, 0, 0, 1, 0, 0, 0, 1]
  }
  const normalized = scaleVec(axis, 1 / axisLength)
  const { x, y, z } = normalized
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  const t = 1 - c
  return [
    t * x * x + c,
    t * x * y - s * z,
    t * x * z + s * y,
    t * x * y + s * z,
    t * y * y + c,
    t * y * z - s * x,
    t * x * z - s * y,
    t * y * z + s * x,
    t * z * z + c,
  ]
}

function createEulerMatrix(x: number, y: number, z: number): Mat3 {
  const cx = Math.cos(x)
  const sx = Math.sin(x)
  const cy = Math.cos(y)
  const sy = Math.sin(y)
  const cz = Math.cos(z)
  const sz = Math.sin(z)
  return [
    cy * cz,
    -cy * sz,
    sy,
    sx * sy * cz + cx * sz,
    cx * cz - sx * sy * sz,
    -sx * cy,
    sx * sz - cx * sy * cz,
    cx * sy * sz + sx * cz,
    cx * cy,
  ]
}

function multiplyMatrices(a: Mat3, b: Mat3): Mat3 {
  return [
    a[0] * b[0] + a[1] * b[3] + a[2] * b[6],
    a[0] * b[1] + a[1] * b[4] + a[2] * b[7],
    a[0] * b[2] + a[1] * b[5] + a[2] * b[8],
    a[3] * b[0] + a[4] * b[3] + a[5] * b[6],
    a[3] * b[1] + a[4] * b[4] + a[5] * b[7],
    a[3] * b[2] + a[4] * b[5] + a[5] * b[8],
    a[6] * b[0] + a[7] * b[3] + a[8] * b[6],
    a[6] * b[1] + a[7] * b[4] + a[8] * b[7],
    a[6] * b[2] + a[7] * b[5] + a[8] * b[8],
  ]
}

function applyMatrix(matrix: Mat3, vector: Vec3): Vec3 {
  return {
    x: matrix[0] * vector.x + matrix[1] * vector.y + matrix[2] * vector.z,
    y: matrix[3] * vector.x + matrix[4] * vector.y + matrix[5] * vector.z,
    z: matrix[6] * vector.x + matrix[7] * vector.y + matrix[8] * vector.z,
  }
}

function addVec(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z }
}

function subVec(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z }
}

function scaleVec(vector: Vec3, scale: number): Vec3 {
  return { x: vector.x * scale, y: vector.y * scale, z: vector.z * scale }
}

function averageVec(vectors: Vec3[]): Vec3 {
  if (!vectors.length) return { x: 0, y: 0, z: 0 }
  const sum = vectors.reduce((acc, vector) => addVec(acc, vector), { x: 0, y: 0, z: 0 })
  return scaleVec(sum, 1 / vectors.length)
}

function length(vector: Vec3) {
  return Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z)
}

function normalize(vector: Vec3): Vec3 {
  const len = length(vector)
  if (!len) return { x: 0, y: 0, z: 0 }
  return scaleVec(vector, 1 / len)
}

function dot(a: Vec3, b: Vec3) {
  return a.x * b.x + a.y * b.y + a.z * b.z
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function mixColor(base: string, target: string, amount: number) {
  const baseRgb = parseColor(base)
  const targetRgb = parseColor(target)
  const mix = {
    r: Math.round(baseRgb.r + (targetRgb.r - baseRgb.r) * amount),
    g: Math.round(baseRgb.g + (targetRgb.g - baseRgb.g) * amount),
    b: Math.round(baseRgb.b + (targetRgb.b - baseRgb.b) * amount),
  }
  return `rgb(${mix.r}, ${mix.g}, ${mix.b})`
}

function parseColor(color: string) {
  const hexMatch = color.replace('#', '').match(/^[0-9a-fA-F]{6}$/)
  if (hexMatch) {
    const value = color.replace('#', '')
    return {
      r: Number.parseInt(value.slice(0, 2), 16),
      g: Number.parseInt(value.slice(2, 4), 16),
      b: Number.parseInt(value.slice(4, 6), 16),
    }
  }
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i)
  if (rgbMatch) {
    return {
      r: Number.parseInt(rgbMatch[1] ?? '0', 10),
      g: Number.parseInt(rgbMatch[2] ?? '0', 10),
      b: Number.parseInt(rgbMatch[3] ?? '0', 10),
    }
  }
  return { r: 91, g: 124, b: 255 }
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3)
}

watch([width, height, redrawToken], () => {
  drawScene(1)
})

watch(
  () => props.results,
  () => {
    scheduleDraw()
  },
  { deep: true },
)

watch(
  () => props.rollId,
  () => {
    nextTick(() => startAnimation())
  },
)

watch(
  () => props.faces,
  () => {
    scheduleDraw()
  },
)

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.stage {
  position: relative;
  width: 100%;
  height: 360px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(130, 140, 170, 0.25);
  background: transparent;
}

.stage-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.stage-pill {
  position: absolute;
  right: 16px;
  bottom: 16px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  background: rgba(30, 34, 45, 0.7);
  color: #fff;
  backdrop-filter: blur(6px);
}

@media (max-width: 640px) {
  .stage {
    height: 280px;
  }
}
</style>

<i18n lang="json">
{
  "en": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "zh": {
    "empty": "开始投掷后即可查看 3D 画面。",
    "showing": "仅展示 {visible} / {total} 颗骰子"
  },
  "zh-CN": {
    "empty": "开始投掷后即可查看 3D 画面。",
    "showing": "仅展示 {visible} / {total} 颗骰子"
  },
  "zh-TW": {
    "empty": "開始擲骰後即可查看 3D 畫面。",
    "showing": "僅顯示 {visible} / {total} 顆骰子"
  },
  "zh-HK": {
    "empty": "開始擲骰後即可查看 3D 畫面。",
    "showing": "僅顯示 {visible} / {total} 顆骰子"
  },
  "es": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "fr": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "de": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "it": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "ja": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "ko": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "ru": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "pt": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "ar": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "hi": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "tr": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "nl": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "sv": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "pl": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "vi": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "th": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "id": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "he": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "ms": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  },
  "no": {
    "empty": "Roll the dice to see the 3D stage.",
    "showing": "Showing {visible} of {total} dice"
  }
}
</i18n>
