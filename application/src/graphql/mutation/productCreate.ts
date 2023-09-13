const gql = String.raw

export const PRODUCT_CREATE = gql`
    mutation productCreate($input: ProductInput!) {
        productCreate(input: $input) {
            product {
                id
                variants(first: 1) {
                    edges {
                        node {
                            id
                        }
                    }
                }
            }
            shop {
                id
            }
            userErrors {
                field
                message
            }
        }
    }
`
