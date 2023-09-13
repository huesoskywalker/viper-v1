import { gql } from "@apollo/client"

export const CHAT_QUERY = gql`
    query GetChats($viperId: ID!, $contactId: ID!) {
        chat(viperId: $viperId, contactId: $contactId) {
            _id
            members
            messages {
                _id
                message
                sender
                timestamp
            }
        }
    }
`

export const MESSAGE_SENDER = gql`
    query GetSender($_id: ID!) {
        sender(_id: $_id) {
            _id
            name
        }
    }
`
