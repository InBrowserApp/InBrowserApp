# Styling & Customization

These examples show consistency and maintenance tradeoffs, not universal bans
on CSS utilities. Choose styling for the tool, content, and existing theme.

See [customization.md](../customization.md) for theming, CSS variables, and adding custom colors.

## Contents

- Semantic colors
- Built-in variants first
- Use className with component ownership in mind
- Choose spacing for the layout
- Prefer size-_ over w-_ h-\* when equal
- Prefer truncate shorthand
- Theme-aware color choices
- Use cn() for conditional classes
- Diagnose overlay stacking before adjusting it

---

## Semantic colors

**Example to evaluate:**

```tsx
<div className="bg-blue-500 text-white">
  <p className="text-gray-600">Secondary text</p>
</div>
```

**Common alternative:**

```tsx
<div className="bg-primary text-primary-foreground">
  <p className="text-muted-foreground">Secondary text</p>
</div>
```

---

## Color meaning and theme consistency

Shared status colors usually benefit from semantic tokens or variants. A chart,
color editor, or other domain-specific visualization may need explicit colors.
Check contrast, themes, and a cue beyond color for important status.

**Example to evaluate:**

```tsx
<span className="text-emerald-600">+20.1%</span>
<span className="text-green-500">Active</span>
<span className="text-red-600">-3.2%</span>
```

**Common alternative:**

```tsx
<Badge variant="secondary">+20.1%</Badge>
<Badge>Active</Badge>
<span className="text-destructive">-3.2%</span>
```

If a repeated semantic role needs a new token, add it through the shared theme
with appropriate light/dark values. A local domain color may stay local. This is
a routine design choice unless the intended product direction remains unclear
(see [customization.md](../customization.md)).

---

## Built-in variants first

**Example to evaluate:**

```tsx
<Button className="border border-input bg-transparent hover:bg-accent">
  Click me
</Button>
```

**Common alternative:**

```tsx
<Button variant="outline">Click me</Button>
```

---

## Use className with component ownership in mind

`className` is useful for layout and contextual customization. Shared variants
and tokens make recurring styles easier to maintain; a local color or typography
adjustment can be appropriate when the component API supports it. Check the
effect on themes, interaction states, and neighboring instances.

**Example to evaluate:**

```tsx
<Card className="bg-blue-100 text-blue-900 font-bold">
  <CardContent>Dashboard</CardContent>
</Card>
```

**Common alternative:**

```tsx
<Card className="max-w-md mx-auto">
  <CardContent>Dashboard</CardContent>
</Card>
```

Useful customization options include:

1. **Built-in variants** — `variant="outline"`, `variant="destructive"`, etc.
2. **Semantic color tokens** — `bg-primary`, `text-muted-foreground`.
3. **CSS variables** — define custom colors in the global CSS file (see [customization.md](../customization.md)).

---

## Choose spacing for the layout

`gap-*` works well for flex/grid layouts, especially wrapping content. Margin or
`space-*` utilities can fit normal flow. Choose the approach whose behavior
matches the layout rather than rewriting working spacing solely for style.

```tsx
<div className="flex flex-col gap-4">
  <Input />
  <Input />
  <Button>Submit</Button>
</div>
```

---

## Prefer size-_ over w-_ h-\* when equal

`size-10` is concise for equal dimensions. Separate width and height utilities
are useful when sizing changes independently.

---

## Prefer truncate shorthand

`truncate` is concise when all three truncation behaviors are wanted. Use the
individual utilities when wrapping or overflow behavior differs.

---

## Theme-aware color choices

Semantic tokens handle shared light/dark colors through CSS variables. Explicit
`dark:` styles can be useful for a specific surface or domain visualization;
verify contrast and consistency in both modes.

---

## Use cn() for conditional classes

`cn()` is useful for conditional classes and Tailwind conflict merging. A simple
expression can also be clear when no merging is needed.

**Example to evaluate:**

```tsx
<div className={`flex items-center ${isActive ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
```

**Common alternative:**

```tsx
import { cn } from "@/lib/utils"

<div className={cn("flex items-center", isActive ? "bg-primary text-primary-foreground" : "bg-muted")}>
```

---

## Diagnose overlay stacking before adjusting it

Existing overlays handle their normal stacking. For an actual conflict, inspect
portal placement and stacking contexts, then make a targeted adjustment and
verify focus, dismissal, and nested overlay behavior.
