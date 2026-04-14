import { DesktopPlatformCard } from "./desktop-platform-card"
import { IOSPlatformCard } from "./ios-platform-card"
import { PWAPlatformCard } from "./pwa-platform-card"

import type {
  DesktopIconConfig,
  IOSIconConfig,
  PWAIconConfig,
  SiteConfig,
} from "../core/favicon-assets"

type IconSettingsCardProps = Readonly<{
  desktop: DesktopIconConfig
  ios: IOSIconConfig
  pwa: PWAIconConfig
  site: SiteConfig
  sourceFile: File | null
  onDesktopChange: (patch: Partial<DesktopIconConfig>) => void
  onIOSChange: (patch: Partial<IOSIconConfig>) => void
  onPWAChange: (patch: Partial<PWAIconConfig>) => void
}>

function IconSettingsCard({
  desktop,
  ios,
  pwa,
  site,
  sourceFile,
  onDesktopChange,
  onIOSChange,
  onPWAChange,
}: IconSettingsCardProps) {
  return (
    <div className="grid gap-6">
      <DesktopPlatformCard
        sourceFile={sourceFile}
        site={site}
        desktop={desktop}
        onDesktopChange={onDesktopChange}
      />
      <IOSPlatformCard
        sourceFile={sourceFile}
        site={site}
        ios={ios}
        onIOSChange={onIOSChange}
      />
      <PWAPlatformCard
        sourceFile={sourceFile}
        site={site}
        pwa={pwa}
        onPWAChange={onPWAChange}
      />
    </div>
  )
}

export { IconSettingsCard }
