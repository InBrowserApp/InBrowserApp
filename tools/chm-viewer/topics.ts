import type { Topic } from "@workspace/chm"
export type { Destination, Topic } from "@workspace/chm"

export function filterTopics(
  contents: Topic[],
  topics: Topic[],
  query: string,
  lang: string
) {
  const needle = query.trim().toLocaleLowerCase(lang)
  if (!needle) return contents

  const matches = new Map<string, Topic>()
  function collect(nodes: Topic[]) {
    for (const { title, destination, children } of nodes) {
      if (destination && title.toLocaleLowerCase(lang).includes(needle)) {
        const key = JSON.stringify([destination.path, destination.fragment])
        if (!matches.has(key))
          matches.set(key, { title, destination, children: [] })
      }
      collect(children)
    }
  }
  collect(contents)
  if (contents !== topics) collect(topics)
  return Array.from(matches.values())
}
