# V1CE / Milestone — Migration Assessment & Roadmap

**Prepared:** 2026-07-03
**Source material:** `V1CE_Code.txt` (single-file export, ~31KB) + README

---

## 1. What we actually have

The repository does **not** contain a runnable codebase. It contains one text file that is a
*summary export* of an app built on an AI app-builder platform. It mixes three kinds of content:

1. **Complete source files** — `package.json`, `app.json`, `lib/supabase.ts`, `constants/colors.ts`,
   `hooks/useColors.ts`, `context/AuthContext.tsx`, `app/_layout.tsx`, `app/index.tsx`,
   `app/onboarding.tsx`, `app/(tabs)/_layout.tsx`, `app/+not-found.tsx`, `components/ErrorBoundary.tsx`
2. **Prose descriptions only** (no code) — all seven tab screens: Home, Coin editor, Stats, Lounge,
   Friends, Profile, Premium; plus `ErrorFallback.tsx`
3. **Documentation** — Supabase schema (3 tables), design system, navigation map, dependency list

**Roughly half the app's screens exist only as feature bullet lists.** They must be recovered from
the platform or rebuilt.

### Platform note (raise with client)

The client says the app was built on **Base44**, but the export carries **Replit** fingerprints:
the dev script uses `$REPLIT_DEV_DOMAIN` / `$REPL_ID` env vars, and `expo-router` is configured with
`origin: "https://replit.com/"`. Either the app actually lives on Replit (Base44 doesn't produce
Expo/React Native apps — it generates web apps), or it was moved between platforms already.
**Clarify which platform holds the source of truth before anything else.**

### Tech stack (good news — it's standard)

| Layer | Technology |
|---|---|
| Framework | Expo SDK 54 / React Native 0.81 / React 19 |
| Routing | expo-router 6 (file-based, typed routes) |
| Backend | Supabase (Postgres + Auth), `@supabase/supabase-js` v2 |
| State | TanStack React Query + React Context |
| Local storage | AsyncStorage |
| Monorepo | pnpm workspace (references `@workspace/api-client-react`, `catalog:` versions — **not included**) |

This is a conventional, portable stack. There is no proprietary Base44/Replit runtime lock-in in the
code itself — the "migration" is mostly about (a) recovering the full source, (b) owning the Supabase
project, and (c) fixing serious security/architecture gaps left by the app-builder.

---

## 2. Critical findings

### 🔴 Security (must fix before any public use)

1. **Supabase URL + anon key are hardcoded in source and have now been shared in plaintext**
   (`lib/supabase.ts`). The anon key is meant to be public *only if* Row Level Security is properly
   configured — see #2. Key expiry is set to 2035. Rotate keys once the project is under our control.
2. **Identity is an unauthenticated email string.** The app stores an email in AsyncStorage and
   loads/writes any `SobrietyProfile` row matching that email. No password, no OTP, no verification.
   Anyone with the anon key (i.e., anyone) can read or modify **any user's sobriety profile** —
   including flipping `is_premium` to true — by supplying an email.
3. **Almost certainly no RLS.** The query pattern (anon-key reads/writes filtered only by email)
   only works if the tables are wide open. Sobriety/addiction data is *sensitive health-adjacent
   data* — this is a privacy liability, not just a bug.
4. **Premium is a client-writable boolean.** `is_premium` lives in the profile row the client can
   update. No payment processor, no receipt validation, no IAP integration exists.
5. **Demo mode inserts a new `demo@v1ce.app` row on every tap** — will collide with the UNIQUE email
   constraint after the first use, and pollutes production data.

### 🟠 Completeness gaps

- Missing entirely: the 7 tab screen implementations, `ErrorFallback.tsx`, `scripts/build.js`,
  `server/serve.js`, `tsconfig.json`, assets (icon/splash), the `@workspace/api-client-react`
  package, pnpm catalog definitions, lockfile.
- **Schema gaps:** Stats screen advertises check-ins and streaks, but no check-in table exists.
  Lounge chat and games are mock data with no backing tables. Friend connections are keyed by
  email, not user ID.
