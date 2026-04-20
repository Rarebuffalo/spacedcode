# SpacedCode Terminal Implementation Guide

This document explains the full implementation of the project in detail: architecture, business logic, route behavior, terminal commands, styling rules, environment variables, and where each concern is implemented.

## 1. Product Intent

SpacedCode Terminal is intentionally split into two layers.

The first layer is the visible product:

- show the LeetCode daily problem
- let the user star it for later review
- track spaced repetition metrics

The second layer is the portfolio shell:

- hidden terminal interaction
- project discovery
- technical identity
- architecture explanation
- live stats output

This combination lets the site behave like both a portfolio and a small real product.

## 2. Repository Architecture

### Root

Key files:

- [package.json](/home/Krishna-Singh/Desktop/portfolio-krishna/package.json)
- [turbo.json](/home/Krishna-Singh/Desktop/portfolio-krishna/turbo.json)
- [tsconfig.json](/home/Krishna-Singh/Desktop/portfolio-krishna/tsconfig.json)
- [.env.example](/home/Krishna-Singh/Desktop/portfolio-krishna/.env.example)
- [.env](/home/Krishna-Singh/Desktop/portfolio-krishna/.env)

Responsibilities:

- workspace orchestration
- build and type-check commands
- shared TypeScript defaults
- environment variable contract

### Frontend App

Location:

- `apps/web`

Key responsibilities:

- render the visible product UI
- call the API through Vite proxy
- manage terminal state
- style the interface

### API App

Location:

- `apps/api`

Key responsibilities:

- fetch and normalize LeetCode data
- persist user review queue state
- aggregate developer stats
- expose JSON APIs to the frontend

## 3. Frontend Architecture

### Entry Point

File:

- [apps/web/src/main.tsx](/home/Krishna-Singh/Desktop/portfolio-krishna/apps/web/src/main.tsx)

Responsibilities:

- boot React
- load global CSS
- print the console easter egg

### App Composition

File:

- [apps/web/src/App.tsx](/home/Krishna-Singh/Desktop/portfolio-krishna/apps/web/src/App.tsx)

Responsibilities:

- fetch daily problem data
- fetch global stats
- render the homepage sections
- mount the terminal launcher
- mount the terminal overlay
- open the architecture modal

Main top-level state:

- `dailyProblem`
- `isLoading`
- `error`
- `starredCount`
- `totalUsers`
- `activeToday`
- `showArchitecture`

Business rule:

- the UI should still work even if the API fails
- daily problem falls back to mock data
- counts fail silently instead of crashing the page

### Public Identity Config

File:

- [apps/web/src/lib/siteConfig.ts](/home/Krishna-Singh/Desktop/portfolio-krishna/apps/web/src/lib/siteConfig.ts)

Responsibilities:

- centralize public profile metadata
- expose GitHub, LinkedIn, email, and LeetCode URLs
- provide `rot13()` for terminal contact encoding

This file is the single source of truth for visible profile identity.

### Styling System

Files:

- [apps/web/src/styles/globals.css](/home/Krishna-Singh/Desktop/portfolio-krishna/apps/web/src/styles/globals.css)
- [apps/web/tailwind.config.js](/home/Krishna-Singh/Desktop/portfolio-krishna/apps/web/tailwind.config.js)

Responsibilities:

- theme tokens
- terminal animation classes
- scrollbar styling
- browser autofill override
- smooth scroll and sticky-header offset behavior

Important styling rule:

- dark UI surfaces must use explicit readable foreground colors when browser autofill or mixed theme tokens could reduce contrast

### Reusable UI Primitives

Files:

- [apps/web/src/components/ui/button.tsx](/home/Krishna-Singh/Desktop/portfolio-krishna/apps/web/src/components/ui/button.tsx)
- [apps/web/src/components/ui/card.tsx](/home/Krishna-Singh/Desktop/portfolio-krishna/apps/web/src/components/ui/card.tsx)
- [apps/web/src/components/ui/badge.tsx](/home/Krishna-Singh/Desktop/portfolio-krishna/apps/web/src/components/ui/badge.tsx)
- [apps/web/src/components/ui/input.tsx](/home/Krishna-Singh/Desktop/portfolio-krishna/apps/web/src/components/ui/input.tsx)
- [apps/web/src/components/ui/label.tsx](/home/Krishna-Singh/Desktop/portfolio-krishna/apps/web/src/components/ui/label.tsx)
- [apps/web/src/lib/utils.ts](/home/Krishna-Singh/Desktop/portfolio-krishna/apps/web/src/lib/utils.ts)

Responsibilities:

- consistent primitives
- class merging
- button/card/input ergonomics

## 4. Frontend Feature Components

### Header

File:

