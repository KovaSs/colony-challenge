import { getLogs, getBlockTime } from "@colony/colony-js";
import { BigNumber } from "ethers/utils";
import { Log } from "ethers/providers";
import { v4 as uuid } from 'uuid';

import { getUserAddress, transformHexValueAmount } from "./utils";
import { connectColonyClient } from "./connectColonyClient";
import { ColonyEventType } from "./types";

export const getEventsLogs = async () => {
  const colonyClient = await connectColonyClient();

  // Get the filters
  const colonyInitialisedFilter = colonyClient.filters.ColonyInitialised(null, null);
  const domainAddedFilter = colonyClient.filters.DomainAdded(null);
  // @ts-ignore
  const colonyRoleSetFilter = colonyClient.filters.ColonyRoleSet(null, null, null, null);
  const payoutClaimedFilter = colonyClient.filters.PayoutClaimed(null, null, null);

  // get events logs with filters
  const colonyInitialisedLogs = await getLogs(colonyClient, colonyInitialisedFilter);
  const colonyRoleSetLogs = await getLogs(colonyClient, colonyRoleSetFilter);
  const payoutClaimedLogs = await getLogs(colonyClient, payoutClaimedFilter);
  const domainAddedLogs = await getLogs(colonyClient, domainAddedFilter);

  const mergedEventLogs: readonly Log[] = [
    ...colonyRoleSetLogs,
    ...payoutClaimedLogs,
    ...domainAddedLogs,
    ...colonyInitialisedLogs,
  ];

  const parsedLogs = mergedEventLogs.map((event) => ({
    ...event,
    ...colonyClient.interface.parseLog(event),
  }));

  const formattedLogs = await Promise.all(
    parsedLogs.map(async (eventLog) => {
      /**
       * Getting the date
       * Events themselves won't provide you with a date, but there's a way of fetching it by using a method called getBlockTime, 
       * which can be imported from @colony/colony-js:
       */
      const logTime = await getBlockTime(colonyClient.provider, eventLog.blockHash || "");

      if (eventLog.name === ColonyEventType.PayoutClaimed) {
        const payoutClaimed = transformHexValueAmount(eventLog.values.amount);
        const humanReadableFundingPotId = new BigNumber(eventLog.values.fundingPotId).toString();
        const userAddress = await getUserAddress(colonyClient, humanReadableFundingPotId);

        return {
          ...eventLog,
          key: uuid(),
          userAddress,
          humanReadableFundingPotId,
          payoutClaimed,
          logTime,
        };
      } else {
        return {
          ...eventLog,
          key: uuid(),
          logTime,
        };
      }
    })
  );

  // Sorted by event date
  return formattedLogs.sort((a, b) => b.logTime - a.logTime);
};
