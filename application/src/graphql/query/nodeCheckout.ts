const gql = String.raw

export const NODE_CHECKOUT_QUERY = gql`
    query getProductVariantsFromNode($id: ID!) {
        node(id: $id) {
            id
            ... on Checkout {
                order {
                    id
                    name
                    orderNumber
                    processedAt
                    cancelReason
                    currentSubtotalPrice {
                        amount
                    }
                    currentTotalPrice {
                        amount
                    }
                    totalPriceV2 {
                        amount
                    }

                    # totalTaxV2 {
                    #     amount
                    # }
                    financialStatus
                    fulfillmentStatus
                    statusUrl

                    lineItems(first: 1) {
                        edges {
                            node {
                                title
                                quantity
                                originalTotalPrice {
                                    amount
                                }
                                variant {
                                    id
                                    product {
                                        id
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`
