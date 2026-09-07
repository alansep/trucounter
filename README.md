# Trucounter

A card game scorekeeper for Truco, built with Ionic and Angular.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running](#running)
- [Troubleshooting](#troubleshooting)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Roadmap](#roadmap)
- [Supporting Docs for AI Agents](#supporting-docs-for-ai-agents)

## Overview

Trucounter is a mobile-first web application designed to track scores during Truco card games. The app is currently in early development, built on a modern Ionic + Angular stack with Capacitor for native deployment.

The goal is to provide a clean, fast interface for keeping score without the hassle of pen and paper — letting players focus on the game.

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 24.15 |
| Angular CLI | 22.x |
| Ionic | 9.x |
| Capacitor | 8.x |

> **Note:** Older Node versions will trigger an Angular CLI error on startup. See [Troubleshooting](#troubleshooting) for details.

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd trucounter

# Install dependencies
npm install

# Start the development server
ionic serve
```

The app will be available at `http://localhost:8100`.

## Running

```bash
ionic serve
```

This launches the development server with live reload. Any changes to source files trigger an automatic rebuild and browser refresh.

For a production build:

```bash
ionic build --configuration production
```

## Troubleshooting

### Angular CLI requires a minimum Node.js version

If you see an error like `This command requires a minimum Node.js version of XX`, you are running an older Node version. Switch to Node ≥ 24.15 before proceeding.

### Blank screen after changes

If the app loads but shows a blank screen, check the browser console for:

- `createElementNS` errors
- `504 (Outdated Optimize Dep)` when loading a dynamic module

These symptoms indicate a stale Vite cache. To fix:

1. Stop the dev server.
2. Delete the `.angular` cache directory: `rm -rf .angular`
3. Restart with `ionic serve` and hard-refresh the browser (`Ctrl+Shift+R` or `Cmd+Shift+R`).

## Project Structure

```
.
├── src/
│   ├── app/            # Application components and routing
│   ├── assets/         # Static assets (icons, images)
│   ├── environments/   # Environment configuration files
│   ├── theme/          # Global SCSS theme variables
│   ├── global.scss     # Global styles
│   ├── index.html      # Entry HTML
│   └── main.ts         # Bootstrap entry point
├── docs/               # Supporting documentation
├── angular.json        # Angular workspace configuration
├── capacitor.config.ts # Capacitor native configuration
├── ionic.config.json   # Ionic project configuration
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

### Key directories

- **`src/app/`** — Contains the main application component and feature modules. The app uses lazy-loaded modules for each page.
- **`src/assets/`** — Static resources served directly by the build.
- **`src/environments/`** — Environment-specific configuration (dev vs. prod).
- **`src/theme/`** — Ionic theme variables and custom styles.
- **`docs/`** — Project documentation, including guides for AI agents and architecture notes.

## Scripts

| Command | Description |
|---------|-------------|
| `ionic serve` | Start the development server with live reload |
| `ionic build` | Build the app for production |
| `ionic build --watch` | Build in watch mode for development |
| `ng test` | Run unit tests via Vitest |
| `ng lint` | Run ESLint on the source code |

## Roadmap

Trucounter aims to be the go-to scorekeeper for Truco players. The vision includes:

- **Score tracking** — Quick, intuitive score entry for all Truco variants.
- **Game history** — Log past games with dates, players, and final scores.
- **Multiplayer support** — Real-time score sharing across devices.
- **Custom rules** — Configurable scoring for regional Truco variations.
- **Mobile deployment** — Native iOS and Android builds via Capacitor.

The app is designed for players who want simplicity without sacrificing functionality.

## Supporting Docs for AI Agents

This project includes documentation to help AI coding agents navigate the codebase:

- [AI Agent Guide](docs/ai-agent-guide.md) — Orientation for AI agents working on this project.
- [Architecture Overview](docs/architecture.md) — High-level view of the system design and data flow.

> **Note:** These documents are living guides and will expand as the project evolves.
