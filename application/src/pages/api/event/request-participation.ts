import { NextApiRequest, NextApiResponse } from "next"
import { requestEventParticipation } from "@/lib/vipers"
import { ModifyResult, MongoError } from "mongodb"
import { Viper } from "@/types/viper"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body
    const viperId: string = body.viper._id
    const eventId: string = body.event._id
    const checkoutId: string = body.checkoutId
    if (req.method === "PUT") {
        try {
            const requestParticipation: ModifyResult<Viper> = await requestEventParticipation(
                viperId,
                eventId,
                checkoutId
            )

            return res.status(200).json(requestParticipation)
        } catch (error: unknown) {
            if (error instanceof MongoError) {
                return res.status(400).json({ error: `${error.name}: ${error.message}` })
            }
        }
    }
}
