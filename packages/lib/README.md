# Shared Domain Libraries

`packages/lib/*` is reserved for pure TypeScript domain libraries that justify shared ownership.

A domain library should only be created when:

1. the logic is reused across multiple tools, or
2. the logic is correctness-sensitive enough that duplication would raise maintenance risk

Each library lives in its own workspace package, for example:

- `packages/lib/image`
- `packages/lib/dns`
- `packages/lib/uuid`

These libraries must stay framework-free and must not import from the app shell, UI layer, or tool implementations.
