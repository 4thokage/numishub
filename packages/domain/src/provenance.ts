import type { ISODateString } from "./types";

export type ProvenanceSource = "USER" | "PROVIDER" | "IMPORT";

export interface DataProvenance {
  readonly source: ProvenanceSource;
  readonly lastUpdated: ISODateString;
}

export function makeProvenance(
  source: ProvenanceSource,
  lastUpdated: ISODateString,
): DataProvenance {
  return { source, lastUpdated };
}
