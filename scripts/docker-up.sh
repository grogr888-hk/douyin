#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/.."
if [ ! -f .env ]; then
  read -p "请输入 JWT_SECRET(强随机字符串): " JWT
  echo "JWT_SECRET=${JWT}" > .env
  echo "已生成 .env"
fi
docker compose build
docker compose up -d
echo "服务已启动: http://<你的服务器IP或域名>"