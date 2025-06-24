# Serverless CRUD API with AWS (CDK + Lambda + DynamoDB)

This project is a fully serverless RESTful API built on AWS. It uses **TypeScript** and **AWS CDK** to define and deploy the infrastructure as code. The API performs CRUD operations on a DynamoDB table and is designed to be scalable, secure, and maintainable.

---

## Tech Stack

- **AWS Lambda** – Runs the business logic without provisioning servers
- **Amazon API Gateway** – Exposes the REST API
- **Amazon DynamoDB** – Serves as the NoSQL database
- **AWS IAM** – Manages access control and least-privilege permissions
- **Amazon CloudWatch** – Provides logging and monitoring
- **AWS CDK (TypeScript)** – Defines and deploys infrastructure as code

---

## TypeScript Best Practices

This project follows TypeScript best practices to ensure type safety and maintainability:

- **Strict Type Checking**: All functions use proper TypeScript types instead of `any`
- **Shared Types**: Common interfaces are defined in `types/index.ts` for consistency
- **API Gateway Types**: Proper typing for Lambda event handlers and responses
- **Error Handling**: Typed error responses and proper error logging
- **Type Guards**: Used in tests to ensure type safety when working with CloudFormation resources

### Type Definitions

The project includes comprehensive type definitions for:

- AWS Lambda events and responses
- API request/response bodies
- DynamoDB item structures
- CloudFormation resources (for testing)

---

## Continuous Integration & Deployment (CI/CD)

This project uses **GitHub Actions** for automated CI/CD. The workflow is defined in `.github/workflows/ci-cd.yml`.

### On Pull Requests

1. Checkout the repository
2. Set up Node.js 18
3. Install dependencies (`npm ci`)
4. Build the project (`npm run build:all`)
5. Run all tests (`npm test`)

### On Push to Main (Production Deployment)

1. Execute all CI steps above
2. Configure AWS credentials
3. Deploy to production (`npm run deploy:prod`)
4. Get the API URL from CloudFormation outputs
5. Comment deployment information on the commit

### Environment Protection

The production deployment requires approval if environment protection rules are configured in GitHub.

📖 **For detailed setup instructions, see [Deployment Configuration Guide](docs/DEPLOYMENT.md)**

---

## Project Structure

```bash
serverless-api/
├── bin/
│   └── serverless-api.ts          # CDK application entry point
├── lambda/
│   ├── hello.ts                   # Lambda function for root endpoint
│   ├── createItem.ts              # Lambda function for creating items
│   ├── getItem.ts                 # Lambda function for getting an item
│   ├── listItems.ts               # Lambda function for listing items
│   ├── updateItem.ts              # Lambda function for updating items
│   ├── deleteItem.ts              # Lambda function for deleting items
├── lib/
│   └── serverless-api-stack.ts    # Main CDK stack
├── constructs/
│   ├── api.ts                     # API Gateway construct
│   ├── database.ts                # DynamoDB construct
│   └── functions.ts               # Lambda functions construct
├── types/
│   └── index.ts                   # Shared TypeScript type definitions
├── scripts/
│   ├── deploy.sh                  # Deployment script
│   └── build-lambda.js            # Lambda bundling script (with esbuild)
├── dist/
│   ├── bin/                       # Compiled CDK entry point
│   ├── constructs/                # Compiled constructs
│   ├── lambda/                    # Compiled Lambda JS from TypeScript
│   ├── lambda-bundled/            # Bundled Lambda functions (for deployment)
│   ├── lib/                       # Compiled CDK stack
│   └── test/                      # Compiled tests
├── test/
│   └── serverless-api.test.ts     # Project tests
├── package.json                   # Project dependencies
├── tsconfig.json                  # TypeScript configuration
├── cdk.json                       # CDK configuration
└── README.md                      # This file
```

---

## Build & Deployment Process

1. **TypeScript Compilation:**
   - Run `npm run build` to compile all TypeScript files to the `dist/` directory.
   - All `.js` and `.d.ts` files are generated inside `dist/` (not in the source folders).

2. **Lambda Bundling:**
   - Run `npm run build:lambda` to bundle all Lambda functions from `dist/lambda/` into `dist/lambda-bundled/` using [esbuild](https://esbuild.github.io/).
   - This ensures all dependencies (except `aws-sdk`) are included for AWS Lambda.

3. **Full Build:**
   - Run `npm run build:all` to execute both steps above.

4. **Deployment:**
   - The CDK stack is configured to deploy Lambda code from `dist/lambda-bundled/`.
   - Use `npm run deploy:dev` or `npm run deploy:prod` to deploy to AWS.

---

## Available Scripts

- `npm run build` - Compiles TypeScript project to `dist/`
- `npm run build:lambda` - Bundles Lambda functions from `dist/lambda/` to `dist/lambda-bundled/`
- `npm run build:all` - Runs both build steps above
- `npm run watch` - Builds in watch mode
- `npm run test` - Runs the tests
- `npm run cdk` - Runs CDK commands
- `npm run deploy:dev` - Deploys to development environment
- `npm run deploy:prod` - Deploys to production environment

---

## Best Practices

- **No generated files in source folders:** All compiled and bundled files are placed in `dist/` to keep the repository clean.
- **Lambda bundling:** The script `scripts/build-lambda.js` (included in the repo) uses esbuild to bundle Lambda functions with all their dependencies.
- **.gitignore:** The `dist/` directory is ignored by git, but scripts in `scripts/` are always included.
- **Type Safety:** All functions use proper TypeScript types with no `any` usage.

---

## API Endpoints

### Welcome Endpoint

| Method | Route | Description |
|--------|-------|-------------|
| GET    | `/`   | Welcome message from Lambda |

### Items Endpoints

All items endpoints are under the `/items` resource.

| Method | Route           | Description                    |
|--------|------------------|--------------------------------|
| POST   | `/items`         | Create a new item              |
| GET    | `/items`         | List all items                 |
| GET    | `/items/{id}`    | Get a specific item            |
| PUT    | `/items/{id}`    | Update an item by ID           |
| DELETE | `/items/{id}`    | Delete an item by ID           |

### Example request body for POST/PUT

```json
{
  "title": "My Important Task"
}
```

### Example response

```json
{
  "message": "Item created successfully",
  "item": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "My Important Task",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## Security & Best Practices

- Each Lambda function has least-privilege access to the DynamoDB table
- All errors are handled properly with structured responses
- CloudWatch is enabled for logging and monitoring
- Environment variables like `TABLE_NAME` are passed through CDK
- Item IDs are automatically generated using UUID v4
- Input validation on all endpoints

---

## Project Features

- **Serverless Architecture**: No servers to manage
- **Auto Scaling**: Automatically scales based on demand
- **Infrastructure as Code**: All infrastructure is defined in TypeScript
- **Multi-Environment Support**: Support for development and production
- **Integrated Logging**: Automatic logs in CloudWatch
- **Error Handling**: Consistent and structured error responses
- **Type Safety**: Full TypeScript support with strict type checking

---

## Purpose

This project demonstrates a robust and scalable serverless architecture built entirely with AWS services using TypeScript and AWS CDK. It serves as a practical and production-ready blueprint for building RESTful APIs backed by AWS Lambda, API Gateway, and DynamoDB, with full infrastructure-as-code support, observability through CloudWatch, and secure IAM role definitions.

It is designed to be easily extensible and maintainable, making it suitable as a foundation for internal tools, microservices, or backend services in modern cloud-native applications.
