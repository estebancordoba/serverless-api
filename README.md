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
│   └── package.json               # Lambda functions dependencies
├── lib/
│   └── serverless-api-stack.ts    # Main CDK stack
├── scripts/
│   └── deploy.sh                  # Deployment script
├── test/
│   └── serverless-api.test.ts     # Project tests
├── package.json                   # Project dependencies
├── tsconfig.json                  # TypeScript configuration
├── cdk.json                       # CDK configuration
└── README.md                      # This file
```

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
    "title": "My Important Task"
  }
}
```

---

## Infrastructure Deployment

### Prerequisites

1. **AWS CLI configured** with valid credentials:

   ```bash
   aws configure
   ```

2. **Node.js** (version 18 or higher)

3. **AWS CDK CLI** installed globally:

   ```bash
   npm install -g aws-cdk
   ```

### Installation and Deployment

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd serverless-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the project:

   ```bash
   npm run build
   ```

4. Deploy the infrastructure:

   **For development:**

   ```bash
   npm run deploy:dev
   ```

   **For production:**

   ```bash
   npm run deploy:prod
   ```

   **Or manually:**

   ```bash
   ./scripts/deploy.sh dev    # For development
   ./scripts/deploy.sh prod   # For production
   ```

### Available Scripts

- `npm run build` - Builds the TypeScript project
- `npm run watch` - Builds in watch mode
- `npm run test` - Runs the tests
- `npm run cdk` - Runs CDK commands
- `npm run deploy:dev` - Deploys to development environment
- `npm run deploy:prod` - Deploys to production environment

---

## Testing

Once deployed, you can use tools like **Postman** or **curl** to test the API.

### Example with curl

```bash
# Welcome endpoint
curl https://<API_URL>/

# Create an item
curl -X POST https://<API_URL>/items \
  -H "Content-Type: application/json" \
  -d '{"title": "Important task"}'

# List all items
curl https://<API_URL>/items

# Get a specific item
curl https://<API_URL>/items/<item-id>

# Update an item
curl -X PUT https://<API_URL>/items/<item-id> \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated task"}'

# Delete an item
curl -X DELETE https://<API_URL>/items/<item-id>
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

---

## Purpose

This project demonstrates a robust and scalable serverless architecture built entirely with AWS services using TypeScript and AWS CDK. It serves as a practical and production-ready blueprint for building RESTful APIs backed by AWS Lambda, API Gateway, and DynamoDB, with full infrastructure-as-code support, observability through CloudWatch, and secure IAM role definitions.

It is designed to be easily extensible and maintainable, making it suitable as a foundation for internal tools, microservices, or backend services in modern cloud-native applications.
