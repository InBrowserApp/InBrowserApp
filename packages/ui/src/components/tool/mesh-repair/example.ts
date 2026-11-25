export async function repairExample() {
  const a = "10 20 30"
  const b = "40 20 30"
  const c = "10 50 30"
  const d = "10 20 60"
  const faces = [
    [a, b, c],
    [a, b, d],
    [a, d, c],
    [b, c, d],
    [d, b, a],
    [a, a, c],
  ]
  const facets = faces.map((face) =>
    [
      "facet normal 0 0 0",
      "outer loop",
      ...face.map((point) => `vertex ${point}`),
      "endloop",
      "endfacet",
    ].join("\n")
  )
  return new File(
    [`solid repair-sample\n${facets.join("\n")}\nendsolid repair-sample\n`],
    "repair-sample.stl",
    { type: "model/stl" }
  )
}
