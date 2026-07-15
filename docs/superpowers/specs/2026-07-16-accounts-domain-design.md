# NumisHub — Accounts Domain Specification

**Version:** 0.1 (Draft)
**Date:** 2026-07-16
**Status:** Approved design (pending implementation plan)
**Audience:** Product, Architecture, Engineering
**Scope:** The Accounts domain only. Excludes schema/API design (to be derived later).

---

## Purpose

This document defines the **business domain** for the Accounts concept in NumisHub, a
personal finance application for young professionals. It is written from the business
language and user workflows outward — not from database tables or REST endpoints.

Every entity exists because it solves a business problem, not because it fits a
relational model. The output of this spec is a domain model that will later drive the
PostgreSQL schema and API design.

This spec covers: business concepts, user expectations, business rules, edge cases,
domain entities, relationships, invariants, and lifecycle for the Accounts domain.

---

## Guiding Principles (from v1.md)

- Mobile-first, AI-native, privacy-first, beautiful by default.
- Automation over manual work.
- Portuguese-first with global expansion in mind.
- MVP explicitly **excludes**: shared accounts, delegated/advisor access, family
  relationships, loans/mortgages, trading, tax filing, bill payments, social features.

---

## Core Definition of "Account"

An **Account** represents a *financial relationship* between a User and an Institution
(or with themselves, for manual accounts). It is a **container**; everything else lives
inside it.

```
Account
├── Positions        (authoritative current holdings)
├── Transactions     (explanatory history)
├── AccountConnection (integration binding, absent for manual)
├── Metadata
├── AccountStatus    (business state)
└── ConnectionStatus (integration state)
```

The Account is a **relationship**, not "a bank account." This unifies bank accounts,
brokerage accounts, crypto exchange accounts, and manual accounts under one concept
without forcing investment mechanics onto cash accounts.

---

## Section 1 — Domain Entities & Relationships

### Entities

- **User** — the young professional. Owns accounts via the membership relationship.
  Holds a *preferred display currency*, used **only** at conversion/display time, never
  as a stored property of accounts or assets.

- **Institution** — the real-world financial entity (e.g. Revolut, Trade Republic,
  Binance). First-class and independent of how we connect. **Optional** on an Account:
  manual accounts have **no** Institution.

- **IntegrationProvider** — the integration mechanism that reaches an Institution (e.g.
  Portuguese Open Banking, a third-party aggregator). Distinct from Institution: an
  Institution may be reached through different providers over time.

- **Account** *(aggregate root)* — financial relationship User ↔ (Institution | self).
  Owns: `AccountStatus`, `ConnectionStatus`, `Positions`, `AccountConnection`, metadata,
  and the `AccountMembership` link.

- **AccountMembership** — first-class link between User and Account carrying a `role`.
  MVP hard-codes exactly one `Owner`. Documented as extensible (joint, delegated,
  advisor) without implementing those roles now.

- **AccountConnection** — binding to an IntegrationProvider plus the `ConnectionStatus`
  state machine. **Absent** for manual accounts (no Institution, no provider).

- **Asset** — first-class identity of *what* is held (cash, a security/ISIN, a crypto
  token). **Currency is NOT owned by Asset** — currency arrives via quotation/valuation
  (see Section 3). Asset just identifies *what* it is.

- **Position** — a *holding* inside an Account that references an Asset. Records
  **quantity only**; it stores **no value**. Carries **DataProvenance**. This is the
  authoritative current state of the account.

- **Transaction** *(separate aggregate, referenced by accountId)* — an explanatory
  historical record: amount, currency, category reference, date, counterparty,
  provenance. **Not required** to reconstruct the current state (but may be used to do
  so in future implementations).

- **DataProvenance** — a value object attached to authoritative values:
  `source ∈ {USER, PROVIDER, IMPORT}`, `lastUpdated`. Deferred (not in MVP):
  `lastConfirmed`, `confidence`.

### Relationships

```
User 1──* AccountMembership *──1 Account
Account *──1 Institution         (nullable; manual accounts = none)
Account *──1 AccountConnection   (optional; absent = manual)
AccountConnection *──1 IntegrationProvider
Account 1──* Position ──> Asset
Account 1──* Transaction          (separate aggregate, by accountId)
```

### Boundary rule

Account + Positions form one consistency boundary (the "current truth"). Transactions
live **outside** that boundary as an independent explanatory history.

---

## Section 2 — State Machines, Invariants & Lifecycle

### Two independent state machines

`AccountStatus` (business — controls net-worth / dashboard inclusion):

| State    | Meaning |
|----------|---------|
| `Active` | Counts toward net worth & dashboards. |
| `Hidden` | Excluded from net worth & dashboards; still syncs; reachable from account-management screens; excluded from historical reports by default (user may override). |
| `Closed` | Read-only; retains all Positions & Transactions; excluded from current net worth & dashboards; included in historical reports for periods when it was active. |

`ConnectionStatus` (integration — describes the data source):

| State             | Meaning |
|-------------------|---------|
| `Manual`          | No AccountConnection (no Institution / IntegrationProvider). |
| `Connected`       | Linked and idle. |
| `Syncing`         | Active data refresh in progress. |
| `AttentionRequired` | Integration failure (auth error, expired token, API error). Triggered **only** by real integration failures — never by data age. |
| `Disconnected`    | Link broken/lost; positions retained. |

