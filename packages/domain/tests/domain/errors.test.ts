import { describe, it, expect } from "vitest";
import { DomainError, InvariantViolationError, LifecycleError, ProvenanceError } from "../../src/errors";

describe("domain errors", () => {
  it("InvariantViolationError is a DomainError", () => {
    const e = new InvariantViolationError("bad");
    expect(e).toBeInstanceOf(Error);
    expect(e).toBeInstanceOf(DomainError);
    expect(e.message).toBe("bad");
  });
  it("LifecycleError carries from/to", () => {
    const e = new LifecycleError("closed", "reopen");
    expect(e.from).toBe("closed");
    expect(e.to).toBe("reopen");
    expect(e.message).toContain("closed");
  });
  it("ProvenanceError is a DomainError", () => {
    expect(new ProvenanceError("x")).toBeInstanceOf(DomainError);
  });
});
