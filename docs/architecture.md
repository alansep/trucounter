# Architecture Overview

> **This is a living document — expand as the project evolves.**

A high-level view of how Trucounter is structured and how its pieces fit together.

## Stack

| Layer | Technology |
|-------|------------|
| UI Framework | Ionic 9 |
| Application Framework | Angular 22 |
| Native Runtime | Capacitor 8 |
| Styling | SCSS |
| Testing | Vitest |
| Language | TypeScript 6 |

## Application Architecture

```
┌─────────────────────────────────────┐
│           Capacitor Shell           │
│  ┌───────────────────────────────┐  │
│  │        Angular App            │  │
│  │  ┌─────────┐  ┌───────────┐  │  │
│  │  │  Router  │  │  Modules  │  │  │
│  │  └────┬────┘  └─────┬─────┘  │  │
│  │       │              │        │  │
│  │       └──────┬───────┘        │  │
│  │              │                │  │
│  │         Components           │  │
│  └───────────────────────────────┘  │
│           Ionic UI Layer            │
└─────────────────────────────────────┘
```

## Data Flow

1. User interacts with Ionic components in a page.
2. Page component handles events and updates state.
3. Angular change detection re-renders the view.
4. For native builds, Capacitor bridges to device APIs.

## Key Design Decisions

- **Lazy loading:** Each page is a separate Angular module loaded on demand.
- **SCSS theming:** Global variables in `src/theme/variables.scss` control the color palette.
- **Environment configs:** Dev and prod settings are swapped at build time via `src/environments/`.

## Development Rules

For code conventions, naming patterns, documentation standards, and test requirements, see [Development Rules](development-rules.md).

---

*This document will be expanded with detailed diagrams and module-level architecture as the project grows.*
