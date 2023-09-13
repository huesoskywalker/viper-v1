import { NextApiRequest, NextApiResponse } from "next"
import { storefrontClient } from "@/utils/storefrontApi"
import { CHECKOUT_CUSTOMER_ASSOCIATE } from "@/graphql/mutation/checkoutCustomerAssociateV2"
import { Checkout } from "@shopify/shopify-api/rest/admin/2023-01/checkout"
import { RequestReturn } from "@shopify/shopify-api"
import { Customer } from "@shopify/shopify-api/rest/admin/2023-01/customer"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body
    const customerAccessToken: string = body.shopify.customerAccessToken
    const checkoutId: string = body.checkoutId
    if (req.method === "POST") {
        try {
            const CHECKOUT_CUSTOMER_INPUT = {
                checkoutId: checkoutId,
                customerAccessToken: customerAccessToken,
            }

            const association: RequestReturn<Checkout & Customer> = await storefrontClient.query({
                data: {
                    query: CHECKOUT_CUSTOMER_ASSOCIATE,
                    variables: CHECKOUT_CUSTOMER_INPUT,
                },
            })
            const checkoutCustomerAssociateV2 = association.body.data.checkoutCustomerAssociateV2
            return res.status(200).json({
                associateCheckout: checkoutCustomerAssociateV2.checkout,
                associateUserErrors: checkoutCustomerAssociateV2.checkoutUserErrors,
                customer: checkoutCustomerAssociateV2.customer,
            })
        } catch (error) {
            return res.status(400).json(error)
        }
    }
}
