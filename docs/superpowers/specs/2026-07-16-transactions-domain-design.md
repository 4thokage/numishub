# NumisHub — Transactions Domain Specification

**Version:** 0.1 (Draft)
**Date:** 2026-07-16
**Status:** Approved design (pending implementation plan)
**Audience:** Product, Architecture, Engineering
**Scope:** The Transactions domain only. Extends and does not contradict the Accounts domain
specification (`2026-07-16-accounts-domain-design.md`). Excludes schema/API design (to be
derived later).

---

## Purpose

This document defines the **business domain** for the Transactions concept in NumisHub, a
personal finance application for young professionals. It is written from the business
language and user workflows outward — not from database tables or REST endpoints.

It elaborates the Transaction aggregate that the Accounts specification defined only at the
level required for the Accounts domain: an *explanatory historical record* referenced by
`accountId`, **not required** to reconstruct current authoritative state (Positions own
that), and excluded from net-worth aggregation.

This spec becomes the source of truth for the *internal* design of the Transaction
aggregate and everything it owns. The Accounts specification remains the source of truth for
how Accounts depend on Transactions.

This spec covers: transaction model and layering, lifecycle, posting status, types and
direction, categories, tags, merchant, transfers, duplicate detection, editing rules,
search, recurring behavior, attachments, and business invariants.

---

## Section 1 — Scope & Relationship to Accounts

This spec **extends** the Accounts document's Transaction contract; it does not redefine it.

- **Accounts spec owns:** Account lifecycle/state, Position authority, net-worth aggregation,
  current financial truth.
- **This spec owns:** Transaction aggregate internals — lifecycle, posting status, types,
  categories, merchant, transfers, provenance layers, duplicates, editing, search, recurring,
  attachments, tags, invariants.

**Contract consistency (from Accounts):** A Transaction is a *separate aggregate* referenced
by `accountId`. It is **not required** to reconstruct current authoritative state (Positions
own that). Net worth excludes Transactions. This spec does not contradict that.

**Cross-domain rules shared by both specs:**
- Net-worth aggregation (Accounts-owned) must exclude transfer legs and pending transactions.
- `currency` at the transaction level is the event currency; conversion is delegated to the
  Accounts-domain valuation/conversion services.

---

## Section 2 — Core Transaction Model

### Identity & layering

Each Transaction has an immutable `id` and is modeled as **layered information** rather than
a single mutable record. Three layers, in increasing precedence:

```
Source Layer     → immutable provider/import data (highest fidelity to reality as received)
        ↓
System Layer     → recomputable inference (merchant normalization, duplicate detection,
                   AI suggestions, rule results)
        ↓
User Layer       → authoritative preferences (category, notes, tags, merchant overrides,
                   attachments). HIGHEST PRECEDENCE.
```

Every displayed value is explainable by its originating layer, preserving NumisHub's
transparency principle. The User Layer is not merely "editable" — it **wins** over System and
Source.

### Money

- `amount` — **unsigned** numeric value.
- `direction` (`FlowDirection ∈ {INFLOW, OUTFLOW}`) — answers *"which way did money move?"*
- `currency` — the currency in which the financial event **occurred**. A Transaction records a
  monetary amount denominated in a specific currency; it does **not** have a quote (quotes
  belong to asset valuation). Conversion into the user's preferred display currency is handled
  by the valuation/conversion services defined in the Accounts domain. This is consistent with
  Accounts §3: currency is a property of valuation, never of Asset or Account.

### Type vs direction (non-redundant)

`FlowDirection` and `TransactionType` answer different questions and are kept separate:

| Question | Field |
|----------|-------|
| Which way did money move? | `FlowDirection` (INFLOW / OUTFLOW) |
| What happened? | `TransactionType` (business event) |

`TransactionType` uses business-event vocabulary (extensible):
`PURCHASE, SALARY, TRANSFER, DIVIDEND, INTEREST, FEE, TAX, REFUND, ADJUSTMENT, WITHDRAWAL, DEPOSIT`.

### Posting lifecycle

`PostingStatus ∈ {PENDING, POSTED}` with optional future states `CANCELLED`, `REVERSED`.
A Pending Transaction represents the same financial event prior to settlement and transitions
to Posted when the provider can correlate them. If a provider replaces pending records with new
posted records, reconciliation is an implementation concern, not a domain rule.

- Pending Transactions are **visible** to the user.
- Posted Transactions are the **authoritative basis** for spending analytics, budgets,
  reports, and historical summaries.
- Pending Transactions may contribute to "available balance" displays where supported by the
  provider but must be clearly identified.
- The domain models a single financial event progressing through its lifecycle, regardless of
  how individual providers expose it.

