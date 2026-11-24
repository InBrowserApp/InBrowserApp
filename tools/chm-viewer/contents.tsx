import { useEffect, useState } from "react"
import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import { Button } from "@workspace/ui/components/ui/button"
import { ChevronRight } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import type { Destination, Topic } from "./topics"

type ListProps = {
  topics: Topic[]
  current: Destination
  onSelect: (destination: Destination) => void
}

export function Contents({ topics, ...props }: ListProps) {
  return (
    <ul className="space-y-0.5">
      {topics.map((topic, index) => (
        <TopicRow key={`${index}:${topic.title}`} topic={topic} {...props} />
      ))}
    </ul>
  )
}

function containsPath(topics: Topic[], path: string): boolean {
  return topics.some(
    (topic) =>
      topic.destination?.path === path || containsPath(topic.children, path)
  )
}

function TopicRow({
  topic,
  current,
  onSelect,
}: Omit<ListProps, "topics"> & { topic: Topic }) {
  const { title, destination, children } = topic
  const hasChildren = children.length > 0
  const activeBranch = containsPath(children, current.path)
  const [open, setOpen] = useState(activeBranch)
  useEffect(() => {
    if (activeBranch) setOpen(true)
  }, [activeBranch, current.path])

  const currentTopic =
    destination?.path === current.path &&
    destination.fragment === current.fragment
  const toggle = () => setOpen(!open)
  const disclosure = (
    <ChevronRight
      aria-hidden="true"
      className={cn("size-4 shrink-0", open ? "rotate-90" : "rtl:rotate-180")}
    />
  )
  return (
    <li>
      <div className="flex items-start">
        {hasChildren && destination && (
          <DocumentIconButton
            label={title}
            aria-expanded={open}
            className="shrink-0"
            onClick={toggle}
          >
            {disclosure}
          </DocumentIconButton>
        )}
        <Button
          type="button"
          variant={currentTopic ? "secondary" : "ghost"}
          aria-expanded={destination ? undefined : open}
          aria-current={currentTopic ? "page" : undefined}
          className={cn(
            "h-auto min-h-9 min-w-0 flex-1 justify-start px-2 py-2 text-start wrap-anywhere whitespace-normal max-sm:min-h-10",
            destination && !currentTopic && "font-normal"
          )}
          onClick={destination ? () => onSelect(destination) : toggle}
        >
          {!destination && disclosure}
          <bdi>{title}</bdi>
        </Button>
      </div>
      {open && hasChildren && (
        <div className="ms-3 border-s ps-2">
          <Contents topics={children} current={current} onSelect={onSelect} />
        </div>
      )}
    </li>
  )
}
