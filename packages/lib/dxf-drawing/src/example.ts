export async function exampleDrawing() {
  const { default: drawing } = await import("./bracket.dxf?raw")
  return new File([drawing], "bracket.dxf")
}
