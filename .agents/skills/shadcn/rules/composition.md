# Component Composition

Choose the parts that serve the interface. Examples assume particular component
APIs; inspect the installed source for required context and accepted props.
Adapt upstream imports through `@workspace/ui` in tool code.

## Contents

- Group related items when useful or required by their labels
- Consider Alert for a callout
- Choose an empty state proportional to the task
- Choose feedback near the action
- Choosing between overlay components
- Give overlays accessible names
- Card structure
- Button has no isPending or isLoading prop
- TabsTrigger must be inside TabsList
- Plan for an unavailable avatar image
- Use Separator instead of raw hr or border divs
- Use Skeleton for loading placeholders
- Use Badge instead of custom styled spans

---

## Group related items when useful or required by their labels

Groups are useful for section labels and related options. Some primitives
require group context for their label component, while ungrouped items may be
valid. Check the actual primitive instead of wrapping every list automatically.

**Example to evaluate:**

```tsx
<SelectContent>
  <SelectItem value="apple">Apple</SelectItem>
  <SelectItem value="banana">Banana</SelectItem>
</SelectContent>
```

**Common alternative:**

```tsx
<SelectContent>
  <SelectGroup>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
  </SelectGroup>
</SelectContent>
```

Common grouping relationships to consider:

| Item                                                       | Group               |
| ---------------------------------------------------------- | ------------------- |
| `SelectItem`, `SelectLabel`                                | `SelectGroup`       |
| `DropdownMenuItem`, `DropdownMenuLabel`, `DropdownMenuSub` | `DropdownMenuGroup` |
| `MenubarItem`                                              | `MenubarGroup`      |
| `ContextMenuItem`                                          | `ContextMenuGroup`  |
| `CommandItem`                                              | `CommandGroup`      |

---

## Consider Alert for a callout

```tsx
<Alert>
  <AlertTitle>Warning</AlertTitle>
  <AlertDescription>Something needs attention.</AlertDescription>
</Alert>
```

---

## Choose an empty state proportional to the task

```tsx
<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon">
      <FolderIcon />
    </EmptyMedia>
    <EmptyTitle>No projects yet</EmptyTitle>
    <EmptyDescription>Get started by creating a new project.</EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button>Create Project</Button>
  </EmptyContent>
</Empty>
```

---

## Choose feedback near the action

Inline feedback or a status region is often sufficient. If toasts serve the
interaction, use an existing shared UI facility or integrate one there. The
following is an upstream API example, not a tool-level import recommendation:

```tsx
import { toast } from "sonner"

toast.success("Changes saved.")
toast.error("Something went wrong.")
toast("File deleted.", {
  action: { label: "Undo", onClick: () => undoDelete() },
})
```

---

## Choosing between overlay components

| Use case                           | Component     |
| ---------------------------------- | ------------- |
| Focused task that requires input   | `Dialog`      |
| Destructive action confirmation    | `AlertDialog` |
| Side panel with details or filters | `Sheet`       |
| Mobile-first bottom panel          | `Drawer`      |
| Quick info on hover                | `HoverCard`   |
| Small contextual content on click  | `Popover`     |

---

## Give overlays accessible names

Dialogs need an accessible name. `DialogTitle`, `SheetTitle`, and `DrawerTitle`
are the usual way to supply one with these components; a visually hidden title
can use `className="sr-only"`. If using another naming mechanism, verify it
against the installed primitive's accessibility and labeling behavior.

```tsx
<DialogContent>
  <DialogHeader>
    <DialogTitle>Edit Profile</DialogTitle>
    <DialogDescription>Update your profile.</DialogDescription>
  </DialogHeader>
  ...
</DialogContent>
```

---

## Card structure

Use the card parts that have actual content. A header, description, and footer
are useful when the task calls for them; a content-only card or no card can be
appropriate. This example shows a fully composed case:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Team Members</CardTitle>
    <CardDescription>Manage your team.</CardDescription>
  </CardHeader>
  <CardContent>...</CardContent>
  <CardFooter>
    <Button>Invite</Button>
  </CardFooter>
</Card>
```

---

## Button has no isPending or isLoading prop

Compose with `Spinner` + `data-icon` + `disabled`:

```tsx
<Button disabled>
  <Spinner data-icon="inline-start" />
  Saving...
</Button>
```

---

## TabsTrigger must be inside TabsList

In the Radix composition used here, `TabsList` provides the keyboard-focus group
context needed by `TabsTrigger`. This is a component dependency, distinct from
the choice of whether tabs suit a particular tool:

```tsx
<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">...</TabsContent>
</Tabs>
```

---

## Plan for an unavailable avatar image

`AvatarFallback` is a useful way to preserve an identity cue when the image
fails. Choose an appropriate text/icon fallback, or a simpler presentation if
the image is decorative:

```tsx
<Avatar>
  <AvatarImage src="/avatar.png" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

---

## Consider existing components alongside semantic markup

| Instead of                                         | Use                                  |
| -------------------------------------------------- | ------------------------------------ |
| `<hr>` or `<div className="border-t">`             | `<Separator />`                      |
| `<div className="animate-pulse">` with styled divs | `<Skeleton className="h-4 w-3/4" />` |
| `<span className="rounded-full bg-green-100 ...">` | `<Badge variant="secondary">`        |
