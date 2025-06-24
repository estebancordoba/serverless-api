#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <env>" >&2
  exit 1
fi

npm run build:all
cdk bootstrap
cdk deploy --context env="$1"
