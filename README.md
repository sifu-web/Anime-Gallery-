# Anime Gallery

A premium dark-themed wallpaper/profile-picture gallery built on Next.js 14,
designed to run on entirely free-tier infrastructure.

## Stack

| Layer | Service | Free tier |
|---|---|---|
| Hosting | Vercel (Hobby) | ~100GB bandwidth/mo, no credit card |
| Database | Neon Postgres | 0.5GB storage, no credit card, no 7-day pause |
| Image storage | ImageKit.io — **3 separate accounts**, one per category | 5GB storage + 25GB bandwidth each, no credit card |

**Why 3 ImageKit accounts?** Each account's free tier is 5GB, so splitting
Profile Pic / Anime Wallpaper / Natural Wallpaper across three accounts
gives ~15GB total instead of competing for one account's 5GB. You asked to
go ahead with this despite the tradeoff, so it's worth repeating here:
**most providers' terms of service restrict one free account per person/
use case**, so this is a genuine account-suspension risk, not a "trick"
with no downside. If any account gets flagged, that category's images
become unavailable until you migrate it to another provider or a paid
plan. Keep the three accounts under different emails and don't rely on
this for a business you can't afford to have interrupted.

## Setup

1. **Database**: create a Neon project, then run the schema:
   ```bash
   psql "$DATABASE_URL" -f lib/schema.sql
   ```
2. **Image storage**: create 3 ImageKit.io accounts (or 1, if you'd rather
   stay safely inside one ToS — see above), grab each account's public
   key / private key / URL endpoint.
3. Copy `.env.example` to `.env.local` and fill in every value.
4. Install and seed the two admin accounts you asked for:
   ```bash
   npm install
   node --env-file=.env.local scripts/seed-admins.mjs
   ```
   This creates **Sifat** and **Sowad** as admins. Log in at `/admin/login`
   (linked quietly in the homepage footer) and change these passwords —
   or edit `scripts/seed-admins.mjs` before running it — as soon as you're
   live. Don't leave real production passwords sitting in that file if you
   push this repo anywhere.
5. Run locally:
   ```bash
   npm run dev
   ```
6. Deploy: push to GitHub, import into Vercel, add the same environment
   variables there, deploy.

## What's stubbed on purpose

- **Ads** (`lib/ads.ts`): no fake ad experience is implemented. Until you
  pick an approved ad provider and wire in their real SDK, downloads work
  normally for every visitor — nothing pretends to show an ad. Admin
  bypass doesn't depend on this file at all: every admin-only action is
  verified server-side against the session cookie (`lib/auth.ts`), so
  there's no client-side flag to spoof.
- **Storage stats** assume 5GB per category (matching the ImageKit free
  tier). If you change providers or plans, update `CAP_BYTES_PER_CATEGORY`
  in `app/api/storage-stats/route.ts`.

## I could not run a real build here

This project was generated in a sandboxed environment with no internet
access, so `npm install` / `npm run build` / `tsc` could not actually be
executed against it. The code follows correct Next.js 14 App Router and
TypeScript patterns, but please run:
```bash
npm install
npm run build
```
locally before deploying, and tell me any error output — I'll fix it.

## Testing checklist (do this before going live)

- [ ] `npm run build` completes with no TypeScript/lint errors
- [ ] Admin login / logout works; wrong password is rejected
- [ ] Visiting `/admin/dashboard` while logged out redirects to login
- [ ] Upload: valid image succeeds; oversized/wrong-type file is rejected
- [ ] Delete single image removes it from both ImageKit and the gallery
- [ ] Select up to 100 images → bulk delete asks for confirmation
- [ ] Select images → "Download selected" produces a valid ZIP
- [ ] Gallery infinite-scroll loads more images near the bottom of the page
- [ ] Test on a throttled/slow network (DevTools → Network → Slow 3G)
- [ ] Test on an actual low-end/mid Android phone, not just desktop DevTools
- [ ] Storage dashboard shows correct per-category usage and warns near cap

## Project layout

```
app/                 routes (pages + API handlers)
components/          UI components (gallery grid, lightbox, upload, etc.)
lib/                 db, auth, imagekit, ads, shared types/config
scripts/             one-time admin seed script
lib/schema.sql        Postgres schema
```
