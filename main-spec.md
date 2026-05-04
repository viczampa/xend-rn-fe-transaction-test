# Main Specification — Xendora Transactions List (React Native + Expo)

This document is the **single source of truth** for the implementation. It merges the technical challenge requirements (see `test-spec.md`) with the obligatory UI / library decisions for this project.

---

## 1. Project goal

Build a **Transactions List** screen for a fintech-style mobile app. Users must be able to:

- Browse their recent transactions in a scrollable list.
- Search transactions by counterparty (text input).
- Filter by **asset** (USDC, USD, BTC, EUR, etc.) and by **status / type** (Withdrawal, Deposit, Exchange, etc.). Filters must be combinable with the search input.
- Tap a row to open a **bottom sheet** revealing additional details: transaction id (hash), sending address, account, network, etc.
- See explicit **loading**, **empty**, and **error** states.

Each row must show: type (Send / Receive / Swap, Crypto / Fiat), counterparty (or asset pair for swaps), status, date & time, amount with the asset.

---

## 2. Stack (locked)

- **React Native** via **Expo (managed workflow)**
- **TypeScript** (mandatory)
- **State / data fetching:** `@tanstack/react-query` (React Query) — see `## LIBRARY REQUIREMENTS`
- **Styling:** free choice (StyleSheet, NativeWind, styled-components, Tamagui). Whatever is picked must respect the colors and font defined below.
- **Bottom sheet:** `@gorhom/bottom-sheet` is the recommended pick for the transaction details sheet.
- **Navigation:** `expo-router` (file-based) is the recommended pick. React Navigation is also acceptable.

Versions targeted by this project:

- Expo SDK **52** (or later)
- React Native **0.76.x** (or whatever version Expo SDK 52+ pins)
- Node **20 LTS** or newer

---

## 3. API

Base URL is read from `.env` only. **No hardcoded URLs in source code.**

- Production base: `https://xendora.com/api`
- Development base (used in this challenge): `https://dev.xendora.com/api`
- Endpoint to consume: `GET /transactions` — unified transactions endpoint (see Swagger: `https://dev.xendora.com/api/docs#/Transactions/TransactionsController_listUnified`).
- Login endpoint: `POST /users/login` (see Swagger: `https://dev.xendora.com/api/docs#/Users/UserController_login`).

### Authentication

Bearer token obtained from the login endpoint. Token must be stored securely (`expo-secure-store`) and attached to every request via the `Authorization: Bearer <token>` header.

The login credentials are **test-only** and are kept in `.env` (never committed). See `## ENVIRONMENT VARIABLES` below.

### Client vs server-side filtering

- **Asset / status filters and search**: prefer **server-side** filtering when supported by the endpoint query parameters. Fall back to client-side filtering on the already-fetched page only when the server cannot do it.
- **Pagination**: server-side, via React Query's `useInfiniteQuery`.

### Example request

```bash
curl -X 'GET' \
  'https://dev.xendora.com/api/transactions?page=1&pageSize=12' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer <YOUR_TOKEN>'
```

> Replace `<YOUR_TOKEN>` with the Bearer token obtained from the login endpoint. The token is stored at runtime by `expo-secure-store` and injected by the API client — it is never hardcoded.

### Example response (truncated to 2 items)

The full response envelope is `{ data: Transaction[], meta: { total, page, pageSize } }`. Each `Transaction` object has the shape below — use it as the TypeScript interface source of truth.

