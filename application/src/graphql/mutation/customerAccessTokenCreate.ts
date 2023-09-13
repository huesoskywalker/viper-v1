const gql = String.raw

export const CUSTOMER_ACCESS_TOKEN_CREATE = gql`
    mutation customerAccessTokenCreate(
        $input: CustomerAccessTokenCreateInput!
    ) {
        customerAccessTokenCreate(input: $input) {
            customerAccessToken {
                accessToken
            }
            customerUserErrors {
                message
            }
        }
    }
`
