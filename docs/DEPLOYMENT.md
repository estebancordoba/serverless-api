# Deployment Configuration Guide

This guide explains how to set up automated deployment to AWS when merging to the `main` branch.

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **GitHub Repository** with the project code
3. **AWS CLI** configured locally (for initial setup)

## Step 1: Create AWS IAM User for GitHub Actions

Create a dedicated IAM user for GitHub Actions with the following permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "cloudformation:*",
                "lambda:*",
                "apigateway:*",
                "dynamodb:*",
                "iam:*",
                "logs:*",
                "s3:*"
            ],
            "Resource": "*"
        }
    ]
}
```

**Or use the AWS managed policy:** `AdministratorAccess` (for simplicity, but consider least privilege in production)

## Step 2: Generate AWS Access Keys

1. Go to AWS IAM Console
2. Select the user created in Step 1
3. Go to "Security credentials" tab
4. Click "Create access key"
5. Choose "Application running outside AWS"
6. Copy the Access Key ID and Secret Access Key

## Step 3: Configure GitHub Secrets

In your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add the following secrets:

| Secret Name | Value |
|-------------|-------|
| `AWS_ACCESS_KEY_ID` | Your AWS Access Key ID |
| `AWS_SECRET_ACCESS_KEY` | Your AWS Secret Access Key |
| `AWS_REGION` | Your AWS region (e.g., `us-east-1`) |

## Step 4: Configure GitHub Environment (Optional but Recommended)

1. Go to **Settings** → **Environments**
2. Click **New environment**
3. Name it `production`
4. Configure protection rules if needed:
   - **Required reviewers**: Add team members who must approve deployments
   - **Wait timer**: Add delay before deployment (optional)
   - **Deployment branches**: Restrict to `main` branch

## Step 5: Bootstrap CDK (One-time setup)

Run this command locally to bootstrap CDK in your AWS account:

```bash
npm run build:all
cdk bootstrap
```

## Step 6: Test the Setup

1. Make a small change to your code
2. Commit and push to `main`
3. Go to **Actions** tab in GitHub
4. Monitor the workflow execution
5. Check that deployment completes successfully

## Workflow Details

The CI/CD pipeline (`.github/workflows/ci-cd.yml`) does the following:

### For Pull Requests

- Builds the project
- Runs tests
- **No deployment**

### For Push to Main

- Builds the project
- Runs tests
- Deploys to production
- Comments deployment info on the commit

## Troubleshooting

### Common Issues

1. **CDK Bootstrap Error**: Run `cdk bootstrap` locally first
2. **Permission Denied**: Check IAM user permissions
3. **Region Mismatch**: Ensure `AWS_REGION` secret matches your target region
4. **Stack Name Conflict**: Ensure no existing stack with the same name

### Debugging

1. Check GitHub Actions logs for detailed error messages
2. Verify AWS credentials are correct
3. Ensure CDK is bootstrapped in the target region
4. Check CloudFormation console for stack deployment status

## Security Best Practices

1. **Use least privilege**: Create specific IAM policies instead of AdministratorAccess
2. **Rotate keys regularly**: Update AWS access keys periodically
3. **Environment protection**: Use GitHub environment protection rules
4. **Audit logs**: Monitor CloudTrail for deployment activities
5. **Secrets management**: Consider using AWS Secrets Manager for production

## Manual Deployment

If you need to deploy manually:

```bash
# Development
npm run deploy:dev

# Production
npm run deploy:prod
```

## Rollback

To rollback a deployment:

1. Go to AWS CloudFormation console
2. Select your stack
3. Click "Create change set for current stack"
4. Choose "Rollback" option
5. Execute the change set

Or use CDK:

```bash
cdk rollback
```

## Deploy

### Development

```bash
npm run deploy:dev
```

### Production

```bash
npm run deploy:prod
```

## Destroy Infrastructure

### Using npm scripts (Recommended)

```bash
# Destroy development environment
npm run destroy:dev

# Destroy production environment
npm run destroy:prod
```

### Using scripts directly

```bash
# Destroy development environment
./scripts/destroy.sh dev

# Destroy production environment
./scripts/destroy.sh prod
```

### Using AWS CLI directly

```bash
# Destroy development stack
aws cloudformation delete-stack --stack-name ServerlessApiStack-dev

# Destroy production stack
aws cloudformation delete-stack --stack-name ServerlessApiStack-prod
```

### Using CDK directly

```bash
# Build first
npm run build:all

# Destroy development
cdk destroy --context env=dev --require-approval never

# Destroy production
cdk destroy --context env=prod --require-approval never
```

## Important Notes

- **Production destroy requires confirmation** - The script will ask for confirmation before destroying production infrastructure
- **All data will be lost** - Destroying will remove all DynamoDB tables and their data
- **API endpoints will be unavailable** - All Lambda functions and API Gateway endpoints will be removed
- **Costs will stop** - No more AWS charges for the destroyed resources

## Destroy Troubleshooting

If you get permission errors, ensure your AWS credentials have the necessary permissions:

- CloudFormation:DeleteStack
- DynamoDB:DeleteTable
- Lambda:DeleteFunction
- ApiGateway:DeleteRestApi
- IAM:DeleteRole
- Logs:DeleteLogGroup
