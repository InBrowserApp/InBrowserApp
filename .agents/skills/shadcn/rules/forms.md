# Forms & Inputs

Choose controls for the user task and the installed component API. The examples
illustrate common patterns; a simpler accessible composition may fit better.
Adapt upstream import examples to `@workspace/ui` in this repository.

## Contents

- Consider FieldGroup + Field for structured forms
- InputGroup requires InputGroupInput/InputGroupTextarea
- Buttons inside inputs use InputGroup + InputGroupAddon
- Choose option controls by their semantics
- FieldSet + FieldLegend for grouping related fields
- Field validation and disabled states

---

## Consider FieldGroup + Field for structured forms

`FieldGroup` + `Field` are useful when labels, hints, and validation need consistent
layout. A simple labeled input or specialized editor may need less structure:

```tsx
<FieldGroup>
  <Field>
    <FieldLabel htmlFor="email">Email</FieldLabel>
    <Input id="email" type="email" />
  </Field>
  <Field>
    <FieldLabel htmlFor="password">Password</FieldLabel>
    <Input id="password" type="password" />
  </Field>
</FieldGroup>
```

Consider `Field orientation="horizontal"` where labels and controls fit side by side. Use `FieldLabel className="sr-only"` for visually hidden labels.

**Choosing form controls:**

- Simple text input → `Input`
- Dropdown with predefined options → `Select`
- Searchable dropdown → `Combobox`
- Native HTML select (no JS) → `native-select`
- Boolean toggle → `Switch` (for settings) or `Checkbox` (for forms)
- Single choice from few options → `RadioGroup`
- Compact toggle selection → consider `ToggleGroup` + `ToggleGroupItem`
- OTP/verification code → `InputOTP`
- Multi-line text → `Textarea`

---

## InputGroup requires InputGroupInput/InputGroupTextarea

The provided group inputs supply the slots and styles used by the group for
focus, borders, and spacing. Use them as the default; a custom control needs
to preserve the relevant behavior of the installed implementation.

**Example to evaluate:**

```tsx
<InputGroup>
  <Input placeholder="Search..." />
</InputGroup>
```

**Common alternative:**

```tsx
import { InputGroup, InputGroupInput } from "@/components/ui/input-group"

;<InputGroup>
  <InputGroupInput placeholder="Search..." />
</InputGroup>
```

---

## Buttons inside inputs use InputGroup + InputGroupAddon

An `InputGroup` keeps inline actions aligned with input spacing and focus states.
Separate adjacent buttons or custom positioning can also work; check label
length, keyboard operation, and overlap at narrow widths.

**Example to evaluate:**

```tsx
<div className="relative">
  <Input placeholder="Search..." className="pr-10" />
  <Button className="absolute right-0 top-0" size="icon">
    <SearchIcon />
  </Button>
</div>
```

**Common alternative:**

```tsx
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group"

;<InputGroup>
  <InputGroupInput placeholder="Search..." />
  <InputGroupAddon>
    <Button size="icon">
      <SearchIcon data-icon="inline-start" />
    </Button>
  </InputGroupAddon>
</InputGroup>
```

---

## Choose option controls by their semantics

A `ToggleGroup` provides selection semantics and keyboard behavior for compact
options. Radios, a select, tabs, or independent buttons may be more suitable
depending on whether the user chooses a value, switches views, or takes actions.
If implementing selection with buttons, account for pressed state and keyboard
behavior rather than relying only on color.

**Example to evaluate:**

```tsx
const [selected, setSelected] = useState("daily")

<div className="flex gap-2">
  {["daily", "weekly", "monthly"].map((option) => (
    <Button
      key={option}
      variant={selected === option ? "default" : "outline"}
      onClick={() => setSelected(option)}
    >
      {option}
    </Button>
  ))}
</div>
```

**Common alternative:**

```tsx
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

;<ToggleGroup spacing={2}>
  <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
  <ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
  <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
</ToggleGroup>
```

Combine with `Field` for labelled toggle groups:

```tsx
<Field orientation="horizontal">
  <FieldTitle id="theme-label">Theme</FieldTitle>
  <ToggleGroup aria-labelledby="theme-label" spacing={2}>
    <ToggleGroupItem value="light">Light</ToggleGroupItem>
    <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
    <ToggleGroupItem value="system">System</ToggleGroupItem>
  </ToggleGroup>
</Field>
```

> **Note:** `defaultValue` and `type`/`multiple` props differ between base and radix. See [base-vs-radix.md](./base-vs-radix.md#togglegroup).

---

## FieldSet + FieldLegend for grouping related fields

`FieldSet` + `FieldLegend` provide semantic grouping for related controls. Native
`fieldset`/`legend` or another correctly named group can also fit:

```tsx
<FieldSet>
  <FieldLegend variant="label">Preferences</FieldLegend>
  <FieldDescription>Select all that apply.</FieldDescription>
  <FieldGroup className="gap-3">
    <Field orientation="horizontal">
      <Checkbox id="dark" />
      <FieldLabel htmlFor="dark" className="font-normal">
        Dark mode
      </FieldLabel>
    </Field>
  </FieldGroup>
</FieldSet>
```

---

## Field validation and disabled states

With this field component, `data-invalid`/`data-disabled` controls presentation.
`aria-invalid` communicates validity and native `disabled` affects interaction.
Apply the states that reflect actual behavior, and associate useful error text
with the control. Other compositions may use different styling hooks.

```tsx
// Invalid.
<Field data-invalid>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input id="email" aria-invalid />
  <FieldDescription>Invalid email address.</FieldDescription>
</Field>

// Disabled.
<Field data-disabled>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input id="email" disabled />
</Field>
```

Works for all controls: `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroupItem`, `Switch`, `Slider`, `NativeSelect`, `InputOTP`.
