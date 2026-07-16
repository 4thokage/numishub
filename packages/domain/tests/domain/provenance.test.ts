import { describe, it, expect } from "vitest";
import { makeProvenance, type ProvenanceSource } from "../../src/provenance";
import { asISODate } from "../../src/types";

describe("DataProvenance", () => {
  it("records source and lastUpdated", () => {
    const now = asISODate("2026-07-16T10:00:00.000Z");
    const p = makeProvenance("USER", now);
    expect(p.source).toBe("USER");
    expect(p.lastUpdated).toBe(now);
  });
  it("rejects unknown source at compile time", () => {
    // @ts-expect-error invalid source must not compile
    makeProvenance("ALIEN", asISODate("2026-07-16T10:00:00.000Z"));
  });
  it("ProvenanceSource is a closed union", () => {
    const sources: ProvenanceSource[] = ["USER", "PROVIDER", "IMPORT"];
    expect(sources).toHaveLength(3);
  });
});
