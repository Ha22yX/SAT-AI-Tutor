#!/usr/bin/env bash
set -euo pipefail

: "${BACKEND_PORT:=5080}"
: "${FRONTEND_PORT:=3000}"
: "${HOST:=0.0.0.0}"
: "${FLASK_CONFIG:=production}"
: "${DATABASE_URL:=sqlite+pysqlite:////data/sat_ai_tutor.db}"
: "${NEXT_PUBLIC_API_BASE:=/api}"
: "${API_BASE:=http://127.0.0.1:${BACKEND_PORT}}"

export FLASK_CONFIG DATABASE_URL NEXT_PUBLIC_API_BASE API_BASE

mkdir -p /data

cd /app/sat_platform
gunicorn --bind "127.0.0.1:${BACKEND_PORT}" app:app &
backend_pid=$!

cd /app/frontend
export PORT="${FRONTEND_PORT}"
export HOSTNAME="${HOST}"
npm run start &
frontend_pid=$!

term() {
  kill "${backend_pid}" "${frontend_pid}" 2>/dev/null || true
}

trap term INT TERM EXIT

wait -n "${backend_pid}" "${frontend_pid}"
status=$?
term
wait "${backend_pid}" 2>/dev/null || true
wait "${frontend_pid}" 2>/dev/null || true
exit "${status}"
