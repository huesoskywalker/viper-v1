import { NextApiRequest, NextApiResponse } from "next"
import { claimEventCard } from "@/lib/events"
import { ModifyResult, MongoError } from "mongodb"
import { Event } from "@/types/event"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body
    const viperId: string = body.viper._id
    const eventId: string = body.event._id
    if (req.method === "PUT") {
        try {
            const giftCard: ModifyResult<Event> = await claimEventCard(eventId, viperId)
            return res.status(200).json(giftCard)
        } catch (error: unknown) {
            if (error instanceof MongoError) {
                return res.status(400).json({ error: `${error.name}: ${error.message}` })
            }
        }
    }
}
