#!/usr/bin/env bash
set -euo pipefail

APP_NAME="${APP_NAME:-asy-syifaa}"
BRANCH="${BRANCH:-main}"
REPO_URL="${REPO_URL:-https://github.com/brontolano/asy-syifaa-.git}"
DEPLOY_ROOT="${DEPLOY_ROOT:-$HOME/deploy/$APP_NAME}"
WEB_ROOT="${WEB_ROOT:-$HOME/domains/asy-syifaa.com/public_html}"

echo "[deploy] app=$APP_NAME branch=$BRANCH"
echo "[deploy] deploy_root=$DEPLOY_ROOT"
echo "[deploy] web_root=$WEB_ROOT"

mkdir -p "$(dirname "$DEPLOY_ROOT")"

if [ -d "$DEPLOY_ROOT/.git" ]; then
  git -C "$DEPLOY_ROOT" fetch --all --prune
  git -C "$DEPLOY_ROOT" checkout "$BRANCH"
  git -C "$DEPLOY_ROOT" reset --hard "origin/$BRANCH"
else
  rm -rf "$DEPLOY_ROOT"
  git clone --branch "$BRANCH" "$REPO_URL" "$DEPLOY_ROOT"
fi

if [ -d "$DEPLOY_ROOT/frontend" ]; then
  mkdir -p "$WEB_ROOT"
  rsync -a --delete "$DEPLOY_ROOT/frontend/" "$WEB_ROOT/"
fi

if [ -f "$WEB_ROOT/web/index.php" ]; then
  cp "$WEB_ROOT/web/index.php" "$WEB_ROOT/index.php"
fi

if command -v docker >/dev/null 2>&1 && [ -f "$DEPLOY_ROOT/docker-compose.yml" ]; then
  echo "[deploy] docker compose detected, reloading stack..."
  docker compose -f "$DEPLOY_ROOT/docker-compose.yml" up -d --build
elif command -v pm2 >/dev/null 2>&1; then
  echo "[deploy] pm2 detected, reloading app..."
  pm2 startOrReload "$DEPLOY_ROOT/ecosystem.config.js" --update-env || true
elif command -v systemctl >/dev/null 2>&1; then
  echo "[deploy] systemd detected (no service name configured), skipping restart."
else
  echo "[deploy] no process manager detected, static sync complete."
fi

HASH="$(git -C "$DEPLOY_ROOT" rev-parse --short HEAD)"
DATE="$(date '+%Y-%m-%d %H:%M:%S')"
echo "[deploy] done commit=$HASH at $DATE"
