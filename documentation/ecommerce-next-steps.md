# Ecommerce Next Steps (When ready)

## Phase 1 — Foundations

- Choose database (recommended: Postgres).
- Choose ORM/migrations (recommended: Prisma).
- Define core domain types in `packages/core`:
  - Money
  - Product / Variant / Modifier Group / Modifier
  - Ingredient / Stock Movement / Recipe Consumption
  - Cart / Order

## Phase 2 — Catalog + Cart

- Read-only catalog routes:
  - collection/listing
  - product detail page (PDP)
- Cart implementation:
  - client state + server validation
  - pricing computed from `packages/core`

## Phase 3 — Stripe Checkout + Orders

- Checkout session endpoint (server-side):
  - create Stripe Checkout Session from cart payload
- Stripe webhook endpoint:
  - verify signature
  - persist Stripe event id for idempotency
  - create/transition order state on successful payment

## Phase 4 — Inventory consumption

- Decide reservation policy:
  - reserve/decrement on payment success (default)
  - optional: short-lived reservations on checkout initiation
- Implement ingredient consumption from order lines and modifiers.
- Add stock adjustments (purchase, spoilage, manual adjustment).

## Phase 5 — Accounts

- Guest checkout remains supported.
- Accounts:
  - order history
  - saved addresses
  - optional Stripe customer portal
