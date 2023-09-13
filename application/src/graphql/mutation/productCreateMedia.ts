const gql = String.raw
export const MEDIA_CREATE = gql`
    mutation productCreateMedia($media: [CreateMediaInput!]!, $productId: ID!) {
        productCreateMedia(media: $media, productId: $productId) {
            media {
                # alt
                mediaContentType
                status
            }
            # mediaUserErrors {
            #     field
            #     message
            # }
            product {
                # id
                title
            }
        }
    }
`
