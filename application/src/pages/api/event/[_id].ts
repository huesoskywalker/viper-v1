import { getEventById } from "@/lib/events"
import { Event } from "@/types/event"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const eventId: string | string[] | undefined = req.query._id
    try {
        if (!Array.isArray(eventId) && eventId) {
            const event: Event | null = await getEventById(eventId)
            return res.status(200).json(event)
        }
    } catch (error) {
        return res.status(400).json(error)
    }
}
