import React, { useState } from 'react';
import useAsyncEffect from "use-async-effect";

import { getEventsLogs } from '../../provider';
import { ColonyLogEvent } from '../../provider/types';

import styles from './style.module.css';

export const AppContainer: React.FC = () => {
  const [eventsList, setEventsList] = useState<ColonyLogEvent[]>([]);

  useAsyncEffect(async () => {
    try {
      const events = await getEventsLogs();
      setEventsList(events);
      console.log('events', events);
    } catch (error: unknown) {
      console.log("Error fetching events:", error);
    }
  }, []);

  const renderEventsList = () => {
    if (!eventsList?.length) {
      return (
        <div className={styles.emptyListMessage}>
          Searching for Colony Events, please wait...
        </div>
      );
    }
    return eventsList.map((item) => (
      <div key={item.key}>{item.name}</div>
    ));
  }

  return (
    <div className={styles.appContainer}>
      {renderEventsList()}
    </div>
  );
}
