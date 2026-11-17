import type { LucideProps } from "lucide-react"
import type { ComponentType } from "react"

import {
  Binary,
  BookOpen,
  Braces,
  Camera,
  Captions,
  CaseSensitive,
  Clock3,
  CreditCard,
  Cpu,
  FileArchive,
  FileJson2,
  FileText,
  Globe,
  ImageIcon,
  LayoutGrid,
  Lock,
  Mic,
  Mail,
  Network,
  Ruler,
  Sparkles,
  Wrench,
} from "@workspace/ui/icons"

const iconMap: Record<string, ComponentType<LucideProps>> = {
  archive: FileArchive,
  binary: Binary,
  "book-open": BookOpen,
  braces: Braces,
  camera: Camera,
  captions: Captions,
  "case-sensitive": CaseSensitive,
  clock3: Clock3,
  "credit-card": CreditCard,
  cpu: Cpu,
  "file-json-2": FileJson2,
  "file-text": FileText,
  globe: Globe,
  image: ImageIcon,
  "layout-grid": LayoutGrid,
  lock: Lock,
  mic: Mic,
  mail: Mail,
  network: Network,
  ruler: Ruler,
  sparkles: Sparkles,
  wrench: Wrench,
}

type ToolIconProps = LucideProps & {
  icon: string
}

function ToolIcon({ icon, ...props }: ToolIconProps) {
  const Icon = iconMap[icon] ?? Wrench
  return <Icon {...props} />
}

export { ToolIcon }
