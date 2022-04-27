import React, { useState } from 'react';
import useAsyncEffect from "use-async-effect";

import { EventItem } from '../EventItem';

import { getEventsLogs } from '../../provider';
import { ColonyLogEvent } from '../../provider/types';

import styles from './style.module.css';

export const AppContainer: React.FC = () => {
  const [eventsList, setEventsList] = useState<ColonyLogEvent[]>([]);
  const [isError, setIsError] = useState<boolean>(false);

  useAsyncEffect(async () => {
    try {
      const events = await getEventsLogs();
      setEventsList(events);
    } catch (error: unknown) {
      setIsError(!!error);
    }
  }, []);

  const renderAnimatedDots = () => {
    return new Array(3).fill('.').map((content, i) => (
      <i key={`key-${i}`} className={styles[`loadingDot${i + 1}`]}>
        {content}
      </i>
    ))
    }

  const renderEventsList = () => {
    if (isError) {
      return (
        <div className={styles.emptyListMessage}>
          Searching for Colony Events has been failed, please refresh page
        </div>
      )
    }
    if (!eventsList?.length) {
      return (
        <div className={styles.emptyListMessage}>
          Searching for Colony Events, please wait {renderAnimatedDots()}
        </div>
      );
    }
    return eventsList.map((eventItem) => (
      <EventItem key={eventItem.key} event={eventItem} />
    ));
  }

  return (
    <div className={styles.appContainer}>
      <ul className={styles.eventsList}>
        {renderEventsList()}
      </ul>
    </div>
  );
}
