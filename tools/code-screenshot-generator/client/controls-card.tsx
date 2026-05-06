import { BackgroundCard } from "./controls/background-card"
import { LayoutCard } from "./controls/layout-card"
import { SyntaxCard } from "./controls/syntax-card"
import { WindowCard } from "./controls/window-card"
import type { CodeShotSettings } from "./constants"
import type { CodeScreenshotGeneratorMessages } from "../types"

type ControlsCardProps = Readonly<{
  messages: CodeScreenshotGeneratorMessages
  onChange: (patch: Partial<CodeShotSettings>) => void
  settings: CodeShotSettings
}>

function ControlsCard({ messages, onChange, settings }: ControlsCardProps) {
  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-2 xl:grid-cols-1">
      <SyntaxCard messages={messages} onChange={onChange} settings={settings} />
      <BackgroundCard
        messages={messages}
        onChange={onChange}
        settings={settings}
      />
      <WindowCard messages={messages} onChange={onChange} settings={settings} />
      <LayoutCard messages={messages} onChange={onChange} settings={settings} />
    </div>
  )
}

export { ControlsCard }
