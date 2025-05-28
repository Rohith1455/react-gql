import { gql } from '@apollo/client';

export const GET_BOOKS = gql`
  query {
    books {
      id
      title
      author
    }
  }
`;


export const GET_USERS = gql`
  query {
    users {
      id
      username
      passwordHash
      isAdmin
    }
  }
`;

export const REGISTER_USER = gql`
  mutation Register($username: String!, $password: String!, $isAdmin: Boolean!) {
    register(username: $username, password: $password, isAdmin: $isAdmin)
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: Int!, $username: String!, $isAdmin: Boolean!) {
    updateUser(id: $id, username: $username, isAdmin: $isAdmin) {
      id
      username
      isAdmin
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: Int!) {
    deleteUser(id: $id)
  }
`;

