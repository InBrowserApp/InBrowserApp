import { z } from "zod"

import { readSetup } from "./accounts"
import type { Account, Setup } from "./accounts"

const backupSchema = z.object({
  format: z.literal("inbrowser-authenticator"),
  version: z.literal(1),
  accounts: z.array(z.unknown()).min(1),
})

function createBackup(accounts: readonly Setup[]) {
  return JSON.stringify(
    { format: "inbrowser-authenticator", version: 1, accounts },
    null,
    2
  )
}

function readBackup(text: string) {
  return backupSchema.parse(JSON.parse(text)).accounts.map(readSetup)
}

const accountIds = z.array(z.looseObject({ id: z.string().min(1) }))

function readSavedAccounts(raw: string | null): Account[] {
  if (raw === null) return []

  return accountIds.parse(JSON.parse(raw)).map((account) => ({
    ...readSetup(account),
    id: account.id,
  }))
}

export { createBackup, readBackup, readSavedAccounts }
