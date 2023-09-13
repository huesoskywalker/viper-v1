import { NextApiRequest, NextApiResponse } from "next"
import { shopifyAdmin } from "@/utils/adminApi"
import { STAGE_UPLOAD } from "@/graphql/mutation/stageUploadCreate"
import { Image } from "@shopify/shopify-api/rest/admin/2023-01/image"
import { RequestReturn } from "@shopify/shopify-api"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body

    const data: {
        url: string
        filename: string
        size: string
        type: string
    } = body.data

    const session = shopifyAdmin.session.customAppSession("vipers-go.myshopify.com")
    if (req.method === "POST") {
        const client = new shopifyAdmin.clients.Graphql({ session })
        try {
            const STAGE_INPUT = {
                input: [
                    {
                        // here we should use the file.name and file.type from the uploaded image from the Event.
                        filename: data.filename,
                        fileSize: data.size,
                        mimeType: data.type,
                        httpMethod: "POST",
                        resource: "FILE", //2021 someone recommended "FILE"
                    },
                ],
            }
            // const stageUpload: RequestReturn<Image>
            // This is not the type , most probably, almost sure
            const stageUploadCreate: RequestReturn<Image> = await client.query({
                data: {
                    query: STAGE_UPLOAD,
                    variables: STAGE_INPUT,
                },
            })
            const target = stageUploadCreate.body.data.stagedUploadsCreate.stagedTargets[0]
            // let's add error and handle errors in a better way
            return res.status(200).json({
                stageUpload: {
                    parameters: target.parameters,
                    url: target.url,
                    resourceUrl: target.resourceUrl,
                },
            })
        } catch (error) {
            return res.status(400).json(error)
        }
    }
}
