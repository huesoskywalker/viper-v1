import { NextApiRequest, NextApiResponse } from "next"
import { shopifyAdmin } from "@/utils/adminApi"
import { PRODUCT_PUBLISH } from "@/graphql/mutation/publishablePublish"
import { RequestReturn } from "@shopify/shopify-api"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body
    const productId: string = body.product._id
    const viperApp: string = process.env.VIPER_APP!
    if (req.method === "POST") {
        try {
            const session = shopifyAdmin.session.customAppSession("vipers-go.myshopify.com")
            const client = new shopifyAdmin.clients.Graphql({ session })

            const PRODUCT_INPUT = {
                id: productId,
                input: {
                    publicationId: viperApp,
                },
            }
            const publishProduct: RequestReturn<unknown> = await client.query({
                data: {
                    query: PRODUCT_PUBLISH,
                    variables: PRODUCT_INPUT,
                },
            })
            const publishablePublish = publishProduct.body.data.publishablePublish
            return res.status(200).json({
                publishable: publishablePublish.publishable,
                shop: publishablePublish.shop,
                userErrors: publishablePublish.userErrors,
            })
        } catch (error: any) {
            return res.status(400).json(error)
        }
    }
    return res.status(400)
}
