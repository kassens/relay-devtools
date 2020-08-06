/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import React, { useCallback, useState } from 'react';
import type { LogEvent } from '../../../../types';

import styles from './EventLogger.css';

export type Props = {|
  events: $ReadOnlyArray<LogEvent>,
  selectedEventID: number,
  setSelectedEventID: number => void,
|};

function StoreEventDisplay({
  displayText,
  index,
  setSelectedEventID,
  selectedEventID,
}) {
  return (
    <div
      key={index}
      onClick={() => {
        setSelectedEventID(index);
      }}
      className={`${styles.Record} ${
        index === selectedEventID ? styles.SelectedRecord : ''
      }`}
    >
      {displayText}
    </div>
  );
}

export default function AllEventsList({
  events,
  selectedEventID,
  setSelectedEventID,
}: Props) {
  const [eventSearch, setEventSearch] = useState('');
  const fetchSearchBarText = useCallback(e => {
    setEventSearch(e.target.value);
  }, []);

  let eventsArrayDisplay = events.map((event, index) => {
    let displayText = '';
    switch (event.name) {
      case 'store.publish':
        return event.optimistic ? (
          <StoreEventDisplay
            displayText="Store Optimistic Update"
            key={index}
            index={index}
            setSelectedEventID={setSelectedEventID}
            selectedEventID={selectedEventID}
          />
        ) : (
          <StoreEventDisplay
            displayText="Store Publish"
            key={index}
            index={index}
            setSelectedEventID={setSelectedEventID}
            selectedEventID={selectedEventID}
          />
        );
      case 'store.gc':
        displayText = 'Store GC';
        break;
      case 'store.restore':
        displayText = 'Store Restore';
        break;
      case 'store.snapshot':
        displayText = 'Store Snapshot';
        break;
      case 'store.notify.start':
        displayText = 'Notify Start';
        break;
      case 'store.notify.complete':
        displayText = 'Notify Complete';
        break;
      case 'queryresource.fetch':
        displayText = 'QueryResource Fetch';
        break;
      case 'execute.start':
        displayText = 'Network Start';
        break;
      case 'execute.info':
        displayText = 'Network Info';
        break;
      case 'execute.next':
        displayText = 'Network Next';
        break;
      case 'execute.complete':
        displayText = 'Network Complete';
        break;
      case 'execute.subscribe':
        displayText = 'Network Unsubscribe';
        break;
      case 'execute.error':
        displayText = 'Network Error';
        break;
      default:
        return null;
    }
    return (
      <StoreEventDisplay
        displayText={displayText}
        key={index}
        index={index}
        setSelectedEventID={setSelectedEventID}
        selectedEventID={selectedEventID}
      />
    );
  });

  // TODO(damassart): Fix search
  // TODO(damassart): Memoize this
  eventsArrayDisplay = eventsArrayDisplay.filter(event =>
    eventSearch
      .trim()
      .split(' ')
      .some(
        search =>
          event != null &&
          String(event.props.displayText)
            .toLowerCase()
            .includes(search.toLowerCase())
      )
  );

  return (
    <div className={styles.AllEventsList}>
      <input
        className={styles.EventsSearchBar}
        type="text"
        onChange={fetchSearchBarText}
        placeholder="Search"
      ></input>
      <div>
        {eventsArrayDisplay.length <= 0 && eventSearch !== '' ? (
          <p className={styles.RecordNotFound}>
            Sorry, no events with the name '{eventSearch}' were found!
          </p>
        ) : (
          eventsArrayDisplay
        )}
      </div>
    </div>
  );
}
