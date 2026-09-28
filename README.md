# Glasspine Activation Guide

Prototype for the WEX Build Challenge (**Grow**): a Guide-led Move-In Checklist that activates new residents by tying first actions to security-deposit protection, then shows Guide helping at a real maintenance moment.

## Quick start

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

## Demo scenes

Use the compact scene switcher in the header, or follow the happy path:

| Route | Scene |
| --- | --- |
| `/` | Day 0 welcome + Guide intro |
| `/checklist` | Photos, household, autopay + contextual Guide |
| `/complete` | Deposit protection confirmation + next milestone |
| `/maintenance` | Proactive Guide at a maintenance need |

Persona: **Jordan Hale**, Apt 4B, Oak Street Residences.

## Live Guide vs demo mode

- By default, Guide replies are **scripted** in the frontend (`src/lib/guide-scripts.ts`). Reliable for panel review with no API key.
- Optionally set `OPENAI_API_KEY` (or `AI_GATEWAY_API_KEY`) in the Vercel project env. The serverless function at `api/guide.ts` will answer live; if the call fails or times out (~2.5s), the UI falls back to scripts.
- A small **Live model** / **Demo mode** badge appears after the first reply so what’s real vs mocked is obvious.

Copy `.env.example` if you want a local reminder of the variable name. Vite alone does not run `/api/guide` locally—scripted mode is expected in `npm run dev`. Live calls work after deploying to Vercel with the env var set.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the repo in Vercel (Framework Preset: Vite).
3. Optional: add `OPENAI_API_KEY` in Project → Settings → Environment Variables.
4. Deploy. `vercel.json` rewrites SPA routes to `index.html` while leaving `/api/*` alone.

## What’s mocked

- Photo “upload” = local previews only (no storage)
- Autopay = confirm a fake card
- Maintenance submit = UI confirmation only
- Guide without an API key = scripted intents + chips

## Theme

Olive/sage tokens live in `src/index.css` (`:root` CSS variables). Change those to recolor the app.

## Written rationale

See [RATIONALE.md](./RATIONALE.md) (≤250 words) — personalize before submitting.
