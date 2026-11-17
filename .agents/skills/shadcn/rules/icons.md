# Icons

Use the configured icon library through the project ownership boundary. In this
repository, tool imports use `@workspace/ui/icons`; `packages/ui` owns the library
re-exports. Match the installed components and their sizing behavior.

---

## Icons in Button use data-icon attribute

Add `data-icon="inline-start"` (prefix) or `data-icon="inline-end"` (suffix) to the icon when using the corresponding button styles. Component sizing is a
useful default; explicit sizing can serve a particular visual need.

**Example to evaluate:**

```tsx
<Button>
  <SearchIcon className="mr-2 size-4" />
  Search
</Button>
```

**Common alternative:**

```tsx
<Button>
  <SearchIcon data-icon="inline-start"/>
  Search
</Button>

<Button>
  Next
  <ArrowRightIcon data-icon="inline-end"/>
</Button>
```

---

## Let components size icons by default

Components usually size icons through CSS. Start with those defaults; use
explicit sizing when it improves alignment, readability, or a specialized
control, checking the resulting hit target and layout.

**Example to evaluate:**

```tsx
<Button>
  <SearchIcon className="size-4" data-icon="inline-start" />
  Search
</Button>

<DropdownMenuItem>
  <SettingsIcon className="mr-2 size-4" />
  Settings
</DropdownMenuItem>
```

**Common alternative:**

```tsx
<Button>
  <SearchIcon data-icon="inline-start" />
  Search
</Button>

<DropdownMenuItem>
  <SettingsIcon />
  Settings
</DropdownMenuItem>
```

---

## Choose icon representation for the boundary

A React component prop often works well as `icon={CheckIcon}`. Serializable
metadata benefits from string identifiers: this repo intentionally uses them
in tool manifests and resolves them with `ToolIcon`. Choose the representation
for the boundary, keeping registry metadata independent of React components.

**Example to evaluate:**

```tsx
const iconMap = {
  check: CheckIcon,
  alert: AlertIcon,
}

function StatusBadge({ icon }: { icon: string }) {
  const Icon = iconMap[icon]
  return <Icon />
}

;<StatusBadge icon="check" />
```

**Common alternative:**

```tsx
import { Check as CheckIcon } from "@workspace/ui/icons"

function StatusBadge({ icon: Icon }: { icon: React.ComponentType }) {
  return <Icon />
}

;<StatusBadge icon={CheckIcon} />
```
