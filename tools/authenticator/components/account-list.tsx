import { useEffect, useMemo, useRef, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Pencil,
  RotateCw,
  ScanLine,
  Trash2,
} from "@workspace/ui/icons"

import { getCode } from "../accounts"
import type { Account } from "../accounts"
import type { Messages } from "../types"

type AccountAction = "edit" | "remove" | "setup"

type Props = {
  messages: Messages
  onAction: (
    action: AccountAction,
    account: Account,
    trigger: HTMLButtonElement
  ) => void
  onNext: (id: string) => void
}

function AccountRow({
  account,
  now,
  messages,
  onAction,
  onNext,
}: Props & { account: Account; now: number }) {
  const trigger = useRef<HTMLButtonElement>(null)
  const name = account.issuer || account.label || messages.unnamed
  const detail =
    account.issuer && account.label !== account.issuer ? account.label : ""
  const counter =
    account.type === "totp" ? Math.floor(now / account.period) : account.counter
  const code = useMemo(() => getCode(account, counter), [account, counter])
  const seconds =
    account.type === "totp" ? account.period - (now % account.period) : 0
  const time =
    account.type === "totp"
      ? messages.remaining.replace("{seconds}", String(seconds))
      : messages.counterValue.replace("{counter}", String(counter))

  return (
    <li
      className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2.5 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(8rem,1fr)_minmax(0,0.9fr)_2.25rem] sm:px-6"
      aria-label={detail ? `${name}, ${detail}` : name}
    >
      <div className="min-w-0">
        <p
          className="font-semibold [overflow-wrap:anywhere] text-foreground"
          dir="auto"
        >
          {name}
        </p>
        {detail && (
          <p
            className="text-sm [overflow-wrap:anywhere] text-muted-foreground"
            dir="auto"
          >
            {detail}
          </p>
        )}
      </div>
      <div className="col-span-2 row-start-2 flex flex-wrap items-center justify-between gap-3 sm:contents">
        <div className="flex min-w-0 flex-col gap-2 sm:col-start-2 sm:row-start-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <code
              dir="ltr"
              className="font-mono text-2xl font-semibold tracking-widest tabular-nums sm:text-[1.65rem]"
            >
              {code.length % 2 === 0
                ? `${code.slice(0, code.length / 2)} ${code.slice(code.length / 2)}`
                : code}
            </code>
            <span className="text-xs whitespace-nowrap text-muted-foreground tabular-nums">
              {time}
            </span>
          </div>
          {account.type === "totp" && (
            <span
              className="h-1 w-24 overflow-hidden rounded-full bg-muted"
              aria-hidden="true"
            >
              <span
                className="block h-full rounded-full bg-primary/65 motion-safe:transition-[width]"
                style={{ width: `${(100 * seconds) / account.period}%` }}
              />
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:col-start-3 sm:row-start-1 sm:justify-end">
          {account.type === "hotp" && (
            <Button
              type="button"
              variant="ghost"
              className="h-9"
              onClick={() => onNext(account.id)}
            >
              <RotateCw data-icon="inline-start" aria-hidden="true" />
              {messages.nextCode}
            </Button>
          )}
          <ToolCopyButton
            value={code}
            copyLabel={messages.copy}
            copiedLabel={messages.copied}
            failedLabel={messages.copyFailed}
            size="default"
            className="h-9"
          />
        </div>
      </div>
      <div className="col-start-2 row-start-1 justify-self-end sm:col-start-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              ref={trigger}
              type="button"
              variant="ghost"
              size="icon"
              className="size-9"
              aria-label={messages.accountMenu.replace(
                "{account}",
                detail || name
              )}
            >
              <MoreHorizontal aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={() => onAction("edit", account, trigger.current!)}
            >
              <Pencil aria-hidden="true" /> {messages.edit}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => onAction("setup", account, trigger.current!)}
            >
              <ScanLine aria-hidden="true" /> {messages.showSetup}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => onAction("remove", account, trigger.current!)}
            >
              <Trash2 aria-hidden="true" /> {messages.remove}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </li>
  )
}

function AccountList({
  accounts,
  ...props
}: Props & { accounts: readonly Account[] }) {
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000))
  const hasTotp = accounts.some((account) => account.type === "totp")

  useEffect(() => {
    if (!hasTotp) return
    let timer: number
    function tick() {
      window.clearTimeout(timer)
      const timestamp = Date.now()
      setNow(Math.floor(timestamp / 1000))
      timer = window.setTimeout(tick, 1000 - (timestamp % 1000))
    }
    tick()
    document.addEventListener("visibilitychange", tick)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener("visibilitychange", tick)
    }
  }, [hasTotp])

  return (
    <ul className="divide-y rounded-xl border border-border bg-card">
      {accounts.map((account) => (
        <AccountRow key={account.id} account={account} now={now} {...props} />
      ))}
    </ul>
  )
}

export { AccountList }
export type { AccountAction }
