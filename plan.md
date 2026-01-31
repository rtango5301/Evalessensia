# Schema & API Design Plan for TensorEvals Dashboard

## Overview

Design and implement the database schema and API routes for the TensorEvals dashboard backend using:
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **Authentication**: Supabase Auth
- **API**: Next.js API Routes

---

## Database Schema Design

### Tables

#### 1. `profiles` (extends Supabase Auth users)
Links to Supabase Auth `auth.users` table.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, FK → auth.users.id | User ID from Supabase Auth |
| email | String | Unique, Not Null | User email |
| full_name | String | Nullable | User's display name |
| created_at | DateTime | Default now() | Account creation timestamp |
| updated_at | DateTime | Auto-update | Last update timestamp |

#### 2. `agents`
Stores agent basic information and configuration.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, Default uuid() | Agent unique ID |
| user_id | UUID | FK → profiles.id, Not Null | Owner of the agent |
| name | String | Not Null | Agent name |
| type | Enum | Not Null | chat, data, browser, content, custom |
| description | String | Nullable, Default null | Agent description |
| status | Enum | Default 'draft' | draft, active, paused, archived |
| created_at | DateTime | Default now() | Creation timestamp |
| updated_at | DateTime | Auto-update | Last update timestamp |

#### 3. `agent_mcp_servers`
Stores MCP server configurations for each agent.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | MCP config ID |
| agent_id | UUID | FK → agents.id | Parent agent |
| mcp_id | String | Not Null | Marketplace MCP ID or custom ID |
| name | String | Not Null | MCP server name |
| description | String | Nullable | MCP description |
| icon | String | Nullable | Icon identifier |
| category | String | Nullable | MCP category |
| url | String | Nullable | Custom MCP URL (for custom servers) |
| is_custom | Boolean | Default false | Whether this is a custom MCP |
| created_at | DateTime | Default now() | Creation timestamp |

#### 4. `agent_query_configs`
Stores query configuration for each agent.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Config ID |
| agent_id | UUID | FK → agents.id, Unique | Parent agent (1:1) |
| method | Enum | Not Null | 'file_upload' or 'ai_generated' |
| file_name | String | Nullable | Uploaded file name |
| file_url | String | Nullable | Uploaded file storage URL |
| query_count | Int | Nullable | Number of AI-generated queries |
| query_context | String | Nullable | Context for AI generation |
| query_types | Json | Nullable | Array of selected query types |
| created_at | DateTime | Default now() | Creation timestamp |
| updated_at | DateTime | Auto-update | Last update timestamp |

---

### Entity Relationship Diagram

```
┌─────────────────┐
│  auth.users     │  (Supabase managed)
│  (id, email...) │
└────────┬────────┘
         │ 1:1
         ▼
┌─────────────────┐
│    profiles     │
│  (id, email,    │
│   full_name...) │
└────────┬────────┘
         │ 1:N
         ▼
┌─────────────────┐       ┌─────────────────────┐
│     agents      │──1:N──│  agent_mcp_servers  │
│  (id, user_id,  │       │  (id, agent_id,     │
│   name, type,   │       │   mcp_id, name...)  │
│   description)  │       └─────────────────────┘
└────────┬────────┘
         │ 1:1
         ▼
┌─────────────────────┐
│ agent_query_configs │
│  (id, agent_id,     │
│   method, ...)      │
└─────────────────────┘
```

---

## API Routes Design

### Authentication Middleware

All `/api/agents/*` routes will use middleware to:
1. Check for valid Supabase session
2. Extract user ID from session
3. Return 401 if not authenticated

### Endpoints

#### Agents CRUD

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/agents` | List user's agents | Required |
| GET | `/api/agents/[id]` | Get agent details | Required |
| POST | `/api/agents` | Create new agent | Required |
| PUT | `/api/agents/[id]` | Update agent | Required |
| DELETE | `/api/agents/[id]` | Delete agent | Required |

#### Agent Configuration

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/agents/[id]/mcps` | Get agent's MCP servers | Required |
| POST | `/api/agents/[id]/mcps` | Add MCP servers to agent | Required |
| DELETE | `/api/agents/[id]/mcps/[mcpId]` | Remove MCP from agent | Required |
| GET | `/api/agents/[id]/query-config` | Get query configuration | Required |
| PUT | `/api/agents/[id]/query-config` | Update query configuration | Required |

---

### Request/Response Examples

#### POST /api/agents (Create Agent)
```json
// Request
{
  "name": "Customer Support Bot",
  "type": "chat",
  "description": "Handles customer inquiries"
}

// Response (201 Created)
{
  "id": "uuid",
  "name": "Customer Support Bot",
  "type": "chat",
  "description": "Handles customer inquiries",
  "status": "draft",
  "createdAt": "2026-01-31T..."
}
```

