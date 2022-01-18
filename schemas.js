const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        id: Int!
        name: String!
        username: String!
        email: String!
    }

    type Beer {
        id: Int!
        name: String!
        brand: String
        price: Float
    }

    type Query {
        current: User
        beer(id: Int!): Beer
        beers(brand: String!): [Beer]
        getAllBeers: [Beer]
    }

    type Mutation {
        register(name: String!, username: String!, email: String!, password: String!): String
        login(email: String!, password: String!): String
        addBeer(name: String!, brand: String!, price: Float!): String
    }
`;

module.exports = typeDefs;