### Dates (explicit meaning)

- `occurredAt` — when the financial event took place (when known).
- `bookedAt` — when the institution posted the transaction to the account.
  These are frequently different.

### Other core fields

- `accountId` — the owning Account (separate aggregate).
- `rawCounterparty` — **immutable** source text as received from provider/import.
- `merchantId?` — optional reference to a normalized Merchant.
- `categoryAssignment` — first-class assignment (see Section 3), not a bare foreign key.
- `tags` — optional, many-per-transaction.
- `notes`, `attachments`.
- Per-layer provenance (see below) — **no transaction-level `source` field**.

### Provenance lives on the layer, not the transaction

The earlier notion of a transaction-level `source ∈ {USER, PROVIDER, IMPORT}` is **removed** to
avoid conflicting provenance. Provenance belongs to the layer:

- Source Layer → `PROVIDER` / `IMPORT`
- System Layer → `AI` / `RULE`
- User Layer → `USER`

Where relevant, layer assignments carry `assignedBy`, `confidence`, `assignedAt`, `overridden`.
The Accounts spec's `DataProvenance` (on Positions) is unaffected and remains the source of
truth there.

---

## Section 3 — Categories, Tags & Merchant

### CategoryAssignment (first-class)

Every Transaction has exactly one leaf `Category` via a `CategoryAssignment` value object
carrying:
- `assignedBy ∈ {SYSTEM, AI, RULE, USER}`
- `confidence`
- `overridden`
- `assignedAt`

This preserves recategorization history and provenance without redesign. Future versions can
support AI suggestions, rule-based auto-categorization, and override timelines.

### Category tree

Categories are hierarchical: system-provided defaults plus user-defined categories. Analytics
roll up naturally (e.g. `Groceries` → `Food`). A Transaction references exactly one **leaf**
category. Users may extend the taxonomy where needed.

### Tags (distinct from Categories)

Optional, user-defined, **many-per-Transaction**. Tags answer *"what context/label do I want?"*
for search and organization — orthogonal to the single categorical *"what kind of activity?"*
answer. No hierarchy, no analytics rollup in MVP.

### Merchant (normalized, deferred bounded context)

`Transaction → Merchant?` (optional). `rawCounterparty` is immutable source; `Merchant` is the
normalized business identity used for analytics, search, auto-categorization, and AI insights.

```
rawCounterparty  (immutable source)
        ↓
Merchant         (normalized identity)
```

The Merchant domain itself (aliases, logos, normalization engine, categorization rules) is
**deferred** to its own bounded context. This spec defines only the relationship.

---

## Section 4 — Transfers, Duplicates, Recurring

### TransferGroup

A transfer is modeled as two ordinary Transactions linked by a `TransferGroup`.

```
TransferGroup
   ├── Transaction (OUTFLOW, Account A)
   └── Transaction (INFLOW,  Account B)
```

Invariants:
- A transfer group contains exactly two Transactions in MVP (one OUTFLOW, one INFLOW).
- Each Transaction belongs to its respective Account and behaves like any other Transaction.
- Transfers do **not** contribute to income or spending analytics.
- Transfers preserve net worth; they only redistribute value between the user's Accounts.
- If one side is missing (e.g. due to import timing), the group may remain **incomplete**
  until reconciliation — never silently fabricated.

### DuplicateSet

Duplicate detection is a first-class domain concept, **independent of import idempotency**.

- Import idempotency prevents the *same* provider record from being imported twice (using
  provider `externalId`).
- Duplicate detection reconciles *distinct* records that may represent the same real-world
  event (e.g. API + CSV imports, or multiple providers).

A `DuplicateSet` represents one or more Transactions believed to describe the same financial
event. Detection is heuristic over `(account, amount, date, counterparty)`.

Rules:
- Transactions are **never silently deleted** because they are suspected duplicates.
- One **canonical** Transaction per set is used for analytics and reporting.
- Non-canonical Transactions are retained for transparency and auditability.
- Duplicate detection is heuristic and may require user confirmation or later reconciliation.
- The duplicate model is independent of provider-specific import mechanics.

### RecurringPattern

A `RecurringPattern` is a separate aggregate and a **derived interpretation** of historical
Transactions. It may be detected heuristically and optionally confirmed by the user. Confirmed
patterns expose frequency, expected amount, expected next occurrence, confidence, and status.

Rules:
- Transactions remain the authoritative financial history.
- A RecurringPattern **never creates authoritative Transactions in MVP**.
- Forecasting and future expected occurrences are separate concepts (later Planning/Forecasting
  domain).
- The primary purpose of RecurringPattern in MVP is insights, analytics, budgeting, and AI — not
  automatic transaction generation.

