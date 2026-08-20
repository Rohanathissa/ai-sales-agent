# AI Sales Agent — Sample Backend (v0.1, no AI yet)

Node.js + Express + PostgreSQL REST API implementing the schema from
`DB-script.txt` (businesses, products, customers, conversations, messages,
business_rules). No LLM / WhatsApp integration yet — this is the plain CRUD
foundation the AI agent will sit on top of later.

## Setup

```bash
npm install
cp .env.example .env       # edit PG* values to match your local PostgreSQL

createdb ai_sales_agent     # or create the DB another way
npm run db:setup            # runs db/schema.sql then db/seed.sql

npm run dev                 # starts on http://localhost:3000 (auto-restart)
# or: npm start
```

`GET /health` → `{ "status": "ok" }` confirms the server is up (works even
without a DB connection).

## API Overview

### Businesses
| Method | Path | Notes |
|---|---|---|
| GET | `/api/businesses` | list all |
| GET | `/api/businesses/:id` | one |
| POST | `/api/businesses` | create — `name` required |
| PUT | `/api/businesses/:id` | partial update |
| DELETE | `/api/businesses/:id` | cascades to products/customers/etc. |

### Products (nested under a business)
| Method | Path |
|---|---|
| GET | `/api/businesses/:businessId/products?category=&stock_status=&is_active=` |
| GET | `/api/businesses/:businessId/products/:id` |
| POST | `/api/businesses/:businessId/products` |
| PUT | `/api/businesses/:businessId/products/:id` |
| DELETE | `/api/businesses/:businessId/products/:id` |

`attributes` is a free-form JSON object (carat, treatment, origin, etc. for
gems — different fields for other industries).

### Customers (nested under a business)
| Method | Path |
|---|---|
| GET | `/api/businesses/:businessId/customers?lead_status=` |
| GET / POST / PUT / DELETE | `/api/businesses/:businessId/customers/:id` |

### Conversations
| Method | Path | Notes |
|---|---|---|
| GET | `/api/businesses/:businessId/conversations?status=&customer_id=` | list |
| POST | `/api/businesses/:businessId/conversations` | create — `customer_id` required |
| GET | `/api/conversations/:id` | conversation **+ its messages**, for a full thread view |
| PUT | `/api/conversations/:id` | update status / `ai_enabled` / `assigned_to` (human handover) / lead_score |
| DELETE | `/api/conversations/:id` | |

### Messages (nested under a conversation)
| Method | Path |
|---|---|
| GET | `/api/conversations/:conversationId/messages` |
| POST | `/api/conversations/:conversationId/messages` — also bumps `last_message_at` on the parent conversation |

### Business Rules (guardrails — discount limits, handover conditions, etc.)
| Method | Path |
|---|---|
| GET | `/api/businesses/:businessId/rules?is_active=true` |
| POST / PUT / DELETE | `/api/businesses/:businessId/rules/:id` |

## Example requests

```bash
# List seeded products for Ceylon Crown Gems (business id 1)
curl http://localhost:3000/api/businesses/1/products

# Simulate the customer's WhatsApp message on the seeded conversation (id 1)
curl -X POST http://localhost:3000/api/conversations/1/messages \
  -H "Content-Type: application/json" \
  -d '{"sender_type":"customer","content":"Can you reduce the price a bit?"}'

# Human handover — assign the conversation to a sales rep and turn AI off
curl -X PUT http://localhost:3000/api/conversations/1 \
  -H "Content-Type: application/json" \
  -d '{"ai_enabled": false, "assigned_to": "Rohana", "status": "handed_over"}'

# Full thread (conversation + messages) for the admin UI
curl http://localhost:3000/api/conversations/1
```

## Next steps (not in this sample)

- AI Orchestrator layer calling these endpoints as **tools** (product search,
  customer lookup, business rules check) — this is the piece that turns raw
  CRUD into the actual "AI Sales Agent."
- WhatsApp Business Cloud API webhook → maps inbound messages to
  `POST /api/conversations/:id/messages` and outbound AI replies back out.
- Auth (currently none — every business is open to every request).
