# SpacedCode Terminal

SpacedCode Terminal is a hybrid portfolio and productivity product.

On the surface, it is a LeetCode daily challenge dashboard with spaced repetition. Under the surface, it includes a hidden terminal-style interface that exposes developer identity, project links, architecture context, and live stats.

The project is built as a monorepo using Turborepo, with:

- `apps/web`: Vite + React 18 + TypeScript + Tailwind CSS
- `apps/api`: Hono.js API running with Wrangler / Cloudflare Workers compatibility
- Upstash Redis for persistence and caching
- optional Resend, GitHub, WakaTime, and LeetCode integrations

## What It Does

The portfolio is designed around two ideas.

First, it acts as a small product: users can view the LeetCode daily challenge, star it for review, and track spaced-repetition review activity.

Second, it acts as a technical portfolio: recruiters or engineers can use the hidden terminal to explore commands like `whois`, `projects`, `stats`, and `architecture`.

## Core Features

- Daily LeetCode challenge card
- Star-for-review workflow with email input
- Review queue metrics
- Hidden terminal overlay via `Cmd+K` / `Ctrl+K`
- Terminal commands for profile, projects, contact, live stats, and architecture
- GitHub and WakaTime stats aggregation
- Upstash-backed persistence with local in-memory fallback for development

## Monorepo Structure

```text
.
├── apps
│   ├── api
│   │   ├── src
│   │   │   ├── index.ts
│   │   │   ├── lib
│   │   │   └── routes
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── wrangler.jsonc
│   └── web
│       ├── src
│       │   ├── components
│       │   ├── hooks
│       │   ├── lib
│       │   ├── store
│       │   └── styles
│       ├── index.html
│       ├── package.json
│       ├── tailwind.config.js
│       ├── tsconfig.json
│       └── vite.config.ts
├── docs
│   └── IMPLEMENTATION.md
├── .env.example
├── package.json
├── turbo.json
└── tsconfig.json
```

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template if needed:

```bash
cp .env.example .env
```

3. Fill in your real secrets in `.env`.

4. Start both frontend and API:

```bash
npm run dev
```

## Useful Commands

From the repo root:

```bash
npm run dev
npm run build:all
npm run type-check:all
```

App-specific:

```bash
npm run dev:web
npm run dev:api
```

## Environment Variables

The project uses a root `.env` file.

Important groups:

- Upstash Redis
- Resend
- GitHub token and username
- WakaTime API key
- LeetCode session
- Vite public profile values

The full variable list is documented in `.env.example` and described in detail in [docs/IMPLEMENTATION.md](/home/Krishna-Singh/Desktop/portfolio-krishna/docs/IMPLEMENTATION.md).

## How The Product Works

At a high level:

1. The frontend fetches the daily LeetCode challenge from the API.
2. A visitor can enter an email and star the problem for review.
3. The API stores the review record in Redis, or in memory during local fallback mode.
4. The dashboard displays aggregate review counts.
5. The hidden terminal exposes developer-focused commands and live stats.

## Hidden Terminal Commands

The terminal currently supports:

- `help`
- `whois`
- `projects`
- `contact`
- `decode [text]`
- `stats`
- `waka`
- `architecture`
- `clear`
- `exit`

## Documentation

For the detailed implementation and architecture reference, see:

[docs/IMPLEMENTATION.md](/home/Krishna-Singh/Desktop/portfolio-krishna/docs/IMPLEMENTATION.md)

That document covers:

- architecture
- routing
- business logic
- terminal command system
- persistence rules
- API integrations
- fallback behavior
- styling system
- environment setup
- file-by-file ownership

## Notes

- `.env` should stay private and should not be committed.
- `.env.example` should contain placeholders only.
- If any secret was ever pasted into a public place or committed accidentally, rotate it.

