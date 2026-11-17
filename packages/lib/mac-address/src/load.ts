import type { Assignment, Database } from "./types"

type Snapshot = {
  schemaVersion: number
  updatedAt: string
  organizations: readonly (readonly [string, string])[]
  assignments: readonly (readonly [Assignment["registry"], string, number])[]
}

let databasePromise: Promise<Database> | undefined

/** Load the same-origin snapshot once; a failed request can be retried. */
export function loadDatabase(): Promise<Database> {
  databasePromise ??= fetch(new URL("../data/registry.json", import.meta.url))
    .then(async (response) => {
      if (!response.ok) throw new Error("MAC registry could not be loaded")
      const snapshot = (await response.json()) as Snapshot
      if (snapshot.schemaVersion !== 1) {
        throw new Error("Unsupported MAC registry snapshot")
      }
      const records = snapshot.assignments.map(
        ([registry, assignment, organizationIndex]): Assignment => {
          const [organization, address] =
            snapshot.organizations[organizationIndex]!
          return { registry, assignment, organization, address }
        }
      )
      return { records, updatedAt: snapshot.updatedAt }
    })
    .catch((error: unknown) => {
      databasePromise = undefined
      throw error
    })
  return databasePromise
}
