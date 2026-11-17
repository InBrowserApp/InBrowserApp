import {
  hasDirectory,
  itemName,
  parentPath,
  validEntryName,
} from "./collection"

import type { EditAction, EditError, ZipItem } from "../types"

export function canMove(path: string, directory: string) {
  return directory !== path && !directory.startsWith(`${path}/`)
}

export function editItems(
  items: readonly ZipItem[],
  action: EditAction
): { items: readonly ZipItem[]; path: string; error: EditError | null } {
  const source = action.kind === "new-folder" ? null : action.path
  const directory =
    action.kind === "rename" ? parentPath(action.path) : action.directory
  const name = action.kind === "move" ? itemName(action.path) : action.name
  const path = directory ? `${directory}/${name}` : name
  const fail = (error: EditError) => ({ items, path, error })

  if (
    !hasDirectory(items, directory) ||
    (source !== null &&
      (!items.some((item) => item.path === source) ||
        !canMove(source, directory)))
  ) {
    return fail("invalidDestination")
  }
  if (!validEntryName(name)) return fail("entryNameError")
  if (
    items.some(
      (item) =>
        item.path !== source && item.path.toLowerCase() === path.toLowerCase()
    )
  ) {
    return fail("nameExists")
  }
  if (source === path) return { items, path, error: null }
  const next =
    source === null
      ? [...items, { path, file: null }]
      : items.map((item) =>
          item.path === source || item.path.startsWith(`${source}/`)
            ? { ...item, path: path + item.path.slice(source.length) }
            : item
        )
  return { items: next, path, error: null }
}
