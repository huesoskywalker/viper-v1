import { NextApiRequest, NextApiResponse } from "next"
import { CUSTOMER_ACCESS_TOKEN_CREATE } from "@/graphql/mutation/customerAccessTokenCreate"
import { storefrontClient } from "@/utils/storefrontApi"
import { RequestReturn } from "@shopify/shopify-api"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body
    const email: string = body.email
    const password: string = body.password

    if (req.method === "POST") {
        const CUSTOMER_ACCESS_TOKEN_INPUT = {
            input: {
                email: email,
                password: password,
            },
        }
        try {
            const customerAccessToken: RequestReturn<unknown> = await storefrontClient.query({
                data: {
                    query: CUSTOMER_ACCESS_TOKEN_CREATE,
                    variables: CUSTOMER_ACCESS_TOKEN_INPUT,
                },
            })

            const customerAccessTokenCreate =
                customerAccessToken.body.data.customerAccessTokenCreate

            return res.status(200).json({
                customerAccessToken: customerAccessTokenCreate.customerAccessToken,
                accessTokenUserErrors: customerAccessTokenCreate.customerUserErrors,
            })
        } catch (error) {
            return res.status(400).json(error)
        }
    }
}
