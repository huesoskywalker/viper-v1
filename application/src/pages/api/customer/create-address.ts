import { NextApiRequest, NextApiResponse } from "next"
import { CUSTOMER_ADDRESS_CREATE } from "@/graphql/mutation/customerAddressCreate"
import { storefrontClient } from "@/utils/storefrontApi"
import { CustomerAddress } from "@shopify/shopify-api/rest/admin/2023-01/customer_address"
import { RequestReturn } from "@shopify/shopify-api"
import { Address } from "@/types/viper"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body

    const lastName: string = body.lastName
    const firstName: string = body.firstName
    // const address = {
    //     phone: body.address.phone,
    //     address: body.address.address,
    //     province: body.address.province,
    //     country: body.address.country,
    //     zip: body.address.zip,
    //     city: body.address.city,
    // }
    const accessToken: string = body.shopify.customerAccessToken
    const phone: string = body.address.phone
    const address: string = body.address.address
    const province: string = body.address.province
    const country: string = body.address.country
    const zip: string = body.address.zip
    const city: string = body.address.city
    try {
        const CUSTOMER_ADDRESS_INPUT = {
            customerAccessToken: accessToken,
            address: {
                lastName: firstName,
                firstName: lastName,
                // ...address,
                phone: phone,
                address1: address,
                province: province,
                country: country,
                zip: zip,
                city: city,
            },
        }

        const customerAddress: RequestReturn<CustomerAddress> = await storefrontClient.query({
            data: {
                query: CUSTOMER_ADDRESS_CREATE,
                variables: CUSTOMER_ADDRESS_INPUT,
            },
        })

        const customerAddressCreate = customerAddress.body.data.customerAddressCreate

        return res.status(200).json({
            customerAddress: customerAddressCreate.customerAddress,
            addressUserErrors: customerAddressCreate.customerUserErrors,
        })
    } catch (error) {
        return res.status(400).json(error)
    }
}
