# NumisHub — Assets Domain Specification

**Version:** 0.1 (Draft)
**Date:** 2026-07-16
**Status:** Approved design (pending implementation plan)
**Audience:** Product, Architecture, Engineering
**Scope:** The Assets domain only. Extends and does not contradict the Accounts domain
specification (`2026-07-16-accounts-domain-design.md`). Excludes schema/API design and
the implementation of Pricing/Quotation and FX/Rate services (deferred to their own bounded
contexts).

---

## Purpose

This document defines the **business domain** for the Assets concept in NumisHub, a personal
finance application for young professionals. It is written from the business language and user
workflows outward — not from database tables or REST endpoints.

The Accounts domain specification introduced `Asset` as a first-class identity of *what* is held,
and `Position` as a quantity-only holding inside an Account that references an Asset. It deferred
the detailed definition of `Asset` to a later document. This spec is that document.

This spec owns: global asset identity, classification by AssetClass, descriptive metadata, the
Asset lifecycle, and the **contracts** consumed by Positions and by the deferred
Pricing/Quotation and FX/Rate services. It explicitly does **not** own valuation, market data,
or any user-specific financial state — those belong to Positions or other bounded contexts.

This spec covers: Asset identity & classification, the Asset→Position relationship, the
Asset→Pricing/FX contracts, lifecycle, edge cases, invariants, and cross-domain consistency.

---

## Section 1 — Asset Identity & Classification

**Asset** represents the globally shared identity of a financial instrument or currency. It is
user-independent: created once in a global registry, referenced by many users' Positions. Its
**identity is immutable**; descriptive metadata (name, symbol, logo, etc.) may evolve.

```
Asset
├── identity       (canonical ID — defined per AssetClass strategy)
├── classification (assetClass)
├── metadata       (symbol, name, logo, display fields — mutable)
└── status         (lifecycle metadata, see below)
```

**Each AssetClass defines its own canonical identity strategy.** Examples:

| AssetClass | Example canonical identity strategy |
|------------|-------------------------------------|
| `cash` (fiat) | ISO 4217 currency code |
| `etf` / `stock` | ISIN (primary), optional ticker + exchange |
| `crypto` | Network + Contract Address (or native asset identifier) |

This is extensible — new AssetClasses supply their own strategy without changing the rule.

**Rules:**
- One real-world financial instrument or currency maps to **exactly one** Asset in the global
  registry (deduplication by canonical identity).
- Identity fields are immutable; symbol/name/logo are mutable metadata.
- A fiat-currency Asset is always valued at **one unit of itself**; conversion into another
  currency is delegated to the FX/Rate service (deferred).
- Optional **Status** lifecycle (metadata, not identity): `Active`, `Delisted`, `Deprecated`,
  `Merged`. `Merged` means this Asset has been superseded by a successor Asset; existing
  Positions remain valid historical references and are never automatically migrated by the Asset
  domain. Status is descriptive only — it never deletes/mutates identity or cascades into user
  Positions.

**Invariants:**
1. Assets **never contain user-specific state**. Ownership, quantity, valuation, performance,
   and cost basis belong to Positions or other bounded contexts.
2. Assets are **reference data**: globally shared, relatively static, and independent of any
   individual user's financial state.

---

## Section 2 — Relationship to Position & Pricing/FX Contracts

Defines how Assets connect to the rest of the system, establishing the **contracts** consumed by
Positions and the deferred Pricing/Quotation and FX/Rate services — without implementing them.

