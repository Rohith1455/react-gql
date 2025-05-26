import { gql, ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

let currentToken = null;
let expiryTime = 0;

const TOKEN_QUERY = gql`
  query {
    accessToken
  }
`;

const tokenClient = new ApolloClient({
  link: new HttpLink({ uri: 'https://localhost:44332/graphql' }), // your HotChocolate endpoint
  cache: new InMemoryCache(),
});

export const getValidToken = async () => {
  const now = Date.now();
  if (!currentToken || now >= expiryTime) {
    const { data } = await tokenClient.query({ query: TOKEN_QUERY, fetchPolicy: 'no-cache' });

    currentToken = data.accessToken;
    // Simulate 2 hours expiry minus a buffer
    expiryTime = now + 2 * 60 * 60 * 1000 - 60 * 1000; // 2h - 1m
  }

  return currentToken;
};
