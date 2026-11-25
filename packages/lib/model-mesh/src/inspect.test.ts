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
