import { NextApiRequest, NextApiResponse } from "next"
import { shopifyAdmin } from "@/utils/adminApi"
import { MEDIA_CREATE } from "@/graphql/mutation/productCreateMedia"
import { RequestReturn } from "@shopify/shopify-api"
import { Product } from "@shopify/shopify-api/rest/admin/2023-01/product"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body
    const resourceUrl: string = body.resourceUrl
    const productId: string = body.product._id
    const session = shopifyAdmin.session.customAppSession("vipers-go.myshopify.com")
    if (req.method === "POST") {
        try {
            const client = new shopifyAdmin.clients.Graphql({ session })

            const MEDIA_INPUT = {
                media: {
                    alt: "product image",
                    mediaContentType: "IMAGE",
                    originalSource: resourceUrl,
                },
                productId: productId,
            }

            const updatedProduct: RequestReturn<Product> = await client.query({
                data: {
                    query: MEDIA_CREATE,
                    variables: MEDIA_INPUT,
                },
            })
            const productCreateMedia = updatedProduct.body.data.productCreateMedia
            return res.status(200).json({
                media: productCreateMedia.media[0],
                product: {
                    title: productCreateMedia.product.title,
                },
                // mediaUserErrors: productCreateMedia.mediaUserErrors,
            })
        } catch (error: any) {
            return res.status(400).json(error)
        }
    }
    return res.status(400)
}
