# Glasspine Activation Guide

Guide-led Move-In Checklist for new residents (Jordan Hale, Apt 4B, Oak Street Residences), plus maintenance triage, mocked nudges, and a static measurement panel.

## Quick start (UI only)

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). Without a live API, Guide uses **scripted** replies — fine for walking the demo.

## Demo scenes

| Route | Scene |
| --- | --- |
| `/` | Welcome + Guide intro |
| `/checklist` | Photos, household, bank autopay |
| `/complete` | Home — move-in record saved + action cards |
| `/maintenance` | Guide-led triage → editable request or emergency handoff |
| `/nudges` | Mocked email / SMS / push timeline |
| `/measure` | Static activation funnel & decision rule |

Use the header scene switcher (includes **Reset demo**). **Demo mode · scripted replies** appears in the switcher when the last Guide reply was scripted.

## Live Guide (Gemini)

1. Copy env and add a [Google AI Studio](https://aistudio.google.com/apikey) key:

```bash
cp .env.example .env
# set GOOGLE_GENERATIVE_AI_API_KEY=...
```

2. Run UI **and** `/api/guide` together (Vite alone does not serve serverless functions):

```bash
npx vercel dev
```

3. Ask Guide something in the dock. Replies come from Gemini (`gemini-2.5-flash`) as a single JSON response. If the call fails or takes longer than ~8s, the UI falls back to scripts and shows Demo mode in the switcher.

`.env` is gitignored. The key is read only in [`api/guide.ts`](./api/guide.ts) — never prefixed with `VITE_`.

### Deploy

1. Import the repo in Vercel (Framework Preset: Vite).
2. Set `GOOGLE_GENERATIVE_AI_API_KEY` in Project → Settings → Environment Variables.
3. Deploy. `vercel.json` keeps `/api/*` on functions and SPA-rewrites the rest.

## What’s mocked

- Room photos = `/public/rooms/room-*.jpg` or placeholders
- Autopay = choose a fake bank account + draft day
- Maintenance submit / track link = UI only
- Nudges = timeline frames only (no send infra)
- Measure numbers = illustrative
- Guide without a key or without `vercel dev` = scripted intents + chips

## Theme

Olive/sage tokens live in `src/index.css` (`:root` CSS variables).

## Written rationale

See [RATIONALE.md](./RATIONALE.md).
