import { useState, useEffect } from 'react';
import { useSubscription, gql } from '@apollo/client';

const BOOK_ADDED_SUB = gql`
  subscription {
    bookAdded {
      id
      title
      author
      createdTime
    }
  }
`;

const BOOK_DELETED_SUB = gql`
  subscription {
    bookDeleted {
      id
      title
      author
      createdTime
    }
  }
`;  

const LOCAL_STORAGE_KEY = 'bookEventLogs';

export const useBookEvents = () => {
  const { data: addData } = useSubscription(BOOK_ADDED_SUB);
  const { data: delData } = useSubscription(BOOK_DELETED_SUB);

  const [bookEvents, setBookEvents] = useState(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [lastAdded, setLastAdded] = useState(null);
  const [lastDeleted, setLastDeleted] = useState(null);

  useEffect(() => {
    if (addData?.bookAdded) {
      const newEvent = {
        type: 'added',
        book: addData.bookAdded,
        time: new Date().toISOString(),
      };
      setBookEvents(prev => {
        const updated = [newEvent, ...prev];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
      setLastAdded(addData.bookAdded);
    }
  }, [addData]);

  useEffect(() => {
    if (delData?.bookDeleted) {
      const newEvent = {
        type: 'deleted',
        book: delData.bookDeleted,
        time: new Date().toISOString(),
      };
      setBookEvents(prev => {
        const updated = [newEvent, ...prev];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
      setLastDeleted(delData.bookDeleted);
    }
  }, [delData]);

  return { bookEvents, lastAdded, lastDeleted };
};
