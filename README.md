# Xendora — Transactions List (React Native + Expo)

A small fintech-style **Transactions List** built with **React Native + Expo + TypeScript** for the Xendora technical challenge.

> Full requirements live in [`test-spec.md`](./test-spec.md). The locked design / library decisions live in [`main-spec.md`](./main-spec.md).

---

## TL;DR — "Just execute this project"

Pick the block that matches your OS, **paste it as-is** into a terminal. It installs every prerequisite (Node, npm, Watchman, Git), clones the repo, sets up `.env`, installs all JS dependencies (which include Expo SDK 52 and React Native 0.76), and starts the dev server.

> Replace `REPO_URL` once at the top of the block — that's the only edit you need.

---

## Versions installed by these scripts

| Tool                | Version                       | Source                                  |
| ------------------- | ----------------------------- | --------------------------------------- |
| Node.js             | **20 LTS**                    | nvm (macOS / Linux) or winget (Windows) |
| npm                 | bundled with Node 20          | —                                       |
| Watchman            | latest                        | Homebrew (macOS) / apt (Linux) — optional on Windows |
| Git                 | latest                        | Homebrew / apt / winget                 |
| Expo SDK            | **52.x**                      | `package.json` → `npm install`          |
| React Native        | **0.76.x**                    | pinned by Expo SDK 52                   |
| React               | **18.3.x**                    | `package.json`                          |
| TypeScript          | **5.x**                       | `package.json`                          |
| Expo CLI            | invoked via `npx expo …`      | no global install needed                |

---

## macOS — full one-paste install

Copy everything between the dashes and paste it into Terminal. It will prompt for `sudo` once when Homebrew installs.

```bash
# ─── EDIT THIS ──────────────────────────────────────────
REPO_URL="https://github.com/<your-user>/xend-rn-fe-transaction-test.git"
# ────────────────────────────────────────────────────────

set -e

# 1. Install Homebrew if missing
if ! command -v brew >/dev/null 2>&1; then
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  # Add brew to PATH for the rest of this script (Apple Silicon path)
  if [ -d /opt/homebrew/bin ]; then eval "$(/opt/homebrew/bin/brew shellenv)"; fi
fi

# 2. Install Git + Watchman
brew install git watchman

# 3. Install nvm + Node 20 + npm
if [ ! -d "$HOME/.nvm" ]; then
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
fi
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 20
nvm use 20
nvm alias default 20

# 4. Clone & enter the project
git clone "$REPO_URL" xend-rn-fe-transaction-test
cd xend-rn-fe-transaction-test

# 5. Set up environment file
[ -f .env ] || cp .env.example .env

# 6. Install JS dependencies (pulls Expo SDK 52, React Native 0.76, etc.)
npm install

# 7. Start the dev server
npx expo start
```

---

## Ubuntu / Debian Linux — full one-paste install

```bash
# ─── EDIT THIS ──────────────────────────────────────────
REPO_URL="https://github.com/<your-user>/xend-rn-fe-transaction-test.git"
# ────────────────────────────────────────────────────────

set -e

# 1. System packages
sudo apt update
sudo apt install -y curl git build-essential ca-certificates

# 2. (Optional but recommended) Watchman — improves file-watch performance
sudo apt install -y watchman || true

# 3. nvm + Node 20 + npm
if [ ! -d "$HOME/.nvm" ]; then
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
fi
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 20
nvm use 20
nvm alias default 20

# 4. Clone & enter the project
git clone "$REPO_URL" xend-rn-fe-transaction-test
cd xend-rn-fe-transaction-test

# 5. Set up environment file
[ -f .env ] || cp .env.example .env

# 6. Install JS dependencies (pulls Expo SDK 52, React Native 0.76, etc.)
npm install

# 7. Start the dev server
npx expo start
```

---

## Windows 10 / 11 (PowerShell) — full one-paste install

Open **Windows PowerShell as Administrator** and paste the whole block.

```powershell
# ─── EDIT THIS ──────────────────────────────────────────
$REPO_URL = "https://github.com/<your-user>/xend-rn-fe-transaction-test.git"
# ────────────────────────────────────────────────────────

$ErrorActionPreference = "Stop"

# 1. Install Node 20 LTS + Git via winget
winget install --id OpenJS.NodeJS.LTS  -e --silent --accept-source-agreements --accept-package-agreements
winget install --id Git.Git             -e --silent --accept-source-agreements --accept-package-agreements

# 2. Refresh the current PowerShell session's PATH so node / git become callable now
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" +
            [System.Environment]::GetEnvironmentVariable("Path","User")

# 3. Clone & enter the project
git clone $REPO_URL xend-rn-fe-transaction-test
Set-Location xend-rn-fe-transaction-test

# 4. Set up environment file
if (-not (Test-Path .env)) { Copy-Item .env.example .env }

# 5. Install JS dependencies (pulls Expo SDK 52, React Native 0.76, etc.)
npm install

# 6. Start the dev server
npx expo start
```

