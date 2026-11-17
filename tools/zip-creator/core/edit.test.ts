import { describe, expect, it } from "vitest"

import { addItems } from "./collection"
import { canMove, editItems } from "./edit"

import type { EditAction, ZipItem } from "../types"

const folder = (path: string): ZipItem => ({ path, file: null })
const file = (path: string): ZipItem => ({
  path,
  file: new File([new Uint8Array([0, 128, 255])], path, { lastModified: 123 }),
})
const collection = () => [
  folder("Work"),
  folder("Work/sub"),
  file("Work/sub/report.txt"),
  folder("Work/empty"),
  folder("Destination"),
  file("notes.txt"),
  file("Workbench.txt"),
]

describe("editing the ZIP directory tree", () => {
  it("creates root and nested empty folders without changing the original queue", () => {
    const first = editItems([], {
      kind: "new-folder",
      directory: "",
      name: "旅行",
    })
    expect(first).toEqual({
      items: [folder("旅行")],
      path: "旅行",
      error: null,
    })
    const next = editItems(first.items, {
      kind: "new-folder",
      directory: "旅行",
      name: "空目录",
    })
    expect(next.items).toEqual([folder("旅行"), folder("旅行/空目录")])
    expect(first.items).toEqual([folder("旅行")])
  })

  it("renames whole subtrees, retains empty directories and exact File objects", () => {
    const items = collection()
    const next = editItems(items, {
      kind: "rename",
      path: "Work",
      name: "work",
    })
    expect(next.error).toBeNull()
    expect(next.items.map((item) => item.path)).toEqual([
      "work",
      "work/sub",
      "work/sub/report.txt",
      "work/empty",
      "Destination",
      "notes.txt",
      "Workbench.txt",
    ])
    expect(next.items[2]!.file).toBe(items[2]!.file)
    expect(next.items[2]!.file!.lastModified).toBe(123)
    expect(next.items[6]).toBe(items[6])
    expect(items[0]!.path).toBe("Work")
  })

  it("moves a whole subtree and can move a nested file back to the root", () => {
    const items = collection()
    const moved = editItems(items, {
      kind: "move",
      path: "Work",
      directory: "Destination",
    })
    expect(moved.error).toBeNull()
    expect(moved.items.slice(0, 4).map((item) => item.path)).toEqual([
      "Destination/Work",
      "Destination/Work/sub",
      "Destination/Work/sub/report.txt",
      "Destination/Work/empty",
    ])
    const root = editItems(moved.items, {
      kind: "move",
      path: "Destination/Work/sub/report.txt",
      directory: "",
    })
    expect(root.error).toBeNull()
    expect(root.items[2]).toEqual({ path: "report.txt", file: items[2]!.file })
    expect(root.items[1]!.path).toBe("Destination/Work/sub")
  })

  it("renames a file and keeps no-op edits referentially unchanged", () => {
    const items = collection()
    expect(
      editItems(items, { kind: "rename", path: "notes.txt", name: "notes.txt" })
        .items
    ).toBe(items)
    expect(
      editItems(items, { kind: "move", path: "notes.txt", directory: "" }).items
    ).toBe(items)
    const renamed = editItems(items, {
      kind: "rename",
      path: "notes.txt",
      name: ".文档",
    })
    expect(renamed.path).toBe(".文档")
    expect(renamed.items[5]!.file).toBe(items[5]!.file)
  })

  it.each([
    "",
    ".",
    "..",
    "bad/name",
    "bad\\name",
    "a:",
    "a?",
    "a\u0000",
    "name.",
    "name ",
    "CON",
    "nul.txt",
  ])("rejects invalid user-entered names atomically: %j", (name) => {
    const items = collection()
    for (const action of [
      { kind: "new-folder", directory: "", name },
      { kind: "rename", path: "Work", name },
    ] satisfies EditAction[]) {
      const result = editItems(items, action)
      expect(result.error).toBe("entryNameError")
      expect(result.items).toBe(items)
    }
  })

  it.each([
    { kind: "new-folder", directory: "", name: "NOTES.TXT" },
    { kind: "rename", path: "Work", name: "destination" },
    { kind: "rename", path: "notes.txt", name: "Work" },
  ] satisfies EditAction[])(
    "rejects file/folder and case-insensitive name conflicts: %j",
    (action) => {
      const items = collection()
      expect(editItems(items, action)).toMatchObject({
        error: "nameExists",
        items,
      })
    }
  )

  it("does not overwrite a conflicting tree when moving", () => {
    const items = [
      ...collection(),
      folder("Destination/work"),
      file("Destination/work/keep.txt"),
    ]
    const result = editItems(items, {
      kind: "move",
      path: "Work",
      directory: "Destination",
    })
    expect(result.error).toBe("nameExists")
    expect(result.items).toBe(items)
  })

  it.each([
    { kind: "new-folder", directory: "missing", name: "New" },
    { kind: "move", path: "missing", directory: "" },
    { kind: "rename", path: "missing", name: "New" },
    { kind: "move", path: "Work", directory: "notes.txt" },
    { kind: "move", path: "Work", directory: "Work" },
    { kind: "move", path: "Work", directory: "Work/sub" },
  ] satisfies EditAction[])(
    "rejects missing, file, self and descendant destinations: %j",
    (action) => {
      const items = collection()
      expect(editItems(items, action).error).toBe("invalidDestination")
      expect(editItems(items, action).items).toBe(items)
    }
  )

  it("accepts sibling names with a common prefix as move destinations", () => {
    expect(canMove("Work", "Workbench")).toBe(true)
    expect(canMove("Work", "")).toBe(true)
    expect(canMove("Work", "Work")).toBe(false)
    expect(canMove("Work", "Work/sub")).toBe(false)
  })
})

describe("adding to the current directory", () => {
  it("reuses the selected destination and resolves collisions inside it", () => {
    const items = collection()
    const incoming = [file("sub/new.txt"), folder("empty")]
    const added = addItems(items, incoming, "Destination")
    expect(added.adjusted).toBe(false)
    expect(added.items.slice(items.length)).toEqual([
      folder("Destination/sub"),
      { path: "Destination/sub/new.txt", file: incoming[0]!.file },
      folder("Destination/empty"),
    ])
    const again = addItems(added.items, [file("sub/new.txt")], "Destination")
    expect(again.adjusted).toBe(true)
    expect(again.items.at(-1)!.path).toBe("Destination/sub (2)/new.txt")
    const direct = addItems(
      again.items,
      [file("new.txt"), file("new.txt")],
      "Destination"
    )
    expect(direct.items.at(-1)!.path).toBe("Destination/new (2).txt")
    expect(
      direct.items.filter((item) => item.path === "Destination")
    ).toHaveLength(1)
  })

  it.each(["missing", "notes.txt"])(
    "rejects invalid destinations: %s",
    (directory) => {
      expect(() =>
        addItems(collection(), [file("new.txt")], directory)
      ).toThrow("Invalid destination")
    }
  )
})
