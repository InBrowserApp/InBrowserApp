export async function drawingFonts(lang: string) {
  const [{ dejavuSans }, { cjk, devanagari, thai }] = await Promise.all([
    import("@workspace/svg-pdf/fonts"),
    import("@workspace/libreoffice/fonts"),
  ])
  const fallbacks =
    lang === "th"
      ? [thai, cjk, devanagari]
      : lang === "hi"
        ? [devanagari, cjk, thai]
        : [cjk, devanagari, thai]
  return [dejavuSans, ...fallbacks]
}
