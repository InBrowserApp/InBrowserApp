# shadcn CLI Reference

Configuration is read from `components.json`.

> Use the project package manager and a CLI version appropriate to the task.
> In this repo, start with `pnpm exec shadcn` from `packages/ui`. The upstream
> `npx shadcn@latest` examples below illustrate command syntax.

> This reference is a snapshot. Check the installed CLI help for current flags
> when uncertain; absence from this document does not establish that a flag is
> unavailable. The CLI normally detects the package manager from the lockfile.

## Contents

- Commands: init, add (dry-run, smart merge), search, view, docs, info, build
- Templates: next, vite, start, react-router, astro
- Presets: named, code, URL formats and fields
- Switching presets

---

## Commands

### `init` — Initialize or create a project

```bash
npx shadcn@latest init [components...] [options]
```

Initializes shadcn/ui in an existing project or creates a new project (when `--name` is provided). Optionally installs components in the same step.

| Flag                    | Short | Description                                               | Default |
| ----------------------- | ----- | --------------------------------------------------------- | ------- |
| `--template <template>` | `-t`  | Template (next, start, vite, next-monorepo, react-router) | —       |
| `--preset [name]`       | `-p`  | Preset configuration (named, code, or URL)                | —       |
| `--yes`                 | `-y`  | Skip confirmation prompt                                  | `true`  |
| `--defaults`            | `-d`  | Use defaults (`--template=next --preset=base-nova`)       | `false` |
| `--force`               | `-f`  | Force overwrite existing configuration                    | `false` |
| `--cwd <cwd>`           | `-c`  | Working directory                                         | current |
| `--name <name>`         | `-n`  | Name for new project                                      | —       |
| `--silent`              | `-s`  | Mute output                                               | `false` |
| `--rtl`                 |       | Enable RTL support                                        | —       |
| `--reinstall`           |       | Re-install existing UI components                         | `false` |
| `--monorepo`            |       | Scaffold a monorepo project                               | —       |
| `--no-monorepo`         |       | Skip the monorepo prompt                                  | —       |

`npx shadcn@latest create` is an alias for `npx shadcn@latest init`.

### `add` — Add components

> CLI `add --dry-run`, `--diff`, and `--view` are useful for project-aware
> previews because they resolve registry paths and CSS changes. Direct source
> inspection is also useful when troubleshooting or comparing a specific version.

```bash
npx shadcn@latest add [components...] [options]
```

Accepts component names, registry-prefixed names (`@magicui/shimmer-button`), URLs, or local paths.

| Flag            | Short | Description                                                                                                          | Default |
| --------------- | ----- | -------------------------------------------------------------------------------------------------------------------- | ------- |
| `--yes`         | `-y`  | Skip confirmation prompt                                                                                             | `false` |
| `--overwrite`   | `-o`  | Overwrite existing files                                                                                             | `false` |
| `--cwd <cwd>`   | `-c`  | Working directory                                                                                                    | current |
| `--all`         | `-a`  | Add all available components                                                                                         | `false` |
| `--path <path>` | `-p`  | Target path for the component                                                                                        | —       |
| `--silent`      | `-s`  | Mute output                                                                                                          | `false` |
| `--dry-run`     |       | Preview all changes without writing files                                                                            | `false` |
| `--diff [path]` |       | Show diffs. Without a path, shows the first 5 files. With a path, shows that file only (implies `--dry-run`)         | —       |
| `--view [path]` |       | Show file contents. Without a path, shows the first 5 files. With a path, shows that file only (implies `--dry-run`) | —       |

#### Dry-Run Mode

Use `--dry-run` to preview what `add` would do without writing any files. `--diff` and `--view` both imply `--dry-run`.

```bash
# Preview all changes.
npx shadcn@latest add button --dry-run

# Show diffs for all files (top 5).
npx shadcn@latest add button --diff

# Show the diff for a specific file.
npx shadcn@latest add button --diff button.tsx

# Show contents for all files (top 5).
npx shadcn@latest add button --view

# Show the full content of a specific file.
npx shadcn@latest add button --view button.tsx

# Works with URLs too.
npx shadcn@latest add https://api.npoint.io/abc123 --dry-run

# CSS diffs.
npx shadcn@latest add button --diff globals.css
```

