#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <env>" >&2
  echo "Example: $0 prod" >&2
  echo "Example: $0 dev" >&2
  exit 1
fi

ENV="$1"
STACK_NAME="ServerlessApiStack-$ENV"

echo "⚠️  WARNING: This will destroy the entire infrastructure for environment: $ENV"
echo "Stack name: $STACK_NAME"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo "Destroy cancelled."
  exit 0
fi

echo "🗑️  Destroying infrastructure for environment: $ENV"

# Build the project first
npm run build:all

# Destroy the stack
cdk destroy --context env="$ENV" --require-approval never

echo "✅ Infrastructure destroyed successfully for environment: $ENV" 