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

interface ITokenType {
  readonly [key: string]: string;
}

export const colonyTokenType: ITokenType = {
  "0x0dd7b8f3d1fa88FAbAa8a04A0c7B52FC35D4312c": "βLNY",
  "0x6B175474E89094C44Da98b954EedeAC495271d0F": "DAI",
  "0x0000000000000000000000000000000000000001": "ETH", //TBD
  "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359": "SAI",
};