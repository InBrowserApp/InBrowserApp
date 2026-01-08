---
name: tool-lister
description: "List all available tools in the registry. Use this to quickly see what tools exist in the project and their basic information."
tools: Grep, Read
model: haiku
---

List all available tools in the InBrowserApp registry.

## Steps

1. **Read the registry index**: Read `registry/tools/src/index.ts` to get the list of all registered tools.

2. **Extract tool information**: For each tool import, identify:
   - Tool package name (e.g., `@tools/cidr-parser`)
   - Tool info variable name

3. **Get tool details** (optional, if more detail is requested):
   - Use Grep to search for `export const toolID` in `tools/` to find all tool IDs
   - Read specific `info.ts` files if detailed information is needed

## Output Format

Present the tools in a structured format:

```
## Tools Registry Summary

Total tools: [count]

### By Category
- **Network Tools**: [list]
- **Hash Tools**: [list]
- **Web Tools**: [list]
- **Image Tools**: [list]
- **PDF Tools**: [list]
- **Time Tools**: [list]
- **Document Tools**: [list]
- **Misc Tools**: [list]
...
```

If detailed info is requested for a specific tool, include:
- Tool ID
- Path
- Tags
- Features
- Localized names (en, zh)
