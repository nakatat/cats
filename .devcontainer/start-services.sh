#!/usr/bin/env bash

set -u

LOG_DIR=/tmp/cats-dev
mkdir -p "$LOG_DIR"
rm -f "$LOG_DIR"/*.pid

if [[ ! -x /workspace/apps/web/node_modules/.bin/next \
  || ! -x /workspace/apps/web/node_modules/.bin/storybook ]]; then
  echo "[cats-dev] Frontend dependencies are not ready; run the workspace entrypoint first." >&2
  exit 1
fi

start_service() {
  local name="$1"
  local log_file="$LOG_DIR/$name.log"
  local pid_file="$LOG_DIR/$name.pid"
  shift

  "$@" >"$log_file" 2>&1 &
  echo $! >"$pid_file"
}

start_service api mvn -f apps/api/pom.xml spring-boot:run
start_service next pnpm --dir apps/web dev
start_service storybook pnpm --dir apps/web exec storybook dev -p 6006 --host 0.0.0.0

cleanup() {
  kill "$api_pid" "$next_pid" "$storybook_pid" 2>/dev/null || true
  wait "$api_pid" "$next_pid" "$storybook_pid" 2>/dev/null || true
}

api_pid=$(<"$LOG_DIR/api.pid")
next_pid=$(<"$LOG_DIR/next.pid")
storybook_pid=$(<"$LOG_DIR/storybook.pid")
trap cleanup EXIT INT TERM

wait -n "$api_pid" "$next_pid" "$storybook_pid"
