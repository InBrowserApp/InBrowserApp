import type { LucideProps } from "lucide-react"

import {
  Binary,
  Braces,
  FileJson2,
  FileText,
  Globe,
  ImageIcon,
  Lock,
  Network,
  Wrench,
} from "@workspace/ui/icons"

const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  binary: Binary,
  braces: Braces,
  "file-json-2": FileJson2,
  "file-text": FileText,
  globe: Globe,
  image: ImageIcon,
  lock: Lock,
  network: Network,
}

type ToolIconProps = LucideProps & {
  icon: string
}

function ToolIcon({ icon, ...props }: ToolIconProps) {
  const Icon = iconMap[icon] ?? Wrench
  return <Icon {...props} />
}

export { ToolIcon }
