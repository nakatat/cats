#!/usr/bin/env bash

set -euo pipefail

WEB_DIR=/workspace/apps/web
NEXT_BIN="$WEB_DIR/node_modules/.bin/next"
STORYBOOK_BIN="$WEB_DIR/node_modules/.bin/storybook"
PROJECT_LOCKFILE="$WEB_DIR/pnpm-lock.yaml"
INSTALLED_LOCKFILE="$WEB_DIR/node_modules/.pnpm/lock.yaml"

prepare_frontend_dependencies() {
  if [[ -x "$NEXT_BIN" && -x "$STORYBOOK_BIN" && -f "$INSTALLED_LOCKFILE" ]] \
    && cmp -s "$PROJECT_LOCKFILE" "$INSTALLED_LOCKFILE"; then
    echo "[cats-dev] Frontend dependencies are ready; skipping install."
    return
  fi

  echo "[cats-dev] Installing frontend dependencies with the frozen lockfile."
  pnpm --dir "$WEB_DIR" install --frozen-lockfile

  if [[ ! -x "$NEXT_BIN" || ! -x "$STORYBOOK_BIN" ]]; then
    echo "[cats-dev] Frontend install completed without the Next.js or Storybook binary." >&2
    exit 1
  fi
}

if [[ "$(id -u)" -eq 0 ]]; then
  mkdir -p \
    "$WEB_DIR/node_modules" \
    "$WEB_DIR/.next" \
    /home/vscode/.m2

  chown -R vscode:vscode \
    "$WEB_DIR/node_modules" \
    "$WEB_DIR/.next" \
    /home/vscode/.m2

  exec su -s /bin/bash vscode -c 'bash /workspace/.devcontainer/workspace-entrypoint.sh'
fi

cd /workspace
prepare_frontend_dependencies
exec bash .devcontainer/start-services.sh
