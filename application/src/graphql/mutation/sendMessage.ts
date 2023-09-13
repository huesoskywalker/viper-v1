import { gql } from "@apollo/client"

export const SEND_MESSAGE_MUTATION = gql`
    mutation SendMessage($viperId: ID!, $contactId: ID!, $message: String!) {
        sendMessage(viperId: $viperId, contactId: $contactId, message: $message) {
            _id
            sender
            message
            timestamp
        }
    }
`
