export type CurrencyCode = string & { readonly __brand: "CurrencyCode" };
export type AssetId = string & { readonly __brand: "AssetId" };
export type AccountId = string & { readonly __brand: "AccountId" };
export type UserId = string & { readonly __brand: "UserId" };
export type InstitutionId = string & { readonly __brand: "InstitutionId" };
export type IntegrationProviderId = string & { readonly __brand: "IntegrationProviderId" };
export type PositionId = string & { readonly __brand: "PositionId" };
export type TransactionId = string & { readonly __brand: "TransactionId" };
export type ISODateString = string & { readonly __brand: "ISODateString" };

export const asCurrencyCode = (v: string): CurrencyCode => v as CurrencyCode;
export const asAssetId = (v: string): AssetId => v as AssetId;
export const asAccountId = (v: string): AccountId => v as AccountId;
export const asUserId = (v: string): UserId => v as UserId;
export const asInstitutionId = (v: string): InstitutionId => v as InstitutionId;
export const asIntegrationProviderId = (v: string): IntegrationProviderId =>
  v as IntegrationProviderId;
export const asPositionId = (v: string): PositionId => v as PositionId;
export const asTransactionId = (v: string): TransactionId => v as TransactionId;
export const asISODate = (v: string): ISODateString => v as ISODateString;
