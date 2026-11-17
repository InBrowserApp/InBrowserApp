import type { LucideProps } from "lucide-react"
import type { ComponentType } from "react"

import {
  Binary,
  BookOpen,
  Braces,
  Camera,
  Car,
  CaseSensitive,
  Clock3,
  CreditCard,
  Cpu,
  EyeOff,
  FileArchive,
  FileCog,
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
  Search,
  Sparkles,
  Table2,
  Text,
  Video,
  Wrench,
} from "@workspace/ui/icons"

const iconMap: Record<string, ComponentType<LucideProps>> = {
  archive: FileArchive,
  binary: Binary,
  "book-open": BookOpen,
  braces: Braces,
  camera: Camera,
  car: Car,
  "case-sensitive": CaseSensitive,
  clock3: Clock3,
  "credit-card": CreditCard,
  cpu: Cpu,
  "eye-off": EyeOff,
  "file-cog": FileCog,
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
  search: Search,
  sparkles: Sparkles,
  "table-2": Table2,
  text: Text,
  video: Video,
  wrench: Wrench,
}

type ToolIconProps = LucideProps & {
  icon: string
}

function ToolIcon({ icon, ...props }: ToolIconProps) {
  const Icon = iconMap[icon] ?? Wrench
  return <Icon {...props} />
}

export { ToolIcon, iconMap as toolIconMap }
