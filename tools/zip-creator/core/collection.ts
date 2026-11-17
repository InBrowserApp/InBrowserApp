import type { InputItem, ZipItem } from "../types"

// ZIP paths must also be safe to extract on Windows, including control bytes.
// oxlint-disable-next-line no-control-regex
const unsafeCharacters = /[<>:"\\|?*\u0000-\u001f\u007f]/g
const reservedName = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i

function safeSegment(value: string) {
  const safe = value.replace(unsafeCharacters, "_").replace(/[. ]+$/, "") || "_"
  return reservedName.test(safe) ? `_${safe}` : safe
}

function uniquePath(path: string, file: boolean, occupied: Set<string>) {
  const dot = path.lastIndexOf(".")
  const hasExtension = file && dot > path.lastIndexOf("/") + 1
  const stem = hasExtension ? path.slice(0, dot) : path
  const extension = hasExtension ? path.slice(dot) : ""
  let candidate = path
  let suffix = 2
  while (occupied.has(candidate.toLowerCase())) {
    candidate = `${stem} (${suffix++})${extension}`
  }
  occupied.add(candidate.toLowerCase())
  return candidate
}

export function addItems(
  previous: readonly ZipItem[],
  incoming: readonly InputItem[],
  directory = ""
) {
  if (!hasDirectory(previous, directory)) throw new Error("Invalid destination")
  const items = [...previous]
  const occupied = new Set(previous.map((item) => item.path.toLowerCase()))
  const folders = new Map<string, string>()
  let adjusted = false

  function addFolder(segments: string[], root: number) {
    let parent = directory
    for (let i = 0; i < segments.length; i++) {
      const original = segments.slice(0, i + 1).join("/")
      const key = `${root}:${original}`
      let path = folders.get(key)
      if (!path) {
        const name = safeSegment(segments[i]!)
        path = uniquePath(parent ? `${parent}/${name}` : name, false, occupied)
        folders.set(key, path)
        items.push({ path, file: null })
        adjusted ||=
          path !== (directory ? `${directory}/${original}` : original)
      }
      parent = path
    }
    return parent
  }

  for (const item of incoming) {
    const segments = item.path.split("/")
    if (segments.some((part) => !part || part === "." || part === "..")) {
      throw new Error("Invalid relative path")
    }
    if (item.file === null) {
      addFolder(segments, item.root ?? 0)
      continue
    }
    const name = safeSegment(segments.pop()!)
    const parent = addFolder(segments, item.root ?? 0)
    const path = uniquePath(parent ? `${parent}/${name}` : name, true, occupied)
    items.push({ path, file: item.file })
    adjusted ||= path !== (directory ? `${directory}/${item.path}` : item.path)
  }
  return { items, adjusted }
}

export function hasDirectory(items: readonly ZipItem[], path: string) {
  return path === "" || items.some((item) => item.path === path && !item.file)
}

export function parentPath(path: string) {
  return path.slice(0, Math.max(0, path.lastIndexOf("/")))
}

export function itemName(path: string) {
  return path.slice(path.lastIndexOf("/") + 1)
}

export function validEntryName(name: string) {
  return name.length > 0 && !name.includes("/") && safeSegment(name) === name
}

export function indexItems(items: readonly ZipItem[]) {
  const directories = new Map<string, ZipItem[]>([["", []]])
  let files = 0
  let folders = 0
  let bytes = 0
  for (const item of items) {
    const parent = parentPath(item.path)
    const children = directories.get(parent) ?? []
    children.push(item)
    directories.set(parent, children)
    if (item.file) {
      files++
      bytes += item.file.size
    } else {
      folders++
    }
  }
  for (const children of directories.values()) {
    children.sort(
      (a, b) =>
        Number(Boolean(a.file)) - Number(Boolean(b.file)) ||
        a.path.localeCompare(b.path)
    )
  }
  return { directories, files, folders, bytes }
}

export function removeItems(items: readonly ZipItem[], path: string) {
  return items.filter(
    (item) => item.path !== path && !item.path.startsWith(`${path}/`)
  )
}

export function zipFilename(value: string) {
  const stem = value.trim().replace(/\.zip$/i, "")
  if (
    !stem ||
    stem.endsWith(".") ||
    safeSegment(stem) !== stem ||
    stem.includes("/")
  ) {
    return null
  }
  return `${stem}.zip`
}