```json
{
  "data": [
    {
      "id": "59803a78-8c74-4437-871c-f707e0d56e44",
      "createdAt": "2026-04-20T23:13:21.181Z",
      "provider": "BRIDGE",
      "providerId": "446fb0a8-2359-4261-a74b-5e9448cbd784",
      "providerEventId": null,
      "type": "WITHDRAWAL",
      "status": "COMPLETED",
      "rail": "SEPA",
      "rawStatus": "payment_processed",
      "description": null,
      "accountId": "90bbec0a-9c28-4b54-9dfb-d0751b373bbe",
      "customerId": "918f5722-f9f1-4a1f-a226-11231884d5ea",
      "counterpartyId": "092715d1-809b-43d3-8911-07a10423eaa1",
      "depositInstructionId": null,
      "imad": null,
      "references": null,
      "date": "2026-04-09T08:07:17.922Z",
      "completedAt": "2026-04-09T08:08:34.150Z",
      "raw": {
        "id": "446fb0a8-2359-4261-a74b-5e9448cbd784",
        "state": "payment_processed",
        "amount": "49.0",
        "currency": "usdc",
        "created_at": "2026-04-09T08:07:17.922Z",
        "receipt_url": "https://dashboard.bridge.xyz/transaction/797213e2-a604-473d-a3f2-a9637d3e8364/receipt/115e2c1f-a5a0-47e6-b3a1-2c6f0ae7c14d",
        "from_address": "0x1f951dd760da387ccb5ed9757f5de4f6be5228cb",
        "deposit_tx_hash": "0xcbd950d26c8625f744b34a4da087f3addabed48905723ec1154f03e151625335",
        "destination_uetr": "010F271260991A29",
        "destination_currency": "eur",
        "receipt_exchange_rate": "0.853061",
        "receipt_initial_amount": "49.0",
        "receipt_outgoing_amount": "41.8",
        "receipt_converted_amount": "41.8",
        "destination_payment_rail": "sepa",
        "destination_sepa_reference": "BRZ to Eur",
        "receipt_destination_currency": "eur",
        "destination_external_account_id": "14d38a99-7f69-4528-bd45-630189c0c71d"
      },
      "source": {
        "name": "Guilherme Teixeira",
        "amount": {
          "value": "49.000000000000000000",
          "currency": "USDC"
        },
        "address": {
          "addressLine1": null,
          "addressLine2": null,
          "city": null,
          "state": null,
          "postalCode": null,
          "country": null
        },
        "accountId": "90bbec0a-9c28-4b54-9dfb-d0751b373bbe",
        "customerId": "918f5722-f9f1-4a1f-a226-11231884d5ea",
        "counterpartyId": null,
        "rail": "CRYPTO",
        "details": {
          "address": "0x1f951dd760da387ccb5ed9757f5de4f6be5228cb",
          "asset": "usdc",
          "network": "ethereum",
          "walletId": null,
          "tag": null,
          "memo": null
        }
      },
      "destination": {
        "name": "Guilherme Yoshida",
        "amount": {
          "value": "41.800000000000000000",
          "currency": "EUR"
        },
        "address": {
          "addressLine1": null,
          "addressLine2": null,
          "city": null,
          "state": null,
          "postalCode": null,
          "country": null
        },
        "accountId": null,
        "customerId": null,
        "counterpartyId": "092715d1-809b-43d3-8911-07a10423eaa1",
        "rail": "SEPA",
        "details": {
          "accountOwnerName": null,
          "accountOwnerType": null,
          "firstName": null,
          "lastName": null,
          "bankName": "N26 Bank SE",
          "accountNumber": "ES9715632626353264127881",
          "address": {
            "addressLine1": "Camino el Olivar 25",
            "addressLine2": null,
            "city": null,
            "state": null,
            "postalCode": null,
            "country": null
          },
          "iban": "ES9715632626353264127881",
          "bic": "NTSBESM1XXX"
        }
      }
    },
    {
      "id": "dfe639c7-2a39-4a6d-afb9-aa85dc8fc057",
      "createdAt": "2026-04-20T23:13:21.181Z",
      "provider": "BRIDGE",
      "providerId": "774fa3ff-d157-4acd-9e6d-715c38901fa6",
      "providerEventId": null,
      "type": "WITHDRAWAL",
      "status": "COMPLETED",
      "rail": "SEPA",
      "rawStatus": "payment_processed",
      "description": null,
      "accountId": "90bbec0a-9c28-4b54-9dfb-d0751b373bbe",
      "customerId": "918f5722-f9f1-4a1f-a226-11231884d5ea",
      "counterpartyId": "092715d1-809b-43d3-8911-07a10423eaa1",
      "depositInstructionId": null,
      "imad": null,
      "references": null,
      "date": "2026-04-07T16:00:55.266Z",
      "completedAt": "2026-04-07T16:03:34.008Z",
      "raw": {
        "id": "774fa3ff-d157-4acd-9e6d-715c38901fa6",
        "state": "payment_processed",
        "amount": "1850.0",
        "currency": "usdc",
        "created_at": "2026-04-07T16:00:55.266Z",
        "receipt_url": "https://dashboard.bridge.xyz/transaction/b0806a9f-23e3-4c48-ad16-1e73e73794b8/receipt/b876e797-028e-480c-9768-74649fc1eeaf",
        "from_address": "0x1f951dd760da387ccb5ed9757f5de4f6be5228cb",
        "deposit_tx_hash": "0x2ec7bb010aa48596d7d63c234872b2b3dc53c09aad135772c5a6bc0fcf0cac04",
        "destination_uetr": "010F271260973K2E",
        "destination_currency": "eur",
        "receipt_exchange_rate": "0.859875",
        "receipt_initial_amount": "1850.0",
        "receipt_outgoing_amount": "1590.77",
        "receipt_converted_amount": "1590.77",
        "destination_payment_rail": "sepa",
        "destination_sepa_reference": "BRZ to Eur",
        "receipt_destination_currency": "eur",
        "destination_external_account_id": "14d38a99-7f69-4528-bd45-630189c0c71d"
      },
      "source": {
        "name": "Guilherme Teixeira",
        "amount": {
          "value": "1850.000000000000000000",
          "currency": "USDC"
        },
        "address": {
          "addressLine1": null,
          "addressLine2": null,
          "city": null,
          "state": null,
          "postalCode": null,
          "country": null
        },
        "accountId": "90bbec0a-9c28-4b54-9dfb-d0751b373bbe",
        "customerId": "918f5722-f9f1-4a1f-a226-11231884d5ea",
        "counterpartyId": null,
        "rail": "CRYPTO",
        "details": {
          "address": "0x1f951dd760da387ccb5ed9757f5de4f6be5228cb",
          "asset": "usdc",
          "network": "ethereum",
          "walletId": null,
          "tag": null,
          "memo": null
        }
      },
      "destination": {
        "name": "Guilherme Yoshida",
        "amount": {
          "value": "1590.770000000000000000",
          "currency": "EUR"
        },
        "address": {
          "addressLine1": null,
          "addressLine2": null,
          "city": null,
          "state": null,
          "postalCode": null,
          "country": null
        },
        "accountId": null,
        "customerId": null,
        "counterpartyId": "092715d1-809b-43d3-8911-07a10423eaa1",
        "rail": "SEPA",
        "details": {
          "accountOwnerName": null,
          "accountOwnerType": null,
          "firstName": null,
          "lastName": null,
          "bankName": "N26 Bank SE",
          "accountNumber": "ES9715632626353264127881",
          "address": {
            "addressLine1": "Camino el Olivar 25",
            "addressLine2": null,
            "city": null,
            "state": null,
            "postalCode": null,
            "country": null
          },
          "iban": "ES9715632626353264127881",
          "bic": "NTSBESM1XXX"
        }
      }
    }
  ]
}
```

