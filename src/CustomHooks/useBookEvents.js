// useBookEvents.js
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

export const useBookEvents = () => {
    const { data: addData } = useSubscription(BOOK_ADDED_SUB);
    const { data: delData } = useSubscription(BOOK_DELETED_SUB);
    const [bookEvents, setBookEvents] = useState([]);
    const [lastAdded, setLastAdded] = useState(null);
    const [lastDeleted, setLastDeleted] = useState(null);

    useEffect(() => {
        if (addData?.bookAdded) {
            const newEvent = {
                type: 'added',
                book: addData.bookAdded,
                time: new Date().toISOString(),
            };
            setBookEvents(prev => [newEvent, ...prev]);
            //setBooks(prev => [addData.onBookAdded, ...prev]); // Also add to table
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
            setBookEvents(prev => [newEvent, ...prev]);
            //setBooks(prev => prev.filter(b => b.id !== deldata.bookDeleted.id)); 
            setLastDeleted(delData.bookDeleted);
        }
    }, [delData]);

    return { bookEvents, lastAdded, lastDeleted };
};
