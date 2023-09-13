const gql = String.raw

const PRODUCT_GET = gql`
    query product($id: ID!) {
        product(id: $id) {
            title
            totalInventory
            priceRange {
                minVariantPrice {
                    amount
                    currencyCode
                }
                maxVariantPrice {
                    amount
                    currencyCode
                }
            }
            variants(first: 10) {
                edges {
                    node {
                        id
                        displayName
                        createdAt
                        price
                        inventoryQuantity
                        availableForSale
                    }
                }
            }
        }
    }
`

export default PRODUCT_GET
