# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run preview      # Preview production build
npm run check        # Type-check with svelte-check
npm run check:watch  # Watch mode type checking
```

No test runner is configured yet.

## Tech Stack

- **Framework:** SvelteKit 2 + Svelte 4, TypeScript 5
- **Styling:** Tailwind CSS 3.4 with custom CSS design tokens (light/dark via `--primary`, `--background`, etc.)
- **UI:** Bits UI (headless components) + Lucide Svelte icons
- **Backend:** Supabase (supabase-js 2)
- **Class composition:** `cn()` utility in [src/lib/utils.ts](src/lib/utils.ts) wraps `clsx` + `tailwind-merge`

## Architecture

### Route Structure

SvelteKit file-based routing under [src/routes/](src/routes/):

- `/` — Landing page that routes to either the teacher or student view
- `/teacher` — Teacher dashboard with sidebar navigation (Dashboard, Students, Content, Settings)
- `/student` — Student view

Both teacher and student areas use nested `+layout.svelte` files for their respective shells.

### Domain Model

Defined in [src/lib/types.ts](src/lib/types.ts):

- **`SurveyResponse` / `QuizResponse`** — Capture student knowledge evidence; quiz responses include a `dok` (Depth of Knowledge level 1–4)
- **`Student`** — Core student entity with `flagSet` for learning needs
- **`Flag` / `FlagSet`** — Five adaptive flags: `readingAccessibility`, `attentionChunking`, `languageScaffolding`, `handsOnLearning`, `extendedChallenge`; each flag has `active` and `teacherValidated` states

### Styling Conventions

- Use the `cn()` utility for all conditional or merged class strings
- Tailwind theme tokens (colors, border-radius, fonts) are extended in [tailwind.config.js](tailwind.config.js)
- CSS custom properties for the design system live in [src/app.css](src/app.css); prefer these over hardcoded colors

### SvelteKit Notes

- The project uses `@sveltejs/adapter-auto`
- Always include `+error.svelte` in any new route group — SvelteKit 2 + Svelte 4 dev server crashes without it due to svelte-hmr proxy incompatibility with the built-in error boundary
