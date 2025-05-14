import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  split
} from '@apollo/client';

import { setContext } from '@apollo/client/link/context';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

// HTTP link to GraphQL endpoint
const httpLink = createHttpLink({
  uri: 'https://localhost:44332/graphql',
});

// Auth link to add Authorization headers
const authLink = setContext((_, { headers }) => {
  const token = process.env.REACT_APP_AUTH_TOKEN;
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// WebSocket link for subscriptions
const wsLink = new GraphQLWsLink(createClient({
  url: 'wss://localhost:44332/graphql',
  on: {
    connected: () => console.log("✅ WebSocket connected"),
    closed: () => console.log("❌ WebSocket closed"),
    error: (err) => console.error("WebSocket error:", err),
  },
  connectionParams: {
    Authorization: `Bearer ${process.env.REACT_APP_AUTH_TOKEN}`,
  },
}));

// Split link: queries/mutations via HTTP, subscriptions via WS
const splitLink = split(
  ({ query }) => {
    const def = getMainDefinition(query);
    return (
      def.kind === 'OperationDefinition' &&
      def.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink) // fallback for queries/mutations
);

// Apollo Client setup
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    assumeImmutableResults: true,
  }),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);

reportWebVitals();
