import { Button } from "@workspace/ui/components/ui/button"

type PlatformTab = Readonly<{
  label: string
  value: string
}>

type PlatformCardTabsProps = Readonly<{
  tabs: readonly PlatformTab[]
  value: string
  onValueChange: (value: string) => void
}>

function PlatformCardTabs({
  tabs,
  value,
  onValueChange,
}: PlatformCardTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Platform options"
      className="flex flex-wrap gap-2"
    >
      {tabs.map((tab) => {
        const active = tab.value === value

        return (
          <Button
            key={tab.value}
            type="button"
            size="sm"
            variant={active ? "secondary" : "outline"}
            aria-pressed={active}
            onClick={() => {
              onValueChange(tab.value)
            }}
          >
            {tab.label}
          </Button>
        )
      })}
    </div>
  )
}

export { PlatformCardTabs }
