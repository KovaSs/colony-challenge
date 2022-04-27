import React, { useRef, useState } from 'react';
import InfiniteScroll from "react-infinite-scroller";
import useAsyncEffect from "use-async-effect";

import { EventItem } from '../EventItem';

import { getEventsLogs } from '../../provider';
import { ColonyLogEvent } from '../../provider/types';

import styles from './style.module.css';

const EVENTS_PER_PAGE = 10;

export const AppContainer: React.FC = () => {
  const eventsRef = useRef<ColonyLogEvent[]>([])
  const isHasMoreDataRef = useRef<boolean>(true)

  const [eventsList, setEventsList] = useState<ColonyLogEvent[]>([]);
  const [isError, setIsError] = useState<boolean>(false);

  useAsyncEffect(async () => {
    try {
      const events = await getEventsLogs();
      eventsRef.current = events;
      setEventsList(events.slice(0, EVENTS_PER_PAGE));
    } catch (error: unknown) {
      setIsError(!!error);
    }
  }, []);


  const renderAnimatedDots = () => {
    return new Array(3).fill('.').map((content, i) => (
      <i key={`key-${i}`} className={styles[`loadingDot${i + 1}`]}>
        {content}
      </i>
    ));
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

    return (
      <InfiniteScroll
        pageStart={0}
        hasMore={isHasMoreDataRef.current}
        loadMore={(page: number) => {
          setEventsList(eventsRef.current?.slice(0, page * EVENTS_PER_PAGE));
          if (eventsList && eventsRef.current) {
            isHasMoreDataRef.current = eventsList.length < eventsRef.current.length;
          }
        }}
        loader={
          <div key="loading" className={`loader ${styles.emptyListMessage}`}>
            Loading...
          </div>
        }
      >
        {eventsList.map((eventItem) => <EventItem key={eventItem.key} event={eventItem} />)}
      </InfiniteScroll>
    )
  }

  return (
    <div className={styles.appContainer}>
      <ul className={styles.eventsList}>
        {renderEventsList()}
      </ul>
    </div>
  );
}
