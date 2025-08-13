#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/.."
docker compose build --no-cache
docker compose up -d
echo "已重新构建并启动"