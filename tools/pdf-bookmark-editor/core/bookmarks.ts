export type Bookmark = {
  id: number
  depth: number
  title: string
  page: number | null
}

export type Move = "up" | "down" | "indent" | "outdent"

function subtreeEnd(items: Bookmark[], start: number) {
  const { depth } = items[start]!
  let end = start + 1
  while (end < items.length && items[end]!.depth > depth) end++
  return end
}

function previousSibling(items: Bookmark[], index: number) {
  const { depth } = items[index]!
  let previous = index - 1
  while (previous >= 0 && items[previous]!.depth > depth) previous--
  return items[previous]?.depth === depth ? previous : -1
}

export function availableMoves(items: Bookmark[], index: number) {
  const previous = previousSibling(items, index)
  const next = subtreeEnd(items, index)
  const { depth } = items[index]!
  return {
    up: previous >= 0,
    down: items[next]?.depth === depth,
    indent: previous >= 0,
    outdent: depth > 0,
  }
}

export function insertBookmark(
  items: Bookmark[],
  index: number,
  item: Bookmark
) {
  const end = index < 0 ? items.length : subtreeEnd(items, index)
  return [...items.slice(0, end), item, ...items.slice(end)]
}

export function deleteBookmark(items: Bookmark[], index: number) {
  const end = subtreeEnd(items, index)
  return [
    ...items.slice(0, index),
    ...items
      .slice(index + 1, end)
      .map((item) => ({ ...item, depth: item.depth - 1 })),
    ...items.slice(end),
  ]
}

export function moveBookmark(items: Bookmark[], index: number, move: Move) {
  const { depth } = items[index]!
  const end = subtreeEnd(items, index)
  const branch = items.slice(index, end)
  const remaining = [...items.slice(0, index), ...items.slice(end)]

  switch (move) {
    case "up": {
      const target = previousSibling(items, index)
      remaining.splice(target, 0, ...branch)
      break
    }
    case "down": {
      const target = subtreeEnd(items, end) - branch.length
      remaining.splice(target, 0, ...branch)
      break
    }
    case "indent":
      remaining.splice(
        index,
        0,
        ...branch.map((item) => ({ ...item, depth: item.depth + 1 }))
      )
      break
    case "outdent": {
      // Place the promoted branch after its old parent's remaining children.
      let target = index
      while (target < remaining.length && remaining[target]!.depth >= depth)
        target++
      remaining.splice(
        target,
        0,
        ...branch.map((item) => ({ ...item, depth: item.depth - 1 }))
      )
      break
    }
  }

  return remaining
}
