# Shared

This directory contains shared packages that can be used across different applications and tools in the monorepo.

## Structure

- **`ui/`** - Shared Vue.js components and composables
- **`locale/`** - Internationalization (i18n) support
- **`tools/`** - Tool interfaces, types, and metadata definitions

## Overview

The `shared/` directory contains reusable packages that provide common functionality across the entire project:

### @shared/ui

A comprehensive UI component library built with Vue 3 and Naive UI that includes:

- Base components (buttons, inputs, displays)
- Domain-specific components (UUID, PDF, MAC address)
- Layout components (navigation, tool layouts)
- Tool-related components (grids, sections, headers)

### @shared/locale

Internationalization support including:

- Language definitions
- Message translations
- Language detection and switching utilities

### @shared/tools

Core tool system definitions:

- `ToolInfo` interface for tool metadata
- Tool registration and discovery interfaces
- Head management utilities for SEO

## Usage

All shared packages use the `@shared/*` namespace and can be imported by applications and tools:

```typescript
import { UUIDInput, CopyToClipboardButton } from '@shared/ui'
import RefreshOutline from '@vicons/ionicons5/RefreshOutline'
import { useI18n } from '@shared/locale'
```

Icons are imported directly from `@vicons/<library>/<IconName>` (or `vue3-simple-icons`).

## Development

Each shared package is independently developed and versioned, allowing for granular updates and better dependency management.
