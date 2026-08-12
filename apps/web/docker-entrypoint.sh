#!/bin/sh
set -eu

if [ ! -f node_modules/.pnpm-state.yaml ]; then
  pnpm install
fi

exec "$@"
