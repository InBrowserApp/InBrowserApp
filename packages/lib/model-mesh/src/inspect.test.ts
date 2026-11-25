import { BoxGeometry, Group, Mesh } from "three"
import { expect, it } from "vitest"
import { analyzeMesh, inspectMesh } from "./inspect"

it("measures a translated closed cube from its indexed surface", () => {
  const mesh = new Mesh(new BoxGeometry(2, 2, 2))
  mesh.position.set(1000, -2000, 3000)
  expect(analyzeMesh(mesh)).toEqual({
    surfaceArea: 24,
    volume: 8,
    triangles: 12,
    vertices: 8,
    shells: 1,
    boundaryEdges: 0,
    nonManifoldEdges: 0,
    nonManifoldVertices: 0,
    inconsistentEdges: 0,
    degenerateFaces: 0,
    duplicateFaces: 0,
  })
})

it("counts open boundaries and keeps surface area available", async () => {
  const file = new File(["v 0 0 0\nv 2 0 0\nv 0 3 0\nf 1 2 3"], "open.obj")
  expect(await inspectMesh(file)).toMatchObject({
    surfaceArea: 3,
    volume: null,
    boundaryEdges: 3,
    nonManifoldVertices: 0,
    shells: 1,
  })
})

it("finds disconnected fans when two closed shells touch at one vertex", () => {
  const group = new Group()
  const corner = new Mesh(new BoxGeometry(2, 2, 2))
  corner.position.set(2, 2, 2)
  group.add(new Mesh(new BoxGeometry(2, 2, 2)), corner)
  expect(analyzeMesh(group)).toMatchObject({
    vertices: 15,
    shells: 2,
    boundaryEdges: 0,
    nonManifoldEdges: 0,
    nonManifoldVertices: 1,
    volume: null,
  })
})

it("separates repeated faces, zero-area faces and edge winding issues", async () => {
  const model = [
    "v 0 0 0",
    "v 1 0 0",
    "v 0 1 0",
    "v 0 0 1",
    "f 1 2 3",
    "f 1 2 3",
    "f 2 1 4",
    "f 1 1 2",
  ].join("\n")
  expect(await inspectMesh(new File([model], "topology.obj"))).toMatchObject({
    triangles: 4,
    duplicateFaces: 1,
    degenerateFaces: 1,
    nonManifoldEdges: 1,
    inconsistentEdges: 2,
    volume: null,
  })
})

it("keeps OBJ mesh faces when the object also contains lines or points", async () => {
  const model = [
    "v 0 0 0",
    "v 1 0 0",
    "v 0 1 0",
    "v 0 0 1",
    "f 1 3 2",
    "f 1 2 4",
    "f 1 4 3",
    "f 2 3 4",
    "l 1 2",
    "p 1",
  ].join("\n")
  expect(await inspectMesh(new File([model], "mixed.obj"))).toMatchObject({
    triangles: 4,
    volume: 1 / 6,
    shells: 1,
    boundaryEdges: 0,
  })
})

it("subtracts a reversed inner shell from the enclosed volume", () => {
  const cavity = new BoxGeometry(1, 1, 1)
  const index = cavity.index!
  for (let i = 0; i < index.count; i += 3) {
    const first = index.getX(i)
    index.setX(i, index.getX(i + 1))
    index.setX(i + 1, first)
  }
  const model = new Group().add(
    new Mesh(new BoxGeometry(2, 2, 2)),
    new Mesh(cavity)
  )
  expect(analyzeMesh(model)).toMatchObject({
    shells: 2,
    volume: 7,
    surfaceArea: 30,
  })
})
