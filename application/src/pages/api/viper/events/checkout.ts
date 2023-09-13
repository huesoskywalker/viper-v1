import isCheckoutFulFilled from "@/helpers/isCheckoutFulFilled"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const eventId = req.body.eventId
    const viperId = req.body.viperId
    if (req.method === "POST") {
        try {
            const fulfillmentStatus = await isCheckoutFulFilled(viperId, eventId)
            if (fulfillmentStatus === undefined) {
                return res.status(200).json({ orderStatus: "No order yet" })
            } else {
                return res.status(200).json(fulfillmentStatus)
            }
        } catch (error) {
            return res.status(400).json({
                message: "something went wrong",
            })
        }
    }
}
