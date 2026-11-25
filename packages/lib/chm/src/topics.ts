import type {
  ChmEntry,
  ChmManifest,
  ChmNavigationNode,
} from "@file-viewer/renderer-chm"

export type Destination = { path: string; fragment?: string }
export type Topic = {
  title: string
  destination?: Destination
  children: Topic[]
}

export function topicDirectory(
  manifest: Pick<ChmManifest, "homePath" | "contents" | "topics">,
  entries: ChmEntry[],
  resolve: (reference: string) => Destination | undefined
) {
  function mapContents(nodes: ChmNavigationNode[]): Topic[] {
    return nodes.flatMap(({ title, path, children }) => {
      const destination = path ? resolve(path) : undefined
      const nested = mapContents(children)
      const label = title || path
      if (!label || (!destination && !nested.length)) return nested
      return [{ title: label, destination, children: nested }]
    })
  }

  const titles = new Map<string, string>()
  for (const { path, title } of manifest.topics) {
    const destination = resolve(path)
    if (destination) titles.set(destination.path, title)
  }

  const topics = entries.flatMap(({ path }) => {
    const destination = resolve(path)
    return destination
      ? [
          {
            title:
              titles.get(destination.path) || path.split("/").at(-1) || path,
            destination,
            children: [],
          },
        ]
      : []
  })
  const tree = mapContents(manifest.contents)
  const contents = tree.length ? tree : topics
  return {
    contents,
    topics,
    home: resolve(manifest.homePath) ?? firstDestination(contents),
  }
}

function firstDestination(topics: Topic[]): Destination | undefined {
  for (const topic of topics) {
    const destination = topic.destination ?? firstDestination(topic.children)
    if (destination) return destination
  }
  return undefined
}
