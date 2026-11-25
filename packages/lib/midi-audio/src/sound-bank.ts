export async function loadDefaultSoundBank(): Promise<ArrayBuffer> {
  const response = await fetch(
    new URL("../assets/GeneralUserGS.sf3", import.meta.url)
  )
  if (!response.ok) throw new Error("SoundFont download failed")
  return response.arrayBuffer()
}
