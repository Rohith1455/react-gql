
import React from 'react';
import { useBookEvents } from '../CustomHooks/useBookEvents';
import { useSelector } from 'react-redux';

const Logs = () => {
  const { bookEvents } = useBookEvents();
  const theme = useSelector((state) => state.theme.mode);
  return (
    <div className={`container mt-4 rounded ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>

      <h2 className="mb-3">Book Event Logs</h2>
      {bookEvents.length === 0 ? (
        <p>No events yet...</p>
      ) : (
        <ul className="list-group">
          {bookEvents.map((event, index) => (
            <li key={index} className={`list-group-item ${event.type === 'deleted' ? 'list-group-item-danger' : 'list-group-item-success'}`}>
              <strong>{event.book.title}</strong> was <strong>{event.type}</strong> on{' '}
              <span>{new Date(event.time).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Logs;
