import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "@/utils/mongodb"
import { ObjectId } from "mongodb"
import { Viper } from "@/types/viper"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body
    const shopify = body.shopify
    const bodyAddress = body.address

    const viperId: string = body._id
    const phone: string = bodyAddress.phone
    const address: string = bodyAddress.address
    const city: string = bodyAddress.city
    const province: string = bodyAddress.province
    const zip: string = bodyAddress.zip
    const country: string = bodyAddress.country
    const accessToken: string = shopify.customerAccessToken
    const newCustomerId: string = shopify.customerId

    const client = await clientPromise
    const db = client.db("viperDb")

    if (req.method === "PUT") {
        try {
            const updateViper = await db.collection<Viper>("users").findOneAndUpdate(
                {
                    _id: new ObjectId(viperId),
                },
                {
                    $set: {
                        address: {
                            phone: phone,
                            address: address,
                            city: city,
                            province: province,
                            zip: zip,
                            country: country,
                        },
                        shopify: {
                            customerAccessToken: accessToken,
                            customerId: newCustomerId,
                        },
                    },
                },
                { upsert: true }
            )
            return res.status(200).json(updateViper)
        } catch (error) {
            return res.status(400).json(error)
        }
    }
}
