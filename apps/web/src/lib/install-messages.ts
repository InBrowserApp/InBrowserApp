import type { InstallGuideId } from "./install-guides"
import type { SiteLanguage } from "./site"

type InstallMessages = Readonly<{
  title: string
  description: string
  guideTitle: string
  guideDescription: string
  switchBrowser: string
  browserHelp: string
  otherBrowsers: string
  desktop: string
  steps: Readonly<Record<InstallGuideId, readonly string[]>>
}>

const messages = import.meta.glob<InstallMessages>(
  "../install-messages/*.json",
  {
    eager: true,
    import: "default",
  }
)

export function loadInstallMessages(language: SiteLanguage) {
  return (
    messages[`../install-messages/${language}.json`] ??
    messages["../install-messages/en.json"]!
  )
}