- [apps/web/src/components/Header.tsx](/home/Krishna-Singh/Desktop/portfolio-krishna/apps/web/src/components/Header.tsx)

Responsibilities:

- brand identity
- section navigation
- social links
- top-right terminal trigger button

Behavior:

- links rely on section ids in `App.tsx`
- the terminal button directly opens the terminal store

### Footer

File:

- [apps/web/src/components/Footer.tsx](/home/Krishna-Singh/Desktop/portfolio-krishna/apps/web/src/components/Footer.tsx)

Responsibilities:

- supporting portfolio links
- hiring CTA
- terminal shortcut CTA
- small branding notes

### Daily Problem Card

File:

- [apps/web/src/components/DailyProblemCard.tsx](/home/Krishna-Singh/Desktop/portfolio-krishna/apps/web/src/components/DailyProblemCard.tsx)

Responsibilities:

- render the current daily LeetCode challenge
- accept user email
- send star-for-review request
- render success feedback

Business logic:

1. validate email on the client
2. POST to `/api/user/star`
3. on success:
   - mark the problem as starred
   - show a toast
   - notify parent to refresh stats

Important UI rules:

- readable text on dark surfaces
- stable layout when autofill is active
- responsive email input + button arrangement

### Stats Dashboard

File:

- [apps/web/src/components/StatsDashboard.tsx](/home/Krishna-Singh/Desktop/portfolio-krishna/apps/web/src/components/StatsDashboard.tsx)

Responsibilities:

- show review queue count
- show total users
- show active today count
- show spaced repetition timeline

Business logic:

- values are API-driven from `/api/user/stats`
- timeline copy is static explanatory content

### System Design Display

File:

- [apps/web/src/components/SystemDesignDisplay.tsx](/home/Krishna-Singh/Desktop/portfolio-krishna/apps/web/src/components/SystemDesignDisplay.tsx)

Responsibilities:

- modal dialog for architecture explanation
- visual display of system diagram

Relationship to terminal:

- the `architecture` terminal command opens this modal through shared app state

### Real Time Stats

File:

- [apps/web/src/components/RealTimeStats.tsx](/home/Krishna-Singh/Desktop/portfolio-krishna/apps/web/src/components/RealTimeStats.tsx)

Responsibilities:

- optional visual representation of developer stats fetched from `/api/dev/stats`

This component is not the main stats surface for the homepage right now, but it is part of the codebase and follows the same API.

## 5. Terminal System

### State Store

File:

- [apps/web/src/store/terminalStore.ts](/home/Krishna-Singh/Desktop/portfolio-krishna/apps/web/src/store/terminalStore.ts)

Responsibilities:

- terminal open/close state
- command history
- output history
- command implementations

Store fields:

- `isOpen`
- `commandHistory`
- `outputHistory`
- `currentCommand`

Store actions:

- `toggle`
- `open`
- `close`
- `addCommand`
- `addOutput`
- `setCurrentCommand`
- `clearHistory`

### Terminal Commands

Implemented in:

- [apps/web/src/store/terminalStore.ts](/home/Krishna-Singh/Desktop/portfolio-krishna/apps/web/src/store/terminalStore.ts)

Commands:

- `help`: lists available commands
- `whois`: returns structured backend/systems-focused profile copy
- `projects`: returns the current project list with repository links
- `contact`: returns encoded email plus profile links
- `decode [text]`: decodes ROT13 text
- `stats`: fetches live stats from `/api/dev/stats`
- `waka`: alias to `stats`
- `architecture`: returns the ASCII system architecture
- `clear`: resets terminal output history
- `exit`: closes the terminal

### Terminal Overlay

File:

- [apps/web/src/components/Terminal.tsx](/home/Krishna-Singh/Desktop/portfolio-krishna/apps/web/src/components/Terminal.tsx)

Responsibilities:

- render terminal UI
- interpret typed commands
- call async handlers for stats
- push command output into store

Behavior rules:

- `stats` / `waka` shows a loading line before awaiting API output
- `clear` clears history immediately
- `architecture` also triggers the modal

### Global Shortcut Hook

File:

- [apps/web/src/hooks/useKeyboardShortcut.ts](/home/Krishna-Singh/Desktop/portfolio-krishna/apps/web/src/hooks/useKeyboardShortcut.ts)

Responsibilities:

- `Cmd+K` / `Ctrl+K` toggles terminal
- `Escape` closes terminal
- shortcuts are disabled when an input or textarea is focused

This prevents the terminal shortcut from interfering with the email input field.

### Terminal Launcher

File:

- [apps/web/src/components/TerminalLauncher.tsx](/home/Krishna-Singh/Desktop/portfolio-krishna/apps/web/src/components/TerminalLauncher.tsx)