### Key fields to render from the response

| UI element              | Source field(s)                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------ |
| Transaction type        | `type` — `WITHDRAWAL`, `DEPOSIT`, `EXCHANGE`                                         |
| Rail / method           | `rail` — `SEPA`, `ACH`, `WIRE`, `CRYPTO`                                             |
| Status pill             | `status` — `COMPLETED`, `PENDING`, `FAILED`                                          |
| Date & time             | `date` (transaction date) or `createdAt`                                             |
| Source asset + amount   | `source.amount.currency` + `source.amount.value`                                     |
| Destination asset + amount | `destination.amount.currency` + `destination.amount.value`                        |
| Counterparty name       | `destination.name` (for withdrawals) or `source.name` (for deposits)                |
| **Bottom sheet — tx hash**  | `raw.deposit_tx_hash` or `raw.destination_tx_hash`                               |
| **Bottom sheet — from address** | `raw.from_address` / `source.details.address`                                |
| **Bottom sheet — network**  | `source.details.network`                                                         |
| **Bottom sheet — bank**     | `destination.details.bankName`                                                   |
| **Bottom sheet — IBAN**     | `destination.details.iban`                                                       |
| **Bottom sheet — BIC**      | `destination.details.bic`                                                        |
| **Bottom sheet — exchange rate** | `raw.receipt_exchange_rate`                                                 |
| **Bottom sheet — receipt**  | `raw.receipt_url`                                                                |

---

## Actual base UI design reference

- https://xendora.com/
- https://xendora.com/_next/static/media/mockup-seamless-multicurrency.f7e28d29.png
- https://xendora.com/_next/static/media/mockup-cta-section.f8bb9e14.png
- https://xendora.com/_next/static/media/cards.9e97aae3.svg

