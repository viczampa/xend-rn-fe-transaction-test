# Xendora — Transactions List (Expo + TypeScript)

## How to run

**Prerequisites:** Node.js **20 LTS** and npm (see `package.json` for Expo SDK **54** / React Native **0.81**).

```bash
git clone https://github.com/viczampa/xend-rn-fe-transaction-test.git
cd xend-rn-fe-transaction-test
cp .env.example .env ( solicitar a .env ao desenvolvedor responsável ou preencher a .env example com os dados )

npm install
npx expo start ou npm run start:lan ou npx expo start --clear

Caso enfrente problemas com congestionamento do ngrok, a execução do app no celular ( expo go ) vai falhar pra corrigir isso, basta instalar o cloudflared tunnel;

cloudflared tunnel --url http://localhost:8081
Pegar o subdomínio gerado do tunnel executar o expo em tunnel próprio
npm run start:with-proxy -- https://PASTE-SUBDOMAIN.trycloudflare.com
```


A página de login carrega os dados da `.env` pra facilitar o processo de login.

## Gerenciamento de estado no login

O login token foi armazenado com a lib própria do react 'react context' pois como trata-se de um token único de autenticação, e a frequência de atualização ser baixa, não vi necessidade em instalar o redux ou similar.

Porém quando a aplicação roda no celular me utilizei da ferramenta expo-secure-store para armazenar o token do login ( authTokenStorage.js )


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
- **Product:** Implementaria o glue stack e o sentry dado que são stacks atuais da empresa até para entendimento de implementação e teste das ferramentas

---

## License

Built for the Xendora technical challenge — not intended for production.


**Tests:**

```bash
npm test
```

---
