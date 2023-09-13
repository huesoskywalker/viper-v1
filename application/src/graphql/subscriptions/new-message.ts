// THIS IS IN USE
import { gql } from "@apollo/client"

export const MESSAGE_SUBSCRIPTION = gql`
    subscription NewMessage {
        messageAdded {
            _id
            sender
            message
            timestamp
        }
    }
`
