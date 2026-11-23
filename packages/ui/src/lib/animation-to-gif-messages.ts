import { animationMakerMessages } from "./animation-maker-messages"
import en from "./animation-to-gif-messages/en.json"

type CatalogGlob = (
  pattern: string,
  options: { eager: true; import: "default" }
) => Record<string, typeof en>

const catalogs = (import.meta.glob as unknown as CatalogGlob)(
  "./animation-to-gif-messages/*.json",
  { eager: true, import: "default" }
)

export function animationToGifMessages(language: string) {
  const { createAnimation, creatingAnimation, preview, play, stop, download } =
    animationMakerMessages(language, "GIF")
  return {
    ...(catalogs[`./animation-to-gif-messages/${language}.json`] ?? en),
    createAnimation,
    creatingAnimation,
    preview,
    play,
    stop,
    download,
  }
}
