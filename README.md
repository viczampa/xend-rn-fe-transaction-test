# Xendora — Transactions List (Expo + TypeScript)

Fintech-style **transactions list** for the Xendora technical challenge: login, scrollable list, search, asset/type filters, sort, and a **bottom sheet** for details.

**Requirements:** [`test-spec.md`](./test-spec.md) · **UI constraints:** [`main-spec.md`](./main-spec.md)

---

## How to run

**Prerequisites:** Node.js **20 LTS** and npm (see `package.json` for Expo SDK **54** / React Native **0.81**).

```bash
git clone <your-fork-url>
cd xend-rn-fe-transaction-test
cp .env.example .env
# Edit .env: set EXPO_PUBLIC_TEST_USER_EMAIL and EXPO_PUBLIC_TEST_USER_PASSWORD
# (values are in test-spec.md — do not commit real secrets)
npm install
npx expo start
```

Then open **Expo Go** (scan QR), or press **`i`** / **`a`** / **`w`** for simulator / emulator / web. The login screen reads email and password from `.env` when those keys are set.

**Clear Metro cache** if something looks stale:

```bash
npx expo start --clear
```

**Phone can’t reach your PC (e.g. WSL2 / different network):** try LAN first (`npm run start:lan`). If the QR URL must be public, use `npm run start:tunnel`, or run your own tunnel (e.g. Cloudflare) and set `EXPO_PACKAGER_PROXY_URL` — see Expo docs for that variable — then `expo start --lan`.

**Tests:**

```bash
npm test
```

---

## Environment variables

Create `.env` from [`.env.example`](./.env.example). Only variables prefixed with **`EXPO_PUBLIC_`** are exposed to the app bundle.

| Variable | Purpose |
| -------- | ------- |
| `EXPO_PUBLIC_API_URL` | API base URL (challenge / Swagger use **`https://dev.xendora.com/api`**) |
| `EXPO_PUBLIC_API_PROD_URL` | Reserved prod base (`https://xendora.com/api`) — not required for the demo flow |
| `EXPO_PUBLIC_TEST_USER_EMAIL` | Pre-fills login (optional convenience) |
| `EXPO_PUBLIC_TEST_USER_PASSWORD` | Pre-fills login (optional convenience) |


--

## Architecture and main decisions

**Routing:** I've used expo-router as the main route manager of the app.

**Layout:**

| Area | Role |
| ---- | ---- |
| `app/` | Routes: auth gate, login, main shell |
| `src/api/` | Axios client, `Bearer` injection, React Query keys, `GET /transactions` wrapper |
| `src/features/auth/` | Login + `AuthProvider`; token in **Secure Store** (native) / AsyncStorage (web) |
| `src/features/transactions/` | List, filters, row, **`@gorhom/bottom-sheet`** details, pure filter/sort helpers |
| `src/components/` | Shared UI (header, badges, empty state, logo) |
| `src/theme/` | Colors, typography (**Lato**), light/dark |

**Why these choices:**

- **TanStack React Query** — server cache, `useInfiniteQuery` for pagination, retries/refetch without Redux-style boilerplate.
- **Context** — auth + theme only; no global store for server data.
- **`StyleSheet`** — no extra styling framework; tokens live in `src/theme/`.
- **Client-side search/filters** — after pages are merged in memory, filters apply locally so UX stays instant; the wire call uses **`page` + `pageSize` only** (see comments in `src/api/transactions.api.ts` for API limitations during integration).

---

## What I’d improve with more time

- **API:** Server-side `search` / filter / cursor pagination so the client doesn’t need to merge large lists.
- **Auth:** Refresh tokens, proactive expiry handling, polished 401 → login flow.
- **Product:** Insert of gluestack and sentry into the base of the app.

---

## License

Built for the Xendora technical challenge — not intended for production.
