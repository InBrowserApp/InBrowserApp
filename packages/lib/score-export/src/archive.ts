export async function exportScoreZip(
  files: Record<string, Uint8Array>,
  filename: string,
  level: 0 | 6
) {
  const { zip } = await import("fflate")
  const bytes = await new Promise<Uint8Array>((resolve, reject) => {
    zip(files, { level }, (error, result) => {
      if (error) reject(error)
      else resolve(result)
    })
  })
  return {
    blob: new Blob([new Uint8Array(bytes)], { type: "application/zip" }),
    filename,
  }
}
