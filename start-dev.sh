#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
export DATABASE_URL="${DATABASE_URL:-file:$(pwd)/dev.db}"
export NEXTAUTH_URL="${NEXTAUTH_URL:-http://localhost:3000}"
export NEXTAUTH_SECRET="${NEXTAUTH_SECRET:-dev-secret-change-me-min-32-chars-long}"
exec npx next dev -p "${PORT:-3000}" -H 0.0.0.0
