const gql = String.raw

const PRODUCT_INVENTORY_GET = gql`
    query getProductById($id: ID!) {
        product(id: $id) {
            totalInventory
        }
    }
`

export default PRODUCT_INVENTORY_GET
