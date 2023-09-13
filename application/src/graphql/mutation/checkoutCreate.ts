const gql = String.raw

export const CHECKOUT_CREATE = gql`
    mutation checkoutCreate($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
            checkoutUserErrors {
                code
                field
                message
            }
            checkout {
                id
                webUrl
                orderStatusUrl
                lineItems(first: 1) {
                    edges {
                        node {
                            id
                            title
                            variant {
                                id
                                sku
                                title
                                priceV2 {
                                    amount
                                    currencyCode
                                }
                                product {
                                    handle
                                }
                            }
                            quantity
                        }
                    }
                }
            }
        }
    }
`
