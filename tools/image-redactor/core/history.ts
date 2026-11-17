export type History<T> = Readonly<{
  past: readonly T[]
  present: T
  future: readonly T[]
}>
export type HistoryAction<T> =
  | { type: "commit"; value: T }
  | { type: "undo" | "redo" }
  | { type: "reset"; value: T }

export function historyReducer<T>(
  state: History<T>,
  action: HistoryAction<T>
): History<T> {
  switch (action.type) {
    case "reset":
      return { past: [], present: action.value, future: [] }
    case "commit":
      if (action.value === state.present) return state
      return {
        past: [...state.past, state.present],
        present: action.value,
        future: [],
      }
    case "undo": {
      if (state.past.length === 0) return state
      return {
        past: state.past.slice(0, -1),
        present: state.past.at(-1)!,
        future: [state.present, ...state.future],
      }
    }
    case "redo": {
      if (state.future.length === 0) return state
      return {
        past: [...state.past, state.present],
        present: state.future[0]!,
        future: state.future.slice(1),
      }
    }
  }
}