**Asset → Position (authoritative holding):**
- A `Position` references exactly one `Asset` (Accounts invariant #4/#13). The Asset answers
  *"what is held?"*; the Position answers *"how much, by whom, with what provenance?"*
- Position stores the **authoritative holding state** (e.g. quantity + DataProvenance), but never
  stores valuation, market price, or derived monetary value. (Future holding-scoped fields such as
  cost basis or acquisition metadata belong to Position, not Asset.)
- Multiple Accounts/Users reference the same global Asset via their own distinct Positions. The
  Asset is never copied or per-user.

**Asset → Pricing/Quotation service (contract, deferred):**
- The Pricing service consumes an **Asset identity** (e.g. ISIN, contract+network) + a requested
  `currency` + `asOf` and returns a **quotation** — not a single scalar price.
- A quotation includes at least: quoted amount, quoted currency, timestamp (`asOf`), and
  source/provider. The Asset domain is agnostic to how quotations are obtained.
- The Asset domain guarantees the identity is stable and class-appropriate so the Pricing service
  can route by AssetClass without Asset-domain logic. It does **not** store, fetch, or assume any
  quotation.

**Asset → FX/Rate service (contract, deferred):**
- For `cash` Assets, the FX service converts between ISO 4217 codes; the Asset supplies only the
  currency code.
- Other Assets are valued via the currency of the **returned quotation** (which may vary by
  provider/exchange); that quotation currency is then converted by the FX service. Rate policy
  (spot vs. daily-close) is FX-domain-owned.

**Valuation (illustrative only):**
`Position.value = quantity × quotation(assetIdentity, currency, asOf).amount × fxRate(quotationCurrency → userDisplayCurrency)`
This formula is illustrative; the **Accounts domain owns** aggregation and valuation rules. The
Asset domain merely defines the contract those rules consume.

**Invariants:**
1. A Position references exactly one Asset; an Asset may be referenced by many Positions.
2. The Asset domain never persists price, quotation, or rate data.
3. Pricing/FX services consume Asset *identity*, never mutate it.
4. **An Asset has no knowledge of which Positions reference it.** Relationships are unidirectional:
   Positions reference Assets; Assets never reference Positions or Users.

---

## Section 3 — Lifecycle, Edge Cases & Out of Scope

**Lifecycle (Asset registry events):**
- **Register** → a new global Asset created with immutable identity + classification + initial
  metadata; Status `Active`.
- **Enrich** → metadata (name, symbol, logo) updated; identity unchanged.
- **Deprecate / Delist / Merge** → Status changes to descriptive lifecycle state. `Merged` points
  to a successor Asset. No Positions migrated; no identity altered.
- **(No delete)** → Assets are reference data; removal is never performed (soft lifecycle only).

**Edge cases:**
- **Rebrand** (e.g. ticker change): metadata updated, identity (ISIN) stable — all Positions keep
  referencing the same Asset.
- **Corporate action / merger**: old Asset → `Merged` (successor set); historical Positions stay
  valid; the user's *current* Position may be updated by the user/Position context, never
  automatically by Asset domain.
- **Delisted security still held**: Asset `Delisted` but remains a valid Position reference for
  historical valuation/performance.
- **Multi-currency quotation**: same Asset may return quotations in different currencies per
  provider; Asset domain is unaware and unaffected.
- **Duplicate registration attempt**: rejected by canonical-identity uniqueness; the existing
  global Asset is reused.

**Out of scope for MVP (deferred to own bounded contexts):**
- Pricing/Quotation service internals (securities & crypto).
- FX/Rate service policy (spot vs. daily-close, sources).
- Position valuation, aggregation, cost-basis/lot tracking (Accounts domain owns).
- User-facing asset search / watchlist / add-custom-asset UX (data model only here).
- Auto-derivation of `Merged` successors from corporate-action feeds.

**Cross-domain consistency call-outs:**
- Reaffirms Accounts spec: Position references exactly one Asset; quantity-only; value derived.
  Asset domain adds the *global identity* layer the Accounts spec referenced but did not define.
- Consistent with Transactions spec's layering: Asset is pure reference data, orthogonal to
  transaction provenance.
- `cash` as fiat AssetClass unifies the net-worth "cash" slice with investment Positions under one
  model.

---

## Summary of Deferred (non-MVP) Extensions

The model is deliberately structured so the following can be added without redefining core
concepts:

- Pricing/Quotation service (securities and crypto).
- FX/Rate service and its policy.
- Position cost-basis / lot tracking layered onto Position (not Asset).
- User-facing asset discovery, watchlists, and custom-asset registration UX.
- Automatic successor derivation from corporate-action data feeds.
- Additional AssetClasses with their own canonical identity strategies.

---

## Open Questions for Future (not blocking MVP)

- Should the Asset registry be seeded centrally, or should registration be triggered on first
  reference from a Position?
- Who is authorized to register/enrich global Assets (system only, or users for niche assets)?
- Should `Delisted`/`Deprecated` Assets be hidden from user-facing asset search by default?
- How are corporate-action `Merged` successors surfaced to users for manual Position migration?
