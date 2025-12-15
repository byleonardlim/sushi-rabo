# Ecommerce Architecture (Draft)

## Scope

This document captures decisions for the bespoke ecommerce platform that will live on `shop.site.com`. The product website lives on `site.com`.

## Repository layout

- `apps/site`: product website (marketing)
- `apps/shop`: ecommerce application (later)
- `packages/*`: shared code (UI, domain, integrations)

## Domain decisions

### Accounts + guest checkout

- Guest checkout is supported.
- Account creation is supported.
- Orders do not require an account. An order may optionally be associated with a user.
- Guest identity (email/phone/address) is stored on the order record.

### Payments

- Stripe is the payment provider.
- Stripe Checkout Sessions for initial implementation.
- Stripe webhooks are the source of truth for payment confirmation.
- Webhook processing must be idempotent (Stripe retries).

### Catalog source of truth (long-term)

- The system of record for sellable configuration and operational correctness is the application database.
- A CMS may be added later as a content layer (SEO copy, editorial content, galleries), keyed by the product identifier.

### Inventory (ingredients + toppings)

- Real inventory tracking is required.
- Inventory is ingredient-based, not just per-SKU stock.
- Use a stock ledger model (append-only movements) for auditability.
- Product variants and modifiers (toppings) consume ingredient quantities according to recipe/consumption rules.

### Currency

- Local currency only for now.
- Represent money values using integer minor units (e.g. cents) with an explicit currency code.

## Deployment

- `apps/site` deploys to `site.com`.
- `apps/shop` deploys to `shop.site.com`.
- Stripe secrets exist only in the shop deployment.
