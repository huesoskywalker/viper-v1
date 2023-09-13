import { NextApiRequest, NextApiResponse } from "next"
import { shopifyAdmin } from "@/utils/adminApi"
import { PRODUCT_CREATE } from "@/graphql/mutation/productCreate"
import { RequestReturn } from "@shopify/shopify-api"
import { Product } from "@shopify/shopify-api/rest/admin/2023-01/product"

const productCreate = async (
    req: NextApiRequest,
    res: NextApiResponse<{
        product: {
            _id: string
            variant_id: string
        }
    }>
) => {
    const body = req.body
    const title: string = body.title
    const description: string = body.description
    const organizer: string = body.organizer
    const price: string = body.price
    const resourceUrl: string = body.resourceUrl
    const entries: string = body.entries
    // const category: string = body.category
    // const location: string = body.location
    // const address: string = body.address

    if (req.method === "POST") {
        try {
            const session = shopifyAdmin.session.customAppSession("vipers-go.myshopify.com")
            const client = new shopifyAdmin.clients.Graphql({ session })

            const PRODUCT_INPUT = {
                input: {
                    collectionsToJoin: "gid://shopify/Collection/437054996770",
                    title: title,
                    descriptionHtml: description,
                    handle: title,
                    seo: {
                        title: title,
                        description: description,
                    },
                    productType: "Event Card",
                    vendor: organizer,

                    variants: [
                        {
                            price: price,
                            // sku: "string"
                            imageSrc: resourceUrl,
                            inventoryItem: { cost: price, tracked: true },
                            inventoryPolicy: "DENY",
                            inventoryQuantities: {
                                availableQuantity: Number(entries),
                                locationId: "gid://shopify/Location/78320468258",
                            },
                            requiresShipping: false,
                            options: "viper-level-1",
                            taxable: false,
                        },
                    ],
                },
            }

            const newProduct: RequestReturn<Product> = await client.query({
                data: {
                    query: PRODUCT_CREATE,
                    variables: PRODUCT_INPUT,
                },
            })
            const product = newProduct.body.data.productCreate.product
            return res.status(200).json({
                product: {
                    _id: product.id,
                    variant_id: product.variants.edges[0].node.id,
                },
            })
        } catch (error: any) {
            return res.status(400).json(error)
        }
    }
    return res.status(400)
    // Gotta manage all the Errors of the page
    // .json(new Error("Bad request, btw, let's do this right"))
}

export default productCreate
