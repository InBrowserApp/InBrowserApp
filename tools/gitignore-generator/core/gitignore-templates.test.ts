import { afterEach, describe, expect, test, vi } from "vitest"

import {
  buildGitignoreContent,
  createTemplateCatalog,
  filterTemplates,
  getPopularTemplateNames,
  getTemplateNameFromPath,
  groupTemplatesByCategory,
  normalizeSelectedTemplateNames,
} from "./gitignore-templates"

const templates = [
  {
    name: "Python",
    path: "./node_modules/gitignore/Python.gitignore",
    category: "language",
    content: "__pycache__/\n.venv/",
  },
  {
    name: "Node",
    path: "./node_modules/gitignore/Node.gitignore",
    category: "language",
    content: "node_modules/\ndist/",
  },
  {
    name: "Windows",
    path: "./node_modules/gitignore/Global/Windows.gitignore",
    category: "global",
    content: "Thumbs.db",
  },
  {
    name: "Laravel",
    path: "./node_modules/gitignore/community/PHP/Laravel.gitignore",
    category: "community",
    content: "bootstrap/cache/",
  },
] as const

afterEach(() => {
  vi.restoreAllMocks()
})

describe("getTemplateNameFromPath", () => {
  test("extracts the template name from the file path", () => {
    expect(
      getTemplateNameFromPath("./node_modules/gitignore/Node.gitignore")
    ).toBe("Node")
  })

  test("returns an empty string when the path has no filename", () => {
    expect(getTemplateNameFromPath("")).toBe("")
  })

  test("falls back to an empty string when the split result has no last item", () => {
    vi.spyOn(Array.prototype, "pop").mockReturnValueOnce(undefined)

    expect(getTemplateNameFromPath("Node.gitignore")).toBe("")
  })
})

describe("createTemplateCatalog", () => {
  test("deduplicates by template name and sorts the result", () => {
    expect(
      createTemplateCatalog([
        templates[3],
        templates[2],
        templates[1],
        templates[0],
        {
          ...templates[0],
          category: "community",
          path: "./node_modules/gitignore/community/Python.gitignore",
        },
      ])
    ).toEqual([templates[3], templates[1], templates[0], templates[2]])
  })
})

describe("groupTemplatesByCategory", () => {
  test("groups templates into the three supported categories", () => {
    expect(groupTemplatesByCategory(templates)).toEqual({
      language: [templates[0], templates[1]],
      global: [templates[2]],
      community: [templates[3]],
    })
  })
})

describe("filterTemplates", () => {
  test("returns every template when the query is blank", () => {
    expect(filterTemplates(templates, "   ")).toEqual(templates)
  })

  test("filters templates by name case-insensitively", () => {
    expect(filterTemplates(templates, "py")).toEqual([templates[0]])
  })
})

describe("getPopularTemplateNames", () => {
  test("keeps only popular templates that exist in the catalog", () => {
    expect(
      getPopularTemplateNames(templates, ["Node", "Rust", "Windows"])
    ).toEqual(["Node", "Windows"])
  })
})

describe("normalizeSelectedTemplateNames", () => {
  test("removes stale values and duplicate selections", () => {
    expect(
      normalizeSelectedTemplateNames(
        ["Node", "Node", "Rust", "Windows"],
        templates
      )
    ).toEqual(["Node", "Windows"])
  })
})

describe("buildGitignoreContent", () => {
  test("returns an empty string when no templates are selected", () => {
    expect(buildGitignoreContent(templates, [])).toBe("")
  })

  test("combines selected templates in catalog order", () => {
    expect(buildGitignoreContent(templates, ["Windows", "Node"])).toBe(
      "### Node ###\nnode_modules/\ndist/\n\n### Windows ###\nThumbs.db"
    )
  })
})
