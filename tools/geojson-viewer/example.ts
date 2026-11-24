const example = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Tokyo Station", kind: "Station" },
      geometry: { type: "Point", coordinates: [139.7671, 35.6812] },
    },
    {
      type: "Feature",
      properties: { name: "Sumida River walk", kind: "Route" },
      geometry: {
        type: "LineString",
        coordinates: [
          [139.794, 35.71],
          [139.798, 35.708],
          [139.798, 35.697],
          [139.791, 35.69],
          [139.788, 35.683],
          [139.783, 35.674],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Imperial Palace grounds", kind: "Area" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [139.746, 35.689],
            [139.751, 35.694],
            [139.759, 35.691],
            [139.761, 35.685],
            [139.755, 35.68],
            [139.747, 35.683],
            [139.746, 35.689],
          ],
        ],
      },
    },
  ],
}

export { example }
