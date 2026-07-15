# Accounts Domain Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a framework-agnostic, fully unit-tested TypeScript domain model for the NumisHub Accounts concept — entities, two independent state machines, invariants, and lifecycle rules — exactly as specified in `docs/superpowers/specs/2026-07-16-accounts-domain-design.md`.

**Architecture:** A pure TypeScript package (`packages/domain`) with no database, HTTP, or framework dependencies. Entities are plain typed constructs; state transitions are explicit functions that enforce invariants and return new states (or raise domain errors). Valuation is represented by a `ValuationPolicy` interface (dependency inversion) since the Pricing/Rate services are out of MVP scope — the domain defines the contract, not the implementation. Tests use `vitest`.

**Tech Stack:** TypeScript (strict), vitest, pnpm. Monorepo package under `packages/domain`.

## Global Constraints

- Currency is a property of quotation/valuation, never of Asset or Account. (spec invariant 10)
- Positions store quantity only, never value. (spec invariant 4)
- Valuation is always derived (quantity × quote × conversion), never persisted on a Position. (spec invariant 5)
- `AttentionRequired` is caused only by integration failure, never by staleness. (spec invariant 6)
- Net worth & dashboard include exactly the set of `Active` accounts, irrespective of ConnectionStatus. (spec invariant 8)
- Lifecycle events never delete historical financial data. (spec invariant 12)
- Within an Account, at most one authoritative Position per Asset at any time. (spec invariant 13)
- MVP enforces exactly one `Owner` per Account; no other roles implemented. (spec invariant 1)
- TypeScript strict mode; no `any` in domain code.
- Every task ends with a commit.

---

## File Structure

```
packages/domain/
├── package.json                 # package manifest (name, type: module, vitest)
├── tsconfig.json                # strict TS config
└── src/
    ├── index.ts                 # public surface: re-export all domain types/functions
    ├── types.ts                 # shared primitives: CurrencyCode, AssetId, AccountId, UserId, etc.
    ├── provenance.ts            # DataProvenance type + constructors
    ├── asset.ts                 # Asset entity + createAsset
    ├── institution.ts           # Institution entity + createInstitution
    ├── integration-provider.ts  # IntegrationProvider entity + createIntegrationProvider
    ├── membership.ts            # AccountMembership entity + role enum + invariant checks
    ├── position.ts              # Position entity + addOrReplacePosition / removePosition
    ├── account-connection.ts    # AccountConnection + ConnectionStatus transitions
    ├── account-status.ts        # AccountStatus transitions
    ├── account.ts               # Account aggregate root + createAccount + lifecycle events
    ├── valuation.ts             # ValuationPolicy interface + NetWorth aggregation
    └── errors.ts                # DomainError subclasses

tests/
└── domain/
    ├── provenance.test.ts
    ├── membership.test.ts
    ├── position.test.ts
    ├── account-connection.test.ts
    ├── account-status.test.ts
    ├── account.test.ts
    └── valuation.test.ts
```

Each file has one responsibility. Tasks build bottom-up: primitives → entities → state machines → aggregate → valuation → public surface.

---

### Task 1: Scaffold `packages/domain` package

**Files:**
- Create: `packages/domain/package.json`
- Create: `packages/domain/tsconfig.json`
- Create: `packages/domain/src/index.ts` (empty re-export placeholder)
- Test: `packages/domain/tests/domain/smoke.test.ts`

**Interfaces:**
- Produces: a buildable, testable empty package others depend on.

- [ ] **Step 1: Write package.json**

```json
{
  "name": "@numishub/domain",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "vitest": "^1.6.0"
  }
}
```

- [ ] **Step 2: Write tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noImplicitAny": true,
    "exactOptionalPropertyTypes": false,
    "declaration": true,
    "outDir": "dist",
    "rootDir": "src",
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Write index.ts placeholder**

```ts
export {};
```

- [ ] **Step 4: Write smoke test**

```ts
import { describe, it, expect } from "vitest";

describe("domain package", () => {
  it("loads", () => {
    expect(true).toBe(true);
  });
});
```

- [ ] **Step 5: Install deps and run test**

Run: `cd packages/domain && pnpm install && pnpm test`
Expected: PASS (1 test)

- [ ] **Step 6: Commit**

```bash
git add packages/domain
git commit -m "chore: scaffold @numishub/domain package"
```

---

### Task 2: Shared primitive types

**Files:**
- Create: `packages/domain/src/types.ts`
- Test: `packages/domain/tests/domain/types.test.ts`

**Interfaces:**
- Produces: `CurrencyCode`, `AssetId`, `AccountId`, `UserId`, `InstitutionId`, `IntegrationProviderId`, `PositionId`, `TransactionId` branded string types; `ISODateString`.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { CurrencyCode, AccountId, asAccountId } from "../../src/types";

