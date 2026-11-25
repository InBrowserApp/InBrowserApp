export async function readIgesExample() {
  return (await import("./stepped-part.igs?raw")).default
}
