const gql = String.raw
export const CHECKOUT_SHIPPING_ADDRESS_UPDATE = gql`
    mutation checkoutShippingAddressUpdateV2(
        $shippingAddress: MailingAddressInput!
        $checkoutId: ID!
    ) {
        checkoutShippingAddressUpdateV2(
            shippingAddress: $shippingAddress
            checkoutId: $checkoutId
        ) {
            checkoutUserErrors {
                code
                field
                message
            }
            checkout {
                id
                shippingAddress {
                    firstName
                    lastName
                    address1
                    province
                    country
                    zip
                }
            }
        }
    }
`