---

## Section 5 — Invariants, Lifecycle & Edge Cases

### Invariants (must always hold)

1. A Transaction references exactly one Account (`accountId`); it is a separate aggregate from
   Account/Positions.
2. **The Source Layer is immutable.**
3. User Layer always takes precedence over System Layer, which overrides Source-derived display
   where applicable.
4. `amount` is unsigned; `direction` is required and non-redundant with `type`.
5. `currency` is the event currency; conversion is delegated to Accounts-domain
   valuation/conversion services.
6. Posted Transactions are the sole authoritative basis for analytics/budgets/reports; Pending
   are visible but excluded.
7. Transfers (both legs) are excluded from income/spending analytics; net worth unaffected.
8. Duplicate Transactions are never deleted; one canonical per DuplicateSet.
9. Recategorization/overrides never mutate the Source Layer.
10. Re-import may refresh the Source Layer on provider correction but never overwrites explicit
    User Layer decisions.
11. System-generated values may be recomputed unless explicitly overridden by the user.
12. A RecurringPattern never creates authoritative Transactions in MVP.
13. Lifecycle events never delete financial history.

### Lifecycle (business events)

- **Create** → manual (User source) or via import/provider (PROVIDER/IMPORT source);
  PostingStatus PENDING or POSTED.
- **Post** → PENDING → POSTED (correlation or settlement).
- **Cancel / Reverse** → future states on the posting lifecycle.
- **Categorize** → CategoryAssignment set/changed (layer-aware provenance).
- **Edit** → User Layer updates; Source untouched.
- **Link Transfer** → two Transactions join a TransferGroup (or remain incomplete).
- **Detect Duplicate** → Transactions grouped into a DuplicateSet; canonical chosen.
- **Detect Recurring** → RecurringPattern derived; optionally confirmed.
- **Hide / Exclude** → visibility flag for reporting (distinct from Account `Hidden`).

### Edge cases

- **Long-lived Pending:** shown but excluded from totals; clearly identified.
- **Incomplete transfer:** one leg missing → group incomplete; reconciliation later.
- **Heuristic duplicate disagreement:** retained; user confirms canonical.
- **Multi-currency transaction:** valued in its event currency; conversion at display time only.
- **Re-import correction:** Source refreshed, User overrides preserved.
- **Provider replaces pending with posted:** reconciliation is implementation; domain keeps the
  single-event view.

---

## Section 6 — Out of Scope, Cross-Domain Notes & Deferred

### Out of scope for MVP (deferred to own bounded contexts)

- **Merchant domain** — aliases, logos, normalization engine, auto-categorization rules.
- **Category management UX** — full taxonomy editor, merge/split categories (data model only
  here).
- **Recurring forecasting** — future expected occurrences / Planning domain.
- **Budget domain** — uses Transaction aggregates but owns its own rules.
- **Full double-entry / ledger** — we use unsigned + `direction`, not debit/credit postings.
- **Attachments storage** — referenced as a concept; storage/ingestion is infrastructure.

### Cross-domain consistency call-outs (explicit, not silent divergence)

- The Accounts spec's Transaction contract (separate aggregate by `accountId`, not required to
  reconstruct state, excluded from net worth) is **unchanged and reaffirmed**.
- This spec's per-layer provenance **supersedes** the earlier notion of a transaction-level
  `source` field; the Accounts `DataProvenance` (on Positions) is unaffected.
- `currency`-as-event-currency is consistent with Accounts §3 ("currency is a property of
  quotation/valuation, never of Asset or Account") applied at the transaction level.
- Net-worth aggregation (Accounts-owned) must exclude transfer legs and pending transactions per
  the invariants above — a shared rule both specs honor.

### Future extensions (documented, not built)

- Transaction splits (one event → multiple categories/amounts).
- Lot/cost-basis linkage to Transactions for tax.
- Multi-leg transfers (≥2 legs).
- Confidence/override history timeline per layer.

---

## Summary of Deferred (non-MVP) Extensions

The model is deliberately structured so the following can be added without redefining core
concepts:

- Merchant bounded context (normalization, aliases, rules).
- Category taxonomy management and split/merge operations.
- Recurring forecasting and expected-occurrence generation.
- Budget domain consuming Transaction aggregates.
- Transaction splits and multi-leg transfers.
- Cost-basis / lot tracking layered onto Transactions.

---

## Open Questions for Future (not blocking MVP)

- Exact reconciliation strategy when providers replace pending with posted records.
- Whether heuristic duplicate detection should run automatically or only on demand.
- Whether `categoryAssignment` history should be surfaced as a user-visible timeline.
- Storage and size limits for attachments.
