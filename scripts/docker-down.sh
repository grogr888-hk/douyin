#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/.."
docker compose down
echo "已停止容器(数据卷未删除)"