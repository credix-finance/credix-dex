import { Credix } from "../idl/credix";
import { PermissionedMarkets } from "../idl/permissioned-market";
import type { AnchorTypes } from "@saberhq/anchor-contrib";

export type CredixTypes = AnchorTypes<
  Credix,
  {
    globalMarketState: GlobalMarketState;
    credixPass: CredixPass;
  },
  { DealRepaymentType: RepaymentType; Ratio: Ratio }
>;

export type CredixProgram = CredixTypes["Program"];

export type CredixPass = CredixTypes["Accounts"]["credixPass"];
export type GlobalMarketState = CredixTypes["Accounts"]["globalMarketState"];

export type Ratio = {
  numerator: number;
  denominator: number;
};

export type PrincipalRepaymentType = { principal: {} };
export type InterestRepaymentType = { interest: {} };

export type RepaymentType = PrincipalRepaymentType | InterestRepaymentType;