> **Tip (Windows):** if you plan to run an Android emulator locally, also install Android Studio (`winget install Google.AndroidStudio`) and create an AVD via the Device Manager.

---

## What to do once `npx expo start` is running

A QR code will appear in the terminal. From here you can:

- Scan the QR code with the **Expo Go** app (iOS / Android) — fastest path.
- Press **`i`** to launch the iOS simulator (macOS + Xcode required).
- Press **`a`** to launch an Android emulator (Android Studio required).
- Press **`w`** to launch the web preview.

Then log in. The login screen pre-fills the test credentials from `.env`. Tap **Sign in** and you should land on the **Transactions** list.

---

## Environment variables

The app reads its base URL and test credentials from `.env` (git-ignored). The `cp .env.example .env` step in the install scripts above creates it. The keys are:

| Key                              | What it is                                         | Default for the challenge                |
| -------------------------------- | -------------------------------------------------- | ---------------------------------------- |
| `EXPO_PUBLIC_API_URL`            | Dev API base URL                                   | `https://dev.xendora.com/api`            |
| `EXPO_PUBLIC_API_PROD_URL`       | Prod API base URL                                  | `https://xendora.com/api`                |
| `EXPO_PUBLIC_TEST_USER_EMAIL`    | Test login email                                   | `guiyshd@gmail.com`                      |
| `EXPO_PUBLIC_TEST_USER_PASSWORD` | Test login password                                | *(see `test-spec.md`)*                   |

> The `EXPO_PUBLIC_` prefix is what makes Expo expose the variable to the JavaScript bundle at build time. Anything **without** that prefix stays server-side only.

---

## Useful scripts (after install)

```bash
npx expo start            # start dev server
npx expo start --clear    # start dev server, clearing Metro cache
npx expo start --tunnel   # use a tunnel (useful on restrictive networks)
npx expo run:ios          # build & run on iOS simulator (requires prebuild)
npx expo run:android      # build & run on Android emulator (requires prebuild)
npm run typecheck         # if a tsc script is configured
npm test                  # if tests are configured
```

---

## Project architecture (short summary)

```
src/
  api/                # axios/fetch client, React Query keys, endpoint wrappers
  features/
    auth/             # login flow + token storage (expo-secure-store)
    transactions/     # list screen, search, filters, details bottom sheet
  components/
    Header/           # menu button + Xendora logo + profile icon
    …                 # other reusable UI primitives
  theme/              # colors, spacing, typography (Lato via expo-font)
  hooks/
  utils/
assets/
  logo/               # xendora-logo-horizontal.svg / .png (rendered in the header)
app/                  # expo-router routes (if using expo-router)
```

Key decisions:

- **React Query** is the only server-state library. Pagination uses `useInfiniteQuery`.
- **All API base URLs come from `.env`** — no URL is hardcoded.
- **Token** is stored via `expo-secure-store` and attached as a `Bearer` header by the API client.
- **Bottom sheet** for transaction details uses `@gorhom/bottom-sheet`.
- **Font** is **Lato** loaded with `@expo-google-fonts/lato`.
- **Colors** are token-based: primary `rgb(62, 65, 70)`, secondary `rgb(122, 93, 233)`.
- **Header** on every authenticated screen: menu button (left) → Xendora logo → spacer → profile icon (right). See `main-spec.md` for the locked structure.

See [`main-spec.md`](./main-spec.md) for the full locked spec.

---

## Troubleshooting

| Symptom                                              | Fix                                                             |
| ---------------------------------------------------- | --------------------------------------------------------------- |
| `Unable to resolve module …`                         | `rm -rf node_modules && npm install && npx expo start --clear`  |
| `EXPO_PUBLIC_API_URL is undefined` at runtime        | Make sure `.env` exists at the **project root** and the variable name starts with `EXPO_PUBLIC_`. Restart the bundler after editing `.env`. |
| 401 from `/transactions`                             | Token expired — log out and back in.                            |
| iOS simulator won't open                             | Open Xcode once, accept the license, install the iOS platform.  |
| Android emulator won't open                          | Start Android Studio → Device Manager → launch an AVD first.    |
| QR code scan does nothing                            | Phone and computer must be on the **same Wi-Fi**, or use `--tunnel`. |
| `command not found: nvm` after install               | Open a **new terminal**, or `source ~/.nvm/nvm.sh`.             |
| Windows: `npm` not recognized after winget install   | Open a **new PowerShell** window (PATH refresh) and try again.  |

---

## What I'd improve with more time

- Real auth flow (refresh tokens, logout, re-auth on 401).
- More granular skeleton loaders per row.
- Component / e2e tests (Maestro or Detox).

---

## License

This project is built solely for the Xendora technical challenge and is not intended for production use.
