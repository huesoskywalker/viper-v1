import { NextApiRequest, NextApiResponse } from "next"
import { shopifyAdmin } from "@/utils/adminApi"
import PRODUCT_GET from "@/graphql/query/product"
import { storefrontClient } from "@/utils/storefrontApi"
import { CHECKOUT_CREATE } from "@/graphql/mutation/checkoutCreate"
import { Product } from "@shopify/shopify-api/rest/admin/2023-01/product"
import { Variant } from "@shopify/shopify-api/rest/admin/2023-01/variant"
import { Checkout } from "@shopify/shopify-api/rest/admin/2023-01/checkout"
import { RequestReturn } from "@shopify/shopify-api"

const checkoutCreate = async (req: NextApiRequest, res: NextApiResponse) => {
    const body = req.body
    const session = shopifyAdmin.session.customAppSession("vipers-go.myshopify.com")
    const email: string = body.email
    const productId: string = body.product._id

    if (req.method === "POST") {
        try {
            const client = new shopifyAdmin.clients.Graphql({ session })

            const PRODUCT_INPUT = {
                id: productId,
            }

            const product: RequestReturn<Product> = await client.query({
                data: {
                    query: PRODUCT_GET,
                    variables: PRODUCT_INPUT,
                },
            })
            const variantId: Variant = product.body.data.product.variants.edges[0].node.id

            const CHECKOUT_INPUT = {
                input: {
                    allowPartialAddresses: true,
                    email: email,

                    lineItems: [
                        {
                            variantId: variantId,
                            quantity: 1,
                        },
                    ],
                },
            }

            const checkout: RequestReturn<Checkout> = await storefrontClient.query({
                data: {
                    query: CHECKOUT_CREATE,
                    variables: CHECKOUT_INPUT,
                },
            })
            const checkoutCreate = checkout.body.data.checkoutCreate
            return res.status(200).json({
                checkout: checkoutCreate.checkout,
                checkoutUserErrors: checkoutCreate.checkoutUserErrors,
            })
        } catch (error: any) {
            return res.status(400).json(error)
        }
    }
}

export default checkoutCreate
