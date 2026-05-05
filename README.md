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

Porém quando a aplicação roda no celular utilizei da ferramenta expo-secure-store para armazenar o token do login ( authTokenStorage.js tem as validações de web ou mobile para direcionar o armazenamento )


## Arquitetura e decisões base da aplicação

**Routing:** Utilização do expo-router para gerenciamento de rotas do app.

**Layout:**

Padronizei as cores / tipografia como base do site da xendora.

Utilizei o stylesheet padrão do react native por uma abordagem de sempre tentar utilizar as libs nativas e evitar importar muitas ferramentas e libs desconhecidas. Abaixo uma lista das libs utilizadas para cada arquivo do projeto

| `app/` | Routes: auth gate, login, main shell |
| `src/api/` | Axios client, `Bearer` injection, React Query keys, `GET /transactions` wrapper |
| `src/features/auth/` | Login + `AuthProvider`; token in **Secure Store** (native) / AsyncStorage (web) |
| `src/features/transactions/` | List, filters, row, **`@gorhom/bottom-sheet`** details, pure filter/sort helpers |
| `src/components/` | Shared UI (header, badges, empty state, logo) |
| `src/theme/` | Colors, typography (**Lato**), light/dark |

**Escolhas das bibliotecas e o porque**

- **TanStack React Query** — `useInfiniteQuery` pra paginação -> eu não conhecia o react query, porém ele realmente 'revolucionou' o front-end, que antigamente era tudo com; useEffect, useState / isLoading / isError, com ele a gente reduz o nível de requisição e além de armazenar em cache 'Persisters'
 - **Context** — utilizei para guardar os dados do tema e o token, como já dito acima, não julguei necessário o redux pra armazenar essas informações dado a simplicidade delas ( estilo e token auth )
- **`StyleSheet`** — utilizei a lib padrão do react native `src/theme/`.
- **Client-side search/filters** — sobre os filtros 

---

## O que eu faria com mais tempo de desenvolvimento

- **API:** Teria feito todos os filtros com os endpoints / filtros da própria api que tem disponível, e faria no front-end apenas o que realmente não tivesse na API, mas abriria solicitação pro time de back-end se a lista de transação ficasse muito grande, como eram apenas 12 transações, fazer tudo no front-end não impactou na performance.

- **Paginação** : Como tinhamos apenas 12 transações acabou que a paginação em si sequer fora implementada, ( não tinha page 2,3 na api ) até considerei limitar o layout pra 6 transações e ao scrollar pra baixo carregar as 6 transações, porém tiraria total a usabilidade atual do list view além de ter que esticar bem as rows, mas considerando uma massa de transações a partir de 30+ transações já seria mais interessante bolar algúm metodo de armazenamento e busca async da lista para evitar travamento durante busca em lista interna dado que não temos todos os endpoints de busca.

- **Auth:** Criaria toda uma estrutura de validação e recaptacha vivendo apenas no front end para evitar brute-force e travas de segurança no front-end mesmo sem demandar do back. 

- **Product:** Implementaria o glue stack e o sentry dado que são stacks atuais da empresa até para entendimento de implementação e teste das ferramentas

---

## Teste unitário
npm test
```

---
