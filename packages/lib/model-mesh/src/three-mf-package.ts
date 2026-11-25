export const rootRelationships = "_rels/.rels"
export const modelRelationship =
  "http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"
export const production =
  "http://schemas.microsoft.com/3dmanufacturing/production/2015/06"
export const modelNamespace =
  "http://schemas.microsoft.com/3dmanufacturing/core/2015/02"
export const relationshipNamespace =
  "http://schemas.openxmlformats.org/package/2006/relationships"

const millimeters = {
  micron: 0.001,
  millimeter: 1,
  centimeter: 10,
  inch: 25.4,
  foot: 304.8,
  meter: 1000,
}

export type ThreeMfUnit = keyof typeof millimeters

export function unitScale(unit = "millimeter") {
  if (!Object.hasOwn(millimeters, unit)) throw new Error("Unsupported 3MF unit")
  return millimeters[unit as ThreeMfUnit]
}
