# TensorEvals API Summary

This document provides a comprehensive overview of all API endpoints implemented for the TensorEvals platform.

---

## Table of Contents

- [Foundation Files](#foundation-files)
- [Datasets API](#datasets-api)
- [Evaluations API](#evaluations-api)
- [Dashboard API](#dashboard-api)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)

---

## Foundation Files

### TypeScript Types

get List Datset , Datase,create Dataset,Delete Dataset

| File                        | Description                                                                      |
| --------------------------- | -------------------------------------------------------------------------------- |
| `src/types/database.ts`     | Core TypeScript interfaces for datasets, evaluations, results, and API responses |
| `src/types/external-api.ts` | TypeScript interfaces for the external SApi.md backend integration               |

### API Utilities

| File                             | Description                                                                     |
| -------------------------------- | ------------------------------------------------------------------------------- |
| `src/lib/api/response.ts`        | API response helpers (`apiSuccess`, `apiError`, `errors`, pagination utilities) |
| `src/lib/api/validation.ts`      | Zod schemas for request validation                                              |
| `src/lib/api/external-client.ts` | HTTP client for SApi.md external API calls                                      |
| `src/lib/api/transformers.ts`    | Data transformation functions between internal and external formats             |

---

## Datasets API

Base path: `/api/datasets`

### List Datasets

```
GET /api/datasets (Current DB return the value from dataset scheme )
```

Returns a paginated list of datasets with optional filtering.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page (max 100) |
| `status` | string | - | Filter by status: `in_progress`, `completed`, `failed` |
| `source` | string | - | Filter by source: `existing`, `uploaded`, `generated` |

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Customer Support Dataset",
      "description": "Test queries for support bot",
      "query_count": 50,
      "status": "completed",
      "source": "uploaded",
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "total_pages": 3
  }
}
```

---

### Create Dataset

```
POST /api/datasets ()
```

Creates a new dataset with optional inline queries.

**Request Body:**

| Field         | Type   | Required | Description                                               |
| ------------- | ------ | -------- | --------------------------------------------------------- | ---------- |
| `name`        | string | Yes      | Dataset name                                              |
| `description` | string | No       | Dataset description                                       |
| `source`      | string | Yes      | Source type: `uploaded`, `generated`(genearted queries) ) |
| `queries`     | array  | No       | Array of query objects (for inline creation)              | (File URL) |

**Query Object Fields:**

| Field                | Type   | Required | Description                       |
| -------------------- | ------ | -------- | --------------------------------- |
| `query`              | string | Yes      | The query/question text           |
| `reference_answer`   | string | Yes      | Expected/reference answer         |
| `category`           | string | No       | Query category for grouping       |
| `rubric`             | array  | No       | Evaluation rubric criteria        |
| `additional_context` | string | No       | Additional context for evaluation |

> **Note:** `query_id` is **auto-generated** by the API. Do not include it in the request body.

**Example Request:**

```json
{
  "name": "My Dataset",
  "description": "Optional description",
  "source": "existing",
  "queries": [
    {
      "query": "What is the return policy?",
      "reference_answer": "Our return policy allows...",
      "category": "policy",
      "rubric": [{ "name": "correctness", "rubric": "Answer matches policy", "weight": 0.5 }],
      "additional_context": "Optional context"
    }
  ]
}
```

**Response:** `201 Created`

```json
{
  "data": {
    "id": "uuid",
    "name": "My Dataset",
    "status": "completed",
    "query_count": 1,
    "queries": [
      {
        "query_id": "q_abc123",
        "query": "What is the return policy?",
        ...
      }
    ]
  }
}
```

---

### Get Dataset Details

```
GET /api/datasets/{id}  (fetch from DB)
```

Returns dataset details including all queries.

**Response:**

```json
{
  "data": {
    "id": "uuid",
    "name": "My Dataset",
    "description": "...",
    "query_count": 50,
    "status": "completed",
    "source": "uploaded",
    "queries": [
      {
        "id": "uuid",
        "query_id": "q1",
        "query": "What is the return policy?",
        "reference_answer": "...", (Optional Field)
        "category": "policy",
        "rubric": [...],
        "additional_context": null
      }
    ],
    "created_at": "...",
    "updated_at": "..."
  }
}y
```

---

---

### Generate Dataset (AI)

```
POST /api/datasets/generate
```

Triggers AI-based dataset generation via external API. The `query_id` for each generated query is automatically created by the backend.

**Request Body:**

| Field               | Type   | Required | Description                               |
| ------------------- | ------ | -------- | ----------------------------------------- |
| `name`              | string | Yes      | Dataset name                              |
| `description`       | string | No       | Dataset description                       |
| `agent_name`        | string | Yes      | Name of the agent to generate queries for |
| `agent_description` | string | Yes      | Description of what the agent does        |
| `mcp_servers`       | array  | No       | List of MCP server names the agent uses   |
| `custom_mcp_server` | string | No       | Custom MCP server configuration           |
| `query_count`       | number | Yes      | Number of queries to generate             |

**Example Request:**

```json
{
  "name": "Generated Dataset",
  "description": "AI-generated test queries",
  "agent_name": "Support Bot",
  "agent_description": "Customer support chatbot",
  "mcp_servers": ["product_catalog", "order_management"],
  "custom_mcp_server": null,
  "query_count": 50
}
```

**Response:** `202 Accepted`

```json
{
  "data": {
    "id": "uuid",
    "name": "Generated Dataset",
    "status": "in_progress",
    "source": "generated",
    "generated_config": {
      "agent_name": "Support Bot",
      "generation_id": "gen_abc123",
      "query_count": 50,
      ...
    }
  }
}
```

> **Note:** The external API (see `.claude/SApi.md`) returns generated queries with `query_index` which is transformed to `query_id` when stored in the database.

---

### Get Generation Status (Polling)

```
GET /api/datasets/generate/{id}/status
```

Returns the current status of dataset generation.

**Response:**

```json
{
  "data": {
    "id": "uuid",
    "generation_id": "gen_abc123",
    "status": "in_progress",
    "progress": {
      "completed": 25,
      "total": 50,
      "percentage": 50,
      "message": "Generating query 25/50..."
    }
  }
}
```

---

### Get Generated Queries

```
GET /api/datasets/generate/{id}
```

Fetches and stores generated queries when generation is complete.

**Response:**

```json
{
  "data": {
    "id": "uuid",
    "status": "completed",
    "query_count": 50,
    "queries": [...]
  }
}
```

## // rmeove before that//

## Evaluations API

Base path: `/api/evaluations`

### List Evaluations

```
GET /api/evaluations
```

Returns a paginated list of evaluation runs.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |
| `status` | string | - | Filter by status |
| `dataset_id` | string | - | Filter by dataset |

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Support Bot Eval #42",
      "status": "completed",
      "dataset_id": "uuid",
      "config": {...},
      "results_summary": {
        "overall_score": 87.5,
        "total_count": 50,
        "passed_count": 44,
        "failed_count": 6,
        "avg_latency_ms": 450
      },
      "created_at": "...",
      "updated_at": "..."
    }
  ],
  "pagination": {...}
}
```

---

### Create & Start Evaluation

```
POST /api/evaluations
```

Creates and starts a new evaluation run.

**Request Body:**

```json
{
  "name": "Support Bot Evaluation #43",
  "description": "Testing new model version", //r
  "dataset_id": "uuid",
  "config": {
    "agent_name": "Support Bot v2.5",
    "description": "Updated customer support chatbot",
    "mcp_servers": ["product_catalog", "order_management"],
    "agent_endpoint_url": "https://my-agent.example.com/chat"
  }
}
```

**Response:** `201 Created`

```json
{
  "data": {
    "id": "uuid",
    "name": "Support Bot Evaluation #43",
    "status": "in_progress",
    "external_evaluation_id": "eval_xyz789",
    ...
  }
}
```

---

### Get Evaluation Details

```
GET /api/evaluations/{id}
```

Returns evaluation details with all results.

**Response:**

```json
{
  "data": {
    "id": "uuid",
    "name": "Support Bot Eval #42",
    "status": "completed",
    "dataset": {...},
    "config": {...},
    "results": [
      {
        "id": "uuid",
        "query_id": "q1",
        "query": "What is the return policy?",
        "reference_answer": "...",
        "agent_response": "...",
        "score": 0.92,
        "pass_fail": "pass",
        "latency_ms": 320,
        "grader_reasoning": "...",
        "rubric": [
          {
            "name": "correctness",
            "rubric": "Score: 0.95",
            "weight": 0.4,
            "reasoning": "Response accurately describes..."
          }
        ]
      }
    ],
    "results_summary": {...}
  }
}
```

---

### Delete Evaluation

```
DELETE /api/evaluations/{id}
```

Deletes an evaluation and all its results. Cannot delete in-progress evaluations.

---

### Get Evaluation Status (Polling)

```
GET /api/evaluations/{id}/status
```

Returns the current status and progress of an evaluation.

**Response:**

```json
{
  "data": {
    "id": "uuid",
    "status": "in_progress",
    "progress": {
      "completed": 36,
      "total": 50,
      "percentage": 72
    },
    "results_summary": {
      "overall_score": 87.5,
      "passed_count": 32,
      "failed_count": 4,
      "avg_latency_ms": 450
    },
    "updated_at": "..."
  }
}
```

---

### Get Evaluation Results (Paginated)

```
GET /api/evaluations/{id}/results
```

Returns paginated results with filtering options.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |
| `pass_fail` | string | - | Filter: `pass` or `fail` |
| `category` | string | - | Filter by category |
| `min_score` | number | - | Minimum score filter |
| `max_score` | number | - | Maximum score filter |
| `sort_by` | string | `query_id` | Sort field |
| `sort_order` | string | `asc` | Sort direction: `asc` or `desc` |

---

### Stop Evaluation

```
POST /api/evaluations/{id}/stop
```

Stops a running evaluation.

**Response:**

```json
{
  "data": {
    "id": "uuid",
    "status": "failed",
    "message": "Evaluation stopped successfully",
    "partial_results_count": 25,
    "results_summary": {...},
    "stopped_at": "..."
  }
}
```

---

### Export Results

```
GET /api/evaluations/{id}/export
```

Exports evaluation results as CSV or JSON.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `format` | string | `json` | Export format: `csv` or `json` |
| `include_rubric` | boolean | `true` | Include rubric details |

**Response Headers:**

```
Content-Type: text/csv (or application/json)
Content-Disposition: attachment; filename="evaluation-{id}-results.csv"
```

---

## Dashboard API

Base path: `/api/dashboard`

### Get Dashboard Summary

```
GET /api/dashboard/summary
```

Returns dashboard overview data.

**Response:**

```json
{
  "data": {
    "recent_evaluations": [
      {
        "id": "uuid",
        "name": "Support Bot Eval #42",
        "status": "completed",
        "created_at": "...",
        "results_summary": {...}
      }
    ],
    "recent_datasets": [
      {
        "id": "uuid",
        "name": "Customer Support Dataset",
        "query_count": 50,
        "status": "completed"
      }
    ],
    "stats": {
      "total_evaluations": 156,
      "evaluations_this_week": 12,
      "average_pass_rate": 89.5,
      "total_datasets": 23
    }
  }
}
```

---

## Environment Variables

Add these to your `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# External API (TensorEvals Backend)
TENSOREVALS_BACKEND_URL=https://api.tensorevals.example.com
TENSOREVALS_BACKEND_API_KEY=your-backend-api-key
```

---

## Database Schema

Run this SQL in your Supabase SQL Editor to create the required tables:

```sql
-- Enums
CREATE TYPE dataset_status AS ENUM ('in_progress', 'completed', 'failed');
CREATE TYPE dataset_source AS ENUM ('existing', 'uploaded', 'generated');
CREATE TYPE evaluation_status AS ENUM ('in_progress', 'completed', 'failed');
CREATE TYPE pass_fail AS ENUM ('pass', 'fail');

-- Datasets
CREATE TABLE datasets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    query_count INTEGER DEFAULT 0,
    status dataset_status DEFAULT 'in_progress',
    source dataset_source NOT NULL,
    generated_config JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dataset Queries
CREATE TABLE dataset_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dataset_id UUID NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
    query_id VARCHAR(100) NOT NULL,
    query TEXT NOT NULL,
    reference_answer TEXT NOT NULL,
    category VARCHAR(100),
    rubric JSONB NOT NULL DEFAULT '[]',
    additional_context TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(dataset_id, query_id)
);

-- Evaluation Runs
CREATE TABLE evaluation_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status evaluation_status DEFAULT 'in_progress',
    dataset_id UUID NOT NULL REFERENCES datasets(id),
    config JSONB NOT NULL,
    results_summary JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Evaluation Results
CREATE TABLE evaluation_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evaluation_run_id UUID NOT NULL REFERENCES evaluation_runs(id) ON DELETE CASCADE,
    query_id VARCHAR(100) NOT NULL,
    query TEXT NOT NULL,
    reference_answer TEXT NOT NULL,
    category VARCHAR(100),
    rubric JSONB NOT NULL DEFAULT '[]',
    agent_response TEXT,
    latency_ms INTEGER,
    grader_reasoning TEXT,
    score DECIMAL(5,4),
    pass_fail pass_fail,
    additional_context JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(evaluation_run_id, query_id)
);

-- Indexes
CREATE INDEX idx_datasets_status ON datasets(status);
CREATE INDEX idx_datasets_created_at ON datasets(created_at DESC);
CREATE INDEX idx_evaluation_runs_status ON evaluation_runs(status);
CREATE INDEX idx_evaluation_runs_created_at ON evaluation_runs(created_at DESC);
CREATE INDEX idx_evaluation_results_run_id ON evaluation_results(evaluation_run_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_datasets_updated_at
    BEFORE UPDATE ON datasets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_evaluation_runs_updated_at
    BEFORE UPDATE ON evaluation_runs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-update query_count
CREATE OR REPLACE FUNCTION update_dataset_query_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE datasets SET query_count = query_count + 1 WHERE id = NEW.dataset_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE datasets SET query_count = query_count - 1 WHERE id = OLD.dataset_id;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_query_count
    AFTER INSERT OR DELETE ON dataset_queries
    FOR EACH ROW EXECUTE FUNCTION update_dataset_query_count();
```

---

## Testing with cURL

This section provides cURL commands to test all API endpoints.

### Base URL Setup

```bash
# Set your base URL (adjust port if needed)
BASE_URL="http://localhost:3000"
```

---

### Datasets API Testing

#### List Datasets

```bash
# Basic list
curl -X GET "$BASE_URL/api/datasets"

# With pagination
curl -X GET "$BASE_URL/api/datasets?page=1&limit=10"

# With filters
curl -X GET "$BASE_URL/api/datasets?status=completed&source=uploaded"
```

#### Create Dataset

```bash
# Note: query_id is auto-generated by the API - do not include it in the request
curl -X POST "$BASE_URL/api/datasets" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Dataset",
    "description": "A test dataset for API testing",
    "source": "existing",
    "queries": [
      {
        "query": "What is the return policy?",
        "reference_answer": "Our return policy allows returns within 30 days.",
        "category": "policy",
        "rubric": [
          { "name": "correctness", "rubric": "Answer matches policy", "weight": 0.5 }
        ]
      }
    ]
  }'
```

#### Get Dataset by ID

```bash
# Replace {id} with actual dataset UUID
curl -X GET "$BASE_URL/api/datasets/{id}"
```

#### Update Dataset

```bash
curl -X PATCH "$BASE_URL/api/datasets/{id}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Dataset Name",
    "description": "Updated description"
  }'
```

#### Delete Dataset

```bash
curl -X DELETE "$BASE_URL/api/datasets/{id}"
```

#### Get Dataset Queries

```bash
curl -X GET "$BASE_URL/api/datasets/{id}/queries?page=1&limit=20&category=policy"
```

#### Upload Dataset (JSON)

```bash
curl -X POST "$BASE_URL/api/datasets/upload" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Uploaded Dataset",
    "description": "Dataset from JSON upload",
    "queries": [
      {
        "query": "What is your pricing?",
        "reference_answer": "Our pricing starts at $10/month.",
        "category": "pricing"
      }
    ]
  }'
```

#### Upload Dataset (CSV file)

```bash
curl -X POST "$BASE_URL/api/datasets/upload" \
  -F "file=@./test-data.csv" \
  -F "name=CSV Dataset" \
  -F "description=Uploaded from CSV"
```

#### Generate Dataset (AI)

```bash
curl -X POST "$BASE_URL/api/datasets/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "AI Generated Dataset",
    "description": "AI-generated test queries",
    "agent_name": "Support Bot",
    "agent_description": "Customer support chatbot",
    "mcp_servers": ["product_catalog", "order_management"],
    "query_count": 10
  }'
```

#### Check Generation Status

```bash
curl -X GET "$BASE_URL/api/datasets/generate/{id}/status"
```

#### Get Generated Queries

```bash
curl -X GET "$BASE_URL/api/datasets/generate/{id}"
```

---

### Evaluations API Testing

#### List Evaluations

```bash
# Basic list
curl -X GET "$BASE_URL/api/evaluations"

# With filters
curl -X GET "$BASE_URL/api/evaluations?status=completed&dataset_id={dataset_id}"
```

#### Create & Start Evaluation

```bash
curl -X POST "$BASE_URL/api/evaluations" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Evaluation Run",
    "description": "Testing API functionality",
    "dataset_id": "{dataset_id}",
    "config": {
      "agent_name": "Test Agent v1.0",
      "description": "Test chatbot agent",
      "mcp_servers": ["product_catalog"],
      "agent_endpoint_url": "https://my-agent.example.com/chat"
    }
  }'
```

#### Get Evaluation Details

```bash
curl -X GET "$BASE_URL/api/evaluations/{id}"
```

#### Delete Evaluation

```bash
curl -X DELETE "$BASE_URL/api/evaluations/{id}"
```

#### Get Evaluation Status (Polling)

```bash
curl -X GET "$BASE_URL/api/evaluations/{id}/status"
```

#### Get Evaluation Results (Paginated)

```bash
# Basic
curl -X GET "$BASE_URL/api/evaluations/{id}/results"

# With filters and sorting
curl -X GET "$BASE_URL/api/evaluations/{id}/results?pass_fail=fail&min_score=0.5&sort_by=score&sort_order=desc"
```

#### Stop Evaluation

```bash
curl -X POST "$BASE_URL/api/evaluations/{id}/stop"
```

#### Export Results

```bash
# Export as JSON
curl -X GET "$BASE_URL/api/evaluations/{id}/export?format=json"

# Export as CSV
curl -X GET "$BASE_URL/api/evaluations/{id}/export?format=csv" -o results.csv

# Without rubric details
curl -X GET "$BASE_URL/api/evaluations/{id}/export?format=json&include_rubric=false"
```

---

### Dashboard API Testing

#### Get Dashboard Summary

```bash
curl -X GET "$BASE_URL/api/dashboard/summary"
```

---

### Sequential Testing Workflow

Test endpoints in this order for proper data dependencies:

```bash
# Step 1: Create a dataset (query_id is auto-generated by the API)
DATASET_RESPONSE=$(curl -s -X POST "$BASE_URL/api/datasets" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","source":"existing","queries":[{"query":"Test?","reference_answer":"Yes","category":"test","rubric":[]}]}')

DATASET_ID=$(echo $DATASET_RESPONSE | jq -r '.data.id')
echo "Created dataset: $DATASET_ID"

# Step 2: Verify dataset creation
curl -s "$BASE_URL/api/datasets/$DATASET_ID" | jq

# Step 3: Create an evaluation
EVAL_RESPONSE=$(curl -s -X POST "$BASE_URL/api/evaluations" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test Eval\",\"dataset_id\":\"$DATASET_ID\",\"config\":{\"agent_name\":\"Test\",\"agent_endpoint_url\":\"https://example.com/chat\"}}")

EVAL_ID=$(echo $EVAL_RESPONSE | jq -r '.data.id')
echo "Created evaluation: $EVAL_ID"

# Step 4: Poll status
curl -s "$BASE_URL/api/evaluations/$EVAL_ID/status" | jq

# Step 5: Check dashboard
curl -s "$BASE_URL/api/dashboard/summary" | jq
```

---

### Testing Tips

#### Use `jq` for readable output

```bash
curl -s "$BASE_URL/api/datasets" | jq '.'
```

#### Test error handling

```bash
# Invalid ID
curl -X GET "$BASE_URL/api/datasets/invalid-uuid"

# Missing required fields
curl -X POST "$BASE_URL/api/datasets" \
  -H "Content-Type: application/json" \
  -d '{}'

# Delete dataset in use
curl -X DELETE "$BASE_URL/api/datasets/{id-used-by-evaluation}"
```

#### Create a test CSV file

```bash
cat > test-data.csv << 'EOF'
query,reference_answer,category,rubric,additional_context
"What is X?","X is a feature","general","[]",""
"How to use Y?","Y can be used by...","usage","[]",""
EOF
```

#### Verbose mode for debugging

```bash
curl -v -X GET "$BASE_URL/api/datasets"
```

#### With authentication (if required)

```bash
curl -X GET "$BASE_URL/api/datasets" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Quick Test Script

Save this as `test-api.sh`:

```bash
#!/bin/bash
BASE_URL="${1:-http://localhost:3000}"

echo "Testing TensorEvals API at $BASE_URL"
echo "======================================"

echo -e "\n1. Testing GET /api/datasets"
curl -s "$BASE_URL/api/datasets" | jq '.pagination // .error'

echo -e "\n2. Testing GET /api/evaluations"
curl -s "$BASE_URL/api/evaluations" | jq '.pagination // .error'

echo -e "\n3. Testing GET /api/dashboard/summary"
curl -s "$BASE_URL/api/dashboard/summary" | jq '.data.stats // .error'

echo -e "\n======================================"
echo "Basic connectivity tests complete"
```

Run with: `chmod +x test-api.sh && ./test-api.sh`

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

**Common Error Codes:**
| Code | HTTP Status | Description |
|------|-------------|-------------|
| `NOT_FOUND` | 404 | Resource not found |
| `BAD_REQUEST` | 400 | Invalid request |
| `VALIDATION_ERROR` | 422 | Request validation failed |
| `CONFLICT` | 409 | Resource conflict (e.g., deleting in-progress evaluation) |
| `INTERNAL_ERROR` | 500 | Server error |
| `EXTERNAL_API_ERROR` | 502 | External API call failed |

---

## File Structure

```
src/
├── types/
│   ├── database.ts              # Core TypeScript interfaces
│   └── external-api.ts          # External API interfaces
├── lib/
│   ├── supabase/
│   │   ├── client.ts            # Browser client
│   │   └── server.ts            # Server-side client
│   └── api/
│       ├── response.ts          # Response helpers
│       ├── validation.ts        # Zod schemas
│       ├── external-client.ts   # External API client
│       └── transformers.ts      # Data transformers
└── app/api/
    ├── datasets/
    │   ├── route.ts             # GET list, POST create
    │   ├── [id]/
    │   │   ├── route.ts         # GET, PATCH, DELETE
    │   │   └── queries/route.ts # GET queries
    │   ├── upload/route.ts      # POST file upload
    │   └── generate/
    │       ├── route.ts         # POST trigger generation
    │       └── [id]/
    │           ├── status/route.ts  # GET polling
    │           └── route.ts         # GET results
    ├── evaluations/
    │   ├── route.ts             # GET list, POST create
    │   └── [id]/
    │       ├── route.ts         # GET, DELETE
    │       ├── status/route.ts  # GET polling
    │       ├── results/route.ts # GET paginated results
    │       ├── stop/route.ts    # POST stop
    │       └── export/route.ts  # GET export
    └── dashboard/
        └── summary/route.ts     # GET dashboard data
```
