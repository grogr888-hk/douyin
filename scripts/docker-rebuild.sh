#!/usr/bin/env bashset -e
cd "$(dirname "$0")/.."docker compose build --no-cache
docker compose up -decho "已重新构建并