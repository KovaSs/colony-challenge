import makeBlockie from "ethereum-blockies-base64";

import { IColonyEventLog } from "../colonyDataProvider/types";
import { EventTitle } from "./EventTitle";
import styles from "./styles.module.css";

export const EventListItem = ({ eventLog }: { eventLog: IColonyEventLog }) => {
  return (
    <li className={styles.eventListItem}>
      <div>
        <img
          src={makeBlockie(
            eventLog.userAddress ||
              eventLog.address ||
              eventLog.values.blockHash
          )}
          alt="blockie avatar"
          className={styles.avatar}
        />
      </div>
      <div>
        <EventTitle eventLog={eventLog} />
        <div className={styles.subtitle}>
          {new Date(eventLog.logTime).toLocaleDateString("en-UK", {
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>
    </li>
  );
};