These two machines are **orthogonal**:
- An `Active` account may be `Disconnected`.
- A `Hidden` account may be `Connected` / `Syncing`.
- A `Closed` account retains history regardless of connection state.

### Invariants (must always hold)

1. An Account has exactly one `Owner` (one AccountMembership with role = Owner). MVP enforces single ownership.
2. A User may own zero or more Accounts.
3. Positions are authoritative current state; Transactions are not required to reconstruct them.
4. A Position references exactly one Asset and records quantity + DataProvenance; it stores no value.
5. Value/valuation is always derived (quantity × quote × conversion), never persisted on a Position.
6. `AttentionRequired` is caused only by integration failure, never by staleness.
7. Manual data is authoritative until the user changes it; age produces an informational freshness signal only.
8. Net worth & dashboard include exactly the set of `Active` accounts, irrespective of ConnectionStatus; stale-but-authoritative positions are never zeroed or removed.
9. Closed accounts are read-only (no Position/Transaction mutation).
10. Currency is a property of quotation/valuation, never of Asset or Account.
11. Visibility preference applies to reports by default but can be overridden by the user per report.
12. Lifecycle events never delete historical financial data.
13. Within an Account, there is at most one authoritative Position for a given Asset at any point in time.

### Lifecycle (business events)

- **Create** → Account (manual or via connect flow) with one Owner; Status `Active`; Connection `Manual` or `Connected`/`Syncing`.
- **Connect** → Manual → Connected (AccountConnection + IntegrationProvider established, Institution attached).
- **Sync** → Connected ↔ Syncing; Positions updated with PROVIDER provenance.
- **Fail** → Connected → AttentionRequired (integration error).
- **Recover** → AttentionRequired → Connected (re-auth).
- **Disconnect** → any connected state → Disconnected (link dropped; Positions retained).
- **Hide** → Active → Hidden (stops dashboard inclusion; sync continues).
- **Reveal** → Hidden → Active.
- **Close** → Active/Hidden → Closed (read-only; history retained).
- **Reopen** → (optional future) Closed → Active — out of MVP scope, documented as possible.

### Edge cases

- **Active + Disconnected:** uses last-known authoritative Positions; contributes to net worth; shows freshness + integration warning. Never zeroed.
- **Hidden + Syncing:** excluded from net worth but data kept fresh.
- **Closed:** historical reports include its active-period data; current views exclude; read-only.
- **Multi-currency account** (e.g. Revolut EUR + USD): each Position's Asset is quoted in its own currency; net-worth conversion at User level.
- **Stale manual account:** informational "last updated N days ago," never AttentionRequired.

---

## Section 3 — Valuation, Aggregation & User Expectations

### Valuation (separate concern, never stored on Position)

- A Position's value = `quantity × quote(asset, currency, asOf)`.
- The `quote` comes from a **Pricing/Quotation service** — named as a domain dependency,
  internals out of MVP scope.
- Currency is a property of the *quote*, not the Asset. Conversion to the User's
  preferred display currency uses a **Rate service** (spot / daily-close policy to be
  defined later — documented, not built now).

### Aggregation (User level)

- Net worth = Σ over all `Active` accounts of Σ over their Positions of
  `value(position, userDisplayCurrency)`.
- `ConnectionStatus` is irrelevant to inclusion — only `AccountStatus = Active` qualifies
  an account.
- Multi-currency accounts aggregate naturally: each Position valued in its quoted
  currency, then converted.

### Dashboard contract (the six questions from v1.md)

The dashboard answers *"what do we currently believe the user's financial position is?"*
using all Active accounts:

1. **Net worth** — total valued across Active accounts.
2. **Where money is** — per-Account and per-Asset-class (cash / investment / crypto) breakdown.
3. **Where money goes** — from Transactions (separate aggregate), by category and period.
4. **Investment performance** — Position quantities vs. cost basis (provenance IMPORT/PROVIDER) where available.
5. **Goal progress** — (Goal entity, later domain) fed by account balances.
6. **What to notice today** — freshness & provenance signals: e.g. "Account X disconnected 3 days ago," "Manual position last updated 87 days ago" — *informational*, never alarmist about authoritative data.

### Transparency rules (privacy-first, trust)

- Every displayed aggregate may carry a freshness/provenance footnote per contributing account.
- Stale-but-authoritative data is shown as-is with a clarity indicator; never silently zeroed, hidden, or removed.
- AttentionRequired accounts are flagged as integration issues, distinct from data-freshness indicators.

### Out of scope for MVP (documented as future domain needs, not built)

- Pricing service internals
- Rate service policy (spot vs. daily close, source)
- Goal entity
- Shared / advised / family accounts
- Cost-basis / lot tracking for tax purposes

---

## Summary of Deferred (non-MVP) Extensions

The model is deliberately structured so the following can be added without redefining
core concepts:

- Additional AccountMembership roles (joint owner, delegated, advisor, family).
- `lastConfirmed` / `confidence` on DataProvenance.
- Account `Reopen` lifecycle event.
- Multi-owner / shared accounts (via the membership relationship already in place).
- Cost-basis and lot tracking layered onto Position/Transaction.

---

## Open Questions for Future (not blocking MVP)

- Exact Rate service policy (spot vs. daily close; which source).
- Pricing service responsibility boundaries (securities vs. crypto).
- Whether `Hidden` accounts should appear in "all time" aggregate views by default.
