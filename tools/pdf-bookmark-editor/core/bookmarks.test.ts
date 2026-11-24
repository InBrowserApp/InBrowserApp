import { expect, test } from "vitest"
import {
  availableMoves,
  deleteBookmark,
  insertBookmark,
  moveBookmark,
  type Bookmark,
} from "./bookmarks"

const branch = [0, 1, 2, 1, 0, 1, 0].map((depth, id): Bookmark => ({
  id,
  depth,
  title: String(id),
  page: id + 1,
}))

function order(bookmarks: Bookmark[]) {
  return bookmarks.map(({ id, depth }) => [id, depth])
}

test("moves entire sibling branches and never crosses a parent boundary", () => {
  expect(availableMoves(branch, 0)).toEqual({
    up: false,
    down: true,
    indent: false,
    outdent: false,
  })
  expect(availableMoves(branch, 1)).toEqual({
    up: false,
    down: true,
    indent: false,
    outdent: true,
  })
  expect(availableMoves(branch, 3)).toEqual({
    up: true,
    down: false,
    indent: true,
    outdent: true,
  })
  expect(availableMoves(branch, 6).down).toBe(false)
  expect(order(moveBookmark(branch, 4, "up"))).toEqual([
    [4, 0],
    [5, 1],
    [0, 0],
    [1, 1],
    [2, 2],
    [3, 1],
    [6, 0],
  ])
  expect(order(moveBookmark(branch, 1, "down"))).toEqual([
    [0, 0],
    [3, 1],
    [1, 1],
    [2, 2],
    [4, 0],
    [5, 1],
    [6, 0],
  ])
})

test("nests and promotes descendants together", () => {
  expect(order(moveBookmark(branch, 4, "indent"))).toEqual([
    [0, 0],
    [1, 1],
    [2, 2],
    [3, 1],
    [4, 1],
    [5, 2],
    [6, 0],
  ])
  expect(order(moveBookmark(branch, 1, "outdent"))).toEqual([
    [0, 0],
    [3, 1],
    [1, 0],
    [2, 1],
    [4, 0],
    [5, 1],
    [6, 0],
  ])
})

test("adds beside the selected branch and keeps sub-bookmarks when deleting", () => {
  const added = { id: 7, depth: 1, title: "New", page: 1 }
  expect(insertBookmark([], -1, { ...added, depth: 0 })).toHaveLength(1)
  expect(order(insertBookmark(branch, 1, added))).toEqual([
    [0, 0],
    [1, 1],
    [2, 2],
    [7, 1],
    [3, 1],
    [4, 0],
    [5, 1],
    [6, 0],
  ])
  expect(order(deleteBookmark(branch, 0))).toEqual([
    [1, 0],
    [2, 1],
    [3, 0],
    [4, 0],
    [5, 1],
    [6, 0],
  ])
  expect(deleteBookmark([added], 0)).toEqual([])
})
