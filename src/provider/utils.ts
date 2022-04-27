import { ColonyClient } from "@colony/colony-js";
import { BigNumber } from "ethers/utils";

export const getUserAddress = async (colonyClient: ColonyClient, fundingPotId: string) => {
  const { associatedTypeId } = await colonyClient.getFundingPot(fundingPotId);
  const { recipient } = await colonyClient.getPayment(associatedTypeId);
  return recipient;
};


export const transformHexValueAmount = (hexValue: string) => {
  const wei = new BigNumber(10);
  return new BigNumber(hexValue).div(wei.pow(18)).toString();
};

export const transformBigNumber = (bigNumber: BigNumber) =>
  new BigNumber(bigNumber).toString();
