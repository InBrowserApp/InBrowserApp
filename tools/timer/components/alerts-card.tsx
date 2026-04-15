import type { ReactNode } from "react"

import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import { CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import { Switch } from "@workspace/ui/components/ui/switch"

import type { TimerMessages } from "../types"

type AlertsCardProps = Readonly<{
  messages: TimerMessages
  soundEnabled: boolean
  vibrationEnabled: boolean
  notificationEnabled: boolean
  soundSupported: boolean
  vibrationSupported: boolean
  notificationSupported: boolean
  notificationHint: string
  showNotificationRequestButton: boolean
  onSoundChange: (checked: boolean) => void
  onVibrationChange: (checked: boolean) => void
  onNotificationChange: (checked: boolean) => void
  onRequestNotificationPermission: () => void
}>

type AlertRowProps = Readonly<{
  label: string
  checked: boolean
  disabled?: boolean
  testId: string
  onCheckedChange: (checked: boolean) => void
  action?: ReactNode
}>

function AlertRow({
  label,
  checked,
  disabled,
  testId,
  onCheckedChange,
  action,
}: AlertRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border/70 bg-muted/20 p-3">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <div className="flex items-center gap-3">
        {action}
        <Switch
          checked={checked}
          disabled={disabled}
          data-testid={testId}
          onCheckedChange={onCheckedChange}
        />
      </div>
    </div>
  )
}

function AlertsCard({
  messages,
  soundEnabled,
  vibrationEnabled,
  notificationEnabled,
  soundSupported,
  vibrationSupported,
  notificationSupported,
  notificationHint,
  showNotificationRequestButton,
  onSoundChange,
  onVibrationChange,
  onNotificationChange,
  onRequestNotificationPermission,
}: AlertsCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.alertsLabel}</CardTitle>
      </CardHeader>

      <ToolPanelCardContent className="gap-4">
        <AlertRow
          label={messages.soundLabel}
          checked={soundEnabled}
          disabled={!soundSupported}
          testId="sound-switch"
          onCheckedChange={onSoundChange}
        />
        <AlertRow
          label={messages.vibrationLabel}
          checked={vibrationEnabled}
          disabled={!vibrationSupported}
          testId="vibration-switch"
          onCheckedChange={onVibrationChange}
        />

        {notificationSupported ? (
          <AlertRow
            label={messages.notificationsLabel}
            checked={notificationEnabled}
            testId="notification-switch"
            onCheckedChange={onNotificationChange}
            action={
              showNotificationRequestButton ? (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  data-testid="notification-request"
                  onClick={onRequestNotificationPermission}
                >
                  {messages.notificationRequestLabel}
                </Button>
              ) : null
            }
          />
        ) : null}

        {notificationSupported && notificationHint ? (
          <Alert>
            <AlertDescription data-testid="notification-hint">
              {notificationHint}
            </AlertDescription>
          </Alert>
        ) : null}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { AlertsCard }
