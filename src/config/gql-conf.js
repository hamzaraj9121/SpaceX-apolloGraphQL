import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
const client = new ApolloClient({
    url: 'http://localhost:3000/api/graphQl',
    cache: new InMemoryCache(),
  });

  export default client;