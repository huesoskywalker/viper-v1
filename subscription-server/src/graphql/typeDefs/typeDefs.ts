import gql from "graphql-tag"

export const typeDefs = gql`
    type Chat {
        _id: ID
        members: [ID!]
        messages: [Message]
    }

    type Message {
        _id: ID!
        sender: String!
        message: String!
        timestamp: String!
    }

    type Sender {
        _id: ID!
        name: String!
    }

    type Query {
        chat(viperId: ID!, contactId: ID!): Chat
        sender(_id: ID!): Sender
    }

    type Mutation {
        sendMessage(viperId: ID!, contactId: ID!, message: String!): Message!
    }

    type Subscription {
        messageAdded: Message!
    }
`