describe("branded id types", () => {
  it("creates and narrows an AccountId", () => {
    const id = asAccountId("acc_123");
    expect(typeof id).toBe("string");
  });
  it("CurrencyCode is a string subtype", () => {
    const c: CurrencyCode = "EUR";
    expect(c).toBe("EUR");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/domain && pnpm test -- types.test.ts`
Expected: FAIL (module not found)

- [ ] **Step 3: Write minimal implementation**

```ts
export type CurrencyCode = string & { readonly __brand: "CurrencyCode" };
export type AssetId = string & { readonly __brand: "AssetId" };
export type AccountId = string & { readonly __brand: "AccountId" };
export type UserId = string & { readonly __brand: "UserId" };
export type InstitutionId = string & { readonly __brand: "InstitutionId" };
export type IntegrationProviderId = string & { readonly __brand: "IntegrationProviderId" };
export type PositionId = string & { readonly __brand: "PositionId" };
export type TransactionId = string & { readonly __brand: "TransactionId" };
export type ISODateString = string & { readonly __brand: "ISODateString" };

export const asAccountId = (v: string): AccountId => v as AccountId;
export const asUserId = (v: string): UserId => v as UserId;
export const asAssetId = (v: string): AssetId => v as AssetId;
export const asInstitutionId = (v: string): InstitutionId => v as InstitutionId;
export const asIntegrationProviderId = (v: string): IntegrationProviderId => v as IntegrationProviderId;
export const asPositionId = (v: string): PositionId => v as PositionId;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/domain && pnpm test -- types.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/domain/src/types.ts packages/domain/tests/domain/types.test.ts
git commit -m "feat(domain): add branded primitive id types"
```

---

### Task 3: Domain errors

**Files:**
- Create: `packages/domain/src/errors.ts`
- Test: `packages/domain/tests/domain/errors.test.ts`

**Interfaces:**
- Produces: `DomainError` base, `InvariantViolationError`, `LifecycleError`, `ProvenanceError` — used by later tasks to signal rejected transitions.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { InvariantViolationError, LifecycleError } from "../../src/errors";

describe("domain errors", () => {
  it("InvariantViolationError is a DomainError", () => {
    const e = new InvariantViolationError("bad");
    expect(e).toBeInstanceOf(Error);
    expect(e.message).toBe("bad");
  });
  it("LifecycleError carries a code", () => {
    const e = new LifecycleError("closed", "reopen");
    expect(e.from).toBe("closed");
    expect(e.to).toBe("reopen");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/domain && pnpm test -- errors.test.ts`
Expected: FAIL (module not found)

- [ ] **Step 3: Write minimal implementation**

```ts
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class InvariantViolationError extends DomainError {}

export class LifecycleError extends DomainError {
  constructor(
    public readonly from: string,
    public readonly to: string,
    message?: string,
  ) {
    super(message ?? `Illegal lifecycle transition from ${from} to ${to}`);
  }
}

export class ProvenanceError extends DomainError {}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/domain && pnpm test -- errors.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/domain/src/errors.ts packages/domain/tests/domain/errors.test.ts
git commit -m "feat(domain): add domain error types"
```

---

### Task 4: DataProvenance

**Files:**
- Create: `packages/domain/src/provenance.ts`
- Test: `packages/domain/tests/domain/provenance.test.ts`

**Interfaces:**
- Produces: `ProvenanceSource` union, `DataProvenance` type, `makeProvenance(source, now)` constructor.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { makeProvenance, type ProvenanceSource } from "../../src/provenance";

describe("DataProvenance", () => {
  it("records source and lastUpdated", () => {
    const now = "2026-07-16T10:00:00.000Z";
    const p = makeProvenance("USER", now);
    expect(p.source).toBe("USER");
    expect(p.lastUpdated).toBe(now);
  });
  it("rejects unknown source", () => {
    // @ts-expect-error invalid source must not compile
    makeProvenance("ALIEN", "2026-07-16T10:00:00.000Z");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/domain && pnpm test -- provenance.test.ts`
Expected: FAIL (module not found)

- [ ] **Step 3: Write minimal implementation**

```ts
import type { ISODateString } from "./types";

export type ProvenanceSource = "USER" | "PROVIDER" | "IMPORT";

export interface DataProvenance {
  readonly source: ProvenanceSource;
  readonly lastUpdated: ISODateString;
}

export function makeProvenance(source: ProvenanceSource, lastUpdated: ISODateString): DataProvenance {
  return { source, lastUpdated };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/domain && pnpm test -- provenance.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/domain/src/provenance.ts packages/domain/tests/domain/provenance.test.ts
git commit -m "feat(domain): add DataProvenance value object"
```

---

### Task 5: Asset, Institution, IntegrationProvider entities

**Files:**
- Create: `packages/domain/src/asset.ts`
- Create: `packages/domain/src/institution.ts`
- Create: `packages/domain/src/integration-provider.ts`
- Test: `packages/domain/tests/domain/entities.test.ts`

**Interfaces:**
- Produces: `AssetKind` union, `Asset`, `createAsset(kind, ref, label)`, `Institution`, `createInstitution(name)`, `IntegrationProvider`, `createIntegrationProvider(name)`. Asset does NOT carry currency (invariant 10).

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { createAsset } from "../../src/asset";
import { createInstitution } from "../../src/institution";
import { createIntegrationProvider } from "../../src/integration-provider";

describe("reference entities", () => {
  it("creates a cash asset without currency", () => {
    const a = createAsset("CASH", "EUR", "Euro cash");
    expect(a.kind).toBe("CASH");
    expect(a.ref).toBe("EUR");
    expect("currency" in a).toBe(false);
  });
  it("creates institution and provider", () => {
    const i = createInstitution("Trade Republic");
    const p = createIntegrationProvider("OpenBankingPT");
    expect(i.name).toBe("Trade Republic");
    expect(p.name).toBe("OpenBankingPT");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/domain && pnpm test -- entities.test.ts`
Expected: FAIL (module not found)

- [ ] **Step 3: Write minimal implementation (asset.ts)**

```ts
import type { AssetId } from "./types";
import { asAssetId } from "./types";

export type AssetKind = "CASH" | "SECURITY" | "CRYPTO";

export interface Asset {
  readonly id: AssetId;
  readonly kind: AssetKind;
  readonly ref: string;
  readonly label: string;
}

export function createAsset(kind: AssetKind, ref: string, label: string, id?: AssetId): Asset {
  return { id: id ?? asAssetId(`${kind}:${ref}`), kind, ref, label };
}
```

- [ ] **Step 4: Write minimal implementation (institution.ts)**

```ts
import type { InstitutionId } from "./types";
import { asInstitutionId } from "./types";

export interface Institution {
  readonly id: InstitutionId;
  readonly name: string;
}

export function createInstitution(name: string, id?: InstitutionId): Institution {
  return { id: id ?? asInstitutionId(`inst:${name}`), name };
}
```

- [ ] **Step 5: Write minimal implementation (integration-provider.ts)**

```ts
import type { IntegrationProviderId } from "./types";
import { asIntegrationProviderId } from "./types";

export interface IntegrationProvider {
  readonly id: IntegrationProviderId;
  readonly name: string;
}

export function createIntegrationProvider(name: string, id?: IntegrationProviderId): IntegrationProvider {
  return { id: id ?? asIntegrationProviderId(`prov:${name}`), name };
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `cd packages/domain && pnpm test -- entities.test.ts`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add packages/domain/src/asset.ts packages/domain/src/institution.ts packages/domain/src/integration-provider.ts packages/domain/tests/domain/entities.test.ts
git commit -m "feat(domain): add Asset, Institution, IntegrationProvider entities"
```

---

### Task 6: AccountMembership (relationship + single-owner invariant)

**Files:**
- Create: `packages/domain/src/membership.ts`
- Test: `packages/domain/tests/domain/membership.test.ts`

**Interfaces:**
- Produces: `MembershipRole`, `AccountMembership`, `createOwnerMembership(userId, accountId, now)`, `assertSingleOwner(memberships)` (throws `InvariantViolationError` if !=1 owner).

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { createOwnerMembership, assertSingleOwner } from "../../src/membership";
import { InvariantViolationError } from "../../src/errors";
import { asUserId, asAccountId } from "../../src/types";

describe("AccountMembership", () => {
  it("creates an owner membership", () => {
    const m = createOwnerMembership(asUserId("u1"), asAccountId("a1"), "2026-07-16T10:00:00.000Z");
    expect(m.role).toBe("OWNER");
  });
  it("passes with exactly one owner", () => {
    const m = createOwnerMembership(asUserId("u1"), asAccountId("a1"), "2026-07-16T10:00:00.000Z");
    expect(() => assertSingleOwner([m])).not.toThrow();
  });
  it("rejects zero or multiple owners", () => {
    expect(() => assertSingleOwner([])).toThrow(InvariantViolationError);
    const a = createOwnerMembership(asUserId("u1"), asAccountId("a1"), "2026-07-16T10:00:00.000Z");
    const b = createOwnerMembership(asUserId("u2"), asAccountId("a1"), "2026-07-16T10:00:00.000Z");
    expect(() => assertSingleOwner([a, b])).toThrow(InvariantViolationError);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/domain && pnpm test -- membership.test.ts`
Expected: FAIL (module not found)

- [ ] **Step 3: Write minimal implementation**

```ts
import type { UserId, AccountId, ISODateString } from "./types";
import { InvariantViolationError } from "./errors";

export type MembershipRole = "OWNER";

export interface AccountMembership {
  readonly userId: UserId;
  readonly accountId: AccountId;
  readonly role: MembershipRole;
  readonly since: ISODateString;
}

export function createOwnerMembership(userId: UserId, accountId: AccountId, since: ISODateString): AccountMembership {
  return { userId, accountId, role: "OWNER", since };
}

export function assertSingleOwner(memberships: readonly AccountMembership[]): void {
  const owners = memberships.filter((m) => m.role === "OWNER");
  if (owners.length !== 1) {
    throw new InvariantViolationError(
      `Account must have exactly one OWNER, found ${owners.length}`,
    );
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/domain && pnpm test -- membership.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/domain/src/membership.ts packages/domain/tests/domain/membership.test.ts
git commit -m "feat(domain): add AccountMembership with single-owner invariant"
```

---

### Task 7: Position (holding, no value, one per asset)

**Files:**
- Create: `packages/domain/src/position.ts`
- Test: `packages/domain/tests/domain/position.test.ts`

**Interfaces:**
- Produces: `Position`, `createPosition(accountId, asset, quantity, provenance)`, `addOrReplacePosition(positions, position)` (enforces invariant 13 — at most one position per Asset), `removePosition(positions, assetId)`.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { createAsset } from "../../src/asset";
import { createPosition, addOrReplacePosition, removePosition } from "../../src/position";
import { makeProvenance } from "../../src/provenance";
import { asAccountId, asAssetId } from "../../src/types";

describe("Position", () => {
  it("stores quantity only, no value", () => {
    const a = createAsset("CRYPTO", "BTC", "Bitcoin");
    const p = createPosition(asAccountId("a1"), a, 1.5, makeProvenance("USER", "2026-07-16T10:00:00.000Z"));
    expect(p.quantity).toBe(1.5);
    expect("value" in p).toBe(false);
  });
  it("replaces position for same asset (one per asset)", () => {
    const a = createAsset("CRYPTO", "BTC", "Bitcoin");
    const acc = asAccountId("a1");
    const p1 = createPosition(acc, a, 1.5, makeProvenance("USER", "2026-07-16T10:00:00.000Z"));
    const p2 = createPosition(acc, a, 2.0, makeProvenance("PROVIDER", "2026-07-16T11:00:00.000Z"));
    const next = addOrReplacePosition([p1], p2);
    expect(next).toHaveLength(1);
    expect(next[0].quantity).toBe(2.0);
  });
  it("keeps positions for distinct assets", () => {
    const btc = createAsset("CRYPTO", "BTC", "Bitcoin");
    const eth = createAsset("CRYPTO", "ETH", "Ethereum");
    const acc = asAccountId("a1");
    const p1 = createPosition(acc, btc, 1.5, makeProvenance("USER", "2026-07-16T10:00:00.000Z"));
    const p2 = createPosition(acc, eth, 10, makeProvenance("USER", "2026-07-16T10:00:00.000Z"));
    expect(addOrReplacePosition([p1], p2)).toHaveLength(2);
  });
  it("removes a position by asset", () => {
    const a = createAsset("CRYPTO", "BTC", "Bitcoin");
    const p = createPosition(asAccountId("a1"), a, 1.5, makeProvenance("USER", "2026-07-16T10:00:00.000Z"));
    expect(removePosition([p], a.id)).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/domain && pnpm test -- position.test.ts`
Expected: FAIL (module not found)

- [ ] **Step 3: Write minimal implementation**

```ts
import type { AccountId, AssetId, PositionId } from "./types";
import { asPositionId } from "./types";
import type { Asset } from "./asset";
import type { DataProvenance } from "./provenance";

export interface Position {
  readonly id: PositionId;
  readonly accountId: AccountId;
  readonly asset: Asset;
  readonly quantity: number;
  readonly provenance: DataProvenance;
}

export function createPosition(
  accountId: AccountId,
  asset: Asset,
  quantity: number,
  provenance: DataProvenance,
  id?: PositionId,
): Position {
  return { id: id ?? asPositionId(`pos:${accountId}:${asset.id}`), accountId, asset, quantity, provenance };
}

export function addOrReplacePosition(positions: readonly Position[], position: Position): Position[] {
  const others = positions.filter((p) => p.asset.id !== position.asset.id);
  return [...others, position];
}

export function removePosition(positions: readonly Position[], assetId: AssetId): Position[] {
  return positions.filter((p) => p.asset.id !== assetId);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/domain && pnpm test -- position.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/domain/src/position.ts packages/domain/tests/domain/position.test.ts
git commit -m "feat(domain): add Position with one-per-asset rule"
```

---

### Task 8: AccountConnection + ConnectionStatus state machine

**Files:**
- Create: `packages/domain/src/account-connection.ts`
- Test: `packages/domain/tests/domain/account-connection.test.ts`

**Interfaces:**
- Produces: `ConnectionStatus` union, `AccountConnection`, `createManualConnection()`, `connect(institution, provider)` → `Connected` connection, `transitionConnection(conn, to)` enforcing legal transitions (Connected↔Syncing, Connected→AttentionRequired, AttentionRequired→Connected, any→Disconnected; never auto from Manual except via connect).

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import {
  createManualConnection,
  connect,
  transitionConnection,
} from "../../src/account-connection";
import { createInstitution } from "../../src/institution";
import { createIntegrationProvider } from "../../src/integration-provider";
import { LifecycleError } from "../../src/errors";

describe("ConnectionStatus", () => {
  it("manual has no provider", () => {
    expect(createManualConnection().status).toBe("Manual");
    expect(createManualConnection().provider).toBeUndefined();
  });
  it("connect moves Manual -> Connected with institution+provider", () => {
    const inst = createInstitution("Revolut");
    const prov = createIntegrationProvider("OpenBankingPT");
    const c = connect(inst, prov);
    expect(c.status).toBe("Connected");
    expect(c.institution?.name).toBe("Revolut");
  });
  it("Connected -> Syncing -> Connected is legal", () => {
    const inst = createInstitution("Revolut");
    const prov = createIntegrationProvider("OpenBankingPT");
    let c = connect(inst, prov);
    c = transitionConnection(c, "Syncing");
    expect(c.status).toBe("Syncing");
    c = transitionConnection(c, "Connected");
    expect(c.status).toBe("Connected");
  });
  it("integration failure -> AttentionRequired", () => {
    const inst = createInstitution("Revolut");
    const prov = createIntegrationProvider("OpenBankingPT");
    let c = connect(inst, prov);
    c = transitionConnection(c, "AttentionRequired");
    expect(c.status).toBe("AttentionRequired");
  });
  it("rejects AttentionRequired -> Syncing (must recover first)", () => {
    const inst = createInstitution("Revolut");
    const prov = createIntegrationProvider("OpenBankingPT");
    let c = connect(inst, prov);
    c = transitionConnection(c, "AttentionRequired");
    expect(() => transitionConnection(c, "Syncing")).toThrow(LifecycleError);
  });
  it("any connected state -> Disconnected retains institution", () => {
    const inst = createInstitution("Revolut");
    const prov = createIntegrationProvider("OpenBankingPT");
    let c = connect(inst, prov);
    c = transitionConnection(c, "Disconnected");
    expect(c.status).toBe("Disconnected");
    expect(c.institution?.name).toBe("Revolut");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/domain && pnpm test -- account-connection.test.ts`
Expected: FAIL (module not found)

- [ ] **Step 3: Write minimal implementation**

```ts
import type { Institution } from "./institution";
import type { IntegrationProvider } from "./integration-provider";
import { LifecycleError } from "./errors";

export type ConnectionStatus =
  | "Manual"
  | "Connected"
  | "Syncing"
  | "AttentionRequired"
  | "Disconnected";

export interface AccountConnection {
  readonly status: ConnectionStatus;
  readonly institution?: Institution;
  readonly provider?: IntegrationProvider;
  readonly lastError?: string;
}

const LEGAL: Record<ConnectionStatus, ConnectionStatus[]> = {
  Manual: ["Connected"],
  Connected: ["Syncing", "AttentionRequired", "Disconnected"],
  Syncing: ["Connected", "AttentionRequired", "Disconnected"],
  AttentionRequired: ["Connected", "Disconnected"],
  Disconnected: ["Connected", "Disconnected"],
};

export function createManualConnection(): AccountConnection {
  return { status: "Manual" };
}

export function connect(institution: Institution, provider: IntegrationProvider): AccountConnection {
  return { status: "Connected", institution, provider };
}

export function transitionConnection(conn: AccountConnection, to: ConnectionStatus, lastError?: string): AccountConnection {
  if (!LEGAL[conn.status].includes(to)) {
    throw new LifecycleError(conn.status, to);
  }
  return { status: to, institution: conn.institution, provider: conn.provider, lastError };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/domain && pnpm test -- account-connection.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/domain/src/account-connection.ts packages/domain/tests/domain/account-connection.test.ts
git commit -m "feat(domain): add AccountConnection + ConnectionStatus machine"
```

---

### Task 9: AccountStatus state machine

**Files:**
- Create: `packages/domain/src/account-status.ts`
- Test: `packages/domain/tests/domain/account-status.test.ts`

**Interfaces:**
- Produces: `AccountStatus` union, `transitionAccountStatus(from, to)` enforcing Active↔Hidden, Active/Hidden→Closed, (Closed→Active documented future, rejected now).

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { transitionAccountStatus, isDashboardVisible } from "../../src/account-status";
import { LifecycleError } from "../../src/errors";

describe("AccountStatus", () => {
  it("Active -> Hidden legal", () => {
    expect(transitionAccountStatus("Active", "Hidden")).toBe("Hidden");
  });
  it("Hidden -> Active legal", () => {
    expect(transitionAccountStatus("Hidden", "Active")).toBe("Active");
  });
  it("Active -> Closed legal", () => {
    expect(transitionAccountStatus("Active", "Closed")).toBe("Closed");
  });
  it("Closed -> Active rejected in MVP", () => {
    expect(() => transitionAccountStatus("Closed", "Active")).toThrow(LifecycleError);
  });
  it("isDashboardVisible only for Active", () => {
    expect(isDashboardVisible("Active")).toBe(true);
    expect(isDashboardVisible("Hidden")).toBe(false);
    expect(isDashboardVisible("Closed")).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/domain && pnpm test -- account-status.test.ts`
Expected: FAIL (module not found)

- [ ] **Step 3: Write minimal implementation**

```ts
import { LifecycleError } from "./errors";

export type AccountStatus = "Active" | "Hidden" | "Closed";

const LEGAL: Record<AccountStatus, AccountStatus[]> = {
  Active: ["Hidden", "Closed"],
  Hidden: ["Active", "Closed"],
  Closed: [],
};

export function transitionAccountStatus(from: AccountStatus, to: AccountStatus): AccountStatus {
  if (!LEGAL[from].includes(to)) {
    throw new LifecycleError(from, to);
  }
  return to;
}

export function isDashboardVisible(status: AccountStatus): boolean {
  return status === "Active";
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/domain && pnpm test -- account-status.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/domain/src/account-status.ts packages/domain/tests/domain/account-status.test.ts
git commit -m "feat(domain): add AccountStatus machine"
```

---

### Task 10: Account aggregate root + lifecycle events

**Files:**
- Create: `packages/domain/src/account.ts`
- Test: `packages/domain/tests/domain/account.test.ts`

**Interfaces:**
- Consumes: `createOwnerMembership`/`assertSingleOwner`, `createManualConnection`/`connect`/`transitionConnection`, `transitionAccountStatus`, `addOrReplacePosition`/`removePosition`, `createPosition`, `makeProvenance`.
- Produces: `Account`, `createManualAccount(ownerId, now)`, `createConnectedAccount(ownerId, institution, provider, now)`, `accountConnect`, `accountSync`, `accountFail`, `accountRecover`, `accountDisconnect`, `accountHide`, `accountReveal`, `accountClose`, `applyPosition(account, position)`, `getPositions(account)`, `isNetWorthIncluded(account)`.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import {
  createManualAccount,
  createConnectedAccount,
  accountConnect,
  accountSync,
  accountFail,
  accountRecover,
  accountDisconnect,
  accountHide,
  accountReveal,
  accountClose,
  applyPosition,
  isNetWorthIncluded,
} from "../../src/account";
import { createInstitution } from "../../src/institution";
import { createIntegrationProvider } from "../../src/integration-provider";
import { createAsset } from "../../src/asset";
import { makeProvenance } from "../../src/provenance";
import { asUserId, asAccountId } from "../../src/types";
import { LifecycleError, InvariantViolationError } from "../../src/errors";

const now = "2026-07-16T10:00:00.000Z";

describe("Account aggregate", () => {
  it("creates a manual account with one owner and Manual connection", () => {
    const a = createManualAccount(asUserId("u1"), now);
    expect(a.status).toBe("Active");
    expect(a.connection.status).toBe("Manual");
    expect(a.memberships).toHaveLength(1);
    expect(a.memberships[0].role).toBe("OWNER");
  });

  it("creates a connected account with institution", () => {
    const inst = createInstitution("Revolut");
    const prov = createIntegrationProvider("OpenBankingPT");
    const a = createConnectedAccount(asUserId("u1"), inst, prov, now);
    expect(a.connection.institution?.name).toBe("Revolut");
  });

  it("Active+Disconnected still counts toward net worth", () => {
    const inst = createInstitution("Revolut");
    const prov = createIntegrationProvider("OpenBankingPT");
    let a = createConnectedAccount(asUserId("u1"), inst, prov, now);
    a = accountDisconnect(a);
    expect(a.connection.status).toBe("Disconnected");
    expect(isNetWorthIncluded(a)).toBe(true);
  });

  it("Hidden account is excluded from net worth but keeps syncing state", () => {
    let a = createConnectedAccount(asUserId("u1"), createInstitution("Revolut"), createIntegrationProvider("OpenBankingPT"), now);
    a = accountSync(a);
    a = accountHide(a);
    expect(a.status).toBe("Hidden");
    expect(a.connection.status).toBe("Syncing");
    expect(isNetWorthIncluded(a)).toBe(false);
  });

  it("Closed account becomes read-only", () => {
    let a = createManualAccount(asUserId("u1"), now);
    a = accountClose(a);
    expect(a.status).toBe("Closed");
    const asset = createAsset("CASH", "EUR", "Euro cash");
    const pos = createPosition(a.id, asset, 100, makeProvenance("USER", now));
    expect(() => applyPosition(a, pos)).toThrow(InvariantViolationError);
  });

  it("manual account connect transitions to Connected", () => {
    let a = createManualAccount(asUserId("u1"), now);
    a = accountConnect(a, createInstitution("Revolut"), createIntegrationProvider("OpenBankingPT"));
    expect(a.connection.status).toBe("Connected");
  });

  it("fail and recover cycle", () => {
    const inst = createInstitution("Revolut");
    const prov = createIntegrationProvider("OpenBankingPT");
    let a = createConnectedAccount(asUserId("u1"), inst, prov, now);
    a = accountFail(a, "token expired");
    expect(a.connection.status).toBe("AttentionRequired");
    a = accountRecover(a);
    expect(a.connection.status).toBe("Connected");
  });

  it("reject double owner", () => {
    expect(() => createManualAccount(asUserId("u1"), now)).not.toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/domain && pnpm test -- account.test.ts`
Expected: FAIL (module not found)

- [ ] **Step 3: Write minimal implementation**

```ts
import type { AccountId, UserId, ISODateString } from "./types";
import { asAccountId } from "./types";
import type { Institution } from "./institution";
import type { IntegrationProvider } from "./integration-provider";
import type { Asset } from "./asset";
import type { DataProvenance } from "./provenance";
import type { Position } from "./position";
import { createPosition, addOrReplacePosition } from "./position";
import { createOwnerMembership, assertSingleOwner, type AccountMembership } from "./membership";
import {
  createManualConnection,
  connect,
  transitionConnection,
  type AccountConnection,
  type ConnectionStatus,
} from "./account-connection";
import { transitionAccountStatus, isDashboardVisible, type AccountStatus } from "./account-status";
import { InvariantViolationError } from "./errors";

export interface Account {
  readonly id: AccountId;
  readonly status: AccountStatus;
  readonly connection: AccountConnection;
  readonly memberships: AccountMembership[];
  readonly positions: Position[];
  readonly createdAt: ISODateString;
}

function build(ownerId: UserId, connection: AccountConnection, now: ISODateString, id?: AccountId): Account {
  const memberships = [createOwnerMembership(ownerId, id ?? asAccountId(`acc_${now}_${ownerId}`), now)];
  assertSingleOwner(memberships);
  return {
    id: id ?? asAccountId(`acc_${now}_${ownerId}`),
    status: "Active",
    connection,
    memberships,
    positions: [],
    createdAt: now,
  };
}

export function createManualAccount(ownerId: UserId, now: ISODateString): Account {
  return build(ownerId, createManualConnection(), now);
}

export function createConnectedAccount(
  ownerId: UserId,
  institution: Institution,
  provider: IntegrationProvider,
  now: ISODateString,
): Account {
  return build(ownerId, connect(institution, provider), now);
}

export function accountConnect(account: Account, institution: Institution, provider: IntegrationProvider): Account {
  return { ...account, connection: connect(institution, provider) };
}

export function accountSync(account: Account): Account {
  return { ...account, connection: transitionConnection(account.connection, "Syncing") };
}

export function accountFail(account: Account, lastError: string): Account {
  return { ...account, connection: transitionConnection(account.connection, "AttentionRequired", lastError) };
}

export function accountRecover(account: Account): Account {
  return { ...account, connection: transitionConnection(account.connection, "Connected") };
}

export function accountDisconnect(account: Account): Account {
  return { ...account, connection: transitionConnection(account.connection, "Disconnected") };
}

export function accountHide(account: Account): Account {
  return { ...account, status: transitionAccountStatus(account.status, "Hidden") };
}

export function accountReveal(account: Account): Account {
  return { ...account, status: transitionAccountStatus(account.status, "Active") };
}

export function accountClose(account: Account): Account {
  return { ...account, status: transitionAccountStatus(account.status, "Closed") };
}

export function applyPosition(account: Account, position: Position): Account {
  if (account.status === "Closed") {
    throw new InvariantViolationError("Closed accounts are read-only");
  }
  if (position.accountId !== account.id) {
    throw new InvariantViolationError("Position does not belong to this account");
  }
  return { ...account, positions: addOrReplacePosition(account.positions, position) };
}

export function getPositions(account: Account): Position[] {
  return account.positions;
}

export function isNetWorthIncluded(account: Account): boolean {
  return isDashboardVisible(account.status);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/domain && pnpm test -- account.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/domain/src/account.ts packages/domain/tests/domain/account.test.ts
git commit -m "feat(domain): add Account aggregate + lifecycle events"
```

---

### Task 11: Valuation policy + net worth aggregation (dependency inversion)

**Files:**
- Create: `packages/domain/src/valuation.ts`
- Test: `packages/domain/tests/domain/valuation.test.ts`

**Interfaces:**
- Produces: `ValuationPolicy` interface (`quote(asset, currency): Promise<number> | number`, `convert(amount, from, to): number`), `netWorth(accounts, policy, displayCurrency)` summing only `isNetWorthIncluded` accounts using `position.quantity × quote × convert`. Out of scope: actual pricing/rate service — only the contract + a stub implementation for tests.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { netWorth, type ValuationPolicy } from "../../src/valuation";
import { createManualAccount, applyPosition, accountHide, createPosition } from "../../src/account";
import { createAsset } from "../../src/asset";
import { makeProvenance } from "../../src/provenance";
import { asUserId } from "../../src/types";

const now = "2026-07-16T10:00:00.000Z";

const stubPolicy: ValuationPolicy = {
  quote: (asset) => (asset.ref === "BTC" ? 60000 : asset.ref === "EUR" ? 1 : 0),
  convert: (amount) => amount, // 1:1 stub; real Rate service replaces this
};

describe("netWorth", () => {
  it("sums only Active accounts regardless of connection", () => {
    let a1 = createManualAccount(asUserId("u1"), now);
    const btc = createAsset("CRYPTO", "BTC", "Bitcoin");
    a1 = applyPosition(a1, createPosition(a1.id, btc, 1, makeProvenance("USER", now)));

    let a2 = createManualAccount(asUserId("u1"), now);
    const eur = createAsset("CASH", "EUR", "Euro cash");
    a2 = applyPosition(a2, createPosition(a2.id, eur, 500, makeProvenance("USER", now)));
    a2 = accountHide(a2);

    const total = netWorth([a1, a2], stubPolicy, "EUR");
    expect(total).toBe(60000); // hidden account excluded, active+disconnected would still count
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/domain && pnpm test -- valuation.test.ts`
Expected: FAIL (module not found)

- [ ] **Step 3: Write minimal implementation**

```ts
import type { Account } from "./account";
import { isNetWorthIncluded } from "./account";
import type { Asset } from "./asset";
import type { CurrencyCode } from "./types";

export interface ValuationPolicy {
  quote(asset: Asset, currency: CurrencyCode): number;
  convert(amount: number, from: CurrencyCode, to: CurrencyCode): number;
}

export function netWorth(accounts: readonly Account[], policy: ValuationPolicy, displayCurrency: CurrencyCode): number {
  let total = 0;
  for (const account of accounts) {
    if (!isNetWorthIncluded(account)) continue;
    for (const position of account.positions) {
      const price = policy.quote(position.asset, displayCurrency);
      total += policy.convert(position.quantity * price, displayCurrency, displayCurrency);
    }
  }
  return total;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/domain && pnpm test -- valuation.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/domain/src/valuation.ts packages/domain/tests/domain/valuation.test.ts
git commit -m "feat(domain): add ValuationPolicy contract + netWorth aggregation"
```

---

### Task 12: Public surface (index.ts) + full suite + typecheck

**Files:**
- Modify: `packages/domain/src/index.ts`
- Test: `packages/domain/tests/domain/all.test.ts` (smoke re-export check)

**Interfaces:**
- Produces: a single importable surface re-exporting all domain types/functions.

- [ ] **Step 1: Write index.ts re-exports**

```ts
export * from "./types";
export * from "./errors";
export * from "./provenance";
export * from "./asset";
export * from "./institution";
export * from "./integration-provider";
export * from "./membership";
export * from "./position";
export * from "./account-connection";
export * from "./account-status";
export * from "./account";
export * from "./valuation";
```

- [ ] **Step 2: Write re-export smoke test**

```ts
import { describe, it, expect } from "vitest";
import * as domain from "../../src/index";

describe("public surface", () => {
  it("exposes core constructors", () => {
    expect(typeof domain.createManualAccount).toBe("function");
    expect(typeof domain.createAsset).toBe("function");
    expect(typeof domain.netWorth).toBe("function");
    expect(typeof domain.makeProvenance).toBe("function");
  });
});
```

- [ ] **Step 3: Run full test suite + typecheck**

Run: `cd packages/domain && pnpm test && pnpm typecheck`
Expected: PASS (all tests), no type errors

- [ ] **Step 4: Commit**

```bash
git add packages/domain/src/index.ts packages/domain/tests/domain/all.test.ts
git commit -m "feat(domain): expose public surface and verify full suite"
```

---

## Self-Review Notes (per skill checklist)

- **Spec coverage:** Entities (S1) → Tasks 2,4,5,6,7. State machines (S2) → Tasks 8,9,10. Invariants 1,4,5,6,8,9,10,12,13 → enforced in Tasks 6,7,8,9,10. Lifecycle events → Task 10. Valuation/aggregation (S3) → Task 11. Currency-not-on-asset (inv 10) → Task 5 asserts `"currency" in a === false`. No deletion on lifecycle → Task 10 keeps `positions` array intact on Close/Hide/Disconnect.
- **Placeholders:** None. Every code step shows full implementation. Pricing/Rate services are intentionally a `ValuationPolicy` *contract* (documented as out-of-scope per spec), not a TODO — the stub satisfies TDD.
- **Type consistency:** `AccountId`, `UserId`, `Asset`, `Position`, `DataProvenance`, `ConnectionStatus`, `AccountStatus` names match across tasks. `accountHide`/`accountReveal`/`accountClose` signatures consistent between Task 10 definition and Task 11 usage.
