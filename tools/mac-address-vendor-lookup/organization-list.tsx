import type English from "./messages/en.json"

function OrganizationList({
  organizations,
  addresses,
  makeHref,
  language,
  messages,
}: Readonly<{
  organizations: readonly Readonly<{ name: string; count: number }>[]
  addresses: ReadonlyMap<string, string>
  makeHref: (organization: string) => string
  language: string
  messages: typeof English
}>) {
  const formatNumber = new Intl.NumberFormat(language).format
  return (
    <ul className="px-2">
      {organizations.map((organization) => (
        <li key={organization.name}>
          <a
            href={makeHref(organization.name)}
            className="flex min-w-0 flex-col gap-2 rounded-lg p-4 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <span className="flex flex-wrap items-start justify-between gap-2">
              <bdi translate="no" className="min-w-0 font-medium wrap-anywhere">
                {organization.name}
              </bdi>
              <span className="text-sm text-muted-foreground tabular-nums">
                <span aria-hidden="true">
                  {formatNumber(organization.count)}
                </span>
                <span className="sr-only">
                  {messages.assignmentCount.replace(
                    "{count}",
                    formatNumber(organization.count)
                  )}
                </span>
              </span>
            </span>
            <bdi
              translate="no"
              className="text-sm wrap-anywhere text-muted-foreground"
            >
              {addresses.get(organization.name)}
            </bdi>
          </a>
        </li>
      ))}
    </ul>
  )
}

export default OrganizationList
