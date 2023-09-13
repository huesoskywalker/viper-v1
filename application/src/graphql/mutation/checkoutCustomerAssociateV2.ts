const gql = String.raw

export const CHECKOUT_CUSTOMER_ASSOCIATE = gql`
    mutation checkoutCustomerAssociateV2($checkoutId: ID!, $customerAccessToken: String!) {
        checkoutCustomerAssociateV2(
            checkoutId: $checkoutId
            customerAccessToken: $customerAccessToken
        ) {
            checkout {
                id
                webUrl
                orderStatusUrl
            }
            checkoutUserErrors {
                code
                field
                message
            }
            customer {
                id
                orders(first: 5) {
                    edges {
                        node {
                            id
                        }
                    }
                }
            }
        }
    }
`
