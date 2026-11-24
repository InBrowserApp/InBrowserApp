type Change = {
  offset: number
  original: number
  before: number
  after: number
}

export type History = {
  edits: ReadonlyMap<number, number>
  past: readonly Change[]
  future: readonly Change[]
}

export const emptyHistory: History = {
  edits: new Map(),
  past: [],
  future: [],
}

function updateEdits(
  current: History["edits"],
  { offset, original }: Change,
  value: number
) {
  const edits = new Map(current)
  if (value === original) edits.delete(offset)
  else edits.set(offset, value)
  return edits
}

export function overwrite(
  history: History,
  offset: number,
  original: number,
  after: number
): History {
  const before = history.edits.get(offset) ?? original
  if (before === after) return history

  const change = { offset, original, before, after }
  return {
    edits: updateEdits(history.edits, change, after),
    past: [...history.past, change],
    future: [],
  }
}

export function undo(history: History, change: Change): History {
  return {
    edits: updateEdits(history.edits, change, change.before),
    past: history.past.slice(0, -1),
    future: [...history.future, change],
  }
}

export function redo(history: History, change: Change): History {
  return {
    edits: updateEdits(history.edits, change, change.after),
    past: [...history.past, change],
    future: history.future.slice(0, -1),
  }
}