## Other references

- https://cdn.sanity.io/images/ordgikwe/production/27c5db1d902d1815e2dbd682aed07d37e89614a7-1000x750.jpg?w=1000&h=750&auto=format
- https://yi-files.yellowimages.com/products/1189000/1189425/1982666-full.jpg
- https://elements-resized.envatousercontent.com/elements-cover-images/2b427efd-97ca-4b2e-90b1-43c6f2996c3e?w=433&cf_fit=scale-down&q=85&format=auto&s=53c6017f36e9f64e462cfa6672d91efc6dd6780afeba1acd868dcc372698dfad

## UI Obligatory requirements

The screen must visually match the look-and-feel implied by the references above: clean, spacious, fintech style, with strong typographic hierarchy and subtle dividers between rows.

### Header (mandatory layout on every authenticated screen)

The app header (top bar) is shared across every authenticated screen and follows this exact layout, from left to right:

1. **Sandwich / menu button** (hamburger icon) — opens the side drawer / main navigation. Use `lucide-react-native`'s `Menu` icon or `@expo/vector-icons` `Feather`/`menu`. Tappable area: 44×44px minimum (iOS HIG).
2. **Xendora logo** — placed immediately to the right of the menu button (still on the left half of the header). Tapping the logo navigates to `/` (transactions home).
3. **Spacer** (`flex: 1`) — pushes the next item to the far right.
4. **User profile icon** — circular avatar (32×32) on the far right. Tapping it opens the profile / account menu (logout, settings, etc.).

#### Logo asset

- Source URL (reference, signed/ephemeral — **do not** use directly at runtime):
  `https://img.notionusercontent.com/s3/prod-files-secure%2F67d43781-47af-4f65-a193-9790b7a54930%2F8d3d099c-1c00-4b67-8ae8-d4f3611127c0%2FXendora_Logo_color_hor.svg/size/?exp=1778001130&sig=ULAogaMeHo5Wi8Go6fHCEsnjgWLErEVZ2O9aTHk3mSc&id=354ccccd-aa4b-8036-be4a-c2e1a60a6ed3&table=block&mtd=so`
- Save the SVG locally as `assets/logo/xendora-logo-horizontal.svg` and import it via `react-native-svg` / `react-native-svg-transformer` (or use the PNG fallback `assets/logo/xendora-logo-horizontal.png` for environments without the SVG transformer).
- Render at **24px height**, width auto. Color must remain the original brand color (do NOT recolor to the primary gray).

#### Header reference structure

```tsx
<SafeAreaView edges={['top']}>
  <View style={styles.header}>
    <Pressable onPress={openDrawer} hitSlop={8}>
      <Menu size={24} color={colors.primary} />
    </Pressable>

    <Pressable onPress={() => router.replace('/')}>
      <XendoraLogo height={24} />
    </Pressable>

    <View style={{ flex: 1 }} />

    <Pressable onPress={openProfileMenu} hitSlop={8}>
      <Avatar size={32} uri={user?.avatarUrl} />
    </Pressable>
  </View>
</SafeAreaView>
```

Header height: **56px** (excluding the safe-area top inset). Horizontal padding: **16px**. Background: `#FFFFFF` (or surface token in dark mode). Bottom border: `1px solid rgba(62, 65, 70, 0.08)`.

## FONT NEEDS TO BE

```css
html :is(.font-lato) {
    family: Lato, sans-serif;
}
```

In React Native, load **Lato** via `expo-font` (`@expo-google-fonts/lato`) and apply it as the default font family across all `<Text>` components. Provide weights: `Regular (400)`, `Bold (700)`, and `Black (900)`.

## COLORS NEED TO BE

- **Primary color** — `rgb(62, 65, 70)` — used for primary text, headings, and dark UI surfaces.
- **Secondary color** — `rgb(122, 93, 233)` — used for buttons, action / detail links, focus borders, and accent details.

A theme tokens file should expose:

```ts
export const colors = {
  primary: 'rgb(62, 65, 70)',
  secondary: 'rgb(122, 93, 233)',
  // plus neutral grays, success / error / warning derived from the primary palette
};
```

## LIBRARY REQUIREMENTS

