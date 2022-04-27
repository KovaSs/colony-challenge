import React from "react";
import { ColonyRole } from "@colony/colony-js";

import { ColonyEventType, ColonyLogEvent } from "../../provider/types";
import { transformBigNumber } from "../../provider/utils";

import styles from "./style.module.css";

/**
 * Handling Token Symbols
 * One of the events you will have to handle includes displaying payouts in various tokens.
 * The parsed event data will only give you a token's address.
 * It is up to you to look up tokens on Etherscan (or another block explorer) and create a manual, 
 * local mapping between token addresses and token symbols.
 */
const colonyTokenType: { [key: string]: string } = {
  "0x0dd7b8f3d1fa88FAbAa8a04A0c7B52FC35D4312c": "βLNY",
  "0x6B175474E89094C44Da98b954EedeAC495271d0F": "DAI",
  "0x0000000000000000000000000000000000000001": "ETH",
  "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359": "SAI",
};


interface Props {
  event: ColonyLogEvent;
}

export const EventInfo: React.FC<Props> = ({ event }) => {
  const {
    name,
    userAddress,
    payoutClaimed,
    humanReadableFundingPotId,
    values: { role, user, domainId, setTo, token },
  } = event;  

  switch (name) {
    case ColonyEventType.ColonyInitialised:
      return (
        <p className={styles.eventInfoContainer}>
          <label>Congratulations! It's a beautiful baby colony!</label>
        </p>
      );
    case ColonyEventType.ColonyRoleSet:
      return (
        <p className={styles.eventInfoContainer}>
          <span>{ColonyRole[role]}</span> 
          <label>{`role${ setTo ? "assigned to" : "revoked from" } user`}</label>
          <span>{user}</span> 
          <label>in domain</label>
          <span>{transformBigNumber(domainId)}</span>
        </p>
      );
    case ColonyEventType.PayoutClaimed:
      return (
        <p className={styles.eventInfoContainer}>
          <label>User</label>
          <span>{userAddress}</span> 
          <label>claimed</label>
          <span>
            {payoutClaimed}
            {colonyTokenType[token]}
          </span>
          <label>payout from pot</label>
          <span>{humanReadableFundingPotId}</span>
        </p>
      );
    case ColonyEventType.DomainAdded:
      return (
        <p className={styles.eventInfoContainer}>
          <label>Domain</label>
          <span>{transformBigNumber(domainId)}</span>
          <label>added</label>
        </p>
      );
    default:
      console.debug("EventTitle: unexpected ColonyEventType");
      return null;
  }
};