- **No IAP plumbing** despite a $3.99/mo Premium screen (App Store/Play both *require* native IAP
  for digital subscriptions — a web checkout is not allowed).
- No tests, no CI, no EAS build config, no error reporting (ErrorBoundary catches but reports nowhere).

### 🟡 Compliance considerations

- Addiction-recovery data will be treated as sensitive by Apple/Google review and by privacy law
  (GDPR special category adjacent). Needs: privacy policy, data deletion path, consent language
  beyond the current EULA checkbox.
- Sobriety date entry is a free-text `YYYY-MM-DD` TextInput — fine for a prototype, not for launch.

---

## 3. Migration roadmap

### Phase 0 — Discovery & access (client-blocking, ~1 week)
- [ ] Confirm where the app actually lives (Base44 vs. Replit) and get login access to that platform.
- [ ] Export/download the **complete** project source, not the summary file. If the platform can't
      export, screens get rebuilt from the descriptions (estimate accordingly — see Phase 2).
- [ ] Get owner access to the Supabase project (`qeqsdfgcoabdomdrnvea`); if the platform owns it,
      plan a data export (pg_dump) into a client-owned Supabase org.
- [ ] Inventory real usage: row counts, active users, whether any real user data exists. This
      decides whether we migrate data or start clean.
- [ ] Confirm business goals: iOS App Store? Android? Web? Real subscription revenue? This sets
      Phase 4 scope.

**Deliverable:** written scope + fixed-price or phased estimate. Do not quote before Phase 0 completes.

### Phase 1 — Repo & infrastructure ownership (~1 week)
- [ ] Stand up a proper git repo with the full source (or fresh Expo SDK 54 scaffold if source is
      unrecoverable), pnpm workspace resolved or flattened to a single package.
- [ ] New client-owned Supabase project; schema recreated via migration files (not dashboard clicks).
- [ ] Rotate all keys; move config to env (`EXPO_PUBLIC_*` / EAS secrets), delete hardcoded credentials.
- [ ] EAS build + dev-client setup so the app runs outside Replit; CI for typecheck/lint.

### Phase 2 — Rebuild missing screens & harden auth (~2–4 weeks, the core effort)
- [ ] Implement the 7 tab screens from the descriptions (Home counter/coin, Coin editor, Stats,
      Lounge, Friends, Profile, Premium). Design system is fully documented, which helps.
- [ ] Replace email-string identity with real Supabase Auth (recommend: email OTP / magic link —
      lowest-friction for this audience). Key profiles by `user_id`, not email.
- [ ] Enable RLS on every table; policies: users read/write own profile, friend rows visible to both
      parties, blocked-user checks server-side.
- [ ] Add missing tables: `check_ins`, chat/messages (or cut Lounge chat from v1), migrate friend
      connections to user IDs.
- [ ] Fix demo mode (local-only demo profile, no DB insert) and date entry (native date picker).

### Phase 3 — Monetization done right (~1–2 weeks)
- [ ] RevenueCat (recommended) or native StoreKit/Play Billing for the $3.99/mo subscription.
- [ ] `is_premium` derived server-side from subscription status (webhook → Supabase), never
      client-writable.
- [ ] Premium gating re-checked server-side via RLS/policies where it matters.

### Phase 4 — Launch readiness (~1–2 weeks)
- [ ] Privacy policy, account deletion (App Store requirement), data export.
- [ ] Crash/error reporting (Sentry), basic analytics.
- [ ] App Store / Play assets, review-guideline pass (health-adjacent app category).
- [ ] TestFlight/internal-track beta with the client, then submission.

### Rough total
**6–10 weeks** of focused effort depending on Phase 0 findings (whether real source and real user
data exist). The single biggest estimate risk is whether the platform export contains the actual
screen code or only the summaries we have here.

---

## 4. Immediate next steps (this week)

1. **Ask the client the Phase 0 questions** — platform access, Supabase ownership, real user count,
   target stores.
2. **Treat the shared Supabase credentials as compromised** — they're in a plaintext file that's
   been emailed around. Rotation goes on day one of engagement.
3. **Do not build on this repo as-is** — it's reference material, not a foundation.
