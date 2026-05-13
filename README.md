# Elevexia

Adaptive learning platform for Year 4–6. Teachers run a short student survey and quiz, an AI rule engine infers five learning flags, and the teacher validates or overrides each one before generating a curriculum-aligned PDF worksheet adapted to that student's needs.

---

## Local development

**Requirements:** Node.js 20+, npm

```bash
# 1. Install dependencies
npm install

# 2. Add your Gemini API key
cp .env.example .env
# Edit .env and set GEMINI_API_KEY=your_key_here

# 3. Start the dev server
npm run dev
# → http://localhost:5173
```

Other useful commands:

```bash
npm run check       # TypeScript + Svelte type-check
npm test            # Run rule-engine unit tests (Vitest)
npm run build       # Production build
npm run preview     # Preview the production build locally
```

---

## Architecture

| Layer | Technology |
|---|---|
| Framework | SvelteKit 2 + Svelte 4 |
| Styling | Tailwind CSS 3.4 + CSS custom properties |
| AI generation | Google Gemini 2.5 Flash (`@google/generative-ai`) |
| PDF rendering | pdfmake (server-side, Node.js) |
| State | Svelte writable store (in-memory, seed data) |
| Deployment | Vercel (`@sveltejs/adapter-vercel`) |

**Data flow:**
1. Student completes survey (`/student/survey`) + quiz (`/student/quiz`)
2. Rule engine (`src/lib/rules/engine.ts`) evaluates responses → five learning flags
3. Teacher reviews flags at `/teacher/student/[id]`, validates or overrides
4. Teacher enters a topic and clicks Generate → `POST /api/generate-material`
5. Gemini returns structured JSON → pdfmake renders an A4 PDF → returned as `application/pdf`
6. Browser shows the PDF in an iframe; teacher downloads

---

## 5-minute demo walkthrough

Use this script for a self-led run-through.

**Before you start:** make sure the dev server is running (`npm run dev`) and you have a `GEMINI_API_KEY` in `.env`.

### Step 1 — Landing page (30 s)
Open `http://localhost:5173`. Read the headline and three value cards. Click **"Watch the demo →"**.

### Step 2 — Sign in (15 s)
You land on the teacher login. Type anything in the email and password fields (demo mode accepts any credentials). Click **Sign in**.

### Step 3 — Dashboard (30 s)
You see the Year 5 Maple class — 5 students. Notice the **Needs review** badge on most cards. Click the **"Needs review"** filter chip to narrow the list.

### Step 4 — Student profile (1 min)
Click on **Amara D.** (reading + language flags). You see her learning flags, each with AI-generated evidence. Try the following:
- Click **Validate** on *Reading Accessibility* to confirm the AI's assessment.
- Click **Override** on *Language Scaffolding*, enter a reason (e.g. "Amara is bilingual, advanced level"), and confirm. Watch the flag flip state.

### Step 5 — Generate a worksheet (2 min)
In the right panel, the subject is pre-set to **Maths**. Type `fractions` in the Topic field. Click **Generate →**.

You land on the worksheet page. A loading spinner appears while Gemini generates the content and pdfmake renders the PDF (~15 s). The finished worksheet appears in the iframe, adapted to Amara's flags.

Click **Download PDF** to save it.

### Step 6 — Reset for next run (15 s)
Go back to the dashboard (`/teacher`). A small amber **Reset demo** button (visible in dev mode only) appears top-right. Click it to restore all students to their original seed state.

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Google AI Studio key — used server-side only |

Set these in the Vercel dashboard under **Project → Settings → Environment Variables** before deploying.

---

## Vercel deployment

```bash
# Install Vercel CLI (once)
npm i -g vercel

# Deploy
vercel
```

When prompted:
- Framework: **SvelteKit** (auto-detected)
- Set `GEMINI_API_KEY` in the Vercel dashboard or with `vercel env add GEMINI_API_KEY`

The project uses `@sveltejs/adapter-auto`, which auto-detects Vercel and deploys server-side routes (including the PDF generator) as Node.js serverless functions automatically.

---

## Known limitations

- **In-memory state only.** Student data resets on every server restart / new tab. A real deployment would need a database (Supabase schema is partially wired — `@supabase/supabase-js` is installed but not yet connected).
- **Single class, hardcoded.** Year 5 Maple and its 5 seed students are fixed. Multi-class support and a real auth system are not implemented.
- **Student flow is one-shot.** There is no persistent student account; survey and quiz state is held in `localStorage` and cleared after submission.
- **PDF fonts are basic.** The worksheet uses Helvetica (built-in PDF Type-1). A custom font (e.g. Lexend for dyslexia-friendly reading) would require bundling font files.
- **English and Science subjects are coming soon.** Only Maths worksheet generation is wired up.
- **Gemini model availability.** The project targets `gemini-2.5-flash`. If this model is unavailable on your key, update the model string in `src/routes/api/generate-material/+server.ts`.
