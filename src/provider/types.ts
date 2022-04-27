import { LogDescription } from "ethers/utils";

export interface ColonyLogEvent extends LogDescription {
  readonly key: string;
  readonly logTime: number;
  readonly address?: string;
  readonly userAddress?: string;
  readonly payoutClaimed?: string;
  readonly humanReadableFundingPotId?: string;
}

export enum ColonyEventType {
  ColonyInitialised = "ColonyInitialised",
  ColonyRoleSet = "ColonyRoleSet",
  PayoutClaimed = "PayoutClaimed",
  DomainAdded = "DomainAdded",
}