Responsibilities:

- fixed bottom-right terminal trigger
- hover tooltip for keyboard shortcut discovery

UI rule:

- the launcher should not overlap itself with a second keyboard badge
- tooltip should reinforce the shortcut without visual clutter

## 6. API Architecture

### API Entry Point

File:

- [apps/api/src/index.ts](/home/Krishna-Singh/Desktop/portfolio-krishna/apps/api/src/index.ts)

Responsibilities:

- register routes
- configure CORS
- attach logger
- define health response
- handle 404 and internal errors

Mounted route groups:

- `/api/leetcode`
- `/api/user`
- `/api/dev`
- `/api/github`
- `/api/wakatime`

### Runtime Config

File:

- [apps/api/wrangler.jsonc](/home/Krishna-Singh/Desktop/portfolio-krishna/apps/api/wrangler.jsonc)

Responsibilities:

- define Worker entrypoint
- define compatibility date
- define dev port
- enable node compatibility

### Environment Helper

File:

- [apps/api/src/lib/env.ts](/home/Krishna-Singh/Desktop/portfolio-krishna/apps/api/src/lib/env.ts)

Purpose:

- safely read environment variables in Worker-compatible code

Reason:

- direct `process.env` access can break or behave inconsistently in Worker-like environments

## 7. API Business Logic

### LeetCode Route

File:

- [apps/api/src/routes/leetcode.ts](/home/Krishna-Singh/Desktop/portfolio-krishna/apps/api/src/routes/leetcode.ts)

Responsibilities:

- fetch the daily LeetCode challenge via GraphQL
- normalize challenge payload
- return fallback mock data if the upstream fetch fails

Main endpoint:

- `GET /api/leetcode/daily`

Response shape:

- `title`
- `slug`
- `difficulty`
- `link`
- `tags`
- `isPaidOnly`
- `date`

Fallback rule:

- the product should remain usable even when LeetCode fetch fails

### User Route

File:

- [apps/api/src/routes/user.ts](/home/Krishna-Singh/Desktop/portfolio-krishna/apps/api/src/routes/user.ts)

Endpoints:

- `POST /api/user/star`
- `POST /api/user/subscribe`
- `POST /api/user/contact`
- `GET /api/user/profile/:email`
- `GET /api/user/stats`

Important business logic:

#### `POST /api/user/star`

Purpose:

- queue a problem for spaced repetition review

Input:

- `email`
- `problemSlug`
- `problemTitle`
- `difficulty`

Behavior:

- validate request body with `zod`
- persist the star event
- calculate review date as now + 3 days

#### `GET /api/user/stats`

Purpose:

- return global review metrics for the dashboard

Returned values:

- `totalUsers`
- `totalProblemsStarred`
- `totalReviewsScheduled`
- `activeToday`

### Dev Stats Route

File:

- [apps/api/src/routes/dev.ts](/home/Krishna-Singh/Desktop/portfolio-krishna/apps/api/src/routes/dev.ts)

Endpoint:

- `GET /api/dev/stats`

Responsibilities:

- fetch GitHub stats
- fetch WakaTime stats
- cache the combined result

This is the main live-stats endpoint used by the terminal.

### GitHub Route

File:

- [apps/api/src/routes/github.ts](/home/Krishna-Singh/Desktop/portfolio-krishna/apps/api/src/routes/github.ts)

Role:

- provides user-specific GitHub fetches
- serves as a secondary lower-level integration path

### WakaTime Route

File:

- [apps/api/src/routes/wakatime.ts](/home/Krishna-Singh/Desktop/portfolio-krishna/apps/api/src/routes/wakatime.ts)

Role:

- provides user-specific WakaTime fetches
- serves as a secondary lower-level integration path

## 8. Persistence and Caching

### Redis Layer

File:

- [apps/api/src/lib/redis.ts](/home/Krishna-Singh/Desktop/portfolio-krishna/apps/api/src/lib/redis.ts)

Responsibilities:

- manage review queue persistence
- manage user stats
- aggregate global stats
- cache developer stats

Key data types:

- `StarredProblem`
- `UserStats`
- `GlobalStats`

Important business rules:

#### Review queue TTL

- starred problems are stored with a 3-day review concept
- the review date is derived when the problem is starred

#### Dev stats caching

- GitHub and WakaTime aggregate response is cached for one hour

### Local Fallback Mode

Implemented in:

- [apps/api/src/lib/redis.ts](/home/Krishna-Singh/Desktop/portfolio-krishna/apps/api/src/lib/redis.ts)

Reason:

- local development should not fail completely if Redis credentials are missing

Fallback behavior:

