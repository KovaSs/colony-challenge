import dayjs from 'dayjs';
import blockies from 'blockies';

import { ColonyLogEvent } from '../../provider/types';
import { EventInfo } from "./EventInfo";

import styles from "./style.module.css";

interface Props {
  event: ColonyLogEvent;
}

export const EventItem: React.FC<Props> = ({ event }) => {
  const avatarSeed = event.userAddress || event.address || event.values.blockHash;

  return (
    <li className={styles.eventItem}>
      <div>
        <img
          src={blockies({ seed: avatarSeed }).toDataURL()}
          className={styles.avatar}
          alt="avatar"
        />
      </div>
      <div className={styles.eventInfo}>
        <EventInfo event={event} />
        <div className={styles.eventDate}>
          {dayjs(event.logTime).format('D MMM')}
        </div>
      </div>
    </li>
  );
};
