const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
  }

  type Product {
    id: ID!
    name: String!
    description: String
    price: Float!
    category: String
    stock: Int
    images: [String]
  }

  type ProductList {
    items: [Product!]!
    pagination: Pagination!
  }

  type Pagination {
    total: Int!
    page: Int!
    limit: Int!
    pages: Int!
  }

  type AuthPayload {
    user: User!
    accessToken: String!
    refreshToken: String!
  }

  type Query {
    products(page: Int, limit: Int, search: String, category: String): ProductList!
    product(id: ID!): Product
    me: User
  }

  input ProductInput {
    name: String!
    description: String
    price: Float!
    category: String
    stock: Int
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    createProduct(input: ProductInput!): Product!
  }
`;
