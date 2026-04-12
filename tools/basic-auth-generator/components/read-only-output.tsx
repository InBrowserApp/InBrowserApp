import type { ReactNode } from "react"

import { cn } from "@workspace/ui/lib/utils"

type ReadOnlyOutputVariant = "plain" | "auth-header" | "curl-command"

type ReadOnlyOutputProps = Readonly<{
  ariaLabel: string
  className?: string
  value: string
  variant?: ReadOnlyOutputVariant
}>

function OutputToken({
  children,
  className,
  token,
}: Readonly<{
  children: ReactNode
  className?: string
  token: string
}>) {
  return (
    <span data-token={token} className={className}>
      {children}
    </span>
  )
}

function renderAuthHeader(value: string) {
  if (value === "") {
    return ""
  }

  const [scheme, token] = value.split(" ", 2)

  if (!scheme || !token) {
    return value
  }

  return (
    <>
      <OutputToken
        token="scheme"
        className="font-semibold text-foreground [text-shadow:0_0_0_currentColor]"
      >
        {scheme}
      </OutputToken>{" "}
      <OutputToken token="credential" className="text-primary">
        {token}
      </OutputToken>
    </>
  )
}

function renderCurlCommand(value: string) {
  if (value === "") {
    return ""
  }

  const match = value.match(/^curl -H "Authorization: (.+)" (.+)$/)

  if (!match) {
    return value
  }

  const headerValue = match[1] ?? ""
  const url = match[2] ?? ""

  return (
    <>
      <OutputToken
        token="command"
        className="font-semibold text-foreground [text-shadow:0_0_0_currentColor]"
      >
        curl
      </OutputToken>{" "}
      <OutputToken token="flag" className="font-medium text-primary">
        -H
      </OutputToken>{" "}
      <OutputToken token="quote" className="text-muted-foreground">
        "
      </OutputToken>
      <OutputToken token="header-name" className="text-muted-foreground">
        Authorization:
      </OutputToken>{" "}
      {renderAuthHeader(headerValue)}
      <OutputToken token="quote" className="text-muted-foreground">
        "
      </OutputToken>{" "}
      <OutputToken token="url" className="font-medium text-primary">
        {url}
      </OutputToken>
    </>
  )
}

function ReadOnlyOutput({
  ariaLabel,
  className,
  value,
  variant = "plain",
}: ReadOnlyOutputProps) {
  const content =
    variant === "auth-header"
      ? renderAuthHeader(value)
      : variant === "curl-command"
        ? renderCurlCommand(value)
        : value

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      className={cn(
        "w-full rounded-lg border border-input bg-transparent px-3 py-2.5",
        className
      )}
    >
      <pre className="overflow-x-auto font-mono text-sm leading-6 break-all whitespace-pre-wrap text-foreground">
        <code>{content}</code>
      </pre>
    </div>
  )
}

export { ReadOnlyOutput }
