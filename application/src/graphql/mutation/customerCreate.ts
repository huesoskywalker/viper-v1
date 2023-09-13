const gql = String.raw
export const CUSTOMER_CREATE = gql`
    mutation customerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
            userErrors {
                field
                message
            }
            customer {
                id
            }
        }
    }
`
