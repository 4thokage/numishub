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
