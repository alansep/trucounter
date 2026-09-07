# AI Agent Guide

> **This is a living document — expand as the project evolves.**

This guide helps AI coding agents understand the project conventions, structure, and workflow when contributing to Trucounter.

## Getting Started

- The project uses Ionic 9 + Angular 22 with Capacitor for native builds.
- Run `ionic serve` to start the dev server at `http://localhost:8100`.
- All source code lives under `src/`.

## Conventions

- Components use SCSS for styling.
- Modules are lazy-loaded via the router.
- Tests use Vitest (configured in `angular.json`).

## Common Tasks

- **Adding a page:** Generate with `ionic g page <name>`, then register the route in `app-routing.module.ts`.
- **Adding a component:** Generate with `ionic g component <name>`.

## What to Avoid

- Do not modify `node_modules/` directly.
- Do not commit `.angular/` or `dist/` contents.

---

*This document will be expanded with more detailed guidance as the codebase grows.*
