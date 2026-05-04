# Technical Challenge — React Native Developer

![Xendora Logo color hor.svg](attachment:8d3d099c-1c00-4b67-8ae8-d4f3611127c0:Xendora_Logo_color_hor.svg)

Welcome, and thanks for taking the time to work on this challenge. This document describes a small project that simulates the kind of work you would be doing on our team. The goal is not only to deliver working code, but also to give us a window into how you think, structure problems, and reason about trade-offs.

[]()

## Overview

You will build a **Transactions List** screen for a fintech-style mobile app. Users should be able to browse their recent transactions, search through them, filter by asset and status, and tap into any transaction to see additional details inline.

The screen should be built as a React Native app using **Expo**.

## Stack

- **React Native + Expo** (managed workflow is fine)
- **TypeScript** is required
- Any state management or data-fetching library you prefer (React Query, Zustand, Redux, Context, etc.) — be ready to justify your choice
- Any styling approach you prefer (StyleSheet, Tamagui, NativeWind, styled-components, etc.)

## API

The base URL for all API calls is:

**`https://xendora.com/api`**
 
You will consume the unified transactions endpoint:

**`GET https://dev.xendora.com/api/docs#/Transactions/TransactionsController_listUnified`**

Refer to the Swagger docs for the request/response shape and query parameters. Part of the challenge is reading the spec and deciding what belongs on the client vs. what should be delegated to the server.

### Authentication

The transactions endpoint is authenticated via **Bearer token**. You can obtain a token by calling the login endpoint:

**`POST https://dev.xendora.com/api/docs#/Users/UserController_login`**

Use the following test credentials:

- **Email:** `guiyshd@gmail.com`
- **Password:** `XKB!meh_cwd9zre4wmk`

How you handle the token (where you store it, how you refresh it, whether you build a real auth flow or hardcode it for the challenge) is up to you — just be ready to explain the call. Do not commit the credentials to your repository; use an `.env` file or equivalent.

## Requirements

### Core

1. **Transactions list**
    - Render the user’s transactions in a scrollable list.
    - Each row should show: type (Send / Receive / Swap, Crypto / Fiat), counterparty (or asset pair for swaps), status, date & time, and amount with the asset.
    - Handle loading, empty, and error states explicitly.
2. **Text search**
    - A search input that filters transactions by counterparty.
    - Decide whether filtering happens client-side, server-side, or both — and be ready to explain why.
3. **Filter dropdowns**
    - **Asset filter**: filter by the asset involved in the transaction (USDC, USD, BTC, EUR, etc.).
    - **Status filter**: filter by transaction type (Withdrawal, Deposit, Exchange, etc.).
    - Filters should be combinable with the search input.
4. **Transaction details**
    
    Tapping a row should open an action sheet (bottom sheet) revealing additional details about the transaction: transaction ID (hash), sending address, account, network, etc.
    The choice of library or implementation approach is up to you — be ready to justify it.
    

Nice to have

*These are not required, but feel free to tackle any that you find interesting:

- Pagination or infinite scroll
- Pull-to-refresh
- Skeleton loaders
- Sorting (by date, amount, etc.)
- Tests (unit, component, or e2e — your choice)
- Light/dark theme support
- Persistence of the last applied filters

## What we are evaluating

We care about the following, roughly in this order:

1. **Code quality** — readability, structure, naming, separation of concerns, TypeScript usage.
2. **Product thinking** — how you handle edge cases, error states, and UX details that were not explicitly spelled out.
3. **Technical decision-making** — the choices you made and why. We are less interested in “the right answer” than in seeing that you considered alternatives.
4. **React Native fundamentals** — list performance, gesture handling, platform-aware UI, navigation if used.
5. **Communication** — your README and the walkthrough during the follow-up call.

## Deliverables

1. A public Git repository (GitHub, GitLab, or Bitbucket) with your solution.
2. A `README.md` containing:
    - How to run the project (`expo start`, environment variables, etc.).
    - A short summary of the architecture and the main decisions you made.
    - Anything you would do differently or improve given more time.
3. A short screen recording (Loom, native screen recording, whatever is easiest) of the app running on a simulator or device. Keep it under 3 minutes.

## Follow-up call

After we review your submission, we will schedule a follow-up call. **A core part of the evaluation is your ability to walk us through the solution, explain your technical choices, and discuss the trade-offs you made.** Be prepared to:

- Give a quick demo of the app.
- Walk through the project structure and explain why you organized it that way.
- Discuss what you would change if this were going to production, what you intentionally left out, and where you see the main risks or weak points in your implementation.

There are no trick questions — we just want to understand how you think.

[]()

---

If anything is unclear or you have questions about the API or the requirements, reach out. Good luck, and have fun with it.