#### GET /api/agents (List Agents)
```json
// Response (200 OK)
{
  "agents": [
    {
      "id": "uuid-1",
      "name": "Customer Support Bot",
      "type": "chat",
      "status": "active",
      "createdAt": "2026-01-31T..."
    },
    {
      "id": "uuid-2",
      "name": "Data Analyzer",
      "type": "data",
      "status": "draft",
      "createdAt": "2026-01-30T..."
    }
  ]
}
```

#### POST /api/agents/[id]/mcps (Add MCPs)
```json
// Request
{
  "mcps": [
    { "mcpId": "gmail", "name": "Gmail", "category": "communication" },
    { "mcpId": "custom-1", "name": "My API", "url": "https://...", "isCustom": true }
  ]
}

// Response (201 Created)
{
  "mcps": [
    { "id": "uuid", "mcpId": "gmail", "name": "Gmail", "category": "communication" },
    { "id": "uuid", "mcpId": "custom-1", "name": "My API", "url": "https://...", "isCustom": true }
  ]
}
```

#### PUT /api/agents/[id]/query-config (Update Query Config)
```json
// Request (File Upload Method)
{
  "method": "file_upload",
  "fileName": "queries.csv",
  "fileUrl": "https://storage.supabase.co/..."
}

// Request (AI Generated Method)
{
  "method": "ai_generated",
  "queryCount": 50,
  "queryContext": "Customer support scenarios",
  "queryTypes": ["simple", "complex", "edge_case"]
}

// Response (200 OK)
{
  "id": "uuid",
  "agentId": "agent-uuid",
  "method": "ai_generated",
  "queryCount": 50,
  "queryContext": "Customer support scenarios",
  "queryTypes": ["simple", "complex", "edge_case"]
}
```

---

## Implementation Steps

### Phase 1: Setup & Configuration
1. Install dependencies: `@supabase/supabase-js`, `@supabase/ssr`, `prisma`, `@prisma/client`
2. Initialize Prisma with Supabase connection
3. Create Supabase client utilities (`src/lib/supabase/`)
4. Add environment variables to `.env.local`

### Phase 2: Database Schema
1. Create Prisma schema file (`prisma/schema.prisma`)
2. Define all models with relationships
3. Run migrations to create tables in Supabase

### Phase 3: Authentication Setup
1. Create Supabase auth middleware (`src/lib/supabase/middleware.ts`)
2. Update login page to use Supabase Auth
3. Create Next.js middleware for route protection

### Phase 4: API Routes
1. Create auth helper for API routes
2. Implement `/api/agents` CRUD endpoints
3. Implement `/api/agents/[id]/mcps` endpoints
4. Implement `/api/agents/[id]/query-config` endpoints

### Phase 5: Integration
1. Update agent wizard pages to call APIs
2. Update dashboard to fetch real data
3. Add error handling and loading states

---

## Files to Create/Modify

### New Files
```
prisma/
  schema.prisma              # Prisma schema definition

src/lib/supabase/
  client.ts                  # Supabase client (browser)
  server.ts                  # Supabase client (server components)
  middleware.ts              # Supabase auth middleware helper

src/lib/
  prisma.ts                  # Prisma client singleton

src/app/api/agents/
  route.ts                   # GET (list) / POST (create)
  [id]/
    route.ts                 # GET / PUT / DELETE single agent
    mcps/
      route.ts               # GET / POST MCPs
      [mcpId]/
        route.ts             # DELETE single MCP
    query-config/
      route.ts               # GET / PUT query config

src/
  middleware.ts              # Next.js middleware for route protection
```

### Modified Files
```
.env.example                 # Add Supabase credentials template
.env.local                   # Add actual Supabase credentials (not committed)
package.json                 # Add new dependencies
src/app/login/page.tsx       # Integrate Supabase Auth
src/app/agents/new/page.tsx  # Call create API
src/app/agents/configure/page.tsx  # Call MCP/query APIs
src/app/agents/review/page.tsx     # Final agent creation
```

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Database (for Prisma)
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

---

## Verification Checklist

- [ ] **Auth Flow**: Login → redirects to dashboard → session persists
- [ ] **Agent Creation**: Complete wizard → agent saved to database → appears in list
- [ ] **API Testing**: All endpoints return correct responses
- [ ] **Error Cases**: Unauthenticated requests return 401, invalid data returns 400
- [ ] **Authorization**: Users can only access their own agents

---

## Discussion Points

1. **Soft Delete vs Hard Delete**: Should we add a `deleted_at` column for soft deletes?
2. **Pagination**: Should the `/api/agents` endpoint support pagination?
3. **Rate Limiting**: Do we need rate limiting on API routes?
4. **File Storage**: Should we use Supabase Storage for query file uploads?
5. **Webhooks**: Should we add webhook support for agent status changes?
