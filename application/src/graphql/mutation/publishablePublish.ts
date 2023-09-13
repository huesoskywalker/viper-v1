const gql = String.raw

export const PRODUCT_PUBLISH = gql`
    mutation publishablePublish($id: ID!, $input: [PublicationInput!]!) {
        publishablePublish(id: $id, input: $input) {
            publishable {
                publishedOnCurrentPublication
            }
            shop {
                url
            }
            userErrors {
                field
                message
            }
        }
    }
`
