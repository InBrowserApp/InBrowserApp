import { Button } from "@workspace/ui/components/ui/button"
import { Blocks, Building2, Network } from "@workspace/ui/icons"

type MacAddressNavigationKey = "lookup" | "blocks" | "vendors"

type MacAddressNavigationProps = Readonly<{
  active: MacAddressNavigationKey
  items: readonly Readonly<{
    key: MacAddressNavigationKey
    label: string
    href: string
  }>[]
}>

function MacAddressNavigation({ active, items }: MacAddressNavigationProps) {
  return (
    <nav aria-label={items.find((item) => item.key === active)?.label}>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item.key} className="max-w-full min-w-0">
            <Button
              asChild
              variant={item.key === active ? "secondary" : "outline"}
              className="h-auto min-h-10 max-w-full py-2 text-start whitespace-normal"
            >
              <a
                href={item.href}
                aria-current={item.key === active ? "page" : undefined}
              >
                {item.key === "lookup" ? (
                  <Network aria-hidden="true" data-icon="inline-start" />
                ) : item.key === "blocks" ? (
                  <Blocks aria-hidden="true" data-icon="inline-start" />
                ) : (
                  <Building2 aria-hidden="true" data-icon="inline-start" />
                )}
                {item.label}
              </a>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export { MacAddressNavigation }
