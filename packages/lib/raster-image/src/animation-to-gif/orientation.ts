export type Orientation = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export function readExifOrientation(data: DataView): Orientation {
  // PNG stores a TIFF header directly. WebP can carry an Exif-prefixed block.
  const start =
    data.byteLength >= 6 &&
    data.getUint32(0) === 0x45786966 &&
    data.getUint16(4) === 0
      ? 6
      : 0
  if (data.byteLength < start + 8) return 1
  const byteOrder = data.getUint16(start)
  if (byteOrder !== 0x4949 && byteOrder !== 0x4d4d) return 1
  const littleEndian = byteOrder === 0x4949
  if (data.getUint16(start + 2, littleEndian) !== 42) return 1

  const directory = start + data.getUint32(start + 4, littleEndian)
  if (directory < start + 8 || directory + 2 > data.byteLength) return 1
  const count = data.getUint16(directory, littleEndian)
  const end = directory + 2 + count * 12
  if (end > data.byteLength) return 1

  for (let entry = directory + 2; entry < end; entry += 12) {
    if (data.getUint16(entry, littleEndian) !== 0x0112) continue
    if (
      data.getUint16(entry + 2, littleEndian) !== 3 ||
      data.getUint32(entry + 4, littleEndian) !== 1
    ) {
      return 1
    }
    const value = data.getUint16(entry + 8, littleEndian)
    return value >= 1 && value <= 8 ? (value as Orientation) : 1
  }
  return 1
}

export function orientationTransform(
  orientation: Exclude<Orientation, 1>,
  width: number,
  height: number
) {
  return {
    2: [-1, 0, 0, 1, width, 0],
    3: [-1, 0, 0, -1, width, height],
    4: [1, 0, 0, -1, 0, height],
    5: [0, 1, 1, 0, 0, 0],
    6: [0, 1, -1, 0, height, 0],
    7: [0, -1, -1, 0, height, width],
    8: [0, -1, 1, 0, 0, width],
  }[orientation] as readonly [number, number, number, number, number, number]
}