- **State management / data fetching: React Query** (`@tanstack/react-query`) is mandatory. No Redux / Zustand / Context replacements for server state.
- **All API calls must use the base URL defined in `.env`** (`EXPO_PUBLIC_API_URL`). Hardcoding any URL in the source is forbidden.
- **All sensitive / environment data lives in `.env`**: API URL, test credentials, any future API keys. The `.env` file is listed in `.gitignore` and must never be committed.

---

## 4. ENVIRONMENT VARIABLES

The following variables are required and live in `.env` (which is git-ignored). A safe-to-commit `.env.example` documents the shape.

| Key                              | Description                                                |
| -------------------------------- | ---------------------------------------------------------- |
| `EXPO_PUBLIC_API_URL`            | Dev API base URL — `https://dev.xendora.com/api`           |
| `EXPO_PUBLIC_API_PROD_URL`       | Prod API base URL — `https://xendora.com/api`              |
| `EXPO_PUBLIC_TEST_USER_EMAIL`    | Test account email used by the login flow                  |
| `EXPO_PUBLIC_TEST_USER_PASSWORD` | Test account password used by the login flow               |

> The `EXPO_PUBLIC_` prefix is required by Expo to expose the variable to the JS bundle at build time.

---

## 5. Required folder layout (recommended)

```
src/
  api/                # axios/fetch client, query keys, endpoint wrappers
  features/
    auth/             # login, token storage (expo-secure-store)
    transactions/     # list, search, filters, details bottom sheet
  components/         # reusable UI primitives (Button, Input, Pill, Row…)
  theme/              # colors, spacing, typography (Lato)
  hooks/
  utils/
app/                  # expo-router routes (if using expo-router)
```

---

## 6. Acceptance checklist — Core

- [ ] App launches via `npx expo start` with no extra manual steps beyond `.env` and `npm install`.
- [ ] Login flow consumes credentials from `.env`, stores token securely.
- [ ] Transactions list renders with loading / empty / error states explicitly handled.
- [ ] Search input filters by counterparty, combinable with filters.
- [ ] Asset filter and Status filter dropdowns work and combine.
- [ ] Tapping a row opens a bottom sheet with extended details.
- [ ] Lato font is applied globally.
- [ ] Primary `rgb(62, 65, 70)` and secondary `rgb(122, 93, 233)` colors are respected.
- [ ] React Query is used for all server state; no other server-state library is used.
- [ ] No URL is hardcoded — every base URL comes from `process.env.EXPO_PUBLIC_API_URL`.
- [ ] `.env` is git-ignored; `.env.example` is committed.
- [ ] Header on every authenticated screen renders **menu button (left) → Xendora logo → spacer → profile icon (right)**, height 56px, with the brand SVG/PNG logo at 24px height.

---

## 7. Acceptance checklist — Extended

Every item that `test-spec.md` listed under "Nice to have" is **promoted to a hard acceptance criterion** for this project. Same checkbox structure as the core checklist.

- [ ] **Pagination / infinite scroll** — implemented via React Query's `useInfiniteQuery`, with the page size driven by the API and the next page fetched as the user nears the bottom of the list.
- [ ] **Pull-to-refresh** — `RefreshControl` on the transactions list, triggers a `queryClient.invalidateQueries` on the transactions key.
- [ ] **Skeleton loaders** — shown while the first page is loading and on refetch; one skeleton row per expected list row, matching the real row's layout (avatar / counterparty / amount / status pill).
- [ ] **Sorting** — at minimum by **date** (default, descending) and by **amount** (asc / desc). Sort UI lives in the filter bar.
- [ ] **Tests** — at least one of: unit tests for utils / hooks (Jest), component tests for the list row and filter bar (React Native Testing Library), or e2e (Maestro / Detox). Cover loading / empty / error states for the list.
- [ ] **Light / dark theme support** — driven by `useColorScheme()`, with a tokenized theme (no hardcoded colors except the two locked brand tokens). Header, list, filters, and bottom sheet all respect the active theme.
- [ ] **Persistence of last applied filters** — search query, asset filter, status filter, and sort persist across app restarts (via `expo-secure-store` or `AsyncStorage`), and are rehydrated on launch.

---

## 8. Deliverables (per `test-spec.md`)

1. A public Git repository with the solution.
2. A `README.md` covering: how to run, architecture summary, decisions, what would be improved with more time. (See `README.md` in this repo.)
3. A short screen recording of the app running (under 3 minutes).
