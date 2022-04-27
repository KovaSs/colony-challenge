import { ColonyClient } from "@colony/colony-js";
import { utils } from "ethers";

export const getUserAddress = async (colonyClient: ColonyClient, fundingPotId: string) => {
  const { associatedTypeId } = await colonyClient.getFundingPot(fundingPotId);
  const { recipient } = await colonyClient.getPayment(associatedTypeId);
  return recipient;
};


export const transformHexValueAmount = (hexValue: string) => {
  const wei = new utils.BigNumber(10);
  return new utils.BigNumber(hexValue).div(wei.pow(18)).toString();
};