- user problems are stored in in-memory maps
- user stats are stored in in-memory maps
- dev stats cache is stored in in-memory maps

Tradeoff:

- data disappears on server restart

## 9. External Integrations

### GitHub

File:

- [apps/api/src/lib/github.ts](/home/Krishna-Singh/Desktop/portfolio-krishna/apps/api/src/lib/github.ts)

Responsibilities:

- fetch GitHub user profile data
- fetch repository stats
- query GitHub GraphQL contributions
- calculate contribution streak

Fallback behavior:

- if token is missing, return mock-but-valid stats

### WakaTime

File:

- [apps/api/src/lib/wakatime.ts](/home/Krishna-Singh/Desktop/portfolio-krishna/apps/api/src/lib/wakatime.ts)

Responsibilities:

- fetch last 7 days coding stats
- normalize hours and languages

Fallback behavior:

- if API key is missing, return mock-but-valid stats

### Resend

Current state:

- env variable contract exists
- actual mail-sending business flow is not yet wired end-to-end in the current implementation

Meaning:

- the reminder product concept is present
- actual delivery is a future extension point

### LeetCode Session

Current state:

- `LEETCODE_SESSION` is present in env contract
- the current daily challenge fetch does not fully depend on session-based authenticated flow

Meaning:

- public GraphQL daily fetch works first
- session-backed behavior can be extended later if needed

## 10. Vite and Local Dev Networking

File:

- [apps/web/vite.config.ts](/home/Krishna-Singh/Desktop/portfolio-krishna/apps/web/vite.config.ts)

Responsibilities:

- configure frontend dev server
- proxy `/api` requests to `http://127.0.0.1:8787`

Important rule:

- the API must run on the same fixed port that Vite proxies to

That fixed dev port is configured in:

- [apps/api/wrangler.jsonc](/home/Krishna-Singh/Desktop/portfolio-krishna/apps/api/wrangler.jsonc)
- [apps/api/package.json](/home/Krishna-Singh/Desktop/portfolio-krishna/apps/api/package.json)

## 11. Build and Type-Check System

### Root Scripts

Defined in:

- [package.json](/home/Krishna-Singh/Desktop/portfolio-krishna/package.json)

Important scripts:

- `npm run dev`
- `npm run dev:web`
- `npm run dev:api`
- `npm run build:all`
- `npm run type-check:all`

### Turbo

Defined in:

- [turbo.json](/home/Krishna-Singh/Desktop/portfolio-krishna/turbo.json)

Responsibilities:

- task orchestration
- build and type-check pipeline coordination

## 12. Environment Variables

### Real Local File

File:

- [.env](/home/Krishna-Singh/Desktop/portfolio-krishna/.env)

Purpose:

- contains the real local values used by the app

Should be ignored by git:

- yes

### Template File

File:

- [.env.example](/home/Krishna-Singh/Desktop/portfolio-krishna/.env.example)

Purpose:

- documents required variables safely
- must not contain live secrets

### Categories

#### Persistence

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

#### Email

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`

#### External Stats

- `GITHUB_TOKEN`
- `GITHUB_USERNAME`
- `WAKATIME_API_KEY`
- `WAKATIME_USERNAME`

#### LeetCode

- `LEETCODE_SESSION`

#### Runtime

- `NODE_ENV`
- `CORS_ORIGIN`

#### Public Frontend Identity

- `VITE_API_BASE_URL`
- `VITE_PUBLIC_NAME`
- `VITE_PUBLIC_HEADLINE`
- `VITE_PUBLIC_GITHUB_URL`
- `VITE_PUBLIC_GITHUB_USERNAME`
- `VITE_PUBLIC_LINKEDIN_URL`
- `VITE_PUBLIC_EMAIL`
- `VITE_PUBLIC_LEETCODE_URL`

## 13. Git Rules and Ignore Policy

This repo should ignore:

- dependencies
- local secrets
- build outputs
- Wrangler temp files
- Turbo cache
- editor/system junk
- logs

See:

- [.gitignore](/home/Krishna-Singh/Desktop/portfolio-krishna/.gitignore)

## 14. Current Functional Summary

Working now:

- homepage renders
- daily problem fetch works
- review star flow works
- dashboard stats work
- terminal opens globally with keyboard shortcut
- terminal commands work
- dev stats route works
- frontend proxy to API works
- builds and type-check pass

Still intentionally lightweight:

- real reminder email delivery
- richer authenticated LeetCode session use
- deployment-specific production wiring

## 15. Suggested Future Extensions

- send actual reminder emails through Resend on review date
- add scheduled job / queue processing for reminders
- persist richer per-user history
- add real architecture diagram illustration
- add a dedicated projects section in the visible UI
- add deploy metadata and CI workflow if deployment is next
