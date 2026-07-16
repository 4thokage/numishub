import { describe, it, expect } from "vitest";
import {
  CurrencyCode,
  asAccountId,
  asUserId,
} from "../../src/types";

describe("branded id types", () => {
  it("creates and narrows an AccountId", () => {
    const id = asAccountId("acc_123");
    expect(typeof id).toBe("string");
    expect(id).toBe("acc_123");
  });
  it("CurrencyCode is a string subtype", () => {
    const c: CurrencyCode = "EUR" as CurrencyCode;
    expect(c).toBe("EUR");
  });
  it("exposes id constructors", () => {
    expect(asUserId("u1")).toBe("u1");
  });
});
