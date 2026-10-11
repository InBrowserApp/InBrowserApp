import gothic from "./fonts/NanumGothic-Regular.ttf?url"
import gothicBold from "./fonts/NanumGothic-Bold.ttf?url"
import myeongjo from "./fonts/NanumMyeongjo-Regular.ttf?url"
import myeongjoBold from "./fonts/NanumMyeongjo-Bold.ttf?url"

export async function loadFonts() {
  if (typeof FontFace === "undefined" || !("fonts" in globalThis))
    throw new Error("browserUnsupported")
  const sources = [
    [gothic, "Nanum Gothic", "400"],
    [gothicBold, "Nanum Gothic", "700"],
    [myeongjo, "Nanum Myeongjo", "400"],
    [myeongjoBold, "Nanum Myeongjo", "700"],
  ] as const
  return Promise.all(
    sources.map(async ([url, family, weight]) => {
      const response = await fetch(url)
      if (!response.ok) throw new Error("engineUnavailable")
      const bytes = await response.arrayBuffer()
      const face = await new FontFace(family, bytes, { weight }).load()
      // Dedicated workers expose a FontFaceSet independently of document.fonts.
      ;(
        globalThis as unknown as { fonts: { add: (face: FontFace) => void } }
      ).fonts.add(face)
      return new Uint8Array(bytes)
    })
  )
}
