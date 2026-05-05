#!/usr/bin/env bash
# Run Metro in LAN mode but advertise a public URL (for Expo Go when LAN/WSL2 won't work).
# 1) In another terminal: cloudflared tunnel --url http://localhost:8081
# 2) Copy the printed https://.... URL (origin only, no path)
# 3) npm run start:with-proxy -- https://YOUR-SUBDOMAIN.trycloudflare.com

set -euo pipefail

if [[ -z "${1:-}" ]]; then
  echo "Usage: npm run start:with-proxy -- <https://your-tunnel-host>"
  echo ""
  echo "Before that, in a second terminal, run:"
  echo "  cloudflared tunnel --url http://localhost:8081"
  echo "Use the HTTPS URL it prints (trycloudflare.com or your domain)."
  exit 1
fi

export EXPO_PACKAGER_PROXY_URL="$1"
shift || true
exec npx expo start --lan "$@"
