import React from 'react';
import BookList from './BookList';
import { MockedProvider } from '@apollo/client/testing';
import { GET_BOOKS } from '../Queries/queries'; // adjust this path
import 'bootstrap/dist/css/bootstrap.min.css';


const mocks = [
  {
    request: {
      query: GET_BOOKS,
    },
    result: {
      data: {
        books: [
          { id: '1', title: 'Mock Book 1', author: 'Mock Author' },
          { id: '2', title: 'Mock Book 2', author: 'Mock Author 2' },
        ],
      },
    },
  },
];

export default {
  title: 'Pages/BookList',
  component: BookList,
};

export const Default = () => (
  <MockedProvider mocks={mocks} addTypename={false}>
    <BookList />
  </MockedProvider>
);