**When to use dry-run:**

- When the user asks "what files will this add?" or "what will this change?" — use `--dry-run`.
- Before overwriting existing components — use `--diff` to preview the changes first.
- When the user wants to inspect component source code without installing — use `--view`.
- When checking what CSS changes would be made to `globals.css` — use `--diff globals.css`.
- When the user asks to review or audit third-party registry code before installing — use `--view` to inspect the source.

> **`npx shadcn@latest add --dry-run` vs `npx shadcn@latest view`:** Prefer `npx shadcn@latest add --dry-run/--diff/--view` over `npx shadcn@latest view` when the user wants to preview changes to their project. `npx shadcn@latest view` only shows raw registry metadata. `npx shadcn@latest add --dry-run` shows exactly what would happen in the user's project: resolved file paths, diffs against existing files, and CSS updates. `view` is useful for browsing registry metadata, with or without a project context.

#### Smart Merge from Upstream

See [Component updates in SKILL.md](./SKILL.md#add-update-or-change-presets) for the full workflow.

### `search` — Search registries

```bash
npx shadcn@latest search <registries...> [options]
```

Fuzzy search across registries. Also aliased as `npx shadcn@latest list`. Without `-q`, lists all items.

| Flag                | Short | Description            | Default |
| ------------------- | ----- | ---------------------- | ------- |
| `--query <query>`   | `-q`  | Search query           | —       |
| `--limit <number>`  | `-l`  | Max items per registry | `100`   |
| `--offset <number>` | `-o`  | Items to skip          | `0`     |
| `--cwd <cwd>`       | `-c`  | Working directory      | current |

### `view` — View item details

```bash
npx shadcn@latest view <items...> [options]
```

Displays item info including file contents. Example: `npx shadcn@latest view @shadcn/button`.

### `docs` — Get component documentation URLs

```bash
npx shadcn@latest docs <components...> [options]
```

Outputs resolved URLs for component documentation, examples, and API references. Accepts one or more component names. Fetch the URLs to get the actual content.

Example output for `npx shadcn@latest docs input button`:

```
base  radix

input
  docs      https://ui.shadcn.com/docs/components/radix/input
  examples  https://raw.githubusercontent.com/.../examples/input-example.tsx

button
  docs      https://ui.shadcn.com/docs/components/radix/button
  examples  https://raw.githubusercontent.com/.../examples/button-example.tsx
```

Some components include an `api` link to the underlying library (e.g. `cmdk` for the command component).

### `diff` — Check for updates

Prefer `add --diff` for project-aware comparisons. Check the installed CLI help
if another command is needed for a particular version or workflow.

### `info` — Project information

```bash
npx shadcn@latest info [options]
```

Displays project info and `components.json` configuration. Run this first to discover the project's framework, aliases, Tailwind version, and resolved paths.

| Flag          | Short | Description       | Default |
| ------------- | ----- | ----------------- | ------- |
| `--cwd <cwd>` | `-c`  | Working directory | current |

**Project Info fields:**

| Field                | Type      | Meaning                                                            |
| -------------------- | --------- | ------------------------------------------------------------------ |
| `framework`          | `string`  | Detected framework (`next`, `vite`, `react-router`, `start`, etc.) |
| `frameworkVersion`   | `string`  | Framework version (e.g. `15.2.4`)                                  |
| `isSrcDir`           | `boolean` | Whether the project uses a `src/` directory                        |
| `isRSC`              | `boolean` | Whether React Server Components are enabled                        |
| `isTsx`              | `boolean` | Whether the project uses TypeScript                                |
| `tailwindVersion`    | `string`  | `"v3"` or `"v4"`                                                   |
| `tailwindConfigFile` | `string`  | Path to the Tailwind config file                                   |
| `tailwindCssFile`    | `string`  | Path to the global CSS file                                        |
| `aliasPrefix`        | `string`  | Import alias prefix (e.g. `@`, `~`, `@/`)                          |
| `packageManager`     | `string`  | Detected package manager (`npm`, `pnpm`, `yarn`, `bun`)            |

**Components.json fields:**

| Field                | Type      | Meaning                                                                                    |
| -------------------- | --------- | ------------------------------------------------------------------------------------------ |
| `base`               | `string`  | Primitive library (`radix` or `base`) — determines component APIs and available props      |
| `style`              | `string`  | Visual style (e.g. `nova`, `vega`)                                                         |
| `rsc`                | `boolean` | RSC flag from config                                                                       |
| `tsx`                | `boolean` | TypeScript flag                                                                            |
| `tailwind.config`    | `string`  | Tailwind config path                                                                       |
| `tailwind.css`       | `string`  | Global CSS path — this is where custom CSS variables go                                    |
| `iconLibrary`        | `string`  | Icon library — determines icon import package (e.g. `lucide-react`, `@tabler/icons-react`) |
| `aliases.components` | `string`  | Component import alias (e.g. `@/components`)                                               |
| `aliases.utils`      | `string`  | Utils import alias (e.g. `@/lib/utils`)                                                    |
| `aliases.ui`         | `string`  | UI component alias (e.g. `@/components/ui`)                                                |
| `aliases.lib`        | `string`  | Lib alias (e.g. `@/lib`)                                                                   |
| `aliases.hooks`      | `string`  | Hooks alias (e.g. `@/hooks`)                                                               |
| `resolvedPaths`      | `object`  | Absolute file-system paths for each alias                                                  |
| `registries`         | `object`  | Configured custom registries                                                               |

**Links fields:**

The `info` output includes a **Links** section with templated URLs for component docs, source, and examples. For resolved URLs, use `npx shadcn@latest docs <component>` instead.

### `build` — Build a custom registry

```bash
npx shadcn@latest build [registry] [options]
```

Builds `registry.json` into individual JSON files for distribution. Default input: `./registry.json`, default output: `./public/r`.

| Flag              | Short | Description       | Default      |
| ----------------- | ----- | ----------------- | ------------ |
| `--output <path>` | `-o`  | Output directory  | `./public/r` |
| `--cwd <cwd>`     | `-c`  | Working directory | current      |

---

## Templates

| Value          | Framework      | Monorepo support |
| -------------- | -------------- | ---------------- |
| `next`         | Next.js        | Yes              |
| `vite`         | Vite           | Yes              |
| `start`        | TanStack Start | Yes              |
| `react-router` | React Router   | Yes              |
| `astro`        | Astro          | Yes              |
| `laravel`      | Laravel        | No               |

All templates support monorepo scaffolding via the `--monorepo` flag. When passed, the CLI uses a monorepo-specific template directory (e.g. `next-monorepo`, `vite-monorepo`). When neither `--monorepo` nor `--no-monorepo` is passed, the CLI prompts interactively. Laravel does not support monorepo scaffolding.

---

## Presets

Three ways to specify a preset via `--preset`:

1. **Named:** `--preset base-nova` or `--preset radix-nova`
2. **Code:** `--preset a2r6bw` (base62 string, starts with lowercase `a`)
3. **URL:** `--preset "https://ui.shadcn.com/init?base=radix&style=nova&..."`

> Preset codes are opaque inputs to `init --preset <code>`. CLI resolution is
> the supported starting point; inspect its output or source when diagnosing a
> resolution problem rather than guessing what a code means.

## Switching Presets

Compare **reinstall**, **merge**, or **skip** against the requested outcome and
local customizations. Make routine choices within existing authorization; ask
about a concrete unresolved loss of local work after inspecting the diff.

- **Re-install** → `npx shadcn@latest init --preset <code> --force --reinstall`. Overwrites all component files with the new preset styles. Use when the user hasn't customized components.
- **Merge** → `npx shadcn@latest init --preset <code> --force --no-reinstall`, then run `npx shadcn@latest info` to get the list of installed components and use the [smart merge workflow](./SKILL.md#add-update-or-change-presets) to update them one by one, preserving local changes. Use when the user has customized components.
- **Skip** → `npx shadcn@latest init --preset <code> --force --no-reinstall`. Only updates config and CSS variables, leaves existing components as-is.

Run preset changes in the intended project so the CLI reads its configuration.
For a scratch comparison, provide the relevant base explicitly: preset codes
do not encode whether the project uses Base or Radix.
