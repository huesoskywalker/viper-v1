const gql = String.raw
export const CUSTOMER_ADDRESS_CREATE = gql`
    mutation customerAddressCreate(
        $customerAccessToken: String!
        $address: MailingAddressInput!
    ) {
        customerAddressCreate(
            customerAccessToken: $customerAccessToken
            address: $address
        ) {
            customerUserErrors {
                code
                field
                message
            }
            customerAddress {
                id
            }
        }
    }
`
