#!/bin/bash
set -e

echo "🚀 Starting CI/CD deployment..."

# Build the project
echo "📦 Building project..."
npm run build:all

# Bootstrap CDK if needed
echo "🔧 Bootstrapping CDK..."
cdk bootstrap

# Deploy without requiring approval
echo "🚀 Deploying to AWS..."
cdk deploy --context env=$1 --require-approval never

echo "✅ Deployment completed successfully!"