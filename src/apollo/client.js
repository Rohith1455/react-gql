// src/apollo/client.js
import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
    split,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { getValidToken } from '../apollo/tokenManager'

// HTTP link to GraphQL endpoint
const httpLink = createHttpLink({
    uri: 'https://localhost:44332/graphql',
});

// Auth link
const authLink = setContext(async (_, { headers }) => {
    const token = await getValidToken(); return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : '',
        },
    };
});

// WebSocket link for subscriptions
const wsLink = new GraphQLWsLink(
    createClient({
        url: 'wss://localhost:44332/graphql',
        connectionParams: async () => {
            const token = await getValidToken();
            console.log(token);
            return {
                Authorization: `Bearer ${token}`,
            };
        },
        lazy: true,
        on: {
            connected: () => console.log('✅ WebSocket connected'),
            closed: () => console.log('❌ WebSocket closed'),
        },
    })
);

// Split link for queries/mutations vs subscriptions
const splitLink = split(
    ({ query }) => {
        const def = getMainDefinition(query);
        return (
            def.kind === 'OperationDefinition' &&
            def.operation === 'subscription'
        );
    },
    wsLink,
    authLink.concat(httpLink)
);

// Create Apollo Client
const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache({
        assumeImmutableResults: true,
    }),
});

export default client;
