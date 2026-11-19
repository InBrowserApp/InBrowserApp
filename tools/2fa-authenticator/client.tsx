import { useRef, useState } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog"
import { Download, Plus } from "@workspace/ui/icons"

import { mergeAccounts, setupLink } from "./accounts"
import { AccountForm } from "./components/account-form"
import { AccountList } from "./components/account-list"
import { AddAccount } from "./components/add-account"
import { ExportContent, QrPreview } from "./components/export-content"
import { updateAccounts, useAccounts } from "./use-accounts"
import type { Account, Setup } from "./accounts"
import type { AccountAction } from "./components/account-list"
import type { Messages } from "./types"

type Modal = { action: "export" } | { action: AccountAction; account: Account }

function Authenticator({ messages }: { messages: Messages }) {
  const accounts = useAccounts()
  const heading = useRef<HTMLHeadingElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const [add, setAdd] = useState(false)
  const [modal, setModal] = useState<Modal | null>(null)
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")
  const hasAccounts = accounts.length > 0
  const selected =
    modal && modal.action !== "export"
      ? accounts.find(({ id }) => id === modal.account.id)
      : undefined

  function onAdd(setups: Setup[], restoreCounters = false) {
    try {
      const updated = updateAccounts((current) =>
        mergeAccounts(current, setups, { restoreCounters })
      )
      if (!updated) return messages.duplicate
      setAdd(false)
      setStatus(messages.saved)
      window.requestAnimationFrame(() => heading.current?.focus())
    } catch {
      return messages.saveError
    }
    return undefined
  }

  function showModal(next: Modal, button: HTMLButtonElement) {
    trigger.current = button
    setError("")
    setModal(next)
  }

  function edit(setups: Setup[]) {
    if (modal?.action !== "edit") return undefined
    const initial = modal.account
    const setup = setups[0]!
    try {
      updateAccounts((current) =>
        current.map((account) => {
          if (account.id !== initial.id) return account
          // Preserve a counter advanced in another tab while this form was open.
          if (
            initial.type === "hotp" &&
            setup.type === "hotp" &&
            account.type === "hotp" &&
            setup.secret === initial.secret &&
            account.secret === initial.secret &&
            setup.counter === initial.counter
          ) {
            return { ...setup, id: account.id, counter: account.counter }
          }
          return { ...setup, id: account.id }
        })
      )
      setStatus(messages.saved)
      setModal(null)
    } catch {
      return messages.saveError
    }
    return undefined
  }

  function remove() {
    try {
      updateAccounts((current) =>
        current.filter((account) => account.id !== selected?.id)
      )
      setStatus(messages.saved)
      setModal(null)
    } catch {
      setError(messages.saveError)
    }
  }

  function nextCode(id: string) {
    setError("")
    try {
      const updated = updateAccounts((current) => {
        const account = current.find((item) => item.id === id)
        if (
          account?.type !== "hotp" ||
          account.counter === Number.MAX_SAFE_INTEGER
        )
          return current
        return current.map((item) =>
          item.id === id ? { ...account, counter: account.counter + 1 } : item
        )
      })
      if (!updated) setError(messages.counterLimit)
    } catch {
      setError(messages.saveError)
    }
  }

  return (
    <div>
      <section>
        {hasAccounts && (
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2
              ref={heading}
              tabIndex={-1}
              className="rounded-sm font-heading text-xl font-semibold focus:outline-none"
            >
              {messages.accounts}
            </h2>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-10"
                onClick={(event) =>
                  showModal({ action: "export" }, event.currentTarget)
                }
              >
                <Download data-icon="inline-start" aria-hidden="true" />
                {messages.export}
              </Button>
              <Button
                type="button"
                className="h-10"
                aria-expanded={add}
                onClick={() => setAdd(!add)}
              >
                {add ? (
                  messages.cancel
                ) : (
                  <>
                    <Plus data-icon="inline-start" aria-hidden="true" />
                    {messages.add}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
        {(!hasAccounts || add) && (
          <div className={hasAccounts ? "mb-4" : undefined}>
            <AddAccount messages={messages} onAdd={onAdd} />
          </div>
        )}
        {hasAccounts && (
          <AccountList
            accounts={accounts}
            messages={messages}
            onAction={(action, account, button) =>
              showModal({ action, account }, button)
            }
            onNext={nextCode}
          />
        )}
      </section>
      <p className="mt-3 text-sm text-muted-foreground">
        {messages.storageHint}
      </p>
      <p role="status" className="sr-only">
        {status}
      </p>
      {error && !modal && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      )}
      <Dialog
        open={modal !== null && (modal.action === "export" || !!selected)}
        onOpenChange={(open) => {
          if (!open) {
            setModal(null)
            setError("")
          }
        }}
      >
        <DialogContent
          closeLabel={messages.cancel}
          className="max-h-[calc(100dvh-2rem)] overflow-y-auto"
          onCloseAutoFocus={(event) => {
            event.preventDefault()
            if (trigger.current?.isConnected) trigger.current.focus()
            else heading.current?.focus()
          }}
        >
          {modal?.action === "export" && (
            <>
              <DialogHeader className="pe-6 text-start">
                <DialogTitle>{messages.export}</DialogTitle>
                <DialogDescription>{messages.backupHint}</DialogDescription>
              </DialogHeader>
              <ExportContent accounts={accounts} messages={messages} />
            </>
          )}
          {modal?.action === "edit" && selected && (
            <>
              <DialogHeader className="pe-6 text-start">
                <DialogTitle>{messages.edit}</DialogTitle>
                <DialogDescription className="sr-only">
                  {selected.label || selected.issuer || messages.unnamed}
                </DialogDescription>
              </DialogHeader>
              <AccountForm
                key={selected.id}
                messages={messages}
                setup={modal.account}
                onSave={edit}
              />
            </>
          )}
          {modal?.action === "setup" && selected && (
            <>
              <DialogHeader className="pe-6 text-start">
                <DialogTitle>{messages.showSetup}</DialogTitle>
                <DialogDescription>{messages.exportHint}</DialogDescription>
              </DialogHeader>
              <QrPreview
                link={setupLink(selected)}
                messages={messages}
                filename="authenticator-setup.png"
                description={messages.showSetup}
              />
            </>
          )}
          {modal?.action === "remove" && (
            <>
              <DialogHeader className="pe-6 text-start">
                <DialogTitle>{messages.remove}</DialogTitle>
                <DialogDescription>{messages.removeHint}</DialogDescription>
              </DialogHeader>
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    {messages.cancel}
                  </Button>
                </DialogClose>
                <Button type="button" variant="destructive" onClick={remove}>
                  {messages.remove}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Authenticator
