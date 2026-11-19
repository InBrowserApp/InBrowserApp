import { useMemo, useSyncExternalStore } from "react"

import { readSavedAccounts } from "./backups"
import type { Account } from "./accounts"

const key = "inbrowser:authenticator:accounts:v1"
const change = "authenticator:accounts-changed"

function subscribe(notify: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key === key || event.key === null) notify()
  }
  window.addEventListener("storage", onStorage)
  window.addEventListener(change, notify)
  return () => {
    window.removeEventListener("storage", onStorage)
    window.removeEventListener(change, notify)
  }
}

function snapshot() {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function useAccounts() {
  const saved = useSyncExternalStore(subscribe, snapshot, () => null)

  return useMemo(() => {
    try {
      return readSavedAccounts(saved)
    } catch {
      return []
    }
  }, [saved])
}

function updateAccounts(
  update: (accounts: readonly Account[]) => readonly Account[]
) {
  const accounts = readSavedAccounts(localStorage.getItem(key))
  const next = update(accounts)
  if (next === accounts) return false

  localStorage.setItem(key, JSON.stringify(next))
  window.dispatchEvent(new Event(change))
  return true
}

export { updateAccounts, useAccounts }